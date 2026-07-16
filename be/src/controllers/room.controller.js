const catchAsync = require('../utils/catchAsync')
const roomService = require('../services/room.service')

// Lấy danh sách phòng và giường kèm trạng thái
exports.getStatus = catchAsync(async (req, res, next) => {
    // Gom toàn bộ data từ request (params, query, body) truyền xuống service
    const payload = {
        ...req.params,
        ...req.query,
        ...req.body
    }

    const result = await roomService.getStatus(payload)

    res.status(200).json({
        status: 'success',
        data: result
    })
})

// Xem chi tiết thông tin một phòng
exports.getOne = catchAsync(async (req, res, next) => {
    // Gom toàn bộ data từ request (params, query, body) truyền xuống service
    const payload = {
        ...req.params,
        ...req.query,
        ...req.body
    }

    const result = await roomService.getOne(payload)

    res.status(200).json({
        status: 'success',
        data: result
    })
})

// Lấy danh sách tài sản của một phòng
exports.getAssets = catchAsync(async (req, res, next) => {
    const payload = {
        ...req.params,
        ...req.query,
        ...req.body
    }

    const result = await roomService.getAssets(payload)

    res.status(200).json({
        status: 'success',
        data: result
    })
})

