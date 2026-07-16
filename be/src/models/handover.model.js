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
// Lay danh sach cac phong/giuong dang co nguoi o (da ban giao)
exports.getOccupiedRooms = async (data) => {
    try {
        const pool = await sql.connect()
        const request = pool.request()

        const query = `
            SELECT 
                bb.MaBienBan AS id,
                r.TenPhong AS room,
                N'Giường ' + RIGHT('0' + CAST(pc_g.SoThuTu AS varchar), 2) AS bed,
                kh.HoTen AS customer,
                CONVERT(varchar, bb.NgayBanGiao, 103) AS date,
                N'Bình thường' AS status
            FROM BIEN_BAN_BAN_GIAO bb
            INNER JOIN HOP_DONG_THUE c ON bb.MaHopDong = c.MaHopDong
            LEFT JOIN KHACHHANG_HOPDONGTHUE kh_hd ON c.MaHopDong = kh_hd.MaHopDong
            LEFT JOIN KHACH_HANG kh ON kh_hd.MaKhachHang = kh.MaKhachHang
            INNER JOIN PHIEU_COC pc ON c.MaPhieuCoc = pc.MaPhieuCoc
            INNER JOIN PHIEUCOC_PHONG pc_p ON pc.MaPhieuCoc = pc_p.MaPhieuCoc
            INNER JOIN PHONG r ON pc_p.MaPhong = r.MaPhong
            INNER JOIN PHIEUCOC_GIUONG pc_g ON pc.MaPhieuCoc = pc_g.MaPhieuCoc
            WHERE bb.TrangThai = N'Đã bàn giao' AND c.TrangThai = N'Còn hiệu lực'
            ORDER BY bb.NgayBanGiao DESC
        `

        const result = await request.query(query)
        return result.recordset
    } catch (error) {
        console.error("Error in handover model (getOccupiedRooms):", error)
        throw error
    }
}
