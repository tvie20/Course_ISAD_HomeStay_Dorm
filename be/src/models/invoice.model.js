const { sql } = require('../config/database')

// Lay danh sach cac hoa don cua khach hang
exports.getAll = async (data) => {
    try {
        const pool = await sql.connect()
        const request = pool.request()

        // Bat buoc truyen id khach hang de loc hoa don chinh chu
        if (!data.CustomerID) {
            throw new Error("Missing CustomerID")
        }

        request.input('CustomerID', sql.VarChar, data.CustomerID)

        // JOIN voi PHIEU_THANH_TOAN, DIEN_NUOC, PHONG
        const query = `
            SELECT 
                ptt.MaPhieuThanhToan AS id,
                COALESCE(hdt.KyThanhToan, N'Tháng ' + CONVERT(varchar, MONTH(COALESCE(ptt.ThoiGianThanhToan, GETDATE()))) + '/' + CONVERT(varchar, YEAR(COALESCE(ptt.ThoiGianThanhToan, GETDATE())))) AS month,
                COALESCE(r.TenPhong, r_hdt.TenPhong, N'Phí dịch vụ chung') AS room,
                COALESCE(hdt.PhiDichVu, ptt.SoTien) AS base,
                0 AS electricity,
                0 AS water,
                0 AS service,
                ptt.SoTien AS total,
                N'Mùng 5 hàng tháng' AS dueDate,
                ptt.TrangThaiThanhToan AS status,
                COALESCE(CONVERT(varchar, ptt.ThoiGianThanhToan, 103), '-') AS paymentDate
            FROM PHIEU_THANH_TOAN ptt
            LEFT JOIN DIEN_NUOC dn ON ptt.MaPhieuThanhToan = dn.MaPhieuThanhToan
            LEFT JOIN PHONG r ON dn.MaPhong = r.MaPhong
            LEFT JOIN HOP_DONG hd ON ptt.MaPhieuThanhToan = hd.MaPhieuThanhToan
            LEFT JOIN HOP_DONG_THUE hdt ON hd.MaHopDong = hdt.MaHopDong
            LEFT JOIN PHIEU_COC pc ON hdt.MaPhieuCoc = pc.MaPhieuCoc
            LEFT JOIN PHIEUCOC_PHONG pcp ON pc.MaPhieuCoc = pcp.MaPhieuCoc
            LEFT JOIN PHONG r_hdt ON pcp.MaPhong = r_hdt.MaPhong
            WHERE ptt.MaKhachHang = @CustomerID
            ORDER BY ptt.MaPhieuThanhToan DESC
        `

        const result = await request.query(query)
        return result.recordset
    } catch (error) {
        console.error("Error in invoice model (getAll):", error)
        throw error
    }
}

// Xem chi tiet mot hoa don
exports.getOne = async (data) => {
    try {
        const pool = await sql.connect()
        const request = pool.request()

        if (!data.id) {
            throw new Error("Missing InvoiceID")
        }

        request.input('InvoiceID', sql.VarChar, data.id)

        // Bảng PHIEU_THANH_TOAN không lưu chi tiết các loại phí, mock = 0
        const query = `
            SELECT 
                ptt.MaPhieuThanhToan AS id,
                0 AS month,
                0 AS year,
                0 AS roomFee,
                0 AS electricityFee,
                0 AS waterFee,
                0 AS serviceFee,
                ptt.SoTien AS totalAmount,
                NULL AS dueDate,
                ptt.TrangThaiThanhToan AS status,
                r.TenPhong AS roomName
            FROM PHIEU_THANH_TOAN ptt
            LEFT JOIN DIEN_NUOC dn ON ptt.MaPhieuThanhToan = dn.MaPhieuThanhToan
            LEFT JOIN PHONG r ON dn.MaPhong = r.MaPhong
            WHERE ptt.MaPhieuThanhToan = @InvoiceID
        `

        const result = await request.query(query)

        if (result.recordset.length === 0) {
            return null
        }

        return result.recordset[0]
    } catch (error) {
        console.error("Error in invoice model (getOne):", error)
        throw error
    }
}

