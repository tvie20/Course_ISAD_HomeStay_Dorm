const invoiceModel = require('../models/invoice.model')

// Lấy danh sách các hóa đơn của khách hàng
exports.getAll = async (data) => {
    // Xử lý business logic ở đây (nếu có) trước khi gọi Model
    const result = await invoiceModel.getAll(data)
    // Xử lý dữ liệu trả về từ Model (nếu cần) trước khi đưa lên Controller
    
    return result
}

// Xem chi tiết một hóa đơn
exports.getOne = async (data) => {
    // Xử lý business logic ở đây (nếu có) trước khi gọi Model
    const result = await invoiceModel.getOne(data)
    // Xử lý dữ liệu trả về từ Model (nếu cần) trước khi đưa lên Controller
    
    return result
}

