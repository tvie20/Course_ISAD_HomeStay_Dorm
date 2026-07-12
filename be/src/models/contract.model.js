const { sql } = require('../config/database')

// Tạo hợp đồng thuê chính thức
exports.create = async (data) => {
    // TODO: Viết câu lệnh SQL hoặc gọi Stored Procedure ở đây
    /*
    Ví dụ:
    const pool = await sql.connect()
    const request = pool.request()
    if (data.id) request.input('id', sql.Int, data.id)
    const result = await request.query('SELECT * FROM TableName WHERE id = @id')
    return result.recordset
    */
    
    return { message: 'Pending SQL for create in contract model' }
}

// Lấy danh sách các hợp đồng mới đã ký nhưng chưa bàn giao phòng
exports.getPendingHandover = async (data) => {
    // TODO: Viết câu lệnh SQL hoặc gọi Stored Procedure ở đây
    /*
    Ví dụ:
    const pool = await sql.connect()
    const request = pool.request()
    if (data.id) request.input('id', sql.Int, data.id)
    const result = await request.query('SELECT * FROM TableName WHERE id = @id')
    return result.recordset
    */
    
    return { message: 'Pending SQL for getPendingHandover in contract model' }
}

// Lấy chi tiết hợp đồng
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
    
    return { message: 'Pending SQL for getOne in contract model' }
}

