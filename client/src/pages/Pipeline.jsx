import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import TopNav  from '../components/layout/TopNav'
import Badge   from '../components/ui/Badge'
import { api } from '../lib/api'
import { LEAD_STATUSES } from '../lib/constants'

function fmt(n) {
  if (!n) return null
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000)     return `$${(n / 1_000).toFixed(0)}K`
  return `$${n}`
}

export default function Pipeline() {
  const [leads,   setLeads]   = useState([])
  const [loading, setLoading] = useState(true)
  const [dragId,  setDragId]  = useState(null)
  const [error,   setError]   = useState('')

  useEffect(() => {
    api.get('/leads')
      .then(d => { setLeads(d); setLoading(false) })
      .catch(err => { setError(err.message); setLoading(false) })
  }, [])

  function onDragStart(e, id) {
    setDragId(id)
    e.dataTransfer.effectAllowed = 'move'
  }

  function onDragOver(e) { e.preventDefault(); e.dataTransfer.dropEffect = 'move' }

  async function onDrop(e, targetStatus) {
    e.preventDefault()
    if (!dragId) return
    const lead = leads.find(l => l.id === dragId)
    if (!lead || lead.status === targetStatus) { setDragId(null); return }

    const prevStatus = lead.status
    setLeads(prev => prev.map(l => l.id === dragId ? { ...l, status: targetStatus } : l))
    setDragId(null)
    try {
      await api.patch(`/leads/${dragId}`, { status: targetStatus })
    } catch {
      setLeads(prev => prev.map(l => l.id === dragId ? { ...l, status: prevStatus } : l))
    }
  }

  const byStatus = (status) => leads.filter(l => l.status === status)

  return (
    <div className="flex flex-col h-full">
      <TopNav title="Pipeline" />

      {error && (
        <div className="mx-6 mt-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      {loading ? (
        <div className="flex gap-4 p-6 overflow-x-auto">
          {LEAD_STATUSES.map(s => (
            <div key={s.value} className="w-64 shrink-0 h-96 rounded-xl bg-surface-container animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="flex gap-4 p-6 overflow-x-auto flex-1">
          {LEAD_STATUSES.map(({ value }) => {
            const cards = byStatus(value)
            return (
              <div
                key={value}
                onDragOver={onDragOver}
                onDrop={e => onDrop(e, value)}
                className="glass-card flex flex-col w-64 shrink-0 rounded-xl border overflow-hidden"
              >
                {/* Column header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-outline-variant bg-surface-container">
                  <div className="flex items-center gap-2">
                    <Badge status={value} />
                    <span className="text-xs font-semibold text-on-surface-variant">{cards.length}</span>
                  </div>
                  {cards.length > 0 && (
                    <span className="text-xs text-on-surface-variant">
                      {fmt(cards.reduce((s, l) => s + (l.deal_value || 0), 0))}
                    </span>
                  )}
                </div>

                {/* Cards */}
                <div className="flex flex-col gap-2 p-3 overflow-y-auto flex-1 min-h-32">
                  {cards.map(lead => (
                    <motion.div
                      key={lead.id}
                      layout
                      draggable
                      onDragStart={e => onDragStart(e, lead.id)}
                      className={`glass-card rounded-lg border p-3 cursor-grab active:cursor-grabbing select-none transition-shadow
                        ${dragId === lead.id ? 'opacity-40 shadow-lg' : 'hover:shadow-sm'}`}
                    >
                      <Link to={`/leads/${lead.id}`} onClick={e => e.stopPropagation()}>
                        <p className="text-sm font-medium text-on-surface hover:text-primary-container transition-colors">
                          {lead.lead_name}
                        </p>
                      </Link>
                      {lead.company_name && (
                        <p className="text-xs text-on-surface-variant mt-0.5">{lead.company_name}</p>
                      )}
                      {lead.deal_value > 0 && (
                        <p className="text-xs font-semibold text-emerald-700 mt-2">{fmt(lead.deal_value)}</p>
                      )}
                      {lead.salesperson && (
                        <p className="text-xs text-on-surface-variant mt-1">{lead.salesperson}</p>
                      )}
                    </motion.div>
                  ))}
                  {cards.length === 0 && (
                    <p className="text-center text-xs text-on-surface-variant py-4">Drop here</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
