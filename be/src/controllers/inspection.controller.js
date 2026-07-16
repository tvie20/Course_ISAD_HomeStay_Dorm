const catchAsync = require('../utils/catchAsync')
const inspectionModel = require('../models/inspection.model')

// Tạo phiếu kiểm tra phòng (Manager gọi khi hoàn tất kiểm tra)
exports.create = catchAsync(async (req, res) => {
    const data = { ...req.params, ...req.query, ...req.body }
    const result = await inspectionModel.create(data)
    res.status(201).json({ status: 'success', data: result })
})

// Lấy kết quả kiểm tra theo MaYeuCau (Kế toán gọi để xem biên bản)
exports.getByRequestId = catchAsync(async (req, res) => {
    const result = await inspectionModel.getByRequestId(req.params.requestId)
    res.status(200).json({ status: 'success', data: result })
})

// Lấy thông tin đối soát theo MaYeuCau (Manager gọi để xem kết quả đối soát)
exports.getReconciliationByRequestId = catchAsync(async (req, res) => {
    const result = await inspectionModel.getReconciliationByRequestId(req.params.requestId)
    res.status(200).json({ status: 'success', data: result })
})
