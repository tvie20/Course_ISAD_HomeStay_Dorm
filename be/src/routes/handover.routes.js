const express = require('express')
const router = express.Router()
const handoverController = require('../controllers/handover.controller')

// Tạo biên bản bàn giao phòng/giường lúc khách vào ở
router.post('/', handoverController.create)

module.exports = router
