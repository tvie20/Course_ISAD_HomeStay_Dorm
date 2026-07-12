const express = require('express')
const router = express.Router()
const appointmentController = require('../controllers/appointment.controller')

// Tạo lịch hẹn xem phòng cho khách
router.post('/', appointmentController.create)

// Cập nhật trạng thái lịch hẹn
router.put('/:id', appointmentController.updateStatus)

module.exports = router
