import { useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from 'recharts'

const COLORS = ['#3b82f6','#22c55e','#fbbf24','#a78bfa','#f87171','#06b6d4','#fb923c','#84cc16','#e879f9','#94a3b8']

const Tip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="card p-3 text-xs shadow-lg" style={{ minWidth: 160 }}>
      <p className="mono font-bold mb-2">{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color }} className="mb-1">
          {p.name}:{' '}
          <span className="font-semibold">
            {p.name === 'Revenue'
              ? `₹${(p.value / 1e5).toFixed(2)}L`
              : p.value}
          </span>
        </p>
      ))}
    </div>
  )
}

export default function CollectionChart({ cityData }) {
  const [tab, setTab] = useState('revenue')

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-sm font-semibold">Municipal Revenue</p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
            {tab === 'revenue' ? 'Total collection per city' : 'Approval pipeline by city'}
          </p>
        </div>
        <div className="flex gap-1">
          {[['revenue','Revenue'],['pipeline','Pipeline']].map(([k,l]) => (
            <button
              key={k}
              onClick={() => setTab(k)}
              className="text-xs px-3 py-1.5 rounded-md transition-all"
              style={{
                background: tab === k ? '#3b82f6' : 'transparent',
                color: tab === k ? '#fff' : 'var(--muted)',
                border: tab === k ? '1px solid #3b82f6' : '1px solid var(--border-hi)',
              }}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={cityData} margin={{ top: 4, right: 4, left: 4, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
          <XAxis
            dataKey="city"
            tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'Space Mono' }}
            axisLine={false} tickLine={false}
            angle={-25} textAnchor="end" height={46}
          />
          <YAxis
            tickFormatter={v => tab === 'revenue' ? `${(v/1e5).toFixed(0)}L` : v}
            tick={{ fill: '#64748b', fontSize: 10 }}
            axisLine={false} tickLine={false}
          />
          <Tooltip content={<Tip />} cursor={{ fill: 'rgba(148,163,184,0.05)' }} />

          {tab === 'revenue' ? (
            <Bar dataKey="collection" name="Revenue" radius={[4,4,0,0]} maxBarSize={36}>
              {cityData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Bar>
          ) : (
            <>
              <Bar dataKey="approved" name="Approved" fill="#22c55e" radius={[3,3,0,0]} maxBarSize={14} />
              <Bar dataKey="rejected" name="Rejected" fill="#f87171" radius={[3,3,0,0]} maxBarSize={14} />
              <Bar dataKey="pending"  name="Pending"  fill="#fbbf24" radius={[3,3,0,0]} maxBarSize={14} />
            </>
          )}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
