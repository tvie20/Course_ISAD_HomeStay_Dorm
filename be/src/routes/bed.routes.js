const express = require('express')
const router = express.Router()
const bedController = require('../controllers/bed.controller')

// Lấy danh sách các giường phòng trống có thể cọc
router.get('/available', bedController.getAvailable)

module.exports = router
