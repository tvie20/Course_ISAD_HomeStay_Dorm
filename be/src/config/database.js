const sql = require('mssql')
require('dotenv').config()

const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    port: parseInt(process.env.DB_PORT),
    options: {
        encrypt: true,
        trustServerCertificate: true,
        useUTC: false
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

        // Bắt lỗi connection pool để tránh việc ứng dụng tự động crash khi mất kết nối
        pool.on('error', err => {
            console.error('--> SQL Server Pool Error: ', err.message)
        })

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