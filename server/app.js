const express = require('express')
const cors    = require('cors')

const app = express()

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.FRONTEND_URL,
].filter(Boolean)

app.use(cors({
  origin(origin, cb) {
    if (!origin) return cb(null, true)
    if (allowedOrigins.includes(origin) || /\.vercel\.app$/.test(origin)) return cb(null, true)
    cb(new Error('CORS: Not allowed'))
  },
}))
app.use(express.json())

app.use('/api/auth',            require('./routes/auth'))
app.use('/api/leads',           require('./routes/leads'))
app.use('/api/leads/:id/notes', require('./routes/notes'))
app.use('/api/dashboard',       require('./routes/dashboard'))
app.use('/api/insights',        require('./routes/insights'))

app.get('/api/health', (_, res) => res.json({ status: 'ok' }))

module.exports = app
