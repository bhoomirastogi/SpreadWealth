import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import React from 'react'

export default function SignIn() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()[\]{};:'",.<>/?\\|`~_\-+=]).{8,}$/

  const onSubmit = async (e) => {
    e.preventDefault()
    const next = {}
    if (!emailRegex.test(email)) next.email = 'Enter a valid email address'
    if (!passwordRegex.test(password)) next.password = 'Invalid password format'
    setErrors(next)
    if (Object.keys(next).length) return
    navigate('/questionnaire')
  }

  // styles
  const page = { 
    minHeight: '100vh',
    background: '#f6f7fb',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial',
    color: '#0f172a',
    position: 'relative'
  }
  const btnBase = { display:'inline-block', textAlign:'center', padding:'10px 16px', borderRadius:8, fontSize:14, fontWeight:600, cursor:'pointer', textDecoration:'none' }
  const btnPrimary = { ...btnBase, background:'#274aa3', color:'#fff', border:'1px solid #274aa3' }
  const dashboardBtn = { 
    ...btnPrimary,
    position:'absolute',
    top:20,
    right:20
  }

  // pie chart icon style (just like your screenshot)
  const iconWrap = { 
    width:50, height:50, borderRadius:'50%',
    display:'flex', alignItems:'center', justifyContent:'center',
    background:'#fff', border:'1px solid #e6e8ef', boxShadow:'0 4px 10px rgba(0,0,0,.05)',
    marginBottom:14 
  }
  const icon = { width:28, height:28, color:'#274aa3' }

  return (
    <div style={page}>
      {/* Back to Dashboard Button */}
      <button style={dashboardBtn} onClick={()=>navigate('/dashboard')}>
        Back to Dashboard
      </button>

      <div style={{ display: 'grid', gap: 16, justifyItems: 'center' }}>
        
        {/* App Logo/Icon */}
        <div style={iconWrap}>
          {/* Inline SVG pie chart icon */}
          <svg xmlns="http://www.w3.org/2000/svg" style={icon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3a9 9 0 018.94 7.88A9 9 0 0111 21V3z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3v9H2.06A9.001 9.001 0 0111 3z" />
          </svg>
        </div>

        {/* Heading */}
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ margin:'0 0 6px 0', fontSize:28, fontWeight:800, color:'#1f2a44' }}>
            Sign in to your Spread Wealth account
          </h1>
          <div style={{ color:'#667085', fontSize:14 }}>
            Don’t have an account? <Link to="/signup" style={{ color:'#274aa3', textDecoration:'none', fontWeight:600 }}>Sign up</Link>
          </div>
        </div>

        {/* Card */}
        <div style={{ width:'100%', maxWidth:520, background:'#fff', borderRadius:14, padding:'20px 24px', border:'1px solid #e6e8ef', boxShadow:'0 16px 40px rgba(0,0,0,.08)' }}>
          <form onSubmit={onSubmit} style={{ display:'grid', gap:12 }}>
            <label style={{ display:'grid', gap:6 }}>
              <span style={{ fontSize:14, color:'#344256', fontWeight:600 }}>Email</span>
              <input 
                style={{ border:'1px solid #e5e7eb', outline:'none', background:'#fff', padding:'10px 12px', fontSize:14, color:'#0f172a', borderRadius:10, borderColor: errors.email ? '#ef4444' : '#e5e7eb' }} 
                value={email} 
                onChange={(e)=>setEmail(e.target.value)} 
                placeholder="your@email.com" 
              />
              {errors.email && <div style={{ color:'#ef4444', fontSize:12 }}>{errors.email}</div>}
            </label>
            <label style={{ display:'grid', gap:6 }}>
              <span style={{ fontSize:14, color:'#344256', fontWeight:600 }}>Password</span>
              <input 
                type="password" 
                style={{ border:'1px solid #e5e7eb', outline:'none', background:'#fff', padding:'10px 12px', fontSize:14, color:'#0f172a', borderRadius:10, borderColor: errors.password ? '#ef4444' : '#e5e7eb' }} 
                value={password} 
                onChange={(e)=>setPassword(e.target.value)} 
                placeholder="********" 
              />
              {errors.password && <div style={{ color:'#ef4444', fontSize:12 }}>{errors.password}</div>}
            </label>
            <button type="submit" style={{ ...btnPrimary, width:'100%' }}>Sign in</button>
          </form>
        </div>
      </div>
    </div>
  )
}
