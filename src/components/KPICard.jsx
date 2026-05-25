import { Building2, CheckCircle2, XCircle, IndianRupee, Clock, TrendingUp } from 'lucide-react'

const CONFIG = {
  total:      { Icon: Building2,    color: '#3b82f6' },
  approved:   { Icon: CheckCircle2, color: '#22c55e' },
  rejected:   { Icon: XCircle,      color: '#f87171' },
  collection: { Icon: IndianRupee,  color: '#fbbf24' },
  pending:    { Icon: Clock,        color: '#94a3b8' },
  rate:       { Icon: TrendingUp,   color: '#a78bfa' },
}

export default function KPICard({ type = 'total', label, value, sub, wide }) {
  const { Icon, color } = CONFIG[type]
  return (
    <div className={`card p-5 flex flex-col gap-3 hover:-translate-y-1 transition-all duration-300 ${wide ? 'col-span-2' : ''}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium tracking-wider uppercase" style={{ color: 'var(--muted)' }}>{label}</span>
        <Icon size={14} color={color} opacity={0.7} />
      </div>
      <div key={value} className="num">
        <p className="mono text-2xl font-bold" style={{ color }}>{value}</p>
        {sub && <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>{sub}</p>}
      </div>
    </div>
  )
}
