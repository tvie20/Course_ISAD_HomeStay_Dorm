const catchAsync = require('../utils/catchAsync')
const branchService = require('../services/branch.service')

// Lấy danh sách các chi nhánh
exports.getAll = catchAsync(async (req, res, next) => {
    // Gom toàn bộ data từ request (params, query, body) truyền xuống service
    const payload = {
        ...req.params,
        ...req.query,
        ...req.body
    }

    const result = await branchService.getAll(payload)

    res.status(200).json({
        status: 'success',
        data: result
    })
})

