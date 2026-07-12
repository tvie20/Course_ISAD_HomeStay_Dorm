const catchAsync = require('../utils/catchAsync')
const depositService = require('../services/deposit.service')

// Tạo biên lai thu tiền cọc giữ chỗ
exports.create = catchAsync(async (req, res, next) => {
    // Gom toàn bộ data từ request (params, query, body) truyền xuống service
    const payload = {
        ...req.params,
        ...req.query,
        ...req.body
    }

    const result = await depositService.create(payload)

    res.status(200).json({
        status: 'success',
        data: result
    })
})

// Xuất file pdf biên nhận cọc
exports.print = catchAsync(async (req, res, next) => {
    // Gom toàn bộ data từ request (params, query, body) truyền xuống service
    const payload = {
        ...req.params,
        ...req.query,
        ...req.body
    }

    const result = await depositService.print(payload)

    res.status(200).json({
        status: 'success',
        data: result
    })
})

// Lấy danh sách các khách đã đặt cọc chờ nhận phòng
exports.getAll = catchAsync(async (req, res, next) => {
    // Gom toàn bộ data từ request (params, query, body) truyền xuống service
    const payload = {
        ...req.params,
        ...req.query,
        ...req.body
    }

    const result = await depositService.getAll(payload)

    res.status(200).json({
        status: 'success',
        data: result
    })
})

// Cập nhật ngày giờ dự kiến khách sẽ đến làm thủ tục nhận phòng
exports.updateCheckinSchedule = catchAsync(async (req, res, next) => {
    // Gom toàn bộ data từ request (params, query, body) truyền xuống service
    const payload = {
        ...req.params,
        ...req.query,
        ...req.body
    }

    const result = await depositService.updateCheckinSchedule(payload)

    res.status(200).json({
        status: 'success',
        data: result
    })
})

