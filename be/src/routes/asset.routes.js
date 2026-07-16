const express = require('express')
const router = express.Router()
const assetController = require('../controllers/asset.controller')

// Danh mục tài sản
router.get('/catalog', assetController.getAllCatalog)

// Phân bổ tài sản
router.get('/allocations', assetController.getAllAllocations)

module.exports = router
