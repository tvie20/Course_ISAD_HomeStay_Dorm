const { sql } = require('../config/database')

exports.getAll = async () => {
    try {
        const pool = await sql.connect()
        const request = pool.request()

        const query = `
            SELECT 
                MaNhanVien AS id,
                HoTen AS name,
                ChucVu AS role,
                N'Toàn hệ thống' AS branch,
                TrangThai AS status,
                Email AS email,
                SoDienThoai AS phone,
                NULL AS cccd
            FROM NHAN_VIEN
            
            UNION ALL
            
            SELECT 
                MaKhachHang AS id,
                HoTen AS name,
                N'Khách hàng' AS role,
                '' AS branch,
                TrangThai AS status,
                Email AS email,
                SDT AS phone,
                CCCD AS cccd
            FROM KHACH_HANG
        `

        const result = await request.query(query)
        return result.recordset
    } catch (error) {
        console.error("Error in user.model.js getAll:", error)
        throw error
    }
}
