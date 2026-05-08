import { STATUS_BADGE } from '../../lib/constants'

export default function Badge({ status }) {
  const cls = STATUS_BADGE[status] ?? 'bg-surface-container text-on-surface-variant'
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${cls}`}>
      {status}
    </span>
  )
}
