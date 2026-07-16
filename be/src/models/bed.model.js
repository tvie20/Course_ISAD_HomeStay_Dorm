const { sql } = require('../config/database')

// Lay danh sach cac giuong phong trong co the coc
exports.getAvailable = async (data) => {
    try {
        const pool = await sql.connect()
        const request = pool.request()

        let whereClause = "WHERE bed.TrangThai = N'Trống'"
        
        // Neu co truyen chi nhanh de loc
        if (data.BranchID) {
            request.input('BranchID', sql.VarChar, data.BranchID)
            whereClause += " AND r.MaChiNhanh = @BranchID"
        }

        const query = `
            SELECT 
                bed.SoThuTu AS bedId,
                bed.GiaGiuong AS price,
                bed.GhiChu AS note,
                r.MaPhong AS roomId,
                r.MaPhong AS roomCode,
                r.TenPhong AS roomName,
                b_r.TenChiNhanh AS branchName
            FROM GIUONG bed
            INNER JOIN PHONG r ON bed.MaPhong = r.MaPhong
            INNER JOIN CHI_NHANH b_r ON r.MaChiNhanh = b_r.MaChiNhanh
            ${whereClause}
            ORDER BY b_r.TenChiNhanh, r.TenPhong, bed.SoThuTu
        `

        const result = await request.query(query)
        
        return result.recordset
    } catch (error) {
        console.error("Error in bed model (getAvailable):", error)
        throw error
    }
}

