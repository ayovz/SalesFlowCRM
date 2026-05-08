import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import TopNav  from '../components/layout/TopNav'
import { api, getUser } from '../lib/api'
import { SALESPEOPLE, LEAD_SOURCES } from '../lib/constants'

const Section = ({ title, children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
    className="glass-card rounded-xl border p-6"
  >
    <h2 className="text-sm font-semibold text-on-surface mb-4">{title}</h2>
    {children}
  </motion.div>
)

export default function Settings() {
  const user = getUser()
  const [total, setTotal] = useState('—')

  useEffect(() => {
    api.get('/leads').then(d => setTotal(d.length))
  }, [])

  return (
    <div>
      <TopNav title="Settings" />
      <div className="p-6 max-w-2xl flex flex-col gap-6">

        <Section title="Account" delay={0}>
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-on-primary font-bold text-lg">
              {user?.email?.[0]?.toUpperCase() ?? '?'}
            </div>
            <div>
              <p className="text-sm font-medium text-on-surface">{user?.email}</p>
              <p className="text-xs text-on-surface-variant">Authenticated via JWT</p>
            </div>
          </div>
        </Section>

        <Section title="Team — Salespeople" delay={0.1}>
          <ul className="divide-y divide-outline-variant">
            {SALESPEOPLE.map(sp => (
              <li key={sp} className="flex items-center gap-3 py-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-blue-700">
                  {sp.split(' ').map(w => w[0]).join('')}
                </div>
                <span className="text-sm text-on-surface">{sp}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-on-surface-variant">
            Edit in <code className="font-mono bg-surface-container px-1 rounded">client/src/lib/constants.js</code>
          </p>
        </Section>

        <Section title="Lead Sources" delay={0.2}>
          <div className="flex flex-wrap gap-2">
            {LEAD_SOURCES.map(s => (
              <span key={s} className="inline-flex items-center rounded-full bg-surface-container px-3 py-1 text-xs font-medium text-on-surface-variant border border-outline-variant">
                {s}
              </span>
            ))}
          </div>
        </Section>

        <Section title="Data" delay={0.3}>
          <p className="text-sm text-on-surface-variant mb-4">
            Data is stored as a JSON file using Node.js built-in <code className="font-mono text-xs bg-surface-container px-1 rounded">fs</code>.
            The file lives at <code className="font-mono text-xs bg-surface-container px-1 rounded">server/db/data.json</code> and is
            created automatically on first run with seed data.
          </p>
          <div className="flex items-center gap-2 text-sm text-on-surface">
            <span className="material-symbols-outlined text-base text-on-surface-variant">storage</span>
            <span><span className="font-semibold">{total}</span> leads in database</span>
          </div>
        </Section>

      </div>
    </div>
  )
}
