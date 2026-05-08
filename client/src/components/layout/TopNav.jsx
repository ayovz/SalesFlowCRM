import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUser, clearAuth } from '../../lib/api'

export default function TopNav({ title, actions }) {
  const user        = getUser()
  const navigate    = useNavigate()
  const [open, setOpen] = useState(false)
  const dropRef     = useRef(null)

  useEffect(() => {
    if (!open) return
    function close(e) { if (!dropRef.current?.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [open])

  function handleSignOut() {
    clearAuth()
    navigate('/login')
  }

  const initials = user?.email
    ? user.email.split('@')[0].slice(0, 2).toUpperCase()
    : '?'

  return (
    <header className="glass-nav sticky top-0 z-20 flex h-14 items-center justify-between gap-4 border-b border-outline-variant px-6">
      <h1 className="text-base font-semibold text-on-surface">{title}</h1>

      <div className="flex items-center gap-3">
        {actions && <div className="flex items-center gap-2">{actions}</div>}

        {/* Profile button */}
        <div className="relative" ref={dropRef}>
          <button
            onClick={() => setOpen(o => !o)}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-on-primary text-xs font-bold shadow-sm hover:opacity-90 transition-opacity select-none"
          >
            {initials}
          </button>

          {open && (
            <div className="absolute right-0 top-10 w-56 rounded-xl glass-card border border-outline-variant shadow-xl z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-outline-variant/50">
                <p className="text-xs font-semibold text-on-surface truncate">{user?.email}</p>
                <p className="text-xs text-on-surface-variant mt-0.5">Authenticated via JWT</p>
              </div>
              <button
                onClick={handleSignOut}
                className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50/60 transition-colors"
              >
                <span className="material-symbols-outlined text-base">logout</span>
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
