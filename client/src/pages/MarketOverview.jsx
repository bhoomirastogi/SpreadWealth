// src/pages/MarketOverview.jsx
import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { API } from '../api' // base URL from your project (VITE_API_BASE or http://localhost:8000)

const YEARS = ['2020', '2021', '2022', '2023', '2024'];

/**
 * This page uses your existing backend:
 * - GET  /api/portfolio/sectors                         -> list of sector names
 * - POST /api/portfolio/recommend/tickers               -> { allocation, latest, history: { dates, series } }
 * - POST /api/portfolio/recommend/sectors (optional)    -> choose tickers per sector
 */

export default function MarketOverview() {
  const navigate = useNavigate()

  // UI state
  const [sectors, setSectors] = useState(['All'])
  const [sector, setSector] = useState('All')
  const [showTable, setShowTable] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Data for display
  const [tickers, setTickers] = useState([])     // active tickers being shown
  const [series, setSeries]   = useState({})     // { TICKER: [p0, p1, ...] }
  const [dates, setDates]     = useState([])     // ISO strings from backend
  const [latest, setLatest]   = useState({})     // { TICKER: 1234 }
  const [sectorMap, setSectorMap] = useState({}) // optional cache: sector -> [tickers]

  // Load sectors (GET /api/portfolio/sectors)
  useEffect(() => {
    (async () => {
      try {
        setLoading(true)
        setError('')
        const r = await fetch(`${API}/api/portfolio/sectors`)
        const j = await r.json()
        const names = Array.isArray(j?.sectors) ? j.sectors : []
        setSectors(['All', ...names])

        // Tiny convenience: remember the map of sector->tickers using /recommend/sectors once on demand
        setLoading(false)
      } catch {
        setLoading(false)
        setError('Failed to load sectors')
      }
    })()
  }, [])

  // Helper: choose tickers to display for a sector
  const loadTickersForSector = async (sectorName) => {
    /**
     * We can derive sector tickers two ways:
     *  A) Call POST /api/portfolio/recommend/sectors with a tiny amount; it returns selected_tickers (from your mapping).
     *  B) Cache results in sectorMap to avoid repeated calls.
     */
    if (sectorName === 'All') {
      // Pick a representative bundle across sectors — tweak to your liking.
      // You can also compute "top by 5y return" by calling recommend/sectors for each sector, but
      // here we just pick a useful, consistent sample.
      return ['RELIANCE','TCS','HDFCBANK','INFY','SBIN','SUNPHARMA','HUL','BAJFINANCE','ADANIPORTS','BHARTIARTL']
    }

    if (sectorMap[sectorName]) return sectorMap[sectorName]

    try {
      const body = JSON.stringify({ amount: 100000, sectors: [sectorName], risk: 'medium' })
      const r = await fetch(`${API}/api/portfolio/recommend/sectors`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body
      })
      const j = await r.json()
      const sel = Array.isArray(j?.selected_tickers) ? j.selected_tickers : Object.keys(j?.allocation || {})
      setSectorMap(prev => ({ ...prev, [sectorName]: sel }))
      return sel
    } catch {
      return []
    }
  }

  // Load history for a set of tickers (POST /api/portfolio/recommend/tickers)
  const loadHistory = async (tickerList) => {
    if (!tickerList.length) { setSeries({}); setDates([]); setLatest({}); return }
    const body = JSON.stringify({ tickers: tickerList, amount: 100000 })
    const r = await fetch(`${API}/api/portfolio/recommend/tickers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body
    })
    if (!r.ok) throw new Error('network')
    const j = await r.json()
    // history.series is { TICKER: [p0, ...] }, history.dates is ISO[]
    setSeries(j?.history?.series || {})
    setDates(j?.history?.dates || [])
    setLatest(j?.latest || {})
  }

  // Whenever sector changes, pick tickers and load history
  useEffect(() => {
    (async () => {
      try {
        setLoading(true)
        setError('')
        const sel = await loadTickersForSector(sector)
        setTickers(sel)
        await loadHistory(sel)
        setLoading(false)
      } catch {
        setLoading(false)
        setError('Failed to load stock history')
      }
    })()
  }, [sector]) // eslint-disable-line

  // Transform: compress daily history to one value per YEAR (closest to year-end)
  const yearRows = useMemo(() => {
    if (!dates.length) return {}
    const yearsToIdx = {}
    // Map each target year to the index in dates nearest to Dec 31 of that year
    YEARS.forEach(y => {
      const target = new Date(`${y}-12-31T00:00:00Z`).getTime()
      let best = 0, bestDiff = Infinity
      dates.forEach((d, i) => {
        const diff = Math.abs(new Date(d).getTime() - target)
        if (diff < bestDiff) { best = i; bestDiff = diff }
      })
      yearsToIdx[y] = best
    })

    const out = {}
    Object.keys(series).forEach(t => {
      out[t] = YEARS.map(y => {
        const i = yearsToIdx[y]
        const arr = series[t] || []
        const v = typeof arr[i] === 'number' ? arr[i] : null
        return v
      })
    })
    return out
  }, [dates, series])

  // Compute 5Y return from the compressed rows
  const returns5y = useMemo(() => {
    const out = {}
    Object.entries(yearRows).forEach(([t, arr]) => {
      const start = arr[0], end = arr[arr.length - 1]
      if (start && end && start > 0) out[t] = Math.round(((end - start) / start) * 100)
      else out[t] = 0
    })
    return out
  }, [yearRows])

  const shown = useMemo(() => tickers.filter(t => yearRows[t]?.some(v => v != null)), [tickers, yearRows])

  return (
    <div style={page}>
      {/* Top Bar */}
      <div style={topbar}>
        <h1 style={h1}>Indian Stock Prices </h1>
        <div style={{display:'flex', gap:10}}>
          <button style={btnPrimary} onClick={()=>navigate('/questionnaire')}>Get Recommendations</button>
        </div>
      </div>

      {/* Filter Card */}
      <div style={filterCard}>
        <div style={{fontSize:20, fontWeight:800, color:'#122142'}}>Filter by Sector</div>
        <div style={filterRow}>
          <select value={sector} onChange={e=>setSector(e.target.value)} style={select}>
            {sectors.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <button style={btnGhost} onClick={()=>setShowTable(v=>!v)}>
            <span style={{marginRight:6}}>📊</span>{showTable ? 'Hide Table' : 'View Table'}
          </button>
        </div>
      </div>

      {/* Content */}
      {loading && <div style={{marginTop:14}}>Loading…</div>}
      {error && <div style={{marginTop:14, color:'#ef4444'}}>{error}</div>}

      {!loading && !error && (
        <>
          {/* Cards */}
          <div style={grid}>
            {shown.map(t => (
              <StockCard
                key={t}
                ticker={t}
                name={t}                // you can map to full name if you store it
                prices={yearRows[t]}    // 5 yearly values
                ret5y={returns5y[t] ?? 0}
              />
            ))}
          </div>

          {/* Table */}
          {showTable && (
            <div style={tableWrap}>
              <div style={tableTitle}>Full Stock Data Table</div>
              <div style={{overflowX:'auto'}}>
                <table style={table}>
                  <thead>
                    <tr>
                      <th style={th}>Stock</th>
                      {YEARS.map(y => <th key={y} style={th}>{y}</th>)}
                      <th style={th}>5Y Return</th>
                    </tr>
                  </thead>
                  <tbody>
                    {shown.map(t => (
                      <tr key={t} style={tr}>
                        <td style={tdStock}>
                          <div style={{fontWeight:800, letterSpacing:.4}}>{t}</div>
                          <div style={{color:'#6b7280', fontSize:12}}>{/* company name, if you have it */}</div>
                        </td>
                        {YEARS.map((y, i) => (
                          <td key={y} style={td}>{formatInr(yearRows[t][i])}</td>
                        ))}
                        <td style={{...td, fontWeight:800, color:(returns5y[t]||0)>=0?'#16a34a':'#dc2626'}}>
                          {(returns5y[t]||0) > 0 ? `+${returns5y[t]}%` : `${returns5y[t]||0}%`}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

/* ---------- Card + Chart ---------- */

function StockCard({ ticker, name, prices = [], ret5y = 0 }) {
  const positive = ret5y >= 0
  const data = prices.map((v, i) => ({ x: i, y: Number(v || 0) }))
  const max = Math.max(...data.map(d=>d.y), 1)
  const min = Math.min(...data.map(d=>d.y), 0)

  return (
    <div style={card}>
      <div style={cardHead}>
        <div>
          <div style={tickerCss}>
            {ticker}
            <span style={nameCss}> {name}</span>
          </div>
        </div>
        <div style={{display:'flex', alignItems:'center', gap:8}}>
          <div style={{display:'flex', alignItems:'center', gap:6, color: positive ? '#16a34a' : '#dc2626', fontWeight:800}}>
            <span>{positive ? '↑' : '↓'}</span>
            <span>{positive ? `+${ret5y}%` : `${ret5y}%`}</span>
          </div>
          <button style={btnSmall} onClick={()=>alert(`Explore ${ticker}`)}>
            🔍 Explore
          </button>
        </div>
      </div>

      <MiniLineChart data={data} yMin={min} yMax={max} />

      <div style={{display:'flex', alignItems:'center', gap:8, color:'#2f855a', fontWeight:700, marginTop:8}}>
        <span style={{fontSize:12}}>●</span> Price (₹)
      </div>
    </div>
  )
}

function MiniLineChart({ data, yMin, yMax }) {
  const w = 440, h = 180, padL = 40, padB = 28, padT = 8, padR = 10
  const scaleX = (i) => {
    const step = (w - padL - padR) / (Math.max(1, data.length - 1))
    return padL + i * step
  }
  const scaleY = (v) => {
    const range = (yMax - yMin) || 1
    return padT + (h - padT - padB) * (1 - (v - yMin) / range)
  }
  const path = data.map((p,i)=>`${i===0?'M':'L'} ${scaleX(i)} ${scaleY(p.y)}`).join(' ')
  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h}`} style={{display:'block'}}>
      {YEARS.map((y, i) => (
        <text key={y} x={scaleX(i)} y={h - 8} textAnchor="middle" fontSize="12" fill="#6b7280">{y}</text>
      ))}
      <line x1={padL} y1={scaleY(yMin)} x2={w - padR} y2={scaleY(yMin)} stroke="#e5e7eb" />
      <path d={path} fill="none" stroke="#22c55e" strokeWidth="3" strokeLinejoin="round" />
      {data.map((p, i) => (
        <g key={i}>
          <circle cx={scaleX(i)} cy={scaleY(p.y)} r="4" fill="#22c55e" />
          <title>{`${YEARS[i]}\nPrice: ₹${formatNumber(p.y)}`}</title>
        </g>
      ))}
    </svg>
  )
}

/* ---------- Styles ---------- */

const page = { minHeight:'100vh', background:'#f6f7fb', color:'#0f172a',
  fontFamily:'Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial', padding:'18px 16px 32px' }

const topbar = { display:'flex', justifyContent:'space-between', alignItems:'center', maxWidth:1200, margin:'0 auto 10px' }
const h1 = { margin:0, fontSize:36, fontWeight:900, color:'#122142' }

const filterCard = { maxWidth:1200, margin:'0 auto 14px', background:'#fff', border:'1px solid #e6e8ef',
  boxShadow:'0 12px 30px rgba(0,0,0,.06)', borderRadius:12, padding:'14px 16px' }
const filterRow = { display:'flex', gap:10, alignItems:'center', marginTop:10 }
const select = { border:'1px solid #e5e7eb', background:'#fff', borderRadius:10, padding:'10px 12px',
  fontSize:14, color:'#0f172a' }

const grid = { maxWidth:1200, margin:'0 auto', display:'grid',
  gridTemplateColumns:'repeat(auto-fit, minmax(320px, 1fr))', gap:16 }

const card = { background:'#fff', border:'1px solid #e6e8ef', borderRadius:12,
  boxShadow:'0 16px 40px rgba(0,0,0,.06)', padding:'14px 16px' }
const cardHead = { display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:6 }
const tickerCss = { fontSize:20, fontWeight:900, letterSpacing:.6, color:'#0f172a', margin:0 }
const nameCss = { fontWeight:400, color:'#6b7280', fontSize:12 }
const btnSmall = { border:'1px solid #dbe2ff', background:'#fff', color:'#0f172a', borderRadius:10,
  padding:'8px 10px', fontWeight:700, cursor:'pointer' }

const tableWrap = { maxWidth:1200, margin:'18px auto 0', background:'#fff', border:'1px solid #e6e8ef',
  borderRadius:12, boxShadow:'0 12px 30px rgba(0,0,0,.06)', padding:'8px 0 12px' }
const tableTitle = { fontSize:22, fontWeight:800, color:'#122142', padding:'12px 16px' }
const table = { width:'100%', borderCollapse:'collapse', minWidth:720 }
const th = { textAlign:'left', padding:'12px 16px', fontSize:13, color:'#6b7280', borderBottom:'1px solid #e5e7eb' }
const tr = { borderBottom:'1px solid #eef2ff' }
const td = { padding:'12px 16px', fontSize:14, color:'#0f172a', whiteSpace:'nowrap' }
const tdStock = { ...td, minWidth:220 }

const btnPrimary = { background:'#274aa3', color:'#fff', border:'1px solid #274aa3',
  borderRadius:10, padding:'10px 14px', fontWeight:800, cursor:'pointer' }
const btnGhost = { background:'#fff', color:'#0f172a', border:'1px solid #dbe2ff',
  borderRadius:10, padding:'10px 14px', fontWeight:800, cursor:'pointer' }

/* ---------- Utils ---------- */
function formatNumber(n){ return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(Math.floor(n || 0)) }
function formatInr(n){ return n == null ? '—' : `₹${formatNumber(n)}` }
