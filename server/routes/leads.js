const router     = require('express').Router()
const db         = require('../db')
const requireAuth = require('../middleware/auth')

router.use(requireAuth)

router.post('/bulk', (req, res) => {
  const leads = req.body
  if (!Array.isArray(leads) || leads.length === 0)
    return res.status(400).json({ error: 'Expected a non-empty array of leads' })
  const created = db.bulkCreateLeads(leads, req.user.email)
  res.status(201).json({ imported: created.length, leads: created })
})

router.get('/', (req, res) => {
  res.json(db.getLeads(req.query))
})

router.post('/', (req, res) => {
  if (!req.body.lead_name) return res.status(400).json({ error: 'lead_name is required' })
  res.status(201).json(db.createLead(req.body, req.user.email))
})

router.get('/:id', (req, res) => {
  const lead = db.getLead(req.params.id)
  if (!lead) return res.status(404).json({ error: 'Lead not found' })
  res.json(lead)
})

router.patch('/:id', (req, res) => {
  const lead = db.updateLead(req.params.id, req.body, req.user.email)
  if (!lead) return res.status(404).json({ error: 'Lead not found' })
  res.json(lead)
})

router.delete('/:id', (req, res) => {
  const ok = db.deleteLead(req.params.id)
  if (!ok) return res.status(404).json({ error: 'Lead not found' })
  res.json({ success: true })
})

module.exports = router
