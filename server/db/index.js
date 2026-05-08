const fs     = require('fs')
const path   = require('path')
const bcrypt = require('bcryptjs')

const DATA_FILE = path.join(__dirname, 'data.json')

const EMPTY = { users: [], leads: [], notes: [], activity_log: [], seq: { users: 0, leads: 0, notes: 0, activity_log: 0 } }

function load()     { return fs.existsSync(DATA_FILE) ? JSON.parse(fs.readFileSync(DATA_FILE, 'utf8')) : JSON.parse(JSON.stringify(EMPTY)) }
function save(data) { fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2)) }
function nextId(data, table) { return ++data.seq[table] }
function now()      { return new Date().toISOString().replace('T', ' ').slice(0, 19) }

// ── Seed on first run ───────────────────────────────────────────────────────
;(function seed() {
  const data = load()
  if (data.users.length > 0) return

  data.users.push({ id: 1, email: 'admin@example.com', password_hash: bcrypt.hashSync('password123', 10), created_at: now() })
  data.seq.users = 1

  const rows = [
    ['Alice Johnson', 'TechCorp',     'alice@techcorp.com',    '555-0101', 'Website',    'Alex Chen',   'Won',           45000],
    ['Bob Smith',     'DataFlow Inc', 'bob@dataflow.com',      '555-0102', 'Referral',   'Sarah Kim',   'Qualified',     28000],
    ['Carol White',   'Streamline',   'carol@streamline.io',   '555-0103', 'LinkedIn',   'James Park',  'Contacted',     15000],
    ['David Lee',     'NovaSystems',  'david@novasystems.com', '555-0104', 'Conference', 'Maria Lopez', 'New',           62000],
    ['Eva Martinez',  'CloudPeak',    'eva@cloudpeak.com',     '555-0105', 'Cold Call',  'David Osei',  'Proposal Sent', 33000],
    ['Frank Turner',  'Apex Digital', 'frank@apexdigital.com', '555-0106', 'Website',    'Alex Chen',   'Lost',          19000],
    ['Grace Kim',     'BlueSky Tech', 'grace@bluesky.com',     '555-0107', 'Referral',   'Sarah Kim',   'Won',           54000],
    ['Henry Park',    'Vertex Corp',  'henry@vertex.com',      '555-0108', 'LinkedIn',   'James Park',  'New',           22000],
  ]

  // Spread creation times over last 6 months for a realistic chart
  rows.forEach(([lead_name, company_name, email, phone, lead_source, salesperson, status, deal_value], i) => {
    const id = nextId(data, 'leads')
    const d  = new Date(); d.setMonth(d.getMonth() - Math.floor(i / 2))
    data.leads.push({ id, lead_name, company_name, email, phone, lead_source, salesperson, status, deal_value, created_at: d.toISOString().replace('T', ' ').slice(0, 19), updated_at: now() })
  })

  // Seed demo notes so the feature is visible on first run
  const demoNotes = [
    [1, 'Closed the deal after final pricing call. Contract signed.', 'admin@example.com'],
    [2, 'Sent over technical specs. Follow up next Tuesday.', 'admin@example.com'],
    [3, 'Left voicemail. Will try again Thursday.', 'admin@example.com'],
    [4, 'Inbound from their website contact form. Strong fit for enterprise tier.', 'admin@example.com'],
    [5, 'Proposal sent via email. Budget approval still pending on their side.', 'admin@example.com'],
    [7, 'Second deal closed this quarter. Referred us to two other companies.', 'admin@example.com'],
  ]
  demoNotes.forEach(([lead_id, content, created_by]) => {
    const id = nextId(data, 'notes')
    data.notes.push({ id, lead_id, content, created_by, created_at: now() })
  })

  save(data)
})()

// ── Public API ───────────────────────────────────────────────────────────────
const db = {
  findUserByEmail(email) {
    return load().users.find(u => u.email === email) ?? null
  },

  getLeads({ search, status, source, salesperson } = {}) {
    let rows = load().leads
    if (search) {
      const q = search.toLowerCase()
      rows = rows.filter(l =>
        (l.lead_name    ?? '').toLowerCase().includes(q) ||
        (l.company_name ?? '').toLowerCase().includes(q) ||
        (l.email        ?? '').toLowerCase().includes(q)
      )
    }
    if (status)      rows = rows.filter(l => l.status      === status)
    if (source)      rows = rows.filter(l => l.lead_source === source)
    if (salesperson) rows = rows.filter(l => l.salesperson === salesperson)
    return [...rows].sort((a, b) => b.created_at.localeCompare(a.created_at))
  },

  getLead(id) {
    return load().leads.find(l => l.id === Number(id)) ?? null
  },

  createLead(fields, createdBy) {
    const data = load()
    const id   = nextId(data, 'leads')
    const lead = {
      id,
      lead_name:    fields.lead_name    || '',
      company_name: fields.company_name || null,
      email:        fields.email        || null,
      phone:        fields.phone        || null,
      lead_source:  fields.lead_source  || null,
      salesperson:  fields.salesperson  || null,
      status:       fields.status       || 'New',
      deal_value:   Number(fields.deal_value) || 0,
      created_at:   now(),
      updated_at:   now(),
    }
    data.leads.push(lead)
    const lid = nextId(data, 'activity_log')
    data.activity_log.push({ id: lid, lead_id: id, action: 'created', detail: 'Lead created', created_by: createdBy, created_at: now() })
    save(data)
    return lead
  },

  updateLead(id, fields, updatedBy) {
    const data  = load()
    const idx   = data.leads.findIndex(l => l.id === Number(id))
    if (idx === -1) return null
    const lead      = { ...data.leads[idx] }
    const prevStatus = lead.status

    const FIELDS = ['lead_name', 'company_name', 'email', 'phone', 'lead_source', 'salesperson', 'status', 'deal_value']
    FIELDS.forEach(f => { if (fields[f] !== undefined) lead[f] = f === 'deal_value' ? Number(fields[f]) : fields[f] })
    lead.updated_at = now()
    data.leads[idx] = lead

    if (fields.status && fields.status !== prevStatus) {
      const lid = nextId(data, 'activity_log')
      data.activity_log.push({ id: lid, lead_id: Number(id), action: 'status_changed', detail: `Status changed from ${prevStatus} to ${fields.status}`, created_by: updatedBy, created_at: now() })
    }
    save(data)
    return lead
  },

  deleteLead(id) {
    const data = load()
    const idx  = data.leads.findIndex(l => l.id === Number(id))
    if (idx === -1) return false
    data.leads.splice(idx, 1)
    data.notes        = data.notes.filter(n => n.lead_id !== Number(id))
    data.activity_log = data.activity_log.filter(a => a.lead_id !== Number(id))
    save(data)
    return true
  },

  getNotes(leadId) {
    return load().notes
      .filter(n => n.lead_id === Number(leadId))
      .sort((a, b) => b.created_at.localeCompare(a.created_at))
  },

  createNote(leadId, content, createdBy) {
    const data = load()
    const id   = nextId(data, 'notes')
    const note = { id, lead_id: Number(leadId), content, created_by: createdBy, created_at: now() }
    data.notes.push(note)
    const lid = nextId(data, 'activity_log')
    const preview = content.length > 80 ? content.slice(0, 80) + '…' : content
    data.activity_log.push({ id: lid, lead_id: Number(leadId), action: 'note_added', detail: preview, created_by: createdBy, created_at: now() })
    save(data)
    return note
  },

  getAllLeads() {
    return load().leads
  },

  bulkCreateLeads(leadsArray, createdBy) {
    const data = load()
    const created = []
    for (const fields of leadsArray) {
      if (!fields.lead_name) continue
      const id   = nextId(data, 'leads')
      const lead = {
        id,
        lead_name:    fields.lead_name    || '',
        company_name: fields.company_name || null,
        email:        fields.email        || null,
        phone:        fields.phone        || null,
        lead_source:  fields.lead_source  || null,
        salesperson:  fields.salesperson  || null,
        status:       fields.status       || 'New',
        deal_value:   Number(fields.deal_value) || 0,
        created_at:   now(),
        updated_at:   now(),
      }
      data.leads.push(lead)
      const lid = nextId(data, 'activity_log')
      data.activity_log.push({ id: lid, lead_id: id, action: 'created', detail: 'Lead imported from XLSX', created_by: createdBy, created_at: now() })
      created.push(lead)
    }
    save(data)
    return created
  },

  getInsights({ period = 30, source, salesperson } = {}) {
    const data = load()
    let leads  = data.leads

    if (source)      leads = leads.filter(l => l.lead_source === source)
    if (salesperson) leads = leads.filter(l => l.salesperson === salesperson)

    // Volume trend — one entry per day for the selected period
    const volumeTrend = []
    for (let i = period - 1; i >= 0; i--) {
      const d    = new Date(); d.setDate(d.getDate() - i)
      const date = d.toISOString().slice(0, 10)
      volumeTrend.push({ date, count: leads.filter(l => l.created_at.startsWith(date)).length })
    }

    // Conversion funnel — count per status stage
    const STAGES = ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Won', 'Lost']
    const funnel  = STAGES.map(stage => ({ stage, count: leads.filter(l => l.status === stage).length }))

    // Win rate by source
    const srcSet  = [...new Set(leads.map(l => l.lead_source).filter(Boolean))]
    const bySource = srcSet.map(src => {
      const sl  = leads.filter(l => l.lead_source === src)
      const won = sl.filter(l => l.status === 'Won').length
      return { source: src, total: sl.length, won, winRate: sl.length ? Math.round((won / sl.length) * 100) : 0 }
    }).sort((a, b) => b.total - a.total)

    // Win rate by salesperson
    const spSet = [...new Set(leads.map(l => l.salesperson).filter(Boolean))]
    const bySalesperson = spSet.map(sp => {
      const sl  = leads.filter(l => l.salesperson === sp)
      const won = sl.filter(l => l.status === 'Won').length
      return { name: sp, total: sl.length, won, winRate: sl.length ? Math.round((won / sl.length) * 100) : 0 }
    }).sort((a, b) => b.total - a.total)

    // Activity log with lead name, most recent first
    const leadIds = new Set(leads.map(l => l.id))
    const activityLog = [...data.activity_log]
      .filter(a => !source && !salesperson ? true : leadIds.has(a.lead_id))
      .sort((a, b) => b.created_at.localeCompare(a.created_at))
      .slice(0, 50)
      .map(a => {
        const lead = data.leads.find(l => l.id === a.lead_id)
        return { ...a, lead_name: lead?.lead_name ?? 'Unknown Lead' }
      })

    // Summary stats
    const total          = leads.length
    const won            = leads.filter(l => l.status === 'Won').length
    const conversionRate = total ? Math.round((won / total) * 100) : 0
    const wonLeads       = leads.filter(l => l.status === 'Won')
    const avgDealValue   = wonLeads.length
      ? Math.round(wonLeads.reduce((s, l) => s + (l.deal_value || 0), 0) / wonLeads.length)
      : 0

    return { volumeTrend, funnel, bySource, bySalesperson, activityLog, summary: { total, won, conversionRate, avgDealValue } }
  },
}

module.exports = db
