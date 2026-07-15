const catchAsync = require('../utils/catchAsync')
const userModel = require('../models/user.model')

exports.getAll = catchAsync(async (req, res, next) => {
    const result = await userModel.getAll()

    res.status(200).json({
        status: 'success',
        data: result
    })
})
