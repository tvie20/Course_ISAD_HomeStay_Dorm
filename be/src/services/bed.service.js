const bedModel = require('../models/bed.model')

// Lấy danh sách các giường phòng trống có thể cọc
exports.getAvailable = async (data) => {
    // Xử lý business logic ở đây (nếu có) trước khi gọi Model
    const result = await bedModel.getAvailable(data)
    // Xử lý dữ liệu trả về từ Model (nếu cần) trước khi đưa lên Controller
    
    return result
}

