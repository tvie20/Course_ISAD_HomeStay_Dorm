const express = require('express')
const router = express.Router()
const checkoutController = require('../controllers/checkout.controller')

// Lấy danh sách và trạng thái duyệt các yêu cầu trả phòng
router.get('/my-requests', checkoutController.getMyRequests)

// Khách hàng khởi tạo yêu cầu báo trước ngày trả phòng
router.post('/', checkoutController.create)

// Quản lý lấy danh sách tất cả yêu cầu trả phòng
router.get('/', checkoutController.getAll)

// Cập nhật trạng thái yêu cầu trả phòng
router.put('/:id/status', checkoutController.updateStatus)

module.exports = router
