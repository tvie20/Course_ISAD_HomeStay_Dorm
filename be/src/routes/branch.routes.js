const express = require('express')
const router = express.Router()
const branchController = require('../controllers/branch.controller')

// Lấy danh sách các chi nhánh
router.get('/', branchController.getAll)

module.exports = router
