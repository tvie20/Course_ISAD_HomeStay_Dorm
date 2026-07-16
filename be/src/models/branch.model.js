const { sql } = require('../config/database')

// Lay danh sach cac chi nhanh
exports.getAll = async (data) => {
    try {
        const pool = await sql.connect()
        const request = pool.request()

        const query = `
            SELECT 
                cn.MaChiNhanh AS id, 
                cn.TenChiNhanh AS name,
                cn.DiaChi AS address,
                cn.SDT AS hotline,
                cn.Email AS email,
                cn.TrangThai AS trangThai,
                ISNULL(nv.HoTen, '') AS manager,
                ISNULL(cn.MaNhanVien, '') AS managerId,
                ISNULL(nv.SoDienThoai, '') AS managerPhone,
                '--' AS avatar,
                COUNT(p.MaPhong) AS rooms
            FROM CHI_NHANH cn
            LEFT JOIN PHONG p ON cn.MaChiNhanh = p.MaChiNhanh
            LEFT JOIN NHAN_VIEN nv ON cn.MaNhanVien = nv.MaNhanVien
            GROUP BY cn.MaChiNhanh, cn.TenChiNhanh, cn.DiaChi, cn.SDT, cn.Email, cn.TrangThai, cn.MaNhanVien, nv.HoTen, nv.SoDienThoai
        `

        const result = await request.query(query)

        return result.recordset
    } catch (error) {
        console.log('Error in branch.model.js getAll')
        throw error
    }
    }

