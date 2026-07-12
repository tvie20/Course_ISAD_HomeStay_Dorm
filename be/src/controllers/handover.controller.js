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

