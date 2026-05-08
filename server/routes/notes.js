const router     = require('express').Router({ mergeParams: true })
const db         = require('../db')
const requireAuth = require('../middleware/auth')

router.use(requireAuth)

router.get('/', (req, res) => {
  res.json(db.getNotes(req.params.id))
})

router.post('/', (req, res) => {
  const { content } = req.body
  if (!content) return res.status(400).json({ error: 'content is required' })
  if (!db.getLead(req.params.id)) return res.status(404).json({ error: 'Lead not found' })
  res.status(201).json(db.createNote(req.params.id, content, req.user.email))
})

module.exports = router
