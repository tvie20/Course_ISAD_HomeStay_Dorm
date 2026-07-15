const { sql } = require('../config/database')
const { generateNextId } = require('../utils/generateId')

exports.generateAccountForCustomer = async (customerId) => {
    try {
        const pool = await sql.connect()

        // Check if customer exists and has an account
        const checkReq = pool.request()
        checkReq.input('CustomerID', sql.VarChar, customerId)
        const customerRes = await checkReq.query(`
            SELECT HoTen, SDT, Email, MaTaiKhoan 
            FROM KHACH_HANG 
            WHERE MaKhachHang = @CustomerID
        `)

        if (customerRes.recordset.length === 0) {
            throw new Error('Khách hàng không tồn tại')
        }

        const customer = customerRes.recordset[0]

        // If already has an account, return null (do not generate again)
        if (customer.MaTaiKhoan) {
            return null
        }

        // Generate new account
        const maTaiKhoan = await generateNextId('TAI_KHOAN', 'MaTaiKhoan', 'TK')
        const username = customerId
        const password = Math.random().toString(36).slice(-8) // Random 8 chars

        const insertReq = pool.request()
        insertReq.input('MaTaiKhoan', sql.VarChar, maTaiKhoan)
        insertReq.input('TenDangNhap', sql.VarChar, username)
        insertReq.input('MatKhau', sql.VarChar, password)
        insertReq.input('TrangThai', sql.NVarChar, 'Đang hoạt động')

        await insertReq.query(`
            INSERT INTO TAI_KHOAN (MaTaiKhoan, TenDangNhap, MatKhau, TrangThai)
            VALUES (@MaTaiKhoan, @TenDangNhap, @MatKhau, @TrangThai)
        `)

        // Update customer with new account
        const updateReq = pool.request()
        updateReq.input('MaTaiKhoan', sql.VarChar, maTaiKhoan)
        updateReq.input('CustomerID', sql.VarChar, customerId)
        await updateReq.query(`
            UPDATE KHACH_HANG 
            SET MaTaiKhoan = @MaTaiKhoan 
            WHERE MaKhachHang = @CustomerID
        `)

        return {
            username,
            password,
            email: customer.Email,
            hoTen: customer.HoTen
        }

    } catch (error) {
        console.error("Error in account model (generateAccountForCustomer):", error)
        throw error
    }
}

exports.login = async (username, password) => {
    try {
        const pool = await sql.connect()
        
        // 1. Check credentials
        const accReq = pool.request()
        accReq.input('TenDangNhap', sql.VarChar, username)
        accReq.input('MatKhau', sql.VarChar, password)
        const accRes = await accReq.query(`
            SELECT MaTaiKhoan, TrangThai FROM TAI_KHOAN 
            WHERE TenDangNhap = @TenDangNhap AND MatKhau = @MatKhau
        `)
        
        if (accRes.recordset.length === 0) {
            throw new Error('Sai tên đăng nhập hoặc mật khẩu')
        }
        
        const account = accRes.recordset[0]
        
        const maTaiKhoan = account.MaTaiKhoan
        let role = ''
        let employeeId = ''
        
        // 2. Identify Role
        const nvReq = pool.request()
        nvReq.input('MaTaiKhoan', sql.VarChar, maTaiKhoan)
        const nvRes = await nvReq.query(`
            SELECT MaNhanVien, ChucVu FROM NHAN_VIEN WHERE MaTaiKhoan = @MaTaiKhoan
        `)
        
        if (nvRes.recordset.length > 0) {
            const chucVu = (nvRes.recordset[0].ChucVu || '').toLowerCase()
            employeeId = nvRes.recordset[0].MaNhanVien
            if (chucVu.includes('kinh doanh')) role = 'sale'
            else if (chucVu.includes('kế toán') || chucVu.includes('ke toan')) role = 'accountant'
            else if (chucVu.includes('quản lý') || chucVu.includes('quan ly')) role = 'manager'
            else if (chucVu.includes('admin') || chucVu.includes('quản trị')) role = 'admin'
            else role = 'staff'
        } else {
            // Check Guest
            const khReq = pool.request()
            khReq.input('MaTaiKhoan', sql.VarChar, maTaiKhoan)
            const khRes = await khReq.query(`
                SELECT MaKhachHang FROM KHACH_HANG WHERE MaTaiKhoan = @MaTaiKhoan
            `)
            if (khRes.recordset.length > 0) {
                role = 'guest'
                employeeId = khRes.recordset[0].MaKhachHang
            } else {
                throw new Error('Tài khoản không thuộc nhân viên hay khách hàng')
            }
        }
        
        return {
            username: employeeId,
            role: role
        }
    } catch (error) {
        console.error("Error in account model (login):", error)
        throw error
    }
}
