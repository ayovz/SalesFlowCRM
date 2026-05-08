import { useEffect, useState, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import TopNav  from '../components/layout/TopNav'
import Button  from '../components/ui/Button'
import Badge   from '../components/ui/Badge'
import { api } from '../lib/api'
import { LEAD_STATUSES, LEAD_SOURCES, SALESPEOPLE } from '../lib/constants'

function fmt(n) {
  if (!n) return '—'
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000)     return `$${(n / 1_000).toFixed(0)}K`
  return `$${n}`
}

function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return debounced
}

export default function Leads() {
  const navigate    = useNavigate()
  const [leads,     setLeads]     = useState([])
  const [loading,   setLoading]   = useState(true)
  const [search,    setSearch]    = useState('')
  const [status,    setStatus]    = useState('')
  const [source,    setSource]    = useState('')
  const [salesperson, setSales]   = useState('')
  const [deleting,  setDeleting]  = useState(null)
  const [error,     setError]     = useState('')

  const dSearch = useDebounce(search)

  const load = useCallback(() => {
    setLoading(true)
    setError('')
    const params = new URLSearchParams()
    if (dSearch)     params.set('search',      dSearch)
    if (status)      params.set('status',      status)
    if (source)      params.set('source',      source)
    if (salesperson) params.set('salesperson', salesperson)
    api.get(`/leads?${params}`)
      .then(d => { setLeads(d); setLoading(false) })
      .catch(err => { setError(err.message); setLoading(false) })
  }, [dSearch, status, source, salesperson])

  useEffect(() => { load() }, [load])

  async function handleDelete(lead) {
    if (!window.confirm(`Delete "${lead.lead_name}"? This cannot be undone.`)) return
    setDeleting(lead.id)
    try {
      await api.delete(`/leads/${lead.id}`)
      setLeads(l => l.filter(x => x.id !== lead.id))
    } catch (err) {
      alert(err.message)
    } finally {
      setDeleting(null)
    }
  }

  function exportCSV() {
    const headers = ['ID', 'Name', 'Company', 'Email', 'Phone', 'Source', 'Salesperson', 'Status', 'Deal Value', 'Created']
    const rows = leads.map(l => [
      l.id, l.lead_name, l.company_name, l.email, l.phone,
      l.lead_source, l.salesperson, l.status, l.deal_value, l.created_at,
    ])
    const csv = [headers, ...rows].map(r => r.map(v => `"${v ?? ''}"`).join(',')).join('\n')
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
    a.download = 'leads.csv'
    a.click()
  }

  return (
    <div>
      <TopNav
        title="Leads"
        actions={
          <>
            <Button variant="secondary" size="sm" onClick={exportCSV}>
              <span className="material-symbols-outlined text-base">download</span>
              Export
            </Button>
            <Link to="/leads/new">
              <Button size="sm">
                <span className="material-symbols-outlined text-base">add</span>
                New Lead
              </Button>
            </Link>
          </>
        }
      />

      {error && (
        <div className="mx-6 mt-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      {/* Filters */}
      <div className="px-6 pt-5 pb-3 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-base text-on-surface-variant">search</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search name, company, email…"
            className="h-9 w-full rounded-lg border border-outline-variant bg-surface-container-lowest pl-8 pr-3 text-sm text-on-surface placeholder:text-on-surface-variant/50 outline-none focus:border-primary-container transition-colors"
          />
        </div>
        {[
          { value: status,      setter: setStatus,  label: 'All Statuses', opts: LEAD_STATUSES.map(s => s.value) },
          { value: source,      setter: setSource,  label: 'All Sources',  opts: LEAD_SOURCES },
          { value: salesperson, setter: setSales,   label: 'All Reps',     opts: SALESPEOPLE  },
        ].map(({ value, setter, label, opts }) => (
          <select
            key={label}
            value={value}
            onChange={e => setter(e.target.value)}
            className="h-9 rounded-lg border border-outline-variant bg-surface-container-lowest px-3 text-sm text-on-surface outline-none focus:border-primary-container transition-colors"
          >
            <option value="">{label}</option>
            {opts.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        ))}
      </div>

      {/* Table */}
      <div className="px-6 pb-6">
        <div className="glass-card rounded-xl border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-surface-container">
              <tr>
                {['Name / Company', 'Status', 'Source', 'Salesperson', 'Deal Value', ''].map(h => (
                  <th key={h} className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wide text-on-surface-variant">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan={6} className="py-12 text-center text-sm text-on-surface-variant">Loading…</td></tr>
              )}
              {!loading && leads.length === 0 && (
                <tr><td colSpan={6} className="py-12 text-center text-sm text-on-surface-variant">No leads found</td></tr>
              )}
              <AnimatePresence>
                {leads.map(lead => (
                  <motion.tr
                    key={lead.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="border-t border-outline-variant hover:bg-surface-container/50 cursor-pointer"
                    onClick={() => navigate(`/leads/${lead.id}`)}
                  >
                    <td className="py-3 px-4">
                      <div className="font-medium text-on-surface">{lead.lead_name}</div>
                      <div className="text-xs text-on-surface-variant">{lead.company_name || '—'}</div>
                    </td>
                    <td className="py-3 px-4"><Badge status={lead.status} /></td>
                    <td className="py-3 px-4 text-on-surface-variant">{lead.lead_source || '—'}</td>
                    <td className="py-3 px-4 text-on-surface-variant">{lead.salesperson  || '—'}</td>
                    <td className="py-3 px-4 font-semibold text-on-surface">{fmt(lead.deal_value)}</td>
                    <td className="py-3 px-4" onClick={e => e.stopPropagation()}>
                      <div className="flex items-center gap-1 justify-end">
                        <button
                          onClick={() => navigate(`/leads/${lead.id}/edit`)}
                          className="flex h-7 w-7 items-center justify-center rounded-md text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
                        >
                          <span className="material-symbols-outlined text-base">edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(lead)}
                          disabled={deleting === lead.id}
                          className="flex h-7 w-7 items-center justify-center rounded-md text-on-surface-variant hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-40"
                        >
                          <span className="material-symbols-outlined text-base">delete</span>
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
        {!loading && (
          <p className="mt-2 text-xs text-on-surface-variant">{leads.length} lead{leads.length !== 1 ? 's' : ''}</p>
        )}
      </div>
    </div>
  )
}
