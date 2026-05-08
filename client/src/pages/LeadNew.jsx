import TopNav   from '../components/layout/TopNav'
import LeadForm from '../components/leads/LeadForm'

export default function LeadNew() {
  return (
    <div>
      <TopNav title="New Lead" />
      <div className="p-6 max-w-2xl">
        <LeadForm />
      </div>
    </div>
  )
}
