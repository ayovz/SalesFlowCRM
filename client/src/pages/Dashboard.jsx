import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import TopNav   from '../components/layout/TopNav'
import StatCard from '../components/ui/StatCard'
import Button   from '../components/ui/Button'
import { api }  from '../lib/api'

function fmt(n) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000)     return `$${(n / 1_000).toFixed(0)}K`
  return `$${n}`
}

export default function Dashboard() {
  const [data,    setData]    = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState('')

  useEffect(() => {
    api.get('/dashboard')
      .then(d => { setData(d); setLoading(false) })
      .catch(err => { setError(err.message); setLoading(false) })
  }, [])

  const stats = data ? [
    { label: 'Total Leads',          value: data.total,                   accent: 'primary', icon: 'people',          index: 0 },
    { label: 'New',                   value: data.newLeads,                accent: 'amber',   icon: 'fiber_new',       index: 1 },
    { label: 'Contacted',             value: data.contacted,               accent: 'blue',    icon: 'mark_email_read', index: 2 },
    { label: 'Qualified',             value: data.qualified,               accent: 'violet',  icon: 'verified',        index: 3 },
    { label: 'Won',                   value: data.won,                     accent: 'emerald', icon: 'emoji_events',    index: 4 },
    { label: 'Lost',                  value: data.lost,                    accent: 'red',     icon: 'cancel',          index: 5 },
    { label: 'Total Pipeline Value',  value: fmt(data.totalValue ?? 0),    accent: 'orange',  icon: 'paid',            index: 6 },
    { label: 'Won Deal Value',        value: fmt(data.wonValue   ?? 0),    accent: 'emerald', icon: 'savings',         index: 7 },
  ] : []

  return (
    <div>
      <TopNav
        title="Dashboard"
        actions={
          <Link to="/leads/new">
            <Button>
              <span className="material-symbols-outlined text-base">add</span>
              New Lead
            </Button>
          </Link>
        }
      />
      {error && (
        <div className="mx-6 mt-6 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>
      )}
      <div className="p-6 flex flex-col gap-8">
        <section>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {loading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="h-28 rounded-xl bg-surface-container animate-pulse" />
                ))
              : stats.map(s => <StatCard key={s.label} {...s} />)
            }
          </div>
        </section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="glass-card rounded-xl border p-6"
        >
          <h2 className="text-sm font-semibold text-on-surface-variant uppercase tracking-wide mb-4">
            Leads Created — Last 6 Months
          </h2>
          {loading ? (
            <div className="h-48 bg-surface-container rounded-lg animate-pulse" />
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={data?.monthly ?? []} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="#c5c5d2" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#5f5f6f' }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#5f5f6f' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: '#fff', border: '1px solid #c5c5d2', borderRadius: 8, fontSize: 13 }}
                  cursor={{ fill: '#efefef' }}
                />
                <Bar dataKey="leads" fill="#334488" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          {[
            { to: '/leads',    icon: 'list',        label: 'View all leads',  sub: `${data?.total ?? '–'} total` },
            { to: '/pipeline', icon: 'view_kanban', label: 'Pipeline board',  sub: 'Drag to update status'       },
            { to: '/reports',  icon: 'bar_chart',   label: 'Reports',         sub: 'Deal value & activity'       },
          ].map(({ to, icon, label, sub }) => (
            <Link key={to} to={to} className="glass-card flex items-center gap-4 rounded-xl border p-4 hover:bg-white/80 transition-colors group">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                <span className="material-symbols-outlined text-xl text-blue-600">{icon}</span>
              </div>
              <div>
                <div className="text-sm font-semibold text-on-surface">{label}</div>
                <div className="text-xs text-on-surface-variant">{sub}</div>
              </div>
            </Link>
          ))}
        </motion.section>
      </div>
    </div>
  )
}
