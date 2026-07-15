const { sql } = require('../config/database')

exports.getAll = async () => {
    try {
        const pool = await sql.connect()
        const request = pool.request()

        const query = `
            SELECT 
                nv.MaNhanVien AS id,
                nv.HoTen AS name,
                nv.ChucVu AS role,
                CASE 
                    WHEN nv.ChucVu = N'Quản trị viên' THEN N'Toàn hệ thống' 
                    ELSE cn.TenChiNhanh 
                END AS branch,
                nv.TrangThai AS status,
                nv.Email AS email,
                nv.SoDienThoai AS phone,
                NULL AS cccd
            FROM NHAN_VIEN nv
            LEFT JOIN CHI_NHANH cn ON nv.MaChiNhanh = cn.MaChiNhanh
            
            UNION ALL
            
            SELECT 
                kh.MaKhachHang AS id,
                kh.HoTen AS name,
                N'Khách hàng' AS role,
                cn.TenChiNhanh AS branch,
                kh.TrangThai AS status,
                kh.Email AS email,
                kh.SDT AS phone,
                kh.CCCD AS cccd
            FROM KHACH_HANG kh
            CROSS APPLY (
                SELECT TOP 1 c.TenChiNhanh
                FROM KHACHHANG_HOPDONGTHUE kh_hd
                JOIN HOP_DONG_THUE hd ON kh_hd.MaHopDong = hd.MaHopDong
                JOIN PHIEU_COC pc ON hd.MaPhieuCoc = pc.MaPhieuCoc
                JOIN PHIEUCOC_PHONG pc_p ON pc.MaPhieuCoc = pc_p.MaPhieuCoc
                JOIN PHONG p ON pc_p.MaPhong = p.MaPhong
                JOIN CHI_NHANH c ON p.MaChiNhanh = c.MaChiNhanh
                WHERE kh_hd.MaKhachHang = kh.MaKhachHang
                ORDER BY hd.NgayBatDau DESC
            ) cn
            WHERE kh.MaTaiKhoan IS NOT NULL
        `

        const result = await request.query(query)
        return result.recordset
    } catch (error) {
        console.error("Error in user.model.js getAll:", error)
        throw error
    }
}

// Danh sách KH chưa có tài khoản (có hoặc chưa có hợp đồng)
exports.getCustomersNeedingAccount = async () => {
    try {
        const pool = await sql.connect()
        const request = pool.request()

        const query = `
            -- KH có hợp đồng còn hiệu lực nhưng chưa có tài khoản
            SELECT
                kh.MaKhachHang      AS id,
                kh.HoTen            AS name,
                kh.SDT              AS phone,
                kh.Email            AS email,
                kh.CCCD             AS cccd,
                kh.TrangThai        AS status,
                hd.MaHopDong        AS contractId,
                hd.NgayBatDau       AS contractStart,
                hd.NgayKetThuc      AS contractEnd,
                r.MaPhong           AS roomId,
                r.TenPhong          AS roomName,
                cn.MaChiNhanh       AS branchId,
                cn.TenChiNhanh      AS branchName,
                g.SoThuTu           AS bedNo
            FROM KHACH_HANG kh
            INNER JOIN KHACHHANG_HOPDONGTHUE kh_hd ON kh.MaKhachHang = kh_hd.MaKhachHang
            INNER JOIN HOP_DONG_THUE hd            ON kh_hd.MaHopDong = hd.MaHopDong
            LEFT JOIN  PHIEU_COC pc                ON hd.MaPhieuCoc   = pc.MaPhieuCoc
            LEFT JOIN  PHIEUCOC_PHONG pc_p         ON pc.MaPhieuCoc   = pc_p.MaPhieuCoc
            LEFT JOIN  PHONG r                     ON pc_p.MaPhong    = r.MaPhong
            LEFT JOIN  CHI_NHANH cn                ON r.MaChiNhanh    = cn.MaChiNhanh
            LEFT JOIN  PHIEUCOC_GIUONG pc_g        ON pc.MaPhieuCoc   = pc_g.MaPhieuCoc
            LEFT JOIN  GIUONG g                    ON pc_g.MaPhong    = g.MaPhong
                                                  AND pc_g.SoThuTu   = g.SoThuTu
            WHERE kh.MaTaiKhoan IS NULL
              AND hd.TrangThai = N'Còn hiệu lực'
            ORDER BY id ASC
        `

        const result = await request.query(query)
        return result.recordset
    } catch (error) {
        console.error("Error in user.model.js getCustomersNeedingAccount:", error)
        throw error
    }
}

