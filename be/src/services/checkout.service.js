const checkoutModel = require('../models/checkout.model')

// Lấy danh sách và trạng thái duyệt các yêu cầu trả phòng
exports.getMyRequests = async (data) => {
    // Xử lý business logic ở đây (nếu có) trước khi gọi Model
    const result = await checkoutModel.getMyRequests(data)
    // Xử lý dữ liệu trả về từ Model (nếu cần) trước khi đưa lên Controller
    
    return result
}

// Khách hàng khởi tạo yêu cầu báo trước ngày trả phòng
exports.create = async (data) => {
    // Xử lý business logic ở đây (nếu có) trước khi gọi Model
    const result = await checkoutModel.create(data)
    // Xử lý dữ liệu trả về từ Model (nếu cần) trước khi đưa lên Controller
    
    return result
}

// Lấy danh sách tất cả yêu cầu trả phòng (dành cho quản lý)
exports.getAll = async (data) => {
    const result = await checkoutModel.getAll(data)
    return result
}

exports.updateStatus = async (data) => {
    const result = await checkoutModel.updateStatus(data)
    return result
}
