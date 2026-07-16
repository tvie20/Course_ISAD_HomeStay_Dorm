const express = require('express')
const router = express.Router()
const inspectionController = require('../controllers/inspection.controller')

// Tạo phiếu kiểm tra phòng
router.post('/', inspectionController.create)

// Lấy kết quả kiểm tra theo MaYeuCau
router.get('/by-request/:requestId', inspectionController.getByRequestId)

// Lấy thông tin đối soát theo MaYeuCau
router.get('/reconciliation-by-request/:requestId', inspectionController.getReconciliationByRequestId)

module.exports = router
