const express = require('express')
const router = express.Router()
const paymentController = require('../controllers/payment.controller')

// Thanh toán các chi phí
router.post('/', paymentController.create)

module.exports = router
