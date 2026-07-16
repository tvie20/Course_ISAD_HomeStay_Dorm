const express = require('express')
const router = express.Router()
const registrationController = require('../controllers/registration.controller')

// Gửi yêu cầu đăng ký thuê phòng
router.post('/', registrationController.create)

// Lấy danh sách các phiếu đăng ký thuê
router.get('/', registrationController.getAll)

// Cập nhật trạng thái
router.put('/:id/status', registrationController.updateStatus)

module.exports = router
