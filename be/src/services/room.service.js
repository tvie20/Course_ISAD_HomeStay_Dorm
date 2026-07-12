const roomModel = require('../models/room.model')

// Lấy danh sách phòng và giường kèm trạng thái
exports.getStatus = async (data) => {
    // Xử lý business logic ở đây (nếu có) trước khi gọi Model
    const result = await roomModel.getStatus(data)
    // Xử lý dữ liệu trả về từ Model (nếu cần) trước khi đưa lên Controller
    
    return result
}

// Xem chi tiết thông tin một phòng
exports.getOne = async (data) => {
    // Xử lý business logic ở đây (nếu có) trước khi gọi Model
    const result = await roomModel.getOne(data)
    // Xử lý dữ liệu trả về từ Model (nếu cần) trước khi đưa lên Controller
    
    return result
}

