const catchAsync = require('../utils/catchAsync')
const appointmentService = require('../services/appointment.service')

// Tạo lịch hẹn xem phòng cho khách
exports.create = catchAsync(async (req, res, next) => {
    // Gom toàn bộ data từ request (params, query, body) truyền xuống service
    const payload = {
        ...req.params,
        ...req.query,
        ...req.body
    }

    const result = await appointmentService.create(payload)

    res.status(200).json({
        status: 'success',
        data: result
    })
})

// Cập nhật trạng thái lịch hẹn
exports.updateStatus = catchAsync(async (req, res, next) => {
    // Gom toàn bộ data từ request (params, query, body) truyền xuống service
    const payload = {
        ...req.params,
        ...req.query,
        ...req.body
    }

    const result = await appointmentService.updateStatus(payload)

    res.status(200).json({
        status: 'success',
        data: result
    })
})

