const catchAsync = require('../utils/catchAsync')
const bedService = require('../services/bed.service')

// Lấy danh sách các giường phòng trống có thể cọc
exports.getAvailable = catchAsync(async (req, res, next) => {
    // Gom toàn bộ data từ request (params, query, body) truyền xuống service
    const payload = {
        ...req.params,
        ...req.query,
        ...req.body
    }

    const result = await bedService.getAvailable(payload)

    res.status(200).json({
        status: 'success',
        data: result
    })
})

