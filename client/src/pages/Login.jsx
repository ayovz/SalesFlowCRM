import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { saveAuth, getToken } from '../lib/api'

export default function Login() {
  const navigate = useNavigate()
  if (getToken()) { navigate('/dashboard', { replace: true }); return null }

  const [email,    setEmail]    = useState('admin@example.com')
  const [password, setPassword] = useState('password123')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Login failed')
      saveAuth(data.token, data.user)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm"
      >
        <div className="mb-8 text-center">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary mb-4">
            <span className="material-symbols-outlined text-2xl text-on-primary">hub</span>
          </div>
          <h1 className="text-2xl font-bold text-on-surface">SalesFlow CRM</h1>
          <p className="text-sm text-on-surface-variant mt-1">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="glass-card flex flex-col gap-4 rounded-2xl border p-6">
          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">{error}</div>
          )}

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-on-surface-variant">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="h-10 rounded-lg border border-outline-variant bg-surface px-3 text-sm text-on-surface outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container/30 transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-on-surface-variant">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="h-10 rounded-lg border border-outline-variant bg-surface px-3 text-sm text-on-surface outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container/30 transition-colors"
            />
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.01 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            className="mt-1 h-10 w-full rounded-lg bg-primary text-sm font-semibold text-on-primary hover:bg-primary-container transition-colors disabled:opacity-50"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </motion.button>
        </form>

        <p className="mt-4 text-center text-xs text-on-surface-variant">
          Demo: admin@example.com / password123
        </p>
      </motion.div>
    </div>
  )
}
