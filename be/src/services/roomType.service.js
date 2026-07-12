const roomTypeModel = require('../models/roomType.model')

// Lấy danh sách các loại phòng
exports.getAll = async (data) => {
    // Xử lý business logic ở đây (nếu có) trước khi gọi Model
    const result = await roomTypeModel.getAll(data)
    // Xử lý dữ liệu trả về từ Model (nếu cần) trước khi đưa lên Controller
    
    return result
}

