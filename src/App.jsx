import { useState, useMemo, lazy, Suspense } from 'react'
import { Search, X } from 'lucide-react'
import data from './data/properties.json'
import { filterByCity, getCityStats, getRevenueByCity, getTopWards, getRecentRegistrations, buildChatContext, fmtINR } from './utils/analytics.js'
import KPICard from './components/KPICard.jsx'
import TenantFilter from './components/TenantFilter.jsx'
import CollectionChart from './components/CollectionChart.jsx'
import PropertiesTable from './components/PropertiesTable.jsx'
import WardStats from './components/WardStats.jsx'

const ChatAssistant = lazy(() => import('./components/ChatAssistant.jsx'))

export default function App() {
  const [city, setCity]       = useState('All Cities')
  const [search, setSearch]   = useState('')

  const filtered    = useMemo(() => filterByCity(data, city), [city])
  const stats       = useMemo(() => getCityStats(filtered), [filtered])
  const cityData    = useMemo(() => getRevenueByCity(data), [])
  const wards       = useMemo(() => getTopWards(filtered), [filtered])
  const chatContext = useMemo(() => buildChatContext(filtered, data), [filtered])

  // search filters recent table only — by property ID or owner name
  const recent = useMemo(() => {
    const base = getRecentRegistrations(filtered, 50)
    if (!search.trim()) return base.slice(0, 8)
    const q = search.toLowerCase()
    return base
      .filter(p => p.property_id.toLowerCase().includes(q) || p.owner_name.toLowerCase().includes(q))
      .slice(0, 8)
  }, [filtered, search])

  return (
    <div style={{ position: 'relative', zIndex: 1 }}>
      {/* Navbar */}
      <header style={{ borderBottom: '1px solid var(--border)', background: 'rgba(11,17,32,0.92)', backdropFilter: 'blur(8px)', position: 'sticky', top: 0, zIndex: 50 }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <div>
            <h1 className="mono text-sm font-bold">UPYOG</h1>
            <p className="text-xs" style={{ color: 'var(--muted)' }}>Property Tax Platform · NUDM</p>
          </div>
          <TenantFilter value={city} onChange={setCity} />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col gap-6">

        {/* Page heading */}
        <div>
          <p className="text-xs tracking-widest uppercase mb-1" style={{ color: 'var(--muted)' }}>Dashboard</p>
          <h2 className="mono text-xl font-bold">
            {city === 'All Cities' ? 'All Cities' : city}
            <span style={{ color: 'var(--muted)' }}> — Property Tax Summary</span>
          </h2>
        </div>

        {/* KPI grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard type="total"    label="Total Properties" value={stats.total.toLocaleString()}    sub={`${stats.pending} pending review`} />
          <KPICard type="approved" label="Approved"         value={stats.approved.toLocaleString()} sub={`${stats.approvalRate}% of total`} />
          <KPICard type="rejected" label="Rejected"         value={stats.rejected.toLocaleString()} sub={`${((stats.rejected / (stats.total || 1)) * 100).toFixed(1)}% of total`} />
          <KPICard type="pending"  label="Pending"          value={stats.pending.toLocaleString()}  sub="awaiting review" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <KPICard type="collection" label="Total Collection" value={fmtINR(stats.collection)} sub="from approved properties" />
          <KPICard type="rate"       label="Approval Rate"    value={`${stats.approvalRate}%`} sub={`${stats.approved} of ${stats.total} properties`} />
        </div>

        {/* Chart + AI */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <CollectionChart cityData={cityData} />
          <Suspense fallback={
            <div className="card flex items-center justify-center" style={{ height: 480 }}>
              <p className="text-xs" style={{ color: 'var(--muted)' }}>Loading...</p>
            </div>
          }>
            <ChatAssistant chatContext={chatContext} />
          </Suspense>
        </div>

        {/* Ward stats + Table */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <WardStats wards={wards} />
          <div className="xl:col-span-2 flex flex-col gap-3">
            {/* Search */}
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-hi)', maxWidth: 320 }}>
              <Search size={13} color="var(--muted)" />
              <input
                type="text"
                placeholder="Search by property ID or owner..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="flex-1 text-xs bg-transparent focus:outline-none"
                style={{ color: 'var(--text)' }}
              />
              {search && (
                <button onClick={() => setSearch('')}>
                  <X size={12} color="var(--muted)" />
                </button>
              )}
            </div>
            <PropertiesTable rows={recent} />
          </div>
        </div>

        <p className="text-center text-xs pb-2" style={{ color: 'var(--border-hi)' }}>
          NUDM · UPYOG · 1,000 records · 10 cities · 2026
        </p>
      </main>
    </div>
  )
}
