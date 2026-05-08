import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Input    from '../ui/Input'
import Select   from '../ui/Select'
import Button   from '../ui/Button'
import { api }  from '../../lib/api'
import { LEAD_STATUSES, LEAD_SOURCES, SALESPEOPLE } from '../../lib/constants'

export default function LeadForm({ initial }) {
  const navigate = useNavigate()
  const isEdit   = !!initial

  const [form, setForm] = useState({
    lead_name:    initial?.lead_name    ?? '',
    company_name: initial?.company_name ?? '',
    email:        initial?.email        ?? '',
    phone:        initial?.phone        ?? '',
    lead_source:  initial?.lead_source  ?? '',
    salesperson:  initial?.salesperson  ?? '',
    status:       initial?.status       ?? 'New',
    deal_value:   initial?.deal_value   ?? '',
  })
  const [errors,  setErrors]  = useState({})
  const [saving,  setSaving]  = useState(false)
  const [apiError, setApiError] = useState('')

  function set(field, value) {
    setForm(f => ({ ...f, [field]: value }))
    if (errors[field]) setErrors(e => ({ ...e, [field]: '' }))
  }

  function validate() {
    const e = {}
    if (!form.lead_name.trim()) e.lead_name = 'Name is required'
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email'
    if (form.deal_value !== '' && isNaN(Number(form.deal_value))) e.deal_value = 'Must be a number'
    return e
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setSaving(true)
    setApiError('')
    try {
      const body = { ...form, deal_value: form.deal_value !== '' ? Number(form.deal_value) : 0 }
      if (isEdit) {
        await api.patch(`/leads/${initial.id}`, body)
        navigate(`/leads/${initial.id}`)
      } else {
        const lead = await api.post('/leads', body)
        navigate(`/leads/${lead.id}`)
      }
    } catch (err) {
      setApiError(err.message)
      setSaving(false)
    }
  }

  const field = (name, label, type = 'text', placeholder = '') => (
    <Input
      label={label}
      type={type}
      placeholder={placeholder}
      value={form[name]}
      onChange={e => set(name, e.target.value)}
      error={errors[name]}
    />
  )

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-5"
    >
      {apiError && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{apiError}</div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {field('lead_name',    'Lead Name *',    'text',  'Full name')}
        {field('company_name', 'Company',        'text',  'Company name')}
        {field('email',        'Email',          'email', 'email@example.com')}
        {field('phone',        'Phone',          'tel',   '555-0100')}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select label="Lead Source" value={form.lead_source} onChange={e => set('lead_source', e.target.value)}>
          <option value="">Select source…</option>
          {LEAD_SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
        </Select>
        <Select label="Salesperson" value={form.salesperson} onChange={e => set('salesperson', e.target.value)}>
          <option value="">Assign salesperson…</option>
          {SALESPEOPLE.map(s => <option key={s} value={s}>{s}</option>)}
        </Select>
        <Select label="Status" value={form.status} onChange={e => set('status', e.target.value)}>
          {LEAD_STATUSES.map(({ value }) => <option key={value} value={value}>{value}</option>)}
        </Select>
        <Input
          label="Deal Value ($)"
          type="number"
          min="0"
          step="100"
          placeholder="0"
          value={form.deal_value}
          onChange={e => set('deal_value', e.target.value)}
          error={errors.deal_value}
        />
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={saving}>
          {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Create lead'}
        </Button>
        <Button type="button" variant="secondary" onClick={() => navigate(-1)}>
          Cancel
        </Button>
      </div>
    </motion.form>
  )
}
