import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const NAV = [
  { to: '/dashboard',  label: 'Dashboard',  icon: 'grid_view'    },
  { to: '/leads',      label: 'Leads',      icon: 'people'       },
  { to: '/pipeline',   label: 'Pipeline',   icon: 'view_kanban'  },
  { to: '/reports',    label: 'Reports',    icon: 'bar_chart'    },
  { to: '/analytics',  label: 'Analytics',  icon: 'insights'     },
  { to: '/import',     label: 'Import',     icon: 'upload_file'  },
  { to: '/settings',   label: 'Settings',   icon: 'settings'     },
]

export default function Sidebar() {
  const { pathname } = useLocation()

  return (
    <aside className="glass-sidebar fixed inset-y-0 left-0 z-30 flex w-60 flex-col border-r border-white/10 text-on-primary">
      {/* Logo */}
      <div className="flex h-14 shrink-0 items-center gap-2.5 px-5 border-b border-white/10">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/15">
          <span className="material-symbols-outlined text-base" style={{ color: '#c8d4ff' }}>hub</span>
        </div>
        <span className="text-sm font-bold tracking-tight text-white">SalesFlow</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-0.5">
        {NAV.map(({ to, label, icon }) => {
          const active = to === '/dashboard'
            ? pathname === '/dashboard'
            : pathname.startsWith(to)
          return (
            <Link key={to} to={to} className="relative group">
              <AnimatePresence>
                {active && (
                  <motion.div
                    layoutId="sidebar-indicator"
                    className="absolute inset-0 rounded-lg bg-white/18"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </AnimatePresence>
              <span className={`relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors
                ${active ? 'text-white' : 'text-white/55 hover:text-white hover:bg-white/10'}`}>
                <span className="material-symbols-outlined text-xl">{icon}</span>
                {label}
              </span>
            </Link>
          )
        })}
      </nav>

      {/* Footer hint */}
      <div className="shrink-0 px-4 py-3 border-t border-white/10">
        <p className="text-[10px] text-white/30 leading-relaxed">SalesFlow CRM · v1.0</p>
      </div>
    </aside>
  )
}
