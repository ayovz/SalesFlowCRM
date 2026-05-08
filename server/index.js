const express = require('express')
const cors    = require('cors')

// Initialize DB (runs schema + seed on first launch)
require('./db')

const app = express()

app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:3000'] }))
app.use(express.json())

app.use('/api/auth',            require('./routes/auth'))
app.use('/api/leads',           require('./routes/leads'))
app.use('/api/leads/:id/notes', require('./routes/notes'))
app.use('/api/dashboard',       require('./routes/dashboard'))
app.use('/api/insights',        require('./routes/insights'))

app.get('/api/health', (_, res) => res.json({ status: 'ok' }))

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))
