const catchAsync = require('../utils/catchAsync')
const accountModel = require('../models/account.model')

exports.login = catchAsync(async (req, res, next) => {
    const { username, password, userType } = req.body

    if (!username || !password) {
        return res.status(400).json({
            status: 'fail',
            message: 'Vui lòng cung cấp tên đăng nhập và mật khẩu'
        })
    }

    try {
        const result = await accountModel.login(username, password, userType)
        res.status(200).json({
            status: 'success',
            data: result
        })
    } catch (error) {
        res.status(401).json({
            status: 'fail',
            message: error.message
        })
    }
})
