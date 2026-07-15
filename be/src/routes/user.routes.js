const express = require('express')
const router = express.Router()
const userController = require('../controllers/user.controller')

// Lấy danh sách tất cả người dùng (Nhân viên và Khách hàng)
router.get('/', userController.getAll)

// Danh sách KH có hợp đồng nhưng chưa có tài khoản
router.get('/pending-account', userController.getCustomersNeedingAccount)

// Tạo tài khoản nhanh cho KH đã có trong DB
router.post('/create-account', userController.createAccountForCustomer)

module.exports = router
