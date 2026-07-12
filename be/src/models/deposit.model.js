const { sql } = require('../config/database')

// Tạo biên lai thu tiền cọc giữ chỗ
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
    
    return { message: 'Pending SQL for create in deposit model' }
}

// Xuất file pdf biên nhận cọc
exports.print = async (data) => {
    // TODO: Viết câu lệnh SQL hoặc gọi Stored Procedure ở đây
    /*
    Ví dụ:
    const pool = await sql.connect()
    const request = pool.request()
    if (data.id) request.input('id', sql.Int, data.id)
    const result = await request.query('SELECT * FROM TableName WHERE id = @id')
    return result.recordset
    */
    
    return { message: 'Pending SQL for print in deposit model' }
}

// Lấy danh sách các khách đã đặt cọc chờ nhận phòng
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
    
    return { message: 'Pending SQL for getAll in deposit model' }
}

// Cập nhật ngày giờ dự kiến khách sẽ đến làm thủ tục nhận phòng
exports.updateCheckinSchedule = async (data) => {
    // TODO: Viết câu lệnh SQL hoặc gọi Stored Procedure ở đây
    /*
    Ví dụ:
    const pool = await sql.connect()
    const request = pool.request()
    if (data.id) request.input('id', sql.Int, data.id)
    const result = await request.query('SELECT * FROM TableName WHERE id = @id')
    return result.recordset
    */
    
    return { message: 'Pending SQL for updateCheckinSchedule in deposit model' }
}

