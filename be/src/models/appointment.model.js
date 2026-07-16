const { sql } = require('../config/database')
const { generateNextId } = require('../utils/generateId')

// Tao lich hen xem phong cho khach
exports.create = async (data) => {
    try {
        const pool = await sql.connect()
        const request = pool.request()

        // Cac bien dau vao tu Frontend
        request.input('RegistrationID', sql.VarChar, data.RegistrationID)
        request.input('Note', sql.NVarChar, data.Note || '')
        request.input('EmployeeID', sql.VarChar, data.EmployeeID || '')

        // Gộp AppointmentDate và AppointmentTime thành chuỗi định dạng YYYY-MM-DD HH:mm:ss
        const ngayGioHenStr = `${data.AppointmentDate} ${data.AppointmentTime}:00`
        const ngayGioHenObj = new Date(`${data.AppointmentDate}T${data.AppointmentTime}`)

        // 1. Tao lich hen moi vao bang LICH_XEM_PHONG
        const query = `
            INSERT INTO LICH_XEM_PHONG (
                MaPhieuDangKy, NgayGioHen, KetQua
            )
            VALUES (
                @RegistrationID, @NgayGioHen, N'Chờ phản hồi'
            );

            IF @EmployeeID <> ''
            BEGIN
                UPDATE PHIEU_DANG_KY
                SET MaNhanVien = @EmployeeID
                WHERE MaPhieuDangKy = @RegistrationID
            END
        `

        // Gửi dưới dạng chuỗi để SQL Server tự parse theo Local Time (tránh lỗi lệch múi giờ NodeJS)
        request.input('NgayGioHen', sql.VarChar, ngayGioHenStr)

        await request.query(query)

        // Tạo chuỗi giả làm ID để frontend sử dụng (ghép MaPhieuDangKy và timestamp)
        const compositeId = `${data.RegistrationID}_${ngayGioHenObj.getTime()}`

        // 2. Tu dong cap nhat trang thai phieu dang ky tuong ung
        const updateRegRequest = pool.request()
        updateRegRequest.input('RegistrationID', sql.VarChar, data.RegistrationID)

        let updateQuery = `
            UPDATE PHIEU_DANG_KY 
            SET TrangThai = N'Đã xử lý'
        `
        if (data.EmployeeID) {
            updateRegRequest.input('EmployeeID', sql.VarChar, data.EmployeeID)
            updateQuery += `, MaNhanVien = @EmployeeID`
        }
        updateQuery += ` WHERE MaPhieuDangKy = @RegistrationID`

        await updateRegRequest.query(updateQuery)

        return {
            id: compositeId,
            message: 'Đã lên lịch hẹn xem phòng thành công'
        }
    } catch (error) {
        console.error("Error in appointment model (create):", error)
        throw error
    }
}

// Cap nhat trang thai lich hen
exports.updateStatus = async (data) => {
    try {
        const pool = await sql.connect()
        const request = pool.request()

        if (!data.id || !data.status) {
            throw new Error("Missing AppointmentID or Status")
        }

        // Tách id (được tạo ra lúc trước) thành MaPhieuDangKy và NgayGioHen
        const parts = data.id.split('_')
        const maPhieuDangKy = parts[0]
        const ngayGioHen = new Date(parseInt(parts[1]))

        request.input('MaPhieuDangKy', sql.VarChar, maPhieuDangKy)
        request.input('NgayGioHen', sql.DateTime, ngayGioHen)
        request.input('KetQua', sql.NVarChar, data.status)

        const query = `
            UPDATE LICH_XEM_PHONG 
            SET KetQua = @KetQua 
            WHERE MaPhieuDangKy = @MaPhieuDangKy AND NgayGioHen = @NgayGioHen
        `

        const result = await request.query(query)

        return {
            success: result.rowsAffected[0] > 0,
            message: 'Cập nhật trạng thái lịch hẹn thành công'
        }
    } catch (error) {
        console.error("Error in appointment model (updateStatus):", error)
        throw error
    }
}

