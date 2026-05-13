const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

function now() { return new Date().toISOString() }

const db = {
  async findUserByEmail(email) {
    const { data, error } = await supabase.from('users').select('*').eq('email', email).maybeSingle()
    return data || null
  },

  async getLeads({ search, status, source, salesperson } = {}) {
    let query = supabase.from('leads').select('*').order('created_at', { ascending: false })
    if (status)      query = query.eq('status', status)
    if (source)      query = query.eq('lead_source', source)
    if (salesperson) query = query.eq('salesperson', salesperson)
    if (search) {
      const q = search.replace(/%/g, '\\%').replace(/_/g, '\\_')
      query = query.or(`lead_name.ilike.%${q}%,company_name.ilike.%${q}%,email.ilike.%${q}%`)
    }
    const { data } = await query
    return data || []
  },

  async getLead(id) {
    const { data } = await supabase.from('leads').select('*').eq('id', Number(id)).maybeSingle()
    return data || null
  },

  async createLead(fields, createdBy) {
    const { data: lead } = await supabase.from('leads').insert({
      lead_name:    fields.lead_name    || '',
      company_name: fields.company_name || null,
      email:        fields.email        || null,
      phone:        fields.phone        || null,
      lead_source:  fields.lead_source  || null,
      salesperson:  fields.salesperson  || null,
      status:       fields.status       || 'New',
      deal_value:   Number(fields.deal_value) || 0,
    }).select().maybeSingle()
    if (lead) {
      await supabase.from('activity_log').insert({
        lead_id: lead.id, action: 'created', detail: 'Lead created', created_by: createdBy,
      })
    }
    return lead
  },

  async updateLead(id, fields, updatedBy) {
    const existing = await this.getLead(id)
    if (!existing) return null
    const update = {}
    const FIELDS = ['lead_name', 'company_name', 'email', 'phone', 'lead_source', 'salesperson', 'status', 'deal_value']
    FIELDS.forEach(f => { if (fields[f] !== undefined) update[f] = f === 'deal_value' ? Number(fields[f]) : fields[f] })
    update.updated_at = now()
    const { data: lead } = await supabase.from('leads').update(update).eq('id', Number(id)).select().maybeSingle()
    if (fields.status && fields.status !== existing.status) {
      await supabase.from('activity_log').insert({
        lead_id: Number(id), action: 'status_changed',
        detail: `Status changed from ${existing.status} to ${fields.status}`,
        created_by: updatedBy,
      })
    }
    return lead
  },

  async deleteLead(id) {
    const { error } = await supabase.from('leads').delete().eq('id', Number(id))
    return !error
  },

  async getNotes(leadId) {
    const { data } = await supabase.from('notes').select('*').eq('lead_id', Number(leadId)).order('created_at', { ascending: false })
    return data || []
  },

  async createNote(leadId, content, createdBy) {
    const { data: note } = await supabase.from('notes').insert({
      lead_id: Number(leadId), content, created_by: createdBy,
    }).select().maybeSingle()
    if (note) {
      const preview = content.length > 80 ? content.slice(0, 80) + '…' : content
      await supabase.from('activity_log').insert({
        lead_id: Number(leadId), action: 'note_added', detail: preview, created_by: createdBy,
      })
    }
    return note
  },

  async getAllLeads() {
    const { data } = await supabase.from('leads').select('*').order('created_at', { ascending: false })
    return data || []
  },

  async bulkCreateLeads(leadsArray, createdBy) {
    const rows = leadsArray.filter(f => f.lead_name).map(fields => ({
      lead_name:    fields.lead_name    || '',
      company_name: fields.company_name || null,
      email:        fields.email        || null,
      phone:        fields.phone        || null,
      lead_source:  fields.lead_source  || null,
      salesperson:  fields.salesperson  || null,
      status:       fields.status       || 'New',
      deal_value:   Number(fields.deal_value) || 0,
    }))
    if (rows.length === 0) return []
    const { data: created } = await supabase.from('leads').insert(rows).select()
    if (created && created.length > 0) {
      await supabase.from('activity_log').insert(
        created.map(lead => ({ lead_id: lead.id, action: 'created', detail: 'Lead imported from XLSX', created_by: createdBy }))
      )
    }
    return created || []
  },

  async getInsights({ period = 30, source, salesperson } = {}) {
    let query = supabase.from('leads').select('*')
    if (source)      query = query.eq('lead_source', source)
    if (salesperson) query = query.eq('salesperson', salesperson)
    const { data: leadsData } = await query
    const all = leadsData || []

    const volumeTrend = []
    for (let i = period - 1; i >= 0; i--) {
      const d    = new Date(); d.setDate(d.getDate() - i)
      const date = d.toISOString().slice(0, 10)
      volumeTrend.push({ date, count: all.filter(l => l.created_at.startsWith(date)).length })
    }

    const STAGES = ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Won', 'Lost']
    const funnel  = STAGES.map(stage => ({ stage, count: all.filter(l => l.status === stage).length }))

    const srcSet  = [...new Set(all.map(l => l.lead_source).filter(Boolean))]
    const bySource = srcSet.map(src => {
      const sl  = all.filter(l => l.lead_source === src)
      const won = sl.filter(l => l.status === 'Won').length
      return { source: src, total: sl.length, won, winRate: sl.length ? Math.round((won / sl.length) * 100) : 0 }
    }).sort((a, b) => b.total - a.total)

    const spSet = [...new Set(all.map(l => l.salesperson).filter(Boolean))]
    const bySalesperson = spSet.map(sp => {
      const sl  = all.filter(l => l.salesperson === sp)
      const won = sl.filter(l => l.status === 'Won').length
      return { name: sp, total: sl.length, won, winRate: sl.length ? Math.round((won / sl.length) * 100) : 0 }
    }).sort((a, b) => b.total - a.total)

    let actQuery = supabase.from('activity_log').select('*, leads(lead_name)').order('created_at', { ascending: false }).limit(50)
    if (source || salesperson) {
      const ids = all.map(l => l.id)
      actQuery = ids.length ? actQuery.in('lead_id', ids) : actQuery.in('lead_id', [-1])
    }
    const { data: actData } = await actQuery
    const activityLog = (actData || []).map(a => ({ ...a, lead_name: a.leads?.lead_name ?? 'Unknown Lead', leads: undefined }))

    const total          = all.length
    const won            = all.filter(l => l.status === 'Won').length
    const conversionRate = total ? Math.round((won / total) * 100) : 0
    const wonLeads       = all.filter(l => l.status === 'Won')
    const avgDealValue   = wonLeads.length
      ? Math.round(wonLeads.reduce((s, l) => s + (l.deal_value || 0), 0) / wonLeads.length)
      : 0

    return { volumeTrend, funnel, bySource, bySalesperson, activityLog, summary: { total, won, conversionRate, avgDealValue } }
  },
}

module.exports = db
