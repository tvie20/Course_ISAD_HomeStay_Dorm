const { sql } = require('../config/database')

// Lấy danh sách các hóa đơn của khách hàng
exports.getAll = async (data) => {
    // TODO: Viết câu lệnh SQL hoặc gọi Stored Procedure ở đây
    /*
    Ví dụ:
    const pool = await sql.connect()
    const request = pool.request()
    if (data.id) request.input('id', sql.Int, data.id)
    const result = await request.query('SELECT * FROM TableName WHERE id = @id')
    return result.recordset
    */
    
    return { message: 'Pending SQL for getAll in invoice model' }
}

// Xem chi tiết một hóa đơn
exports.getOne = async (data) => {
    // TODO: Viết câu lệnh SQL hoặc gọi Stored Procedure ở đây
    /*
    Ví dụ:
    const pool = await sql.connect()
    const request = pool.request()
    if (data.id) request.input('id', sql.Int, data.id)
    const result = await request.query('SELECT * FROM TableName WHERE id = @id')
    return result.recordset
    */
    
    return { message: 'Pending SQL for getOne in invoice model' }
}

