const catchAsync = require('../utils/catchAsync')
const roomTypeService = require('../services/roomType.service')

// Lấy danh sách các loại phòng
exports.getAll = catchAsync(async (req, res, next) => {
    // Gom toàn bộ data từ request (params, query, body) truyền xuống service
    const payload = {
        ...req.params,
        ...req.query,
        ...req.body
    }

    const result = await roomTypeService.getAll(payload)

    res.status(200).json({
        status: 'success',
        data: result
    })
})

