const { sql } = require('../config/database')

/**
 * Tự động sinh ID mới dựa trên ID lớn nhất hiện tại trong bảng
 * @param {string} tableName - Tên bảng (VD: 'KHACH_HANG')
 * @param {string} columnName - Tên cột khóa chính (VD: 'MaKhachHang')
 * @param {string} prefix - Tiền tố của ID (VD: 'KH')
 * @returns {string} - ID mới được tạo ra (VD: 'KH0001')
 */
exports.generateNextId = async (tableName, columnName, prefix) => {
    try {
        const pool = await sql.connect()
        
        // Truy vấn lấy ID lớn nhất có tiền tố tương ứng
        const query = `
            SELECT MAX(${columnName}) AS maxId 
            FROM ${tableName} 
            WHERE ${columnName} LIKE '${prefix}%'
        `
        
        const result = await pool.request().query(query)
        const maxId = result.recordset[0].maxId
        
        let nextNumber = 1
        if (maxId) {
            // maxId có dạng ví dụ: KH0001
            const numStr = maxId.substring(prefix.length)
            const num = parseInt(numStr, 10)
            if (!isNaN(num)) {
                nextNumber = num + 1
            }
        }
        
        // Khóa chính có độ dài CHAR(6), phần số sẽ chiếm (6 - prefix.length) ký tự
        const numLength = 6 - prefix.length
        
        // Chèn số 0 vào trước
        let strNumber = nextNumber.toString()
        while(strNumber.length < numLength) {
            strNumber = '0' + strNumber
        }
        
        return prefix + strNumber
    } catch (error) {
        console.error("Error in generateNextId:", error)
        throw error
    }
}
