const catchAsync = require('../utils/catchAsync')
const paymentService = require('../services/payment.service')

// Thanh toán các chi phí
exports.create = catchAsync(async (req, res, next) => {
    // Gom toàn bộ data từ request (params, query, body) truyền xuống service
    const payload = {
        ...req.params,
        ...req.query,
        ...req.body
    }

    const result = await paymentService.create(payload)

    res.status(200).json({
        status: 'success',
        data: result
    })
})

