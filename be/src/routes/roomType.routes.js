const express = require('express')
const router = express.Router()
const roomTypeController = require('../controllers/roomType.controller')

// Lấy danh sách các loại phòng
router.get('/', roomTypeController.getAll)

module.exports = router
