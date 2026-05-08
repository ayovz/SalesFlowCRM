import { useEffect, useState, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, Legend,
} from 'recharts'
import TopNav          from '../components/layout/TopNav'
import Button          from '../components/ui/Button'
import { api }         from '../lib/api'
import { downloadPDF } from '../lib/pdf'
import { LEAD_SOURCES, SALESPEOPLE } from '../lib/constants'

// ── helpers ──────────────────────────────────────────────────────────────────
function fmt(n) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000)     return `$${(n / 1_000).toFixed(0)}K`
  return `$${n}`
}

function linearTrend(data) {
  const n  = data.length
  if (n < 2) return data.map(d => ({ ...d, trend: d.count }))
  const xs = data.map((_, i) => i)
  const ys = data.map(d => d.count)
  const sx = xs.reduce((a, b) => a + b, 0)
  const sy = ys.reduce((a, b) => a + b, 0)
  const sxy = xs.reduce((s, x, i) => s + x * ys[i], 0)
  const sx2 = xs.reduce((s, x) => s + x * x, 0)
  const slope     = (n * sxy - sx * sy) / (n * sx2 - sx * sx)
  const intercept = (sy - slope * sx) / n
  return data.map((d, i) => ({ ...d, trend: Math.max(0, Math.round(slope * i + intercept)) }))
}

function downloadSVG(containerRef, filename) {
  const svgEl = containerRef.current?.querySelector('svg')
  if (!svgEl) return
  const clone = svgEl.cloneNode(true)
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
  const bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
  bg.setAttribute('width', '100%'); bg.setAttribute('height', '100%'); bg.setAttribute('fill', 'white')
  clone.insertBefore(bg, clone.firstChild)
  const blob = new Blob([new XMLSerializer().serializeToString(clone)], { type: 'image/svg+xml;charset=utf-8' })
  const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(blob), download: `${filename}.svg` })
  document.body.appendChild(a); a.click(); document.body.removeChild(a)
  URL.revokeObjectURL(a.href)
}

function downloadCSV(rows, filename) {
  if (!rows?.length) return
  const headers = Object.keys(rows[0])
  const csv = [headers.join(','), ...rows.map(r => headers.map(h => `"${r[h] ?? ''}"`).join(','))].join('\n')
  const a = Object.assign(document.createElement('a'), {
    href: URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' })),
    download: `${filename}.csv`,
  })
  document.body.appendChild(a); a.click(); document.body.removeChild(a)
  URL.revokeObjectURL(a.href)
}

// ── sub-components ────────────────────────────────────────────────────────────
const FUNNEL_COLORS = {
  'New': '#f59e0b', 'Contacted': '#3b82f6', 'Qualified': '#8b5cf6',
  'Proposal Sent': '#f97316', 'Won': '#10b981', 'Lost': '#ef4444',
}

function ConversionFunnel({ data }) {
  const active = data.filter(d => d.stage !== 'Lost')
  const max    = Math.max(...active.map(d => d.count), 1)
  return (
    <div className="flex flex-col gap-2.5">
      {data.map((d, i) => {
        const prev    = i > 0 ? data[i - 1].count : null
        const dropPct = prev && prev > 0 ? Math.round(((d.count - prev) / prev) * 100) : null
        const width   = Math.max((d.count / max) * 100, d.count > 0 ? 6 : 0)
        return (
          <div key={d.stage} className="flex items-center gap-3">
            <div className="w-28 text-right text-xs text-on-surface-variant font-medium shrink-0">{d.stage}</div>
            <div className="flex-1 min-w-0">
              <div
                style={{ width: `${width}%`, backgroundColor: FUNNEL_COLORS[d.stage] ?? '#6b7280' }}
                className="flex items-center h-9 rounded-lg px-3 text-white text-xs font-bold transition-all duration-500 min-w-[2rem]"
              >
                {d.count}
              </div>
            </div>
            <div className="w-14 text-right text-xs shrink-0">
              {dropPct !== null && (
                <span className={dropPct < 0 ? 'text-red-500' : 'text-emerald-600'}>
                  {dropPct > 0 ? '+' : ''}{dropPct}%
                </span>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

const ACTION_META = {
  created:        { icon: 'add_circle',  color: 'text-emerald-600', bg: 'bg-emerald-50', label: 'Lead Created'    },
  status_changed: { icon: 'swap_horiz',  color: 'text-blue-600',    bg: 'bg-blue-50',    label: 'Status Changed'  },
  note_added:     { icon: 'note_add',    color: 'text-violet-600',  bg: 'bg-violet-50',  label: 'Note Added'      },
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1)   return 'just now'
  if (m < 60)  return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24)  return `${h}h ago`
  const d = Math.floor(h / 24)
  if (d < 7)   return `${d}d ago`
  return new Date(dateStr).toLocaleDateString()
}

function ChartCard({ title, onDownload, children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="glass-card rounded-xl border p-6 flex flex-col gap-4"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant">{title}</h2>
        {onDownload && (
          <button
            onClick={onDownload}
            title="Download SVG"
            className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-on-surface-variant hover:bg-white/60 hover:text-on-surface transition-colors"
          >
            <span className="material-symbols-outlined text-sm">download</span>
            SVG
          </button>
        )}
      </div>
      {children}
    </motion.div>
  )
}

// ── main page ─────────────────────────────────────────────────────────────────
const PERIODS = [
  { label: 'Last 7 days',   value: '7'   },
  { label: 'Last 30 days',  value: '30'  },
  { label: 'Last 90 days',  value: '90'  },
  { label: 'Last 180 days', value: '180' },
]

export default function ActivityInsights() {
  const [data,       setData]       = useState(null)
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState('')
  const [period,     setPeriod]     = useState('30')
  const [source,     setSource]     = useState('')
  const [salesp,     setSalesp]     = useState('')
  const [pdfLoading, setPdfLoading] = useState(false)

  const contentRef = useRef(null)
  const trendRef   = useRef(null)
  const sourceRef  = useRef(null)
  const spRef      = useRef(null)

  const load = useCallback(() => {
    setLoading(true); setError('')
    const p = new URLSearchParams({ period })
    if (source) p.set('source', source)
    if (salesp) p.set('salesperson', salesp)
    api.get(`/insights?${p}`)
      .then(d => { setData(d); setLoading(false) })
      .catch(err => { setError(err.message); setLoading(false) })
  }, [period, source, salesp])

  useEffect(() => { load() }, [load])

  async function handlePDF() {
    if (!contentRef.current) return
    setPdfLoading(true)
    try {
      await downloadPDF(contentRef.current, 'crm-analytics', 'Analytics & Insights')
    } finally {
      setPdfLoading(false)
    }
  }

  const trendData = data ? linearTrend(data.volumeTrend) : []

  const SUMMARY = data ? [
    { label: 'Total Leads',      value: data.summary.total,          icon: 'people',       accent: 'primary'  },
    { label: 'Won Deals',        value: data.summary.won,            icon: 'emoji_events', accent: 'emerald'  },
    { label: 'Conversion Rate',  value: `${data.summary.conversionRate}%`, icon: 'percent',     accent: 'violet'   },
    { label: 'Avg Won Value',    value: fmt(data.summary.avgDealValue),   icon: 'savings',      accent: 'orange'   },
  ] : []

  const ACCENT_CLS = {
    primary: { bg: 'bg-blue-50',    icon: 'text-blue-600',    val: 'text-blue-700'    },
    emerald: { bg: 'bg-emerald-50', icon: 'text-emerald-600', val: 'text-emerald-700' },
    violet:  { bg: 'bg-violet-50',  icon: 'text-violet-600',  val: 'text-violet-700'  },
    orange:  { bg: 'bg-orange-50',  icon: 'text-orange-600',  val: 'text-orange-700'  },
  }

  const filterSelect = 'h-9 rounded-lg border border-outline-variant/60 bg-white/60 px-3 text-sm text-on-surface outline-none focus:border-primary-container transition-colors backdrop-blur-sm'

  return (
    <div>
      <TopNav
        title="Analytics"
        actions={
          <>
            <Button size="sm" variant="secondary" onClick={() => downloadCSV(data?.activityLog, 'activity-log')} disabled={!data}>
              <span className="material-symbols-outlined text-base">download</span>
              CSV
            </Button>
            <Button size="sm" variant="secondary" onClick={handlePDF} disabled={pdfLoading || loading}>
              <span className="material-symbols-outlined text-base">picture_as_pdf</span>
              {pdfLoading ? 'Generating…' : 'PDF'}
            </Button>
          </>
        }
      />

      <div ref={contentRef} className="p-6 flex flex-col gap-6">

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <select value={period} onChange={e => setPeriod(e.target.value)} className={filterSelect}>
            {PERIODS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
          </select>
          <select value={source} onChange={e => setSource(e.target.value)} className={filterSelect}>
            <option value="">All Sources</option>
            {LEAD_SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={salesp} onChange={e => setSalesp(e.target.value)} className={filterSelect}>
            <option value="">All Reps</option>
            {SALESPEOPLE.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <button onClick={load} className="flex items-center gap-1.5 h-9 px-3 rounded-lg bg-white/60 border border-outline-variant/60 text-sm text-on-surface hover:bg-white/80 transition-colors backdrop-blur-sm">
            <span className="material-symbols-outlined text-base">refresh</span>
            Refresh
          </button>
        </div>

        {error && <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>}

        {/* Summary stat cards */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[0,1,2,3].map(i => <div key={i} className="h-28 rounded-xl bg-white/40 animate-pulse" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {SUMMARY.map(({ label, value, icon, accent }, i) => {
              const a = ACCENT_CLS[accent]
              return (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: i * 0.05 }}
                  className="glass-card flex flex-col gap-3 rounded-xl border p-4"
                >
                  <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${a.bg}`}>
                    <span className={`material-symbols-outlined text-xl ${a.icon}`}>{icon}</span>
                  </div>
                  <div>
                    <div className={`text-2xl font-bold ${a.val}`}>{value}</div>
                    <div className="text-xs text-on-surface-variant mt-0.5">{label}</div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}

        {/* Row 1: Volume Trend + Conversion Funnel */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          <div className="lg:col-span-3">
            <ChartCard
              title="Lead Volume Trend"
              delay={0.1}
              onDownload={() => downloadSVG(trendRef, 'lead-volume-trend')}
            >
              {loading ? (
                <div className="h-52 rounded-lg bg-white/40 animate-pulse" />
              ) : (
                <div ref={trendRef}>
                  <ResponsiveContainer width="100%" height={210}>
                    <LineChart data={trendData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(26,44,112,0.08)" vertical={false} />
                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: 11, fill: '#5f5f6f' }}
                        axisLine={false} tickLine={false}
                        tickFormatter={d => {
                          const dt = new Date(d)
                          return `${dt.getMonth()+1}/${dt.getDate()}`
                        }}
                        interval={Math.floor(trendData.length / 6)}
                      />
                      <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#5f5f6f' }} axisLine={false} tickLine={false} />
                      <Tooltip
                        contentStyle={{ background: 'rgba(255,255,255,0.92)', border: '1px solid rgba(197,197,210,0.5)', borderRadius: 10, fontSize: 12, backdropFilter: 'blur(8px)' }}
                        labelFormatter={d => new Date(d).toLocaleDateString()}
                      />
                      <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                      <Line type="monotone" dataKey="count" name="Actual"    stroke="#334488" strokeWidth={2.5} dot={false} activeDot={{ r: 4 }} />
                      <Line type="monotone" dataKey="trend" name="Trend"     stroke="#10b981" strokeWidth={2}   dot={false} strokeDasharray="5 3" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </ChartCard>
          </div>

          <div className="lg:col-span-2">
            <ChartCard title="Conversion Funnel" delay={0.15}>
              {loading ? (
                <div className="h-52 rounded-lg bg-white/40 animate-pulse" />
              ) : (
                <ConversionFunnel data={data?.funnel ?? []} />
              )}
            </ChartCard>
          </div>
        </div>

        {/* Row 2: Win Rate by Source + Salesperson Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          <ChartCard
            title="Win Rate by Source"
            delay={0.2}
            onDownload={() => downloadSVG(sourceRef, 'win-rate-by-source')}
          >
            {loading ? (
              <div className="h-48 rounded-lg bg-white/40 animate-pulse" />
            ) : (
              <div ref={sourceRef}>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={data?.bySource ?? []} layout="vertical" barSize={14} margin={{ left: 0, right: 8, top: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(26,44,112,0.08)" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 11, fill: '#5f5f6f' }} axisLine={false} tickLine={false} domain={[0, 100]} tickFormatter={v => `${v}%`} />
                    <YAxis type="category" dataKey="source" width={80} tick={{ fontSize: 11, fill: '#5f5f6f' }} axisLine={false} tickLine={false} />
                    <Tooltip
                      formatter={(v, name) => [`${v}%`, name === 'winRate' ? 'Win Rate' : name]}
                      contentStyle={{ background: 'rgba(255,255,255,0.92)', border: '1px solid rgba(197,197,210,0.5)', borderRadius: 10, fontSize: 12 }}
                    />
                    <Bar dataKey="winRate" name="Win Rate" fill="#334488" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </ChartCard>

          <ChartCard
            title="Salesperson Performance"
            delay={0.25}
            onDownload={() => downloadCSV(data?.bySalesperson, 'salesperson-performance')}
          >
            {loading ? (
              <div className="h-48 rounded-lg bg-white/40 animate-pulse" />
            ) : (
              <div ref={spRef} className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-outline-variant/40">
                      {['Rep', 'Leads', 'Won', 'Win Rate', 'Value'].map(h => (
                        <th key={h} className="py-2 pr-3 text-left text-xs font-semibold uppercase tracking-wide text-on-surface-variant">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(data?.bySalesperson ?? []).map(sp => (
                      <tr key={sp.name} className="border-b border-outline-variant/30 last:border-0">
                        <td className="py-2 pr-3 font-medium text-on-surface">{sp.name}</td>
                        <td className="py-2 pr-3 text-on-surface-variant">{sp.total}</td>
                        <td className="py-2 pr-3 text-on-surface-variant">{sp.won}</td>
                        <td className="py-2 pr-3">
                          <span className={`text-xs font-semibold px-1.5 py-0.5 rounded-full ${sp.winRate >= 50 ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'}`}>
                            {sp.winRate}%
                          </span>
                        </td>
                        <td className="py-2 pr-3 font-semibold text-on-surface">
                          {fmt(sp.total > 0 ? (data.summary.avgDealValue * sp.won) : 0)}
                        </td>
                      </tr>
                    ))}
                    {(data?.bySalesperson?.length ?? 0) === 0 && (
                      <tr><td colSpan={5} className="py-6 text-center text-xs text-on-surface-variant">No data</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </ChartCard>
        </div>

        {/* Recent Activity Log */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="glass-card rounded-xl border p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant">Recent Activity</h2>
            <button
              onClick={() => downloadCSV(data?.activityLog, 'activity-log')}
              className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-on-surface-variant hover:bg-white/60 hover:text-on-surface transition-colors"
            >
              <span className="material-symbols-outlined text-sm">download</span>
              CSV
            </button>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[0,1,2,3].map(i => <div key={i} className="h-12 rounded-lg bg-white/40 animate-pulse" />)}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-outline-variant/40">
                    {['Action', 'Lead', 'Details', 'By', 'When'].map(h => (
                      <th key={h} className="py-2 pr-4 text-left text-xs font-semibold uppercase tracking-wide text-on-surface-variant">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(data?.activityLog ?? []).map(log => {
                    const meta = ACTION_META[log.action] ?? { icon: 'circle', color: 'text-gray-500', bg: 'bg-gray-50', label: log.action }
                    return (
                      <tr key={log.id} className="border-b border-outline-variant/20 last:border-0 hover:bg-white/30 transition-colors">
                        <td className="py-2.5 pr-4">
                          <div className="flex items-center gap-2">
                            <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${meta.bg}`}>
                              <span className={`material-symbols-outlined text-sm ${meta.color}`}>{meta.icon}</span>
                            </div>
                            <span className="text-xs font-medium text-on-surface whitespace-nowrap">{meta.label}</span>
                          </div>
                        </td>
                        <td className="py-2.5 pr-4 font-medium text-on-surface whitespace-nowrap">{log.lead_name}</td>
                        <td className="py-2.5 pr-4 text-on-surface-variant max-w-xs truncate">{log.detail}</td>
                        <td className="py-2.5 pr-4 text-on-surface-variant whitespace-nowrap text-xs">{log.created_by}</td>
                        <td className="py-2.5 text-on-surface-variant whitespace-nowrap text-xs">{timeAgo(log.created_at)}</td>
                      </tr>
                    )
                  })}
                  {(data?.activityLog?.length ?? 0) === 0 && (
                    <tr><td colSpan={5} className="py-10 text-center text-xs text-on-surface-variant">No activity yet</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
