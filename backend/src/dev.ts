import app from './server.js'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const PORT = process.env.PORT || 5000

// Start server for local development
app.listen(PORT, () => {
  console.log('🚀 Server running on http://localhost:' + PORT)
  console.log('📝 Environment: ' + (process.env.NODE_ENV || 'development'))
})
