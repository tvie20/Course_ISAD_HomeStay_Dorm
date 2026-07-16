const express = require('express')
const router = express.Router()

// Import routes
const branchRoutes = require('./branch.routes')
const roomTypeRoutes = require('./roomType.routes')
const roomRoutes = require('./room.routes')
const bedRoutes = require('./bed.routes')
const registrationRoutes = require('./registration.routes')
const appointmentRoutes = require('./appointment.routes')
const depositRoutes = require('./deposit.routes')
const contractRoutes = require('./contract.routes')
const handoverRoutes = require('./handover.routes')
const invoiceRoutes = require('./invoice.routes')
const paymentRoutes = require('./payment.routes')
const checkoutRoutes = require('./checkout.routes')
const authRoutes = require('./auth.routes')
const userRoutes = require('./user.routes')
const assetRoutes = require('./asset.routes')

// Health check endpoint
router.get('/health', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Server is up and running smooth'
    })
})

// Mount routes
router.use('/branches', branchRoutes)
router.use('/room-types', roomTypeRoutes)
router.use('/rooms', roomRoutes)
router.use('/beds', bedRoutes)
router.use('/registrations', registrationRoutes)
router.use('/appointments', appointmentRoutes)
router.use('/deposits', depositRoutes)
router.use('/contracts', contractRoutes)
router.use('/handovers', handoverRoutes)
router.use('/invoices', invoiceRoutes)
router.use('/payments', paymentRoutes)
router.use('/checkout-requests', checkoutRoutes)
router.use('/auth', authRoutes)
router.use('/users', userRoutes)
router.use('/assets', assetRoutes)

const reconRoutes = require('./reconciliation.routes')
router.use('/reconciliations', reconRoutes)

module.exports = router