const { sql } = require('../config/database')
const { generateNextId } = require('../utils/generateId')

// Gui yeu cau dang ky thue phong
exports.create = async (data) => {
    try {
        const pool = await sql.connect()
        const request = pool.request()

        // Khai bao cac tham so thong tin KHACH_HANG
        request.input('FullName', sql.NVarChar, data.FullName)
        request.input('Gender', sql.NVarChar, data.Gender)
        request.input('BirthDate', sql.Date, data.BirthDate)
        request.input('IdentityCard', sql.VarChar, data.IdentityCard)
        request.input('Nationality', sql.NVarChar, data.Nationality || 'Việt Nam')
        request.input('PhoneNumber', sql.VarChar, data.PhoneNumber)
        request.input('Email', sql.VarChar, data.Email)
        request.input('PermanentAddress', sql.NVarChar, data.PermanentAddress)
        request.input('Occupation', sql.NVarChar, data.Occupation)

        // Khai bao cac tham so thong tin PHIEU_DANG_KY
        request.input('BranchID', sql.NVarChar, data.BranchID)
        request.input('RoomTypeID', sql.NVarChar, data.RoomTypeID)
        request.input('ExpectedPrice', sql.Int, data.ExpectedPrice)
        request.input('ExpectedOccupants', sql.Int, data.ExpectedOccupants)
        request.input('ExpectedMoveInDate', sql.Date, data.ExpectedMoveInDate)

        // ThoiHanThue la INT (so thang)
        let thoiHan = parseInt(data.ExpectedDuration)
        if (isNaN(thoiHan)) thoiHan = 6
        request.input('ExpectedDuration', sql.Int, thoiHan)

        request.input('Notes', sql.NVarChar, data.Notes || '')
        request.input('Status', sql.NVarChar, 'Đang xử lý')

        // Generate IDs
        const maKhachHang = await generateNextId('KHACH_HANG', 'MaKhachHang', 'KH')
        request.input('MaKhachHang', sql.VarChar, maKhachHang)

        const maPhieuDangKy = await generateNextId('PHIEU_DANG_KY', 'MaPhieuDangKy', 'PDK')
        request.input('MaPhieuDangKy', sql.VarChar, maPhieuDangKy)

        const query = `
            INSERT INTO KHACH_HANG (
                MaKhachHang, HoTen, GioiTinh, NgaySinh, CCCD, QuocTich, 
                SDT, Email, DiaChiThuongTru, NgheNghiep, TrangThai, NgayDangKy
            )
            VALUES (
                @MaKhachHang, @FullName, @Gender, @BirthDate, @IdentityCard, @Nationality, 
                @PhoneNumber, @Email, @PermanentAddress, @Occupation, N'Đang quyết định', GETDATE()
            );
            
            INSERT INTO PHIEU_DANG_KY (
                MaPhieuDangKy, SoNguoiDuKien, GioiTinhYeuCau, KhuVucMongMuon, LoaiThue, MucGiaMongMuon,
                NgayDuKienO, ThoiHanThue, YeuCauKhac, TrangThai, MaKhachHang
            )
            VALUES (
                @MaPhieuDangKy, @ExpectedOccupants, @Gender, @BranchID, @RoomTypeID, @ExpectedPrice,
                @ExpectedMoveInDate, @ExpectedDuration, @Notes, @Status, @MaKhachHang
            );
        `

        await request.query(query)

        // Tra ve id cua phieu dang ky vua tao thanh cong
        return {
            id: maPhieuDangKy,
            message: 'Tạo phiếu đăng ký thành công'
        }
    } catch (error) {
        console.error("Error in registration model (create):", error)
        throw error
    }
}

// Lay danh sach cac phieu dang ky thue
exports.getAll = async (data) => {
    try {
        const pool = await sql.connect()
        const request = pool.request()

        // Cau lenh SQL lay danh sach 
        const query = `
            SELECT 
                reg.MaPhieuDangKy AS id, 
                reg.LoaiThue AS room, 
                cn.TenChiNhanh AS branch,
                kh.HoTen AS customer, 
                kh.SDT AS phone, 
                kh.CCCD AS cccd,
                kh.Email AS email,
                kh.DiaChiThuongTru AS address,
                reg.TrangThai AS status,
                -- Lay them ngay hen neu da co trong bang LICH_XEM_PHONG
                app.NgayGioHen AS date,
                app.NgayGioHen AS time
            FROM PHIEU_DANG_KY reg
            LEFT JOIN KHACH_HANG kh ON reg.MaKhachHang = kh.MaKhachHang
            LEFT JOIN LICH_XEM_PHONG app ON reg.MaPhieuDangKy = app.MaPhieuDangKy
            LEFT JOIN CHI_NHANH cn ON reg.KhuVucMongMuon = cn.MaChiNhanh
            WHERE 1=1
            ${data.branchId ? "AND cn.MaChiNhanh = @BranchID" : ""}
            ${data.employeeId ? "AND (reg.MaNhanVien IS NULL OR reg.MaNhanVien = @EmployeeID)" : ""}
            ORDER BY reg.MaPhieuDangKy DESC
        `

        if (data.branchId) request.input('BranchID', sql.VarChar, data.branchId)
        if (data.employeeId) request.input('EmployeeID', sql.VarChar, data.employeeId)

        const result = await request.query(query)

        return result.recordset
    } catch (error) {
        console.error("Error in registration model (getAll):", error)
        throw error
    }
}

