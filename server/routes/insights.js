const router      = require('express').Router()
const db          = require('../db')
const requireAuth = require('../middleware/auth')

router.get('/', requireAuth, (req, res) => {
  const { period = '30', source, salesperson } = req.query
  const p = Math.min(Math.max(Number(period) || 30, 7), 365)
  res.json(db.getInsights({ period: p, source, salesperson }))
})

module.exports = router
