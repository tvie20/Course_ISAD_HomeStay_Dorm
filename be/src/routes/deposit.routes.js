const express = require('express')
const router = express.Router()
const depositController = require('../controllers/deposit.controller')

// Tạo biên lai thu tiền cọc giữ chỗ
router.post('/', depositController.create)

// Xuất file pdf biên nhận cọc
router.get('/:id/print', depositController.print)

// Lấy danh sách các khách đã đặt cọc chờ nhận phòng
router.get('/', depositController.getAll)

// Cập nhật ngày giờ dự kiến khách sẽ đến làm thủ tục nhận phòng
router.put('/:id/checkin-schedule', depositController.updateCheckinSchedule)

module.exports = router
