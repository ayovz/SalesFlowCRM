import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import TopNav  from '../components/layout/TopNav'
import Badge   from '../components/ui/Badge'
import Button  from '../components/ui/Button'
import Select  from '../components/ui/Select'
import { api } from '../lib/api'
import { LEAD_STATUSES } from '../lib/constants'

function fmt(n) {
  if (!n) return '—'
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000)     return `$${(n / 1_000).toFixed(0)}K`
  return `$${n}`
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1)   return 'just now'
  if (m < 60)  return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24)  return `${h}h ago`
  const d = Math.floor(h / 24)
  return `${d}d ago`
}

export default function LeadDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [lead,    setLead]    = useState(null)
  const [notes,   setNotes]   = useState([])
  const [note,    setNote]    = useState('')
  const [posting, setPosting] = useState(false)
  const [error,   setError]   = useState('')

  useEffect(() => {
    api.get(`/leads/${id}`)
      .then(setLead)
      .catch(err => setError(err.message))
    api.get(`/leads/${id}/notes`)
      .then(setNotes)
      .catch(() => {})
  }, [id])

  async function handleStatusChange(status) {
    const updated = await api.patch(`/leads/${id}`, { status })
    setLead(updated)
  }

  async function handleAddNote(e) {
    e.preventDefault()
    if (!note.trim()) return
    setPosting(true)
    try {
      const n = await api.post(`/leads/${id}/notes`, { content: note })
      setNotes(prev => [n, ...prev])
      setNote('')
    } catch (err) {
      alert(err.message)
    } finally {
      setPosting(false)
    }
  }

  async function handleDelete() {
    if (!window.confirm(`Delete "${lead?.lead_name}"?`)) return
    try {
      await api.delete(`/leads/${id}`)
      navigate('/leads')
    } catch (err) {
      alert(err.message)
    }
  }

  if (!lead) return (
    <div>
      <TopNav title="Lead" />
      {error ? (
        <div className="m-6 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>
      ) : (
        <div className="p-6 space-y-4">
          {[1, 2, 3].map(i => <div key={i} className="h-20 rounded-xl bg-surface-container animate-pulse" />)}
        </div>
      )}
    </div>
  )

  const INFO = [
    { label: 'Company',     value: lead.company_name },
    { label: 'Email',       value: lead.email        },
    { label: 'Phone',       value: lead.phone        },
    { label: 'Lead Source', value: lead.lead_source  },
    { label: 'Salesperson', value: lead.salesperson  },
    { label: 'Deal Value',  value: fmt(lead.deal_value) },
    { label: 'Created',     value: new Date(lead.created_at).toLocaleDateString() },
    { label: 'Updated',     value: new Date(lead.updated_at).toLocaleDateString() },
  ]

  return (
    <div>
      <TopNav
        title={lead.lead_name}
        actions={
          <div className="flex items-center gap-2">
            <Link to={`/leads/${id}/edit`}>
              <Button variant="secondary" size="sm">
                <span className="material-symbols-outlined text-base">edit</span>
                Edit
              </Button>
            </Link>
            <Button variant="danger" size="sm" onClick={handleDelete}>
              <span className="material-symbols-outlined text-base">delete</span>
              Delete
            </Button>
          </div>
        }
      />

      <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: info */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-xl border p-6"
          >
            <div className="flex items-start justify-between mb-5">
              <div>
                <h2 className="text-lg font-bold text-on-surface">{lead.lead_name}</h2>
                <p className="text-sm text-on-surface-variant">{lead.company_name || '—'}</p>
              </div>
              <Badge status={lead.status} />
            </div>

            <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
              {INFO.map(({ label, value }) => (
                <div key={label}>
                  <dt className="text-xs font-medium text-on-surface-variant">{label}</dt>
                  <dd className="text-sm text-on-surface mt-0.5">{value || '—'}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-5 pt-5 border-t border-outline-variant">
              <Select
                label="Update Status"
                value={lead.status}
                onChange={e => handleStatusChange(e.target.value)}
              >
                {LEAD_STATUSES.map(({ value }) => (
                  <option key={value} value={value}>{value}</option>
                ))}
              </Select>
            </div>
          </motion.div>
        </div>

        {/* Right: notes */}
        <div className="flex flex-col gap-4">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card rounded-xl border p-5"
          >
            <h3 className="text-sm font-semibold text-on-surface mb-3">Add Note</h3>
            <form onSubmit={handleAddNote} className="flex flex-col gap-2">
              <textarea
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="Write a note…"
                rows={3}
                className="w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 text-sm text-on-surface placeholder:text-on-surface-variant/50 outline-none focus:border-primary-container resize-none transition-colors"
              />
              <Button type="submit" size="sm" disabled={posting || !note.trim()}>
                {posting ? 'Saving…' : 'Add note'}
              </Button>
            </form>
          </motion.div>

          <div className="flex flex-col gap-3">
            <AnimatePresence>
              {notes.map((n, i) => (
                <motion.div
                  key={n.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="glass-card rounded-xl border p-4"
                >
                  <p className="text-sm text-on-surface">{n.content}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs font-medium text-primary-container">{n.created_by}</span>
                    <span className="text-xs text-on-surface-variant">·</span>
                    <span className="text-xs text-on-surface-variant">{timeAgo(n.created_at)}</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {notes.length === 0 && (
              <p className="text-xs text-on-surface-variant text-center py-4">No notes yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
