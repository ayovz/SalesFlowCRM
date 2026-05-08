const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET || 'salesflow-dev-secret-change-in-prod'

module.exports = function requireAuth(req, res, next) {
  const header = req.headers.authorization
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  try {
    req.user = jwt.verify(header.split(' ')[1], JWT_SECRET)
    next()
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' })
  }
}
