const catchAsync = require('../utils/catchAsync')
const checkoutService = require('../services/checkout.service')

// Lấy danh sách và trạng thái duyệt các yêu cầu trả phòng
exports.getMyRequests = catchAsync(async (req, res, next) => {
    // Gom toàn bộ data từ request (params, query, body) truyền xuống service
    const payload = {
        ...req.params,
        ...req.query,
        ...req.body
    }

    const result = await checkoutService.getMyRequests(payload)

    res.status(200).json({
        status: 'success',
        data: result
    })
})

// Khách hàng khởi tạo yêu cầu báo trước ngày trả phòng
exports.create = catchAsync(async (req, res, next) => {
    // Gom toàn bộ data từ request (params, query, body) truyền xuống service
    const payload = {
        ...req.params,
        ...req.query,
        ...req.body
    }

    const result = await checkoutService.create(payload)

    res.status(200).json({
        status: 'success',
        data: result
    })
})
// Quản lý lấy danh sách tất cả yêu cầu trả phòng
exports.getAll = catchAsync(async (req, res, next) => {
    const payload = {
        ...req.params,
        ...req.query,
        ...req.body
    }

    const result = await checkoutService.getAll(payload)

    res.status(200).json({
        status: 'success',
        data: result
    })
})

exports.updateStatus = catchAsync(async (req, res, next) => {
    const payload = {
        ...req.params,
        ...req.query,
        ...req.body
    }

    const result = await checkoutService.updateStatus(payload)

    res.status(200).json({
        status: 'success',
        data: result
    })
})
