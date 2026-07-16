const catchAsync = require('../utils/catchAsync')
const contractService = require('../services/contract.service')

// Tạo hợp đồng thuê chính thức
exports.create = catchAsync(async (req, res, next) => {
    // Gom toàn bộ data từ request (params, query, body) truyền xuống service
    const payload = {
        ...req.params,
        ...req.query,
        ...req.body
    }

    const result = await contractService.create(payload)

    res.status(200).json({
        status: 'success',
        data: result
    })
})

// Lấy danh sách các hợp đồng mới đã ký nhưng chưa bàn giao phòng
exports.getPendingHandover = catchAsync(async (req, res, next) => {
    // Gom toàn bộ data từ request (params, query, body) truyền xuống service
    const payload = {
        ...req.params,
        ...req.query,
        ...req.body
    }

    const result = await contractService.getPendingHandover(payload)

    res.status(200).json({
        status: 'success',
        data: result
    })
})

// Lấy chi tiết hợp đồng
exports.getOne = catchAsync(async (req, res, next) => {
    // Gom toàn bộ data từ request (params, query, body) truyền xuống service
    const payload = {
        ...req.params,
        ...req.query,
        ...req.body
    }

    const result = await contractService.getOne(payload)

    res.status(200).json({
        status: 'success',
        data: result
    })
})

// Lấy hợp đồng đang hiệu lực của khách hàng
exports.getActiveContract = catchAsync(async (req, res, next) => {
    const payload = {
        ...req.params,
        ...req.query,
        ...req.body
    }

    const result = await contractService.getActiveContract(payload)

    res.status(200).json({
        status: 'success',
        data: result
    })
})

