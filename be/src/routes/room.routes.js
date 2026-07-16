const express = require('express')
const router = express.Router()
const roomController = require('../controllers/room.controller')

// Lấy danh sách phòng và giường kèm trạng thái
router.get('/status', roomController.getStatus)

// Xem chi tiết thông tin một phòng
router.get('/:id', roomController.getOne)

// Lấy danh sách tài sản của một phòng
router.get('/:id/assets', roomController.getAssets)

module.exports = router
