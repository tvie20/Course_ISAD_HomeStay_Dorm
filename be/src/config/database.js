const sql = require('mssql')
require('dotenv').config()

const dbConfig = {
    user: 'sa', 
    password: '18022005', // Điền mật khẩu sa của bạn
    server: '127.0.0.1',             // Giữ nguyên IP local
    database: 'Course_Homestay_Dorm', // Tên database đã tạo trong SSMS
    port: 1433,                       // Cổng mà netstat đã báo LISTENING
    options: {
        encrypt: true,
        trustServerCertificate: true // Giữ nguyên để bỏ qua chứng chỉ bảo mật
        // KHÔNG ĐỂ DÒNG instanceName Ở ĐÂY NỮA
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    }
}

const connectDatabase = async () => {
    try {
        const pool = await sql.connect(dbConfig)
        console.log('--> SQL Server connected successfully')
        return pool
    } catch (error) {
        console.error('--> Database connection failed: ', error.message)
        process.exit(1)
    }
}

module.exports = {
    sql,
    connectDatabase
}