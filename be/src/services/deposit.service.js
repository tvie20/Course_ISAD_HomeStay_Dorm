const depositModel = require('../models/deposit.model')

// Tạo biên lai thu tiền cọc giữ chỗ
exports.create = async (data) => {
    // Xử lý business logic ở đây (nếu có) trước khi gọi Model
    const result = await depositModel.create(data)
    // Xử lý dữ liệu trả về từ Model (nếu cần) trước khi đưa lên Controller
    
    return result
}

// Xuất file pdf biên nhận cọc
exports.print = async (data) => {
    // Xử lý business logic ở đây (nếu có) trước khi gọi Model
    const result = await depositModel.print(data)
    // Xử lý dữ liệu trả về từ Model (nếu cần) trước khi đưa lên Controller
    
    return result
}

// Lấy danh sách các khách đã đặt cọc chờ nhận phòng
exports.getAll = async (data) => {
    // Xử lý business logic ở đây (nếu có) trước khi gọi Model
    const result = await depositModel.getAll(data)
    // Xử lý dữ liệu trả về từ Model (nếu cần) trước khi đưa lên Controller
    
    return result
}

// Cập nhật ngày giờ dự kiến khách sẽ đến làm thủ tục nhận phòng
exports.updateCheckinSchedule = async (data) => {
    // Xử lý business logic ở đây (nếu có) trước khi gọi Model
    const result = await depositModel.updateCheckinSchedule(data)
    // Xử lý dữ liệu trả về từ Model (nếu cần) trước khi đưa lên Controller
    
    return result
}

// Xac nhan thanh toan tien coc
exports.confirmPayment = async (data) => {
    // Xử lý business logic ở đây (nếu có) trước khi gọi Model
    const result = await depositModel.confirmPayment(data)
    // Xử lý dữ liệu trả về từ Model (nếu cần) trước khi đưa lên Controller
    
    return result
}

