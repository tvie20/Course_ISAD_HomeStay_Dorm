const registrationModel = require('../models/registration.model')

// Gửi yêu cầu đăng ký thuê phòng
exports.create = async (data) => {
    // Xử lý business logic ở đây (nếu có) trước khi gọi Model
    const result = await registrationModel.create(data)
    // Xử lý dữ liệu trả về từ Model (nếu cần) trước khi đưa lên Controller
    
    return result
}

// Lấy danh sách các phiếu đăng ký thuê
exports.getAll = async (data) => {
    // Xử lý business logic ở đây (nếu có) trước khi gọi Model
    const result = await registrationModel.getAll(data)
    // Xử lý dữ liệu trả về từ Model (nếu cần) trước khi đưa lên Controller
    
    return result
}

// Cập nhật trạng thái
exports.updateStatus = async (id, status) => {
    return await registrationModel.updateStatus(id, status)
}
