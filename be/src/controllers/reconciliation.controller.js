
const catchAsync = require('../utils/catchAsync')
const reconService = require('../services/reconciliation.service')

exports.getAll = catchAsync(async (req, res, next) => {
    const data = await reconService.getAll()
    res.status(200).json({ status: 'success', data })
})

exports.create = catchAsync(async (req, res, next) => {
    const data = await reconService.create(req.body)
    res.status(201).json({ status: 'success', data })
})

exports.updateStatus = catchAsync(async (req, res, next) => {
    const data = await reconService.updateStatus({ ...req.params, ...req.body })
    res.status(200).json({ status: 'success', data })
})
