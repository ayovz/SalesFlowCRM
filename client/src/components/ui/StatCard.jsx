import { motion } from 'framer-motion'

const ACCENT = {
  primary: { bg: 'bg-blue-50/80',    icon: 'text-blue-600',    val: 'text-blue-700'    },
  amber:   { bg: 'bg-amber-50/80',   icon: 'text-amber-600',   val: 'text-amber-700'   },
  blue:    { bg: 'bg-sky-50/80',     icon: 'text-sky-600',     val: 'text-sky-700'     },
  violet:  { bg: 'bg-violet-50/80',  icon: 'text-violet-600',  val: 'text-violet-700'  },
  emerald: { bg: 'bg-emerald-50/80', icon: 'text-emerald-600', val: 'text-emerald-700' },
  red:     { bg: 'bg-red-50/80',     icon: 'text-red-600',     val: 'text-red-700'     },
  orange:  { bg: 'bg-orange-50/80',  icon: 'text-orange-600',  val: 'text-orange-700'  },
}

export default function StatCard({ label, value, icon, accent = 'primary', index = 0 }) {
  const a = ACCENT[accent] ?? ACCENT.primary
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      className="glass-card flex flex-col gap-3 rounded-xl border p-4"
    >
      <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${a.bg}`}>
        <span className={`material-symbols-outlined text-xl ${a.icon}`}>{icon}</span>
      </div>
      <div>
        <div className={`text-2xl font-bold ${a.val}`}>{value ?? '–'}</div>
        <div className="text-xs text-on-surface-variant mt-0.5">{label}</div>
      </div>
    </motion.div>
  )
}
