const catchAsync = require('../utils/catchAsync')
const invoiceService = require('../services/invoice.service')

// Lấy danh sách các hóa đơn của khách hàng
exports.getAll = catchAsync(async (req, res, next) => {
    // Gom toàn bộ data từ request (params, query, body) truyền xuống service
    const payload = {
        ...req.params,
        ...req.query,
        ...req.body
    }

    const result = await invoiceService.getAll(payload)

    res.status(200).json({
        status: 'success',
        data: result
    })
})

// Xem chi tiết một hóa đơn
exports.getOne = catchAsync(async (req, res, next) => {
    // Gom toàn bộ data từ request (params, query, body) truyền xuống service
    const payload = {
        ...req.params,
        ...req.query,
        ...req.body
    }

    const result = await invoiceService.getOne(payload)

    res.status(200).json({
        status: 'success',
        data: result
    })
})

