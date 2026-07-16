const catchAsync = require('../utils/catchAsync')
const userModel = require('../models/user.model')
const accountModel = require('../models/account.model')

exports.getAll = catchAsync(async (req, res, next) => {
    const result = await userModel.getAll()
    res.status(200).json({ status: 'success', data: result })
})

// Danh sách KH có hợp đồng còn hiệu lực nhưng chưa có tài khoản
exports.getCustomersNeedingAccount = catchAsync(async (req, res, next) => {
    const result = await userModel.getCustomersNeedingAccount()
    res.status(200).json({ status: 'success', data: result })
})

// Tạo tài khoản nhanh cho KH có sẵn (từ tab "Cần cấp tài khoản")
exports.createAccountForCustomer = catchAsync(async (req, res, next) => {
    const { customerId, password } = req.body
    if (!customerId) {
        return res.status(400).json({ status: 'fail', message: 'Thiếu customerId' })
    }
    const result = await accountModel.createAccountForExistingCustomer(customerId, password)
    res.status(201).json({
        status: 'success',
        message: `Đã tạo tài khoản cho khách hàng ${result.name}`,
        data: result
    })
})
