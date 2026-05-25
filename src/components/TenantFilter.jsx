import { TENANTS } from '../utils/analytics.js'

export default function TenantFilter({ value, onChange }) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="mono text-sm font-bold px-3 py-2 rounded-lg focus:outline-none cursor-pointer"
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-hi)',
        color: '#3b82f6',
        minWidth: 150,
      }}
    >
      {TENANTS.map(t => <option key={t} value={t}>{t}</option>)}
    </select>
  )
}
