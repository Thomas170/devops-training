const express = require('express')
const cors = require('cors')

const app = express()

// Middlewares
app.use(cors())
app.use(express.json())

// Basic security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-Frame-Options', 'DENY')
  res.setHeader('X-XSS-Protection', '1; mode=block')
  next()
})

// Fictive services (shared with frontend)
const services = [
  { id: 1, name: 'API Auth', status: 'Online' },
  { id: 2, name: 'Database', status: 'Online' },
  { id: 3, name: 'Payment Service', status: 'Online' }
]

// Health endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'UP', timestamp: new Date().toISOString() })
})

// Services endpoint
app.get('/api/services', (req, res) => {
  res.json(services)
})

// Port and DB config
const PORT = process.env.PORT || 3000
const DATABASE_URL = process.env.DATABASE_URL || null

app.listen(PORT, () => {
  console.log(`DevOps backend listening on port ${PORT}`)
  if (DATABASE_URL) console.log('DATABASE_URL is configured')
})
