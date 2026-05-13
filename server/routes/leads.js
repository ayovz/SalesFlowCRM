const router      = require('express').Router()
const db          = require('../db')
const requireAuth = require('../middleware/auth')

router.use(requireAuth)

router.post('/bulk', async (req, res) => {
  const leads = req.body
  if (!Array.isArray(leads) || leads.length === 0)
    return res.status(400).json({ error: 'Expected a non-empty array of leads' })
  try {
    const created = await db.bulkCreateLeads(leads, req.user.email)
    res.status(201).json({ imported: created.length, leads: created })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

router.get('/', async (req, res) => {
  try {
    res.json(await db.getLeads(req.query))
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

router.post('/', async (req, res) => {
  if (!req.body.lead_name) return res.status(400).json({ error: 'lead_name is required' })
  try {
    res.status(201).json(await db.createLead(req.body, req.user.email))
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const lead = await db.getLead(req.params.id)
    if (!lead) return res.status(404).json({ error: 'Lead not found' })
    res.json(lead)
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

router.patch('/:id', async (req, res) => {
  try {
    const lead = await db.updateLead(req.params.id, req.body, req.user.email)
    if (!lead) return res.status(404).json({ error: 'Lead not found' })
    res.json(lead)
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const ok = await db.deleteLead(req.params.id)
    if (!ok) return res.status(404).json({ error: 'Lead not found' })
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

module.exports = router
