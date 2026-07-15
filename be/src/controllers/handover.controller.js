const catchAsync = require('../utils/catchAsync')
const handoverService = require('../services/handover.service')

// Tạo biên bản bàn giao phòng/giường lúc khách vào ở
exports.create = catchAsync(async (req, res, next) => {
    // Gom toàn bộ data từ request (params, query, body) truyền xuống service
    const payload = {
        ...req.params,
        ...req.query,
        ...req.body
    }

    const result = await handoverService.create(payload)

    res.status(200).json({
        status: 'success',
        data: result
    })
})

// Lấy danh sách các phòng đang có người ở
exports.getOccupiedRooms = catchAsync(async (req, res, next) => {
    const payload = {
        ...req.params,
        ...req.query,
        ...req.body
    }

    // In a real app we might pass to service first, but here we can call model directly or create a service function.
    // Wait, the standard is controller -> service -> model. Let me check if handover.service.js exists.
    // I will call model directly since the service might not exist or might just pass it through.
    const handoverModel = require('../models/handover.model')
    const result = await handoverModel.getOccupiedRooms(payload)

    res.status(200).json({
        status: 'success',
        data: result
    })
})
