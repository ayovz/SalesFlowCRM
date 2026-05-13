const router      = require('express').Router()
const bcrypt      = require('bcryptjs')
const jwt         = require('jsonwebtoken')
const db          = require('../db')
const requireAuth = require('../middleware/auth')

const JWT_SECRET = process.env.JWT_SECRET || 'salesflow-dev-secret-change-in-prod'

router.post('/login', async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' })
  try {
    const user = await db.findUserByEmail(email)
    if (!user || !bcrypt.compareSync(password, user.password_hash)) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' })
    res.json({ token, user: { id: user.id, email: user.email } })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

router.get('/me', requireAuth, (req, res) => {
  res.json({ user: req.user })
})

module.exports = router
