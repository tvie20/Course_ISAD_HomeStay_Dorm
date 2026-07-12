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

