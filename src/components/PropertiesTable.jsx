import { fmtDate, fmtINR } from '../utils/analytics.js'

export default function PropertiesTable({ rows }) {
  if (!rows?.length) return (
    <div className="card p-6 text-center text-xs" style={{ color: 'var(--muted)' }}>
      No records to display
    </div>
  )

  return (
    <div className="card overflow-hidden">
      <div className="px-5 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
        <p className="text-sm font-semibold">Recent Registrations</p>
        <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>Latest properties added to the platform</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {['Property ID','Owner','City','Type','Status','Collection','Registered'].map(h => (
                <th key={h} className="px-4 py-2.5 text-left mono font-normal" style={{ color: 'var(--muted)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((p, i) => (
              <tr
                key={p.property_id}
                style={{ borderBottom: i < rows.length - 1 ? '1px solid var(--border)' : 'none' }}
                className="transition-colors hover:bg-white/[0.02]"
              >
                <td className="px-4 py-2.5 mono" style={{ color: '#3b82f6' }}>{p.property_id}</td>
                <td className="px-4 py-2.5">{p.owner_name}</td>
                <td className="px-4 py-2.5" style={{ color: 'var(--muted)' }}>{p.tenant}</td>
                <td className="px-4 py-2.5" style={{ color: 'var(--muted)' }}>{p.property_type}</td>
                <td className="px-4 py-2.5">
                  <span className={`badge badge-${p.status.toLowerCase()}`}>{p.status}</span>
                </td>
                <td className="px-4 py-2.5 mono" style={{ color: p.collection_inr > 0 ? '#22c55e' : 'var(--muted)' }}>
                  {p.collection_inr > 0 ? fmtINR(p.collection_inr) : '—'}
                </td>
                <td className="px-4 py-2.5" style={{ color: 'var(--muted)' }}>{fmtDate(p.registration_date)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
