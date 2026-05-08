import { useEffect, useState } from 'react'
import { useParams }  from 'react-router-dom'
import TopNav         from '../components/layout/TopNav'
import LeadForm       from '../components/leads/LeadForm'
import { api }        from '../lib/api'

export default function LeadEdit() {
  const { id }              = useParams()
  const [lead, setLead]     = useState(null)

  useEffect(() => { api.get(`/leads/${id}`).then(setLead) }, [id])

  return (
    <div>
      <TopNav title="Edit Lead" />
      <div className="p-6 max-w-2xl">
        {lead ? <LeadForm initial={lead} /> : (
          <div className="h-64 rounded-xl bg-surface-container animate-pulse" />
        )}
      </div>
    </div>
  )
}
