const router      = require('express').Router()
const db          = require('../db')
const requireAuth = require('../middleware/auth')

router.get('/', requireAuth, async (req, res) => {
  const { period = '30', source, salesperson } = req.query
  const p = Math.min(Math.max(Number(period) || 30, 7), 365)
  try {
    res.json(await db.getInsights({ period: p, source, salesperson }))
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

module.exports = router
