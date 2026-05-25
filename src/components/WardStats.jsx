import { fmtINR } from '../utils/analytics.js'

export default function WardStats({ wards }) {
  if (!wards?.length) return null
  const max = wards[0]?.collection || 1

  return (
    <div className="card p-5">
      <p className="text-sm font-semibold mb-1">Top Wards by Collection</p>
      <p className="text-xs mb-4" style={{ color: 'var(--muted)' }}>Highest revenue generating wards</p>
      <div className="flex flex-col gap-3">
        {wards.map((w, i) => (
          <div key={`${w.ward}-${w.city}`}>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="mono text-xs" style={{ color: 'var(--muted)', minWidth: 16 }}>#{i+1}</span>
                <span className="text-xs font-medium">{w.ward}</span>
                <span className="text-xs" style={{ color: 'var(--muted)' }}>{w.city}</span>
              </div>
              <div className="text-right">
                <span className="mono text-xs font-semibold" style={{ color: '#fbbf24' }}>{fmtINR(w.collection)}</span>
                <span className="text-xs ml-2" style={{ color: 'var(--muted)' }}>{w.total} props</span>
              </div>
            </div>
            <div className="h-1 rounded-full" style={{ background: 'var(--border-hi)' }}>
              <div
                className="h-1 rounded-full"
                style={{ width: `${(w.collection / max) * 100}%`, background: '#3b82f6', opacity: 1 - i * 0.12 }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
