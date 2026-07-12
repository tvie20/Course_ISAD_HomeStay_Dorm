const appointmentModel = require('../models/appointment.model')

// Tạo lịch hẹn xem phòng cho khách
exports.create = async (data) => {
    // Xử lý business logic ở đây (nếu có) trước khi gọi Model
    const result = await appointmentModel.create(data)
    // Xử lý dữ liệu trả về từ Model (nếu cần) trước khi đưa lên Controller
    
    return result
}

// Cập nhật trạng thái lịch hẹn
exports.updateStatus = async (data) => {
    // Xử lý business logic ở đây (nếu có) trước khi gọi Model
    const result = await appointmentModel.updateStatus(data)
    // Xử lý dữ liệu trả về từ Model (nếu cần) trước khi đưa lên Controller
    
    return result
}

