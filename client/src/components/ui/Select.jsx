export default function Select({ label, error, children, className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-xs font-medium text-on-surface-variant">{label}</label>
      )}
      <select
        className={`h-9 w-full rounded-lg border px-3 text-sm bg-surface-container-lowest text-on-surface
          outline-none transition-colors border-outline-variant
          focus:border-primary-container focus:ring-1 focus:ring-primary-container/30
          disabled:opacity-50 ${className}`}
        {...props}
      >
        {children}
      </select>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}
