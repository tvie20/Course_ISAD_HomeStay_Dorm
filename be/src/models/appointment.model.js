const { sql } = require('../config/database')

// Tạo lịch hẹn xem phòng cho khách
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

    return { message: 'Pending SQL for create in appointment model' }
}

// Cập nhật trạng thái lịch hẹn
exports.updateStatus = async (data) => {
    // TODO: Viết câu lệnh SQL hoặc gọi Stored Procedure ở đây
    /*
    Ví dụ:
    const pool = await sql.connect()
    const request = pool.request()
    if (data.id) request.input('id', sql.Int, data.id)
    const result = await request.query('SELECT * FROM TableName WHERE id = @id')
    return result.recordset
    */

    return { message: 'Pending SQL for updateStatus in appointment model' }
}

