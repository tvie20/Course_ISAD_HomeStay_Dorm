const contractModel = require('../models/contract.model')

// Tạo hợp đồng thuê chính thức
exports.create = async (data) => {
    // Xử lý business logic ở đây (nếu có) trước khi gọi Model
    const result = await contractModel.create(data)
    // Xử lý dữ liệu trả về từ Model (nếu cần) trước khi đưa lên Controller
    
    return result
}

// Lấy danh sách các hợp đồng mới đã ký nhưng chưa bàn giao phòng
exports.getPendingHandover = async (data) => {
    // Xử lý business logic ở đây (nếu có) trước khi gọi Model
    const result = await contractModel.getPendingHandover(data)
    // Xử lý dữ liệu trả về từ Model (nếu cần) trước khi đưa lên Controller
    
    return result
}

// Lấy chi tiết hợp đồng
exports.getOne = async (data) => {
    // Xử lý business logic ở đây (nếu có) trước khi gọi Model
    const result = await contractModel.getOne(data)
    // Xử lý dữ liệu trả về từ Model (nếu cần) trước khi đưa lên Controller
    
    return result
}

