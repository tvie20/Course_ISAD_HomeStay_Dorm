const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
require('dotenv').config()

const { connectDatabase } = require('./config/database')
const rootRoutes = require('./routes/index')

const app = express()
const PORT = 5000

// Middlewares
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))

// Initialize API routes
app.use('/api/v1', rootRoutes)

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).json({
        status: 'error',
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : {}
    })
})

const startServer = async () => {
    await connectDatabase()

    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`)
        console.log(`Environment: ${process.env.NODE_ENV}`)
    })
}

startServer()