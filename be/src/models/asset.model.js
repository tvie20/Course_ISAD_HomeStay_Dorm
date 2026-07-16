const { sql } = require('../config/database')

exports.getAllCatalog = async () => {
    try {
        const pool = await sql.connect()
        const request = pool.request()
        const query = `
            SELECT 
                MaVatDung AS maTaiSan,
                TenVatDung AS tenTaiSan,
                SoLuongTon AS soLuongTon,
                LoaiTaiSan AS moTa
            FROM TAI_SAN
        `
        const result = await request.query(query)
        return result.recordset
    } catch (error) {
        console.error("Error in asset.model.js getAllCatalog:", error)
        throw error
    }
}

exports.getAllAllocations = async () => {
    try {
        const pool = await sql.connect()
        const request = pool.request()
        const query = `
            SELECT 
                tc.MaVatDung + '-' + tc.MaChiNhanh AS id,
                tc.MaVatDung AS maTaiSan,
                ts.TenVatDung AS tenTaiSan,
                cn.TenChiNhanh AS branch,
                CAST(tc.SoLuong AS int) AS soLuong,
                N'Tốt' AS condition,
                CONVERT(varchar, GETDATE(), 103) AS lastUpdated,
                '' AS notes
            FROM TAISAN_CHINHANH tc
            JOIN TAI_SAN ts ON tc.MaVatDung = ts.MaVatDung
            JOIN CHI_NHANH cn ON tc.MaChiNhanh = cn.MaChiNhanh
        `
        const result = await request.query(query)
        return result.recordset
    } catch (error) {
        console.error("Error in asset.model.js getAllAllocations:", error)
        throw error
    }
}
