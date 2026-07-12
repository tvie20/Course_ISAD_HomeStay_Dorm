const handoverModel = require('../models/handover.model')

// Tạo biên bản bàn giao phòng/giường lúc khách vào ở
exports.create = async (data) => {
    // Xử lý business logic ở đây (nếu có) trước khi gọi Model
    const result = await handoverModel.create(data)
    // Xử lý dữ liệu trả về từ Model (nếu cần) trước khi đưa lên Controller
    
    return result
}

