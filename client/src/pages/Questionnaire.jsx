import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import React from 'react'

export default function Questionnaire() {
  const navigate = useNavigate()

  const [amount, setAmount] = useState(100000)
  const [years, setYears] = useState(3)
  const [risk, setRisk] = useState('medium')
  const [goal, setGoal] = useState('balanced')
  const [sectors, setSectors] = useState([])

  const sectorList = [
    'Technology', 'Healthcare', 'Automobiles',
    'Defence', 'Finance', 'Consumer Goods',
    'Oil & Gas', 'Telecom'
  ]

  const formattedAmount = useMemo(() =>
    new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(Number(amount || 0)),
    [amount]
  )

  const toggleSector = (name) => {
    setSectors(prev =>
      prev.includes(name) ? prev.filter(s => s !== name) : [...prev, name]
    )
  }

  const quickAmounts = [50000, 100000, 200000, 500000]
  const isValid = Number(amount) > 0 && Number(years) >= 1

  const onSubmit = (e) => {
    e.preventDefault()
    if (!isValid) return

    const payload = { amount: Number(amount), years, risk, goal, sectors }
    localStorage.setItem('questionnaire', JSON.stringify(payload))
    navigate('/recommendations')
  }

  // --- styles for icon ---
  const iconWrap = { 
    width:60, height:60, borderRadius:'50%',
    display:'flex', alignItems:'center', justifyContent:'center',
    background:'#fff', border:'1px solid #e6e8ef', boxShadow:'0 4px 10px rgba(0,0,0,.05)',
    margin:'0 auto 14px'
  }
  const icon = { width:32, height:32, color:'#274aa3' }

  // --- top-right action buttons (inside the card) ---
  const actionBar = { position:'absolute', top:12, right:12, display:'flex', gap:8 }
  const actionBtn = { padding:'8px 12px', borderRadius:10, fontWeight:700, cursor:'pointer', border:'1px solid #dbe2ff', background:'#fff', color:'#1f2a44' }
  const actionBtnPrimary = { ...actionBtn, background:'#274aa3', color:'#fff', borderColor:'#274aa3' }

  return (
    <div style={page}>
      {/* make container relative so action buttons can sit on top-right */}
      <div style={{ ...container, position:'relative' }}>
        {/* ACTION BUTTONS */}
        <div style={actionBar}>
          <button style={actionBtn} onClick={()=>navigate('/dashboard')}>Back to Dashboard</button>
          <button style={actionBtnPrimary} onClick={()=>navigate('/market')}>Stock Prices</button>
        </div>

        {/* Centered Icon + Heading */}
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center' }}>
          <div style={iconWrap}>
            <svg xmlns="http://www.w3.org/2000/svg" style={icon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3a9 9 0 018.94 7.88A9 9 0 0111 21V3z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3v9H2.06A9.001 9.001 0 0111 3z" />
            </svg>
          </div>
          <h1 style={title}>Questionnaire</h1>
          <p style={subtitle}>Tell us your preferences. We’ll propose a simple, diversified allocation.</p>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} style={{ display:'grid', gap:16 }}>
          {/* Amount */}
          <div style={block}>
            <label style={label}>
              <span style={labelText}>Amount to invest (₹)</span>
              <div style={inputAffix}>
                <span style={affix}>₹</span>
                <input
                  type="number"
                  min="1000"
                  step="1000"
                  value={amount}
                  onChange={(e)=>setAmount(e.target.value)}
                  style={input}
                />
                <span style={suffix}>{formattedAmount}</span>
              </div>
            </label>
            <div style={chipRow}>
              {quickAmounts.map(v => (
                <button
                  key={v}
                  type="button"
                  onClick={()=>setAmount(v)}
                  style={{ ...chip, ...(Number(amount)===v ? chipActive : null) }}
                >
                  ₹{new Intl.NumberFormat('en-IN').format(v)}
                </button>
              ))}
            </div>
          </div>

          {/* Time horizon */}
          <div style={block}>
            <label style={label}>
              <span style={labelText}>Time horizon (years)</span>
              <div style={rangeWrap}>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={years}
                  onChange={(e)=>setYears(Number(e.target.value))}
                  style={range}
                />
                <div style={rangeValue}>{years} {years===1 ? 'year' : 'years'}</div>
              </div>
            </label>
            <div style={hint}>Longer horizons can support more risk and equity exposure.</div>
          </div>

          {/* Risk */}
          <div style={block}>
            <div style={labelText}>Risk capability</div>
            <div style={segRow}>
              {['low','medium','high'].map(level => (
                <button
                  key={level}
                  type="button"
                  onClick={()=>setRisk(level)}
                  style={{ ...segBtn, ...(risk===level ? segBtnActive : null) }}
                >
                  {level}
                </button>
              ))}
            </div>
            <div style={riskExplain[risk]}>{riskCopy[risk]}</div>
          </div>

          {/* Goal */}
          <div style={block}>
            <div style={labelText}>Primary goal</div>
            <div style={segRow}>
              {['growth','balanced','income'].map(g => (
                <button
                  key={g}
                  type="button"
                  onClick={()=>setGoal(g)}
                  style={{ ...segBtn, ...(goal===g ? segBtnActive : null) }}
                >
                  {cap(g)}
                </button>
              ))}
            </div>
          </div>

          {/* Sectors */}
          <div style={block}>
            <div style={labelText}>Select sectors (optional)</div>
            <div style={cardGrid}>
              {sectorList.map(s => (
                <label key={s} style={checkCard}>
                  <input
                    type="checkbox"
                    checked={sectors.includes(s)}
                    onChange={()=>toggleSector(s)}
                    style={checkbox}
                  />
                  <span>{s}</span>
                </label>
              ))}
            </div>
            <div style={hint}>If you don’t select any, we’ll pick a mix based on your risk.</div>
          </div>

          {/* Submit */}
          <button type="submit" style={{ ...submitBtn, opacity:isValid?1:0.7 }} disabled={!isValid}>
            Get Recommendations
          </button>
        </form>
      </div>
      <div style={footer}>© {new Date().getFullYear()} Spread Wealth</div>
    </div>
  )
}

/* ---------------- Styles ---------------- */
const page = { minHeight:'100vh', background:'#f6f7fb', display:'flex', flexDirection:'column', alignItems:'center', padding:'32px 16px 24px', fontFamily:'Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial', color:'#0f172a' }
const container = { width:'100%', maxWidth:920, background:'#fff', borderRadius:14, border:'1px solid #e6e8ef', boxShadow:'0 22px 60px rgba(0,0,0,.10)', padding:22 }
const title = { margin:'10px 0 0', fontSize:26, color:'#1f2a44', fontWeight:800, textAlign:'center' }
const subtitle = { margin:'6px 0 0', color:'#667085', fontSize:14, textAlign:'center' }

const block = { padding:12, borderRadius:12, border:'1px solid #eef2ff', background:'#fafbff' }
const label = { display:'grid', gap:6 }
const labelText = { fontWeight:700, color:'#344256', fontSize:14 }
const hint = { marginTop:6, color:'#94a3b8', fontSize:12 }

const inputAffix = { display:'grid', gridTemplateColumns:'48px 1fr auto', alignItems:'center', border:'1px solid #e5e7eb', background:'#fff', borderRadius:10 }
const affix = { display:'grid', placeItems:'center', color:'#6b7280', fontWeight:700 }
const suffix = { padding:'0 10px', color:'#6b7280', fontSize:13 }
const input = { border:'none', outline:'none', background:'transparent', padding:'10px 12px', fontSize:14, color:'#0f172a', borderRadius:10 }

const chipRow = { display:'flex', gap:8, marginTop:10, flexWrap:'wrap' }
const chip = { background:'#f3f4f6', border:'1px solid #e5e7eb', padding:'6px 10px', borderRadius:999, fontSize:13, cursor:'pointer' }
const chipActive = { background:'#eef2ff', borderColor:'#b9c7ff', color:'#274aa3', fontWeight:700 }

const rangeWrap = { display:'grid', gridTemplateColumns:'1fr auto', alignItems:'center', gap:12 }
const range = { width:'100%' }
const rangeValue = { fontWeight:700, color:'#1f2a44' }

const segRow = { display:'flex', gap:8, flexWrap:'wrap', marginTop:6 }
const segBtn = { padding:'8px 12px', borderRadius:999, border:'1px solid #e5e7eb', background:'#fff', cursor:'pointer', fontSize:14 }
const segBtnActive = { background:'#274aa3', color:'#fff', borderColor:'#274aa3', fontWeight:700 }

const riskExplain = { low:{marginTop:6,color:'#667085',fontSize:13}, medium:{marginTop:6,color:'#667085',fontSize:13}, high:{marginTop:6,color:'#667085',fontSize:13} }
const riskCopy = {
  low:'Lower volatility preference. We’ll emphasize bonds/large-caps and capital protection.',
  medium:'Balanced approach between growth and stability with diversified equity and debt.',
  high:'Higher risk tolerance. We’ll tilt toward equities and growth sectors.'
}

const cardGrid = { marginTop:10, display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(180px, 1fr))', gap:10 }
const checkCard = { display:'flex', alignItems:'center', gap:10, padding:'10px 12px', borderRadius:10, border:'1px solid #e5e7eb', background:'#fff', cursor:'pointer' }
const checkbox = { width:18, height:18, accentColor:'#274aa3' }

const submitBtn = { marginTop:4, display:'inline-block', width:'100%', textAlign:'center', padding:'12px 16px', borderRadius:10, fontSize:15, fontWeight:700, background:'#274aa3', color:'#fff', border:'1px solid #274aa3', cursor:'pointer' }
const footer = { color:'#98a1b3', fontSize:12, marginTop:12 }

function cap(s){ return s[0].toUpperCase()+s.slice(1) }
