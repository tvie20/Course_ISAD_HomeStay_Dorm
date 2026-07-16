
const express = require('express')
const router = express.Router()
const reconController = require('../controllers/reconciliation.controller')

router.get('/', reconController.getAll)
router.post('/', reconController.create)
router.put('/:id/status', reconController.updateStatus)

module.exports = router
