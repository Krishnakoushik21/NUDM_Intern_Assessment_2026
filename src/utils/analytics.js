export const TENANTS = [
  'All Cities',
  'Delhi', 'Mumbai', 'Pune', 'Bengaluru', 'Chennai',
  'Hyderabad', 'Ahmedabad', 'Kolkata', 'Jaipur', 'Lucknow',
]

export const filterByCity = (data, city) => {
  if (!city || city === 'All Cities') return data
  return data.filter(p => p.tenant === city)
}

export const getCityStats = (data) => {
  if (!data?.length) return { total: 0, approved: 0, rejected: 0, pending: 0, collection: 0, approvalRate: 0 }
  const total      = data.length
  const approved   = data.filter(p => p.status === 'Approved').length
  const rejected   = data.filter(p => p.status === 'Rejected').length
  const pending    = data.filter(p => p.status === 'Pending').length
  const collection = data.reduce((sum, p) => sum + (p.collection_inr || 0), 0)
  const approvalRate = total ? ((approved / total) * 100).toFixed(1) : '0.0'
  return { total, approved, rejected, pending, collection, approvalRate }
}

export const getRevenueByCity = (data) => {
  if (!data?.length) return []
  const map = {}
  for (const p of data) {
    if (!map[p.tenant]) map[p.tenant] = { city: p.tenant, collection: 0, total: 0, approved: 0, rejected: 0, pending: 0 }
    map[p.tenant].collection += p.collection_inr || 0
    map[p.tenant].total++
    if (p.status === 'Approved')      map[p.tenant].approved++
    else if (p.status === 'Rejected') map[p.tenant].rejected++
    else                              map[p.tenant].pending++
  }
  return Object.values(map).sort((a, b) => b.collection - a.collection)
}

export const getTopWards = (data, limit = 5) => {
  if (!data?.length) return []
  const map = {}
  for (const p of data) {
    const key = `${p.ward}||${p.tenant}`
    if (!map[key]) map[key] = { ward: p.ward, city: p.tenant, collection: 0, total: 0, approved: 0 }
    map[key].collection += p.collection_inr || 0
    map[key].total++
    if (p.status === 'Approved') map[key].approved++
  }
  return Object.values(map)
    .sort((a, b) => b.collection - a.collection)
    .slice(0, limit)
}

export const getRecentRegistrations = (data, limit = 8) => {
  if (!data?.length) return []
  return [...data]
    .sort((a, b) => new Date(b.registration_date) - new Date(a.registration_date))
    .slice(0, limit)
}

export const buildChatContext = (filteredData, allData) => {
  const global  = getCityStats(allData)
  const byCity  = getRevenueByCity(allData)
  const topCity = byCity[0]
  const current = getCityStats(filteredData)

  return {
    currentView: {
      total: current.total,
      approved: current.approved,
      rejected: current.rejected,
      pending: current.pending,
      collection_INR: Math.round(current.collection),
      approvalRate_pct: current.approvalRate,
    },
    national: {
      total: global.total,
      approved: global.approved,
      rejected: global.rejected,
      pending: global.pending,
      collection_INR: Math.round(global.collection),
      topCollectionCity: topCity?.city,
      topCollectionAmount_INR: Math.round(topCity?.collection || 0),
    },
    cityBreakdown: byCity.map(c => ({
      city: c.city,
      total: c.total,
      approved: c.approved,
      rejected: c.rejected,
      pending: c.pending,
      collection_INR: Math.round(c.collection),
      approvalRate_pct: c.total ? ((c.approved / c.total) * 100).toFixed(1) : '0.0',
    })),
  }
}

export const fmtINR = (value) => {
  if (value >= 1e7) return `₹${(value / 1e7).toFixed(2)} Cr`
  if (value >= 1e5) return `₹${(value / 1e5).toFixed(2)} L`
  return `₹${value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`
}

export const fmtDate = (str) => {
  if (!str) return '-'
  const d = new Date(str)
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}
