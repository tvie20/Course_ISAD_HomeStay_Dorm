const { sql } = require('../config/database')
const { generateNextId } = require('../utils/generateId')

// Tao bien ban ban giao phong/giuong luc khach vao o
exports.create = async (data) => {
    try {
        const pool = await sql.connect()
        const request = pool.request()

        // Thong tin ban giao
        request.input('ContractID', sql.VarChar, data.ContractID)
        request.input('HandoverDate', sql.DateTime, data.HandoverDate || new Date())
        request.input('Note', sql.NVarChar, data.Note || '')
        request.input('Status', sql.NVarChar, 'Đã bàn giao')

        const maBienBan = await generateNextId('BIEN_BAN_BAN_GIAO', 'MaBienBan', 'BB')
        request.input('MaBienBan', sql.VarChar, maBienBan)

        const query = `
            INSERT INTO BIEN_BAN_BAN_GIAO (
                MaBienBan, NgayBanGiao, SoChiaKhoa, GhiChu, TrangThai, MaHopDong
            )
            VALUES (
                @MaBienBan, @HandoverDate, 1, @Note, @Status, @ContractID
            )
        `

        const result = await request.query(query)

        // Cap nhat hop dong thanh Đang có hiệu lực
        if (data.ContractID) {
            const updateContract = pool.request()
            updateContract.input('ContractID', sql.VarChar, data.ContractID)
            await updateContract.query("UPDATE HOP_DONG_THUE SET TrangThai = N'Còn hiệu lực' WHERE MaHopDong = @ContractID")
        }

        return {
            id: maBienBan,
            message: 'Lap bien ban ban giao thanh cong'
        }
    } catch (error) {
        console.error("Error in handover model (create):", error)
        throw error
    }
}

