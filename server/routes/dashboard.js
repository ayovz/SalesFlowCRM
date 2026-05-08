const router     = require('express').Router()
const db         = require('../db')
const requireAuth = require('../middleware/auth')

router.get('/', requireAuth, (req, res) => {
  const leads = db.getAllLeads()

  const total      = leads.length
  const newLeads   = leads.filter(l => l.status === 'New').length
  const contacted  = leads.filter(l => l.status === 'Contacted').length
  const qualified  = leads.filter(l => l.status === 'Qualified').length
  const won        = leads.filter(l => l.status === 'Won').length
  const lost       = leads.filter(l => l.status === 'Lost').length
  const totalValue = leads.reduce((s, l) => s + (l.deal_value || 0), 0)
  const wonValue   = leads.filter(l => l.status === 'Won').reduce((s, l) => s + (l.deal_value || 0), 0)

  const monthly = []
  for (let i = 5; i >= 0; i--) {
    const d     = new Date(); d.setMonth(d.getMonth() - i)
    const year  = d.getFullYear()
    const month = d.getMonth() + 1
    const count = leads.filter(l => {
      const c = new Date(l.created_at)
      return c.getFullYear() === year && c.getMonth() + 1 === month
    }).length
    monthly.push({ month: d.toLocaleString('default', { month: 'short' }), leads: count })
  }

  res.json({ total, newLeads, contacted, qualified, won, lost, totalValue, wonValue, monthly })
})

module.exports = router
