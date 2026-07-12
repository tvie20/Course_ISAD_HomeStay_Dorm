const express = require('express')
const router = express.Router()
const invoiceController = require('../controllers/invoice.controller')

// Lấy danh sách các hóa đơn của khách hàng
router.get('/', invoiceController.getAll)

// Xem chi tiết một hóa đơn
router.get('/:id', invoiceController.getOne)

module.exports = router
