const express = require('express')
const router = express.Router()
const roomController = require('../controllers/room.controller')

// Lấy danh sách phòng và giường kèm trạng thái
router.get('/status', roomController.getStatus)

// Xem chi tiết thông tin một phòng
router.get('/:id', roomController.getOne)

module.exports = router
