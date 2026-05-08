import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import * as XLSX from 'xlsx'
import TopNav  from '../components/layout/TopNav'
import Button  from '../components/ui/Button'
import { api } from '../lib/api'
import { LEAD_STATUSES, LEAD_SOURCES, SALESPEOPLE } from '../lib/constants'

// Flexible column name → lead field mapping
const COL_MAP = {
  'name':          'lead_name',   'lead name':   'lead_name',   'full name':   'lead_name',
  'contact':       'lead_name',   'contact name':'lead_name',
  'company':       'company_name','company name':'company_name','organization':'company_name','org':'company_name',
  'email':         'email',       'email address':'email',      'e-mail':      'email',
  'phone':         'phone',       'phone number':'phone',       'mobile':      'phone',       'tel':'phone',
  'source':        'lead_source', 'lead source': 'lead_source', 'channel':     'lead_source', 'origin':'lead_source',
  'salesperson':   'salesperson', 'assigned to': 'salesperson', 'sales rep':   'salesperson', 'rep':'salesperson','owner':'salesperson',
  'status':        'status',      'stage':       'status',      'lead status': 'status',
  'deal value':    'deal_value',  'value':       'deal_value',  'deal size':   'deal_value',  'amount':'deal_value','revenue':'deal_value','price':'deal_value',
}

const VALID_STATUSES = new Set(LEAD_STATUSES.map(s => s.value))
const VALID_SOURCES  = new Set(LEAD_SOURCES)
const VALID_REPS     = new Set(SALESPEOPLE)

function normalizeRow(raw) {
  const lead = {}
  for (const [key, val] of Object.entries(raw)) {
    const field = COL_MAP[String(key).toLowerCase().trim()]
    if (field) lead[field] = String(val ?? '').trim()
  }
  if (lead.deal_value) lead.deal_value = parseFloat(lead.deal_value.replace(/[^0-9.-]/g, '')) || 0
  if (lead.status && !VALID_STATUSES.has(lead.status)) lead.status = 'New'
  return lead
}

function validateRow(lead, i) {
  const warnings = []
  if (!lead.lead_name)                              warnings.push('Missing name')
  if (lead.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)) warnings.push('Invalid email')
  if (lead.lead_source && !VALID_SOURCES.has(lead.lead_source)) warnings.push(`Unknown source "${lead.lead_source}"`)
  if (lead.salesperson && !VALID_REPS.has(lead.salesperson))    warnings.push(`Unknown rep "${lead.salesperson}"`)
  return warnings
}

export default function LeadImport() {
  const navigate    = useNavigate()
  const fileRef     = useRef(null)
  const [step,      setStep]      = useState('upload')  // upload | preview | done
  const [rows,      setRows]      = useState([])
  const [warnings,  setWarnings]  = useState([])
  const [importing, setImporting] = useState(false)
  const [result,    setResult]    = useState(null)
  const [dragOver,  setDragOver]  = useState(false)
  const [parseErr,  setParseErr]  = useState('')

  function processFile(file) {
    setParseErr('')
    if (!file) return
    const ext = file.name.split('.').pop().toLowerCase()
    if (!['xlsx', 'xls', 'csv'].includes(ext)) {
      setParseErr('Unsupported file type. Please upload an .xlsx, .xls, or .csv file.')
      return
    }
    const reader = new FileReader()
    reader.onload = e => {
      try {
        const wb   = XLSX.read(new Uint8Array(e.target.result), { type: 'array' })
        const ws   = wb.Sheets[wb.SheetNames[0]]
        const raw  = XLSX.utils.sheet_to_json(ws, { defval: '' })
        if (!raw.length) { setParseErr('The file appears to be empty.'); return }
        const normalized = raw.map(normalizeRow)
        const warns      = normalized.map((r, i) => validateRow(r, i))
        setRows(normalized)
        setWarnings(warns)
        setStep('preview')
      } catch (err) {
        setParseErr('Failed to parse the file. Make sure it is a valid Excel or CSV file.')
      }
    }
    reader.readAsArrayBuffer(file)
  }

  function onFileChange(e) { processFile(e.target.files?.[0]) }
  function onDrop(e) {
    e.preventDefault(); setDragOver(false)
    processFile(e.dataTransfer.files?.[0])
  }

  const validRows    = rows.filter((_, i) => !warnings[i]?.some(w => w.startsWith('Missing')))
  const skippedCount = rows.length - validRows.length

  async function handleImport() {
    setImporting(true)
    try {
      const res = await api.post('/leads/bulk', validRows)
      setResult(res)
      setStep('done')
    } catch (err) {
      setParseErr(err.message)
    } finally {
      setImporting(false)
    }
  }

  function reset() {
    setStep('upload'); setRows([]); setWarnings([]); setResult(null); setParseErr('')
    if (fileRef.current) fileRef.current.value = ''
  }

  const PREVIEW_COLS = ['lead_name', 'company_name', 'email', 'lead_source', 'salesperson', 'status', 'deal_value']
  const COL_LABELS   = { lead_name:'Name', company_name:'Company', email:'Email', lead_source:'Source', salesperson:'Rep', status:'Status', deal_value:'Value' }

  return (
    <div>
      <TopNav title="Import Leads" />

      <div className="p-6 max-w-5xl flex flex-col gap-6">

        {/* Step indicator */}
        <div className="flex items-center gap-3">
          {[['upload','Upload'], ['preview','Preview'], ['done','Done']].map(([s, label], i, arr) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-colors
                ${step === s ? 'bg-primary text-on-primary' : (
                  ['upload','preview','done'].indexOf(step) > i ? 'bg-emerald-500 text-white' : 'bg-white/60 text-on-surface-variant border border-outline-variant'
                )}`}>
                {['upload','preview','done'].indexOf(step) > i
                  ? <span className="material-symbols-outlined text-sm">check</span>
                  : i + 1}
              </div>
              <span className={`text-sm font-medium ${step === s ? 'text-on-surface' : 'text-on-surface-variant'}`}>{label}</span>
              {i < arr.length - 1 && <span className="material-symbols-outlined text-sm text-on-surface-variant">chevron_right</span>}
            </div>
          ))}
        </div>

        {parseErr && (
          <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{parseErr}</div>
        )}

        {/* Upload step */}
        <AnimatePresence mode="wait">
          {step === 'upload' && (
            <motion.div key="upload" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div
                onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                onDragLeave={() => setDragOver(false)}
                onDrop={onDrop}
                onClick={() => fileRef.current?.click()}
                className={`glass-card rounded-2xl border-2 border-dashed p-12 flex flex-col items-center gap-4 cursor-pointer transition-all
                  ${dragOver ? 'border-primary bg-blue-50/60 scale-[1.01]' : 'border-outline-variant hover:border-primary/50 hover:bg-white/60'}`}
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50">
                  <span className="material-symbols-outlined text-4xl text-blue-600">upload_file</span>
                </div>
                <div className="text-center">
                  <p className="text-base font-semibold text-on-surface">Drop your file here or click to browse</p>
                  <p className="text-sm text-on-surface-variant mt-1">Supports .xlsx, .xls, and .csv files</p>
                </div>
                <input ref={fileRef} type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={onFileChange} />
              </div>

              {/* Column guide */}
              <div className="glass-card rounded-xl border p-5 mt-4">
                <h3 className="text-sm font-semibold text-on-surface mb-3">Recognized Column Names</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { field: 'Lead Name *', aliases: 'name, lead name, full name, contact' },
                    { field: 'Company',     aliases: 'company, company name, organization' },
                    { field: 'Email',       aliases: 'email, email address, e-mail' },
                    { field: 'Phone',       aliases: 'phone, phone number, mobile, tel' },
                    { field: 'Lead Source', aliases: 'source, lead source, channel, origin' },
                    { field: 'Salesperson', aliases: 'salesperson, rep, assigned to, owner' },
                    { field: 'Status',      aliases: 'status, stage, lead status' },
                    { field: 'Deal Value',  aliases: 'deal value, value, amount, revenue' },
                  ].map(({ field, aliases }) => (
                    <div key={field} className="rounded-lg bg-white/50 p-2.5">
                      <p className="text-xs font-semibold text-on-surface">{field}</p>
                      <p className="text-xs text-on-surface-variant mt-0.5">{aliases}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Preview step */}
          {step === 'preview' && (
            <motion.div key="preview" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex flex-col gap-4">
              {/* Summary banner */}
              <div className="glass-card rounded-xl border p-4 flex flex-wrap items-center gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-700">{rows.length}</div>
                  <div className="text-xs text-on-surface-variant">Rows detected</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-700">{validRows.length}</div>
                  <div className="text-xs text-on-surface-variant">Will import</div>
                </div>
                {skippedCount > 0 && (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{skippedCount}</div>
                    <div className="text-xs text-on-surface-variant">Skipped (missing name)</div>
                  </div>
                )}
                <div className="ml-auto flex gap-2">
                  <Button variant="secondary" size="sm" onClick={reset}>Change file</Button>
                  <Button size="sm" onClick={handleImport} disabled={importing || validRows.length === 0}>
                    {importing ? 'Importing…' : `Import ${validRows.length} lead${validRows.length !== 1 ? 's' : ''}`}
                  </Button>
                </div>
              </div>

              {/* Preview table */}
              <div className="glass-card rounded-xl border overflow-hidden">
                <div className="overflow-x-auto max-h-[480px] overflow-y-auto">
                  <table className="w-full text-sm">
                    <thead className="sticky top-0 bg-white/80 backdrop-blur-sm">
                      <tr>
                        <th className="py-2.5 px-4 text-left text-xs font-semibold uppercase tracking-wide text-on-surface-variant w-8">#</th>
                        {PREVIEW_COLS.map(c => (
                          <th key={c} className="py-2.5 px-4 text-left text-xs font-semibold uppercase tracking-wide text-on-surface-variant whitespace-nowrap">
                            {COL_LABELS[c]}
                          </th>
                        ))}
                        <th className="py-2.5 px-4 text-left text-xs font-semibold uppercase tracking-wide text-on-surface-variant">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((row, i) => {
                        const warns   = warnings[i] ?? []
                        const hasErr  = warns.some(w => w.startsWith('Missing'))
                        return (
                          <tr key={i} className={`border-t border-outline-variant/30 ${hasErr ? 'bg-red-50/40' : 'hover:bg-white/40'}`}>
                            <td className="py-2 px-4 text-xs text-on-surface-variant">{i + 1}</td>
                            {PREVIEW_COLS.map(c => (
                              <td key={c} className="py-2 px-4 text-on-surface truncate max-w-[140px]">
                                {c === 'deal_value' && row[c] ? `$${Number(row[c]).toLocaleString()}` : (row[c] || <span className="text-on-surface-variant/40">—</span>)}
                              </td>
                            ))}
                            <td className="py-2 px-4">
                              {warns.length === 0
                                ? <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-full">Ready</span>
                                : <span className="text-xs font-medium text-red-700 bg-red-50 px-1.5 py-0.5 rounded-full" title={warns.join(', ')}>{warns[0]}</span>
                              }
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* Done step */}
          {step === 'done' && result && (
            <motion.div key="done" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="glass-card rounded-2xl border p-12 flex flex-col items-center gap-6 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50">
                <span className="material-symbols-outlined text-5xl text-emerald-600">check_circle</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-on-surface">{result.imported} leads imported</h2>
                <p className="text-sm text-on-surface-variant mt-1">All leads have been added to the system.</p>
              </div>
              <div className="flex gap-3">
                <Button variant="secondary" onClick={reset}>Import more</Button>
                <Button onClick={() => navigate('/leads')}>View Leads</Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
