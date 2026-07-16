const express = require('express')
const router = express.Router()
const contractController = require('../controllers/contract.controller')

// Tạo hợp đồng thuê chính thức
router.post('/', contractController.create)

// Lấy danh sách các hợp đồng mới đã ký nhưng chưa bàn giao phòng
router.get('/pending-handover', contractController.getPendingHandover)

// Lấy hợp đồng đang hiệu lực
router.get('/active-contract', contractController.getActiveContract)

// Lấy chi tiết hợp đồng
router.get('/:id', contractController.getOne)

module.exports = router
