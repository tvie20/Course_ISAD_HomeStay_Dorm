const { sql } = require('../config/database')
const { generateNextId } = require('../utils/generateId')

// Tao bien lai thu tien coc giu cho
exports.create = async (data) => {
    try {
        const pool = await sql.connect()
        const request = pool.request()

        // Cac thong tin can thiet de tao coc
        request.input('CustomerName', sql.NVarChar, data.CustomerName)
        request.input('PhoneNumber', sql.VarChar, data.PhoneNumber)
        
        // BedID is removed, we use data.Beds
        request.input('RoomID', sql.VarChar, data.RoomID)
        // Convert Amount from formatted string or number to clean number if needed
        const amount = typeof data.Amount === 'string' ? parseFloat(data.Amount.replace(/[^0-9.-]+/g,"")) : data.Amount;
        request.input('Amount', sql.Decimal, amount)
        request.input('DepositDate', sql.DateTime, data.DepositDate || new Date())
        
        // Han thanh toan luu INT (so gio) theo cau truc DB
        request.input('HanThanhToan', sql.Int, 24)
        
        request.input('Status', sql.NVarChar, 'Chờ thanh toán')
        request.input('MaPhieuDangKy', sql.VarChar, data.RegistrationID || null)
        request.input('HinhThucThanhToan', sql.NVarChar, data.PaymentMethod || null)

        const maPhieuCoc = await generateNextId('PHIEU_COC', 'MaPhieuCoc', 'PC')
        request.input('MaPhieuCoc', sql.VarChar, maPhieuCoc)

        const query = `
            INSERT INTO PHIEU_COC (
                MaPhieuCoc, SoTienCoc, NgayDatCoc, HanThanhToan, TrangThai, MaPhieuDangKy, HinhThucThanhToan
            )
            VALUES (
                @MaPhieuCoc, @Amount, @DepositDate, @HanThanhToan, @Status, @MaPhieuDangKy, @HinhThucThanhToan
            );

            INSERT INTO PHIEUCOC_PHONG (MaPhieuCoc, MaPhong)
            VALUES (@MaPhieuCoc, @RoomID);
        `
        await request.query(query)
        
        // Insert từng giường
        if (data.Beds && Array.isArray(data.Beds)) {
            for (let bed of data.Beds) {
                const bedRequest = pool.request()
                bedRequest.input('MaPhieuCoc', sql.VarChar, maPhieuCoc)
                bedRequest.input('MaPhong', sql.VarChar, data.RoomID)
                bedRequest.input('SoThuTu', sql.Int, bed)
                await bedRequest.query(`
                    INSERT INTO PHIEUCOC_GIUONG (MaPhieuCoc, MaPhong, SoThuTu)
                    VALUES (@MaPhieuCoc, @MaPhong, @SoThuTu);
                `)
            }
        }
        
        return {
            id: maPhieuCoc,
            message: 'Tao phieu coc thanh cong, vui long cho thanh toan'
        }
    } catch (error) {
        console.error("Error in deposit model (create):", error)
        throw error
    }
}

// Xuat file pdf bien nhan coc
exports.print = async (data) => {
    // TODO: Viết câu lệnh SQL hoặc gọi Stored Procedure ở đây
    /*
    Ví dụ:
    const pool = await sql.connect()
    const request = pool.request()
    if (data.id) request.input('id', sql.Int, data.id)
    const result = await request.query('SELECT * FROM TableName WHERE id = @id')
    return result.recordset
    */
    
    return { message: 'Pending SQL for print in deposit model' }
}

// Lay danh sach cac khach da dat coc cho nhan phong
exports.getAll = async (data) => {
    try {
        const pool = await sql.connect()
        const request = pool.request()

        // Lay danh sach cac khach hang dang trong giai doan cho nhan phong (bao gom ca cho thanh toan)
        const query = `
            SELECT 
                d.MaPhieuCoc AS id, 
                r.MaPhong AS room, 
                pc_g.SoThuTu AS bed, 
                kh.MaKhachHang AS customerId,
                kh.HoTen AS customer, 
                kh.SDT AS phone, 
                kh.CCCD AS cccd,
                kh.Email AS email,
                kh.DiaChiThuongTru AS address,
                COALESCE(lnp.TrangThai, d.TrangThai) AS status,
                lnp.NgayGioHen AS expectedDate,
                lnp.NgayGioHen AS expectedTime,
                d.SoTienCoc AS amount,
                COALESCE(g.GiaGiuong, g_room.GiaGiuong, 0) AS rentPrice,
                d.NgayDatCoc AS depositDate
            FROM PHIEU_COC d
            LEFT JOIN PHIEUCOC_PHONG pc_p ON d.MaPhieuCoc = pc_p.MaPhieuCoc
            LEFT JOIN PHONG r ON pc_p.MaPhong = r.MaPhong
            LEFT JOIN PHIEUCOC_GIUONG pc_g ON d.MaPhieuCoc = pc_g.MaPhieuCoc
            LEFT JOIN GIUONG g ON pc_g.MaPhong = g.MaPhong AND pc_g.SoThuTu = g.SoThuTu
            LEFT JOIN (SELECT MaPhong, MAX(GiaGiuong) AS GiaGiuong FROM GIUONG GROUP BY MaPhong) g_room ON r.MaPhong = g_room.MaPhong
            LEFT JOIN PHIEU_DANG_KY pdk ON d.MaPhieuDangKy = pdk.MaPhieuDangKy
            LEFT JOIN KHACH_HANG kh ON pdk.MaKhachHang = kh.MaKhachHang
            LEFT JOIN LICH_NHAN_PHONG lnp ON d.MaPhieuCoc = lnp.MaPhieuCoc
            WHERE d.TrangThai IN (N'Chờ thanh toán', N'Đã thanh toán', N'Chờ xếp lịch', N'Sắp nhận phòng')
            ORDER BY d.NgayDatCoc DESC
        `

        const result = await request.query(query)
        
        // Nhom cac giuong lai thanh 1 mang beds
        const depositsMap = {}
        result.recordset.forEach(row => {
            if (!depositsMap[row.id]) {
                // Formatting amount to VND currency string
                const formattedAmount = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(row.amount || 0);
                
                depositsMap[row.id] = {
                    id: row.id,
                    room: row.room,
                    customer: row.customer,
                    customerId: row.customerId,
                    phone: row.phone,
                    cccd: row.cccd,
                    email: row.email,
                    address: row.address,
                    status: row.status,
                    amount: formattedAmount,
                    rawAmount: row.amount,
                    rentPrice: row.rentPrice || 0,
                    expectedDate: row.expectedDate,
                    expectedTime: row.expectedTime,
                    depositDate: row.depositDate,
                    beds: []
                }
            }
            if (row.bed) {
                // convert bed to string as frontend uses string
                if (!depositsMap[row.id].beds.includes(row.bed.toString())) {
                    depositsMap[row.id].beds.push(row.bed.toString())
                }
            }
        })
        
        return Object.values(depositsMap)
    } catch (error) {
        console.error("Error in deposit model (getAll):", error)
        throw error
    }
}

// Cap nhat ngay gio du kien khach se den lam thu tuc nhan phong
exports.updateCheckinSchedule = async (data) => {
    try {
        const pool = await sql.connect()
        const request = pool.request()

        if (!data.id) {
            throw new Error("Missing DepositID")
        }

        request.input('DepositID', sql.VarChar, data.id)
        const ngayGioHenStr = `${data.expectedDate} ${data.expectedTime}:00`
        request.input('NgayGioHen', sql.VarChar, ngayGioHenStr)
        
        // Cap nhat trang thai thanh Sap nhan phong khi da co lich
        request.input('Status', sql.NVarChar, 'Sắp nhận phòng')

        const query = `
            IF EXISTS (SELECT 1 FROM LICH_NHAN_PHONG WHERE MaPhieuCoc = @DepositID)
            BEGIN
                UPDATE LICH_NHAN_PHONG 
                SET NgayGioHen = @NgayGioHen, TrangThai = @Status
                WHERE MaPhieuCoc = @DepositID
            END
            ELSE
            BEGIN
                INSERT INTO LICH_NHAN_PHONG (MaPhieuCoc, NgayGioHen, TrangThai)
                VALUES (@DepositID, @NgayGioHen, @Status);
            END
        `

        const result = await request.query(query)
        
        return {
            success: result.rowsAffected[0] > 0,
            message: 'Cap nhat lich nhan phong thanh cong'
        }
    } catch (error) {
        console.error("Error in deposit model (updateCheckinSchedule):", error)
        throw error
    }
}

// Lay danh sach cac khoan coc cho thanh toan hoac xac nhan
exports.getPendingPayments = async (data) => {
    try {
        const pool = await sql.connect()
        const request = pool.request()

        const query = `
            SELECT 
                d.MaPhieuCoc AS id, 
                r.TenPhong AS room, 
                kh.HoTen AS customer, 
                d.TrangThai AS status,
                FORMAT(d.SoTienCoc, 'N0') + N' đ' AS amount,
                DATEADD(hour, d.HanThanhToan, d.NgayDatCoc) AS expiredAt
            FROM PHIEU_COC d
            LEFT JOIN PHIEUCOC_PHONG pc_p ON d.MaPhieuCoc = pc_p.MaPhieuCoc
            LEFT JOIN PHONG r ON pc_p.MaPhong = r.MaPhong
            LEFT JOIN PHIEU_DANG_KY pdk ON d.MaPhieuDangKy = pdk.MaPhieuDangKy
            LEFT JOIN KHACH_HANG kh ON pdk.MaKhachHang = kh.MaKhachHang
            WHERE d.TrangThai = N'Chờ thanh toán'
            ORDER BY d.NgayDatCoc DESC
        `

        const result = await request.query(query)
        
        return result.recordset
    } catch (error) {
        console.error("Error in deposit model (getPendingPayments):", error)
        throw error
    }
}

// Xac nhan da thanh toan tien coc
exports.confirmPayment = async (data) => {
    try {
        const pool = await sql.connect()
        const request = pool.request()

        if (!data.id) {
            throw new Error("Missing DepositID")
        }

        request.input('DepositID', sql.VarChar, data.id)
        request.input('Status', sql.NVarChar, 'Đã thanh toán')

        const query = `
            UPDATE PHIEU_COC 
            SET TrangThai = @Status
            WHERE MaPhieuCoc = @DepositID;
        `

        const result = await request.query(query)
        
        return {
            success: result.rowsAffected[0] > 0,
            message: 'Xác nhận thanh toán tiền cọc thành công'
        }
    } catch (error) {
        console.error("Error in deposit model (confirmPayment):", error)
        throw error
    }
}
