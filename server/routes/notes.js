const router      = require('express').Router({ mergeParams: true })
const db          = require('../db')
const requireAuth = require('../middleware/auth')

router.use(requireAuth)

router.get('/', async (req, res) => {
  try {
    res.json(await db.getNotes(req.params.id))
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

router.post('/', async (req, res) => {
  const { content } = req.body
  if (!content) return res.status(400).json({ error: 'content is required' })
  try {
    const lead = await db.getLead(req.params.id)
    if (!lead) return res.status(404).json({ error: 'Lead not found' })
    res.status(201).json(await db.createNote(req.params.id, content, req.user.email))
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

module.exports = router
