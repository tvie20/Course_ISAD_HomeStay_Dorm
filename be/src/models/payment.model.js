const { sql } = require('../config/database')

// Thanh toan cac chi phi (Ghi nhan vao Database)
exports.create = async (data) => {
    try {
        const pool = await sql.connect()
        const request = pool.request()

        if (!data.InvoiceID) {
            throw new Error("Missing InvoiceID")
        }

        // Thong tin thanh toan
        request.input('InvoiceID', sql.VarChar, data.InvoiceID)
        request.input('Amount', sql.Decimal, data.Amount)
        request.input('PaymentMethod', sql.NVarChar, data.PaymentMethod || 'Tiền mặt')
        request.input('PaymentDate', sql.DateTime, data.PaymentDate || new Date())
        request.input('Note', sql.NVarChar, data.Note || '')

        // 1. Cap nhat giao dich thanh toan (Gộp logic Invoice và Payment)
        const updateQuery = `
            UPDATE PHIEU_THANH_TOAN 
            SET 
                PhuongThucThanhToan = @PaymentMethod,
                ThoiGianThanhToan = @PaymentDate,
                TrangThaiThanhToan = N'Đã thanh toán'
            WHERE MaPhieuThanhToan = @InvoiceID
        `
        const result = await request.query(updateQuery)

        return {
            id: data.InvoiceID,
            message: 'Thanh toan thanh cong, da cap nhat trang thai phieu thanh toan'
        }
    } catch (error) {
        console.error("Error in payment model (create):", error)
        throw error
    }
}

