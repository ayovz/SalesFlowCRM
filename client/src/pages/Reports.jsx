import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell,
} from 'recharts'
import TopNav        from '../components/layout/TopNav'
import Button        from '../components/ui/Button'
import { api }       from '../lib/api'
import { downloadPDF } from '../lib/pdf'
import { LEAD_STATUSES, LEAD_SOURCES } from '../lib/constants'

const STATUS_COLORS = {
  'New': '#f59e0b', 'Contacted': '#3b82f6', 'Qualified': '#8b5cf6',
  'Proposal Sent': '#f97316', 'Won': '#10b981', 'Lost': '#ef4444',
}

function fmt(n) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000)     return `$${(n / 1_000).toFixed(0)}K`
  return `$${n}`
}

const CARD_STYLE = 'glass-card rounded-xl border p-6'

export default function Reports() {
  const [leads,      setLeads]      = useState([])
  const [loading,    setLoading]    = useState(true)
  const [pdfLoading, setPdfLoading] = useState(false)
  const contentRef = useRef(null)

  useEffect(() => {
    api.get('/leads').then(d => { setLeads(d); setLoading(false) })
  }, [])

  const statusDist = LEAD_STATUSES.map(({ value }) => ({
    name: value,
    value: leads.filter(l => l.status === value).length,
  })).filter(d => d.value > 0)

  const sourceDist = LEAD_SOURCES.map(s => ({
    name: s,
    leads: leads.filter(l => l.lead_source === s).length,
    value: leads.filter(l => l.lead_source === s).reduce((a, l) => a + (l.deal_value ?? 0), 0),
  })).filter(d => d.leads > 0)

  const salesDist = [...new Set(leads.map(l => l.salesperson).filter(Boolean))].map(sp => ({
    name: sp,
    leads: leads.filter(l => l.salesperson === sp).length,
    won:   leads.filter(l => l.salesperson === sp && l.status === 'Won').length,
    value: leads.filter(l => l.salesperson === sp && l.status === 'Won').reduce((a, l) => a + (l.deal_value ?? 0), 0),
  }))

  async function handlePDF() {
    if (!contentRef.current) return
    setPdfLoading(true)
    try {
      await downloadPDF(contentRef.current, 'crm-reports', 'CRM Reports')
    } finally {
      setPdfLoading(false)
    }
  }

  if (loading) return (
    <div>
      <TopNav title="Reports" />
      <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-64 rounded-xl bg-surface-container animate-pulse" />)}
      </div>
    </div>
  )

  const Card = ({ title, children, delay = 0 }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className={CARD_STYLE}
    >
      <h2 className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant mb-4">{title}</h2>
      {children}
    </motion.div>
  )

  return (
    <div>
      <TopNav
        title="Reports"
        actions={
          <Button size="sm" variant="secondary" onClick={handlePDF} disabled={pdfLoading}>
            <span className="material-symbols-outlined text-base">picture_as_pdf</span>
            {pdfLoading ? 'Generating…' : 'Download PDF'}
          </Button>
        }
      />
      <div ref={contentRef} className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">

        <Card title="Lead Status Distribution" delay={0}>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={statusDist} dataKey="value" nameKey="name"
                cx="50%" cy="50%" outerRadius={80}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {statusDist.map(d => <Cell key={d.name} fill={STATUS_COLORS[d.name]} />)}
              </Pie>
              <Tooltip formatter={v => [v, 'Leads']} />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Leads by Source" delay={0.1}>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={sourceDist} layout="vertical" barSize={16}>
              <CartesianGrid strokeDasharray="3 3" stroke="#c5c5d2" horizontal={false} />
              <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11, fill: '#5f5f6f' }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" width={90} tick={{ fontSize: 11, fill: '#5f5f6f' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#fff', border: '1px solid #c5c5d2', borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="leads" fill="#334488" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Deal Value by Source ($)" delay={0.2}>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={sourceDist} layout="vertical" barSize={16}>
              <CartesianGrid strokeDasharray="3 3" stroke="#c5c5d2" horizontal={false} />
              <XAxis type="number" tickFormatter={fmt} tick={{ fontSize: 11, fill: '#5f5f6f' }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" width={90} tick={{ fontSize: 11, fill: '#5f5f6f' }} axisLine={false} tickLine={false} />
              <Tooltip formatter={v => [fmt(v), 'Deal Value']} contentStyle={{ background: '#fff', border: '1px solid #c5c5d2', borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="value" fill="#10b981" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Salesperson Performance" delay={0.3}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-outline-variant">
                  {['Salesperson', 'Leads', 'Won', 'Win Rate', 'Won Value'].map(h => (
                    <th key={h} className="py-2 pr-3 text-left text-xs font-semibold uppercase tracking-wide text-on-surface-variant">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {salesDist.map(sp => (
                  <tr key={sp.name} className="border-b border-outline-variant last:border-0">
                    <td className="py-2 pr-3 font-medium text-on-surface">{sp.name}</td>
                    <td className="py-2 pr-3 text-on-surface-variant">{sp.leads}</td>
                    <td className="py-2 pr-3 text-on-surface-variant">{sp.won}</td>
                    <td className="py-2 pr-3 text-on-surface-variant">{sp.leads ? `${((sp.won / sp.leads) * 100).toFixed(0)}%` : '—'}</td>
                    <td className="py-2 pr-3 font-semibold text-on-surface">{fmt(sp.value)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

      </div>
    </div>
  )
}
