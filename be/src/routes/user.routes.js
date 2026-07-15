const express = require('express')
const router = express.Router()
const userController = require('../controllers/user.controller')

// Lấy danh sách tất cả người dùng (Nhân viên và Khách hàng)
router.get('/', userController.getAll)

module.exports = router
