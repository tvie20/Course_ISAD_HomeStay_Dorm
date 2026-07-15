
const sql = require('mssql')

exports.getAll = async () => {
    try {
        const pool = await sql.connect()
        const result = await pool.request().query(`
            SELECT 
                ds.MaDoiSoat AS id, 
                ds.TyLeHoan AS tyLeHoan, 
                ds.TienHoan AS tienHoan, 
                ds.NgayDoiSoat AS ngayDoiSoat, 
                ds.TrangThai AS status,
                ds.MaPhieuCoc AS depositId,
                ds.MaHopDong AS contractId,
                kh.HoTen AS customer,
                r.MaPhong AS room,
                'Trống' AS bed
            FROM DOI_SOAT_HOAN_COC ds
            LEFT JOIN PHIEU_COC pc ON ds.MaPhieuCoc = pc.MaPhieuCoc
            LEFT JOIN PHIEU_DANG_KY pdk ON pc.MaPhieuDangKy = pdk.MaPhieuDangKy
            LEFT JOIN KHACH_HANG kh ON pdk.MaKhachHang = kh.MaKhachHang
            LEFT JOIN PHIEUCOC_PHONG pcp ON pc.MaPhieuCoc = pcp.MaPhieuCoc
            LEFT JOIN PHONG r ON pcp.MaPhong = r.MaPhong
            ORDER BY ds.NgayDoiSoat DESC
        `)
        return result.recordset
    } catch (err) {
        throw err
    }
}

exports.updateStatus = async (data) => {
    try {
        const pool = await sql.connect()
        const request = pool.request()
        request.input('MaDoiSoat', sql.VarChar, data.id)
        request.input('Status', sql.NVarChar, data.status)
        
        await request.query(`
            UPDATE DOI_SOAT_HOAN_COC SET TrangThai = @Status WHERE MaDoiSoat = @MaDoiSoat
        `)
        return { success: true }
    } catch (err) {
        throw err
    }
}
