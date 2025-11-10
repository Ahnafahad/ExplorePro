import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import compression from 'compression'
import dotenv from 'dotenv'

// Import routes
import authRoutes from './routes/auth.js'
import guideRoutes from './routes/guides.js'
import bookingRoutes from './routes/bookings.js'
import pollingRoutes from './routes/polling.js'

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(helmet())
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}))
app.use(compression())
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'ExplorePro API is running',
    timestamp: new Date().toISOString(),
  })
})

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/guides', guideRoutes)
app.use('/api/bookings', bookingRoutes)
app.use('/api/polling', pollingRoutes)
// Additional routes to be implemented:
// app.use('/api/tours', tourRoutes)
// app.use('/api/reviews', reviewRoutes)
// app.use('/api/admin', adminRoutes)

// Error handling middleware
interface ApiError extends Error {
  statusCode?: number
  code?: string
}

app.use((err: ApiError, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err)

  const statusCode = err.statusCode || 500
  const errorCode = err.code || 'SERVER_ERROR'

  res.status(statusCode).json({
    success: false,
    error: {
      code: errorCode,
      message: err.message || 'Internal server error',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    },
  })
})

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: 'Route not found',
    },
  })
})

// For local development
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`)
    console.log(`📝 Environment: ${process.env.NODE_ENV}`)
  })
}

// Export for Vercel serverless
export default app
