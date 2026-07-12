const branchModel = require('../models/branch.model')

// Lấy danh sách các chi nhánh
exports.getAll = async (data) => {
    // Xử lý business logic ở đây (nếu có) trước khi gọi Model
    const result = await branchModel.getAll(data)
    // Xử lý dữ liệu trả về từ Model (nếu cần) trước khi đưa lên Controller
    
    return result
}

