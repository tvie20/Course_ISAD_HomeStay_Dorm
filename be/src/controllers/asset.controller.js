const catchAsync = require('../utils/catchAsync')
const assetModel = require('../models/asset.model')

exports.getAllCatalog = catchAsync(async (req, res, next) => {
    const result = await assetModel.getAllCatalog()
    res.status(200).json({
        status: 'success',
        data: result
    })
})

exports.getAllAllocations = catchAsync(async (req, res, next) => {
    const result = await assetModel.getAllAllocations()
    res.status(200).json({
        status: 'success',
        data: result
    })
})
