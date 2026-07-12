const express = require('express')
const router = express.Router()
const checkoutController = require('../controllers/checkout.controller')

// Lấy danh sách và trạng thái duyệt các yêu cầu trả phòng
router.get('/my-requests', checkoutController.getMyRequests)

// Khách hàng khởi tạo yêu cầu báo trước ngày trả phòng
router.post('/', checkoutController.create)

module.exports = router
