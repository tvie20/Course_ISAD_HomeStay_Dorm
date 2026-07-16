const catchAsync = require('../utils/catchAsync')
const registrationService = require('../services/registration.service')

// Gửi yêu cầu đăng ký thuê phòng
exports.create = catchAsync(async (req, res, next) => {
    // Gom toàn bộ data từ request (params, query, body) truyền xuống service
    const payload = {
        ...req.params,
        ...req.query,
        ...req.body
    }

    const result = await registrationService.create(payload)

    res.status(200).json({
        status: 'success',
        data: result
    })
})

// Lấy danh sách các phiếu đăng ký thuê
exports.getAll = catchAsync(async (req, res, next) => {
    // Gom toàn bộ data từ request (params, query, body) truyền xuống service
    const payload = {
        ...req.params,
        ...req.query,
        ...req.body
    }

    const result = await registrationService.getAll(payload)

    res.status(200).json({
        status: 'success',
        data: result
    })
})

// Cập nhật trạng thái
exports.updateStatus = catchAsync(async (req, res, next) => {
    const { id } = req.params
    const { status } = req.body

    const result = await registrationService.updateStatus(id, status)

    res.status(200).json({
        status: 'success',
        data: result
    })
})
