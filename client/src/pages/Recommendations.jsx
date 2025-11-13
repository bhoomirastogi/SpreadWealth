import React from 'react'
import { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { API } from '../api'

export default function Recommendations(){
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [error, setError] = useState('')

  // Read the saved questionnaire (for summary text only)
  const q = useMemo(() => {
    try { return JSON.parse(localStorage.getItem('questionnaire') || '{}') } catch { return {} }
  }, [])

  useEffect(()=>{
    const qx = JSON.parse(localStorage.getItem('questionnaire') || '{}')
    const body = JSON.stringify({ amount: qx.amount || 100000, sectors: qx.sectors || [], risk: qx.risk || 'medium' })
    fetch(`${API}/api/portfolio/recommend/sectors`, {
      method:'POST', headers:{'Content-Type':'application/json'}, body
    })
      .then(r=>r.json())
      .then((e) => {
        setData(e)
      })
      .catch(()=>setError('Failed to load recommendations'))
  }, [])

  // ---- helpers (UI only) ----
  const inr = (n) => new Intl.NumberFormat('en-IN', { style:'currency', currency:'INR', maximumFractionDigits:0 }).format(Math.floor(n || 0))
  const num = (n) => new Intl.NumberFormat('en-IN', { maximumFractionDigits:0 }).format(Math.floor(n || 0))

  const allocationEntries = useMemo(() => data?.allocation ? Object.entries(data.allocation) : [], [data])
  const totalAmt = useMemo(() => allocationEntries.reduce((s, [,v]) => s + (v?.amount || 0), 0), [allocationEntries])
  const stockCount = allocationEntries.length

  // ---- styles ----
  const page = { minHeight:'100vh', background:'#f6f7fb', fontFamily:'Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial', color:'#0f172a' }

  const header = { display:'flex', alignItems:'center', justifyContent:'space-between', padding:'18px 20px', maxWidth:1100, margin:'0 auto' }
  const brand = { fontSize:36, fontWeight:800, color:'#1f2a44', letterSpacing:.2 }
  const backBtn = { padding:'10px 14px', borderRadius:10, border:'1px solid #dbe2ff', background:'#fff', cursor:'pointer', fontWeight:700, color:'#1f2a44', display:'inline-flex', alignItems:'center', gap:8 }
  const primaryBtn = { padding:'10px 14px', borderRadius:10, border:'1px solid #274aa3', background:'#274aa3', color:'#fff', cursor:'pointer', fontWeight:800 }
  const headerRight = { display:'flex', gap:8 }  // row for the two buttons

  const intro = { maxWidth:980, margin:'2px auto 22px', textAlign:'center', color:'#667085', fontSize:16 }

  const hero = { maxWidth:980, margin:'0 auto', textAlign:'center', paddingTop:8, paddingBottom:12 }
  const badge = { width:56, height:56, borderRadius:'50%', background:'#e8f8ee', display:'inline-grid', placeItems:'center', marginBottom:10, border:'1px solid #c9f0db' }
  const check = { width:24, height:24, borderRadius:'50%', border:'3px solid #2aa46c', transform:'rotate(45deg)', borderLeft:'none', borderTop:'none' }
  const bigTitle = { fontSize:30, fontWeight:900, letterSpacing:.2, color:'#111827', margin:'8px 0 6px' }
  const sub = { color:'#667085', lineHeight:1.6, margin:0 }

  const container = { maxWidth:1100, margin:'20px auto 40px', padding:'0 14px' }

  const notice = { background:'#f8fbff', border:'1px solid #e4ecff', color:'#3b4a66', fontSize:13, padding:'12px 14px', borderRadius:12, marginTop:14 }

  const blockCard = { background:'#fff', border:'1px solid #e6e8ef', borderRadius:14, boxShadow:'0 22px 60px rgba(0,0,0,.06)', padding:18 }

  const sumTitleWrap = { display:'flex', alignItems:'center', gap:8, fontWeight:800, color:'#122142', marginBottom:12, fontSize:18 }
  const clockDot = { width:16, height:16, border:'2px solid #274aa3', borderRadius:'50%' }

  const sumGrid = { display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(220px, 1fr))', gap:14 }
  const sumItem = { background:'#f9fbff', border:'1px solid #eef2ff', borderRadius:12, padding:'14px 16px' }
  const sumLabel = { color:'#7b8aa4', fontSize:13, marginBottom:6 }
  const sumValue = { color:'#10213a', fontWeight:800, fontSize:18, lineHeight:1.2 }

  const sectionTitle = { fontSize:22, fontWeight:800, color:'#122142', margin:'22px 0 12px' }

  const cards = { display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(260px, 1fr))', gap:18 }
  const recCard = { background:'#fff', border:'1px solid #e6e8ef', borderRadius:14, boxShadow:'0 16px 40px rgba(0,0,0,.05)', padding:'16px 16px 14px' }
  const ticker = { fontSize:20, fontWeight:900, letterSpacing:.6, color:'#0f172a', margin:0 }
  const growRow = { display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:4, color:'#19a34a', fontWeight:800, fontSize:13 }
  const grey = { color:'#6b7280', fontSize:14, margin:'8px 0 12px', minHeight:36 }

  const allocBox = { background:'#f6f7fb', border:'1px solid #edf0f6', borderRadius:12, padding:'12px 14px' }
  const row = { display:'grid', gridTemplateColumns:'1fr auto', alignItems:'center', gap:10, marginBottom:8 }
  const bar = { position:'relative', height:8, borderRadius:8, background:'#e5e7eb', overflow:'hidden' }
  const barFill = (pct)=>({ position:'absolute', top:0, left:0, height:'100%', width:`${pct}%`, background:'#274aa3' })

  const chip = { display:'inline-block', marginTop:10, padding:'6px 10px', borderRadius:999, background:'#fff6d9', color:'#8d6b00', fontSize:12, fontWeight:700, border:'1px solid #ffe9a8' }
  const link = { fontSize:12, fontWeight:700, color:'#274aa3', marginLeft:'auto', cursor:'pointer' }

  const footer = { textAlign:'center', margin:'20px 0 28px', color:'#98a1b3', fontSize:12 }
  const center = { textAlign:'center' }
  const startOverBtn = { padding:'10px 16px', borderRadius:10, fontWeight:800, border:'1px solid #274aa3', background:'#274aa3', color:'#fff', cursor:'pointer' }

  return (
    <div style={page}>
      {/* top header */}
      <div style={header}>
        <div style={brand}>Spread Wealth</div>
        <div style={headerRight}>
          <button style={backBtn} onClick={()=>navigate('/dashboard')}>
            <span style={{fontSize:16}}>←</span> Back to Dashboard
          </button>
          <button style={primaryBtn} onClick={()=>navigate('/market')}>Stock Prices</button>
        </div>
      </div>

      {/* tagline */}
      <div style={intro}>
        Get personalized stock recommendations based on your risk profile and investment goals.
      </div>

      {/* hero */}
      <div style={hero}>
        <div style={badge}><div style={check} /></div>
        <h2 style={bigTitle}>Your Personalized Indian Stock Recommendations</h2>
        <p style={sub}>
          {`Based on your ${q?.risk ? (q.risk[0].toUpperCase()+q.risk.slice(1)) : 'Balanced'} risk profile${q?.years ? ` and ${q.years===1?'short-term (1 year)':'Medium-term (3-5 years)'} investment horizon,` : ','}`}
          <br />
          {`here are our recommended Indian stocks for your ${q?.amount ? inr(q.amount) : 'investment'}.`}
        </p>
      </div>

      {/* content container */}
      <div style={container}>
        <div style={blockCard}>
          <div style={sumTitleWrap}><span style={clockDot}/><span>Investment Summary</span></div>
          <div style={sumGrid}>
            <div style={sumItem}>
              <div style={sumLabel}>Risk Profile</div>
              <div style={sumValue}>{q?.risk ? (q.risk[0].toUpperCase()+q.risk.slice(1)) : '—'}</div>
            </div>
            <div style={sumItem}>
              <div style={sumLabel}>Time Horizon</div>
              <div style={sumValue}>
                {q?.years ? (q.years===1 ? 'Short-term (1 year)' : 'Medium-term (3–5 years)') : '—'}
              </div>
            </div>
            <div style={sumItem}>
              <div style={sumLabel}>Initial Investment</div>
              <div style={sumValue}>{q?.amount ? inr(q.amount) : '—'}</div>
            </div>
            <div style={sumItem}>
              <div style={sumLabel}>Number of Stocks</div>
              <div style={sumValue}>{stockCount || '—'}</div>
            </div>
          </div>

          {(!data && !error) && <div style={{marginTop:16}}>Giving You Personalized Recommendations...</div>}
          {error && <div style={{marginTop:16, color:'#ef4444'}}>{error}</div>}

          {data && (
            <>
              <div style={notice}>
                These recommendations are for educational purposes only and do not constitute financial advice.
                Always conduct your own research or consult with a financial advisor before making investment
                decisions in Indian markets.
              </div>

              <h3 style={sectionTitle}>Recommended Allocation</h3>

              <div style={cards}>
                {allocationEntries.map(([tickerKey, amtObj])=>{
                  const amtVal = amtObj?.amount || 0
                  const pct = totalAmt ? Math.round((amtVal / totalAmt) * 100) : 0
                  return (
                    <div key={tickerKey} style={recCard}>
                      <div style={{display:'flex', alignItems:'flex-start', justifyContent:'space-between'}}>
                        <h4 style={ticker}>{tickerKey}</h4>
                        <div style={growRow}>
                          <span style={{color:'#19a34a'}}>↑</span>
                          <span style={{marginLeft:6, color:'#19a34a'}}>—</span>
                        </div>
                      </div>

                      <div style={grey}>{/* optional company blurb */}</div>

                      <div style={allocBox}>
                        <div style={row}>
                          <div>Allocation</div>
                          <div style={{fontWeight:800}}>{pct}%</div>
                        </div>
                        <div style={bar}><div style={barFill(pct)} /></div>
                        <div style={{...row, marginTop:10}}>
                          <div>Amount</div>
                          <div style={{fontWeight:800}}>{inr(amtVal)}</div>
                        </div>
                      </div>

                      <div style={{display:'flex', alignItems:'center', marginTop:8}}>
                        <span style={chip}>{(q?.risk || 'medium').toUpperCase()} RISK</span>
                        <span style={link}>View History</span>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div style={{marginTop:24, ...center}}>
                <button style={startOverBtn} onClick={()=>navigate('/questionnaire')}>Start Over</button>
              </div>

              {data.chosen && data.chosen.length>0 && (
                <p style={{marginTop:14, color:'#667085', textAlign:'center'}}>
                  Chosen from sectors: {data.chosen.join(', ')}
                </p>
              )}
            </>
          )}
        </div>
      </div>

      <div style={footer}>© {new Date().getFullYear()} Spread Wealth</div>
    </div>
  )
}
