const { sql } = require('../config/database')

// Lay danh sach cac loai phong
exports.getAll = async (data) => {
    try {
        const pool = await sql.connect()
        const request = pool.request()

        let query = `
            SELECT DISTINCT 
                LoaiPhong AS id, 
                LoaiPhong AS name
            FROM PHONG
            WHERE LoaiPhong IS NOT NULL
        `

        if (data.MaChiNhanh) {
            request.input('BranchID', sql.VarChar, data.MaChiNhanh)
            query += `
                AND MaChiNhanh = @BranchID
            `
        }

        const result = await request.query(query)

        return result.recordset
    } catch (error) {
        console.error("Error in roomType model:", error)
        throw error
    }
}

