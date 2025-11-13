import { Link } from 'react-router-dom'
import React from 'react'

export default function Dashboard() {
  return (
    <div style={page}>
      {/* Top row: brand + CTAs */}
      <div style={topBar}>
        <h1 style={brand}>Spread Wealth</h1>
        <div style={ctaRow}>
          <Link to="/signin" style={btnGhost}>Sign In</Link>
          <Link to="/signup" style={btnPrimary}>Sign Up</Link>
        </div>
      </div>

      {/* Subtitle */}
      <p style={subtitle}>Your personalized path to smarter investing in Indian markets</p>

      {/* Hero */}
      <section style={heroWrap}>
        <div style={heroLeft}>
          <h2 style={heroTitle}>Start Your Investment Journey Today</h2>
          <p style={heroText}>
            Spread Wealth helps beginners make informed investment decisions by creating personalized
            Indian stock recommendations based on your risk tolerance, investment goals, and budget.
          </p>
          <div style={{ display: 'flex', gap: 12, marginTop: 14 }}>
            {/* <Link to="/questionnaire" style={btnPrimaryLg}>Get Recommendations</Link>
            <Link to="/signup" style={btnOutline}>Create Account</Link> */}
          </div>
        </div>

        <div style={heroRight}>
          <img
            src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80"
            alt="Investment dashboard on laptop"
            style={heroImg}
          />
          <div style={imgShadow} />
        </div>
      </section>

      {/* HOW IT WORKS */}
      <h3 style={sectionTitle}>How Spread Wealth Works</h3>
      <div style={cardGrid}>
        <Card icon="₹"  title="Tell Us Your Goals"
              text="Answer a few questions about your investment amount in ₹, risk tolerance, and time horizon."/>
        <Card icon="🕒" title="Smart Analysis"
              text="Our algorithm analyzes 5-year historical data of Indian stocks to find the best matches."/>
        <Card icon="📊" title="Custom Portfolio"
              text="Receive a personalized allocation strategy optimized for your unique needs."/>
        <Card icon="🚀" title="Start Investing"
              text="Begin your journey with confidence using data-driven recommendations."/>
      </div>

      {/* WHY CHOOSE US */}
      <section style={whyWrap}>
        <h3 style={whyTitle}>Why Choose Spread Wealth?</h3>
        <div style={whyGrid}>
          <WhyCard
            img="https://cdn-icons-png.flaticon.com/512/1995/1995515.png"
            title="Beginner Friendly"
            text="No prior investment knowledge required. We guide you through the Indian stock market step by step."
          />
          <WhyCard
            img="https://cdn-icons-png.flaticon.com/512/1828/1828884.png"
            title="Data Driven"
            text="Our recommendations are based on historical performance of Indian equities and market analysis."
          />
          <WhyCard
            img="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            title="Personalized"
            text="Custom recommendations tailored to your unique financial situation and goals for the Indian market."
          />
        </div>
        <p style={whyNote}>
          © 2025 Spread Wealth. All data is for demonstration purposes only.<br/>
          Not financial advice. Always do your own research before investing in Indian markets.
        </p>
      </section>
    </div>
  )
}

/* ---------- Components ---------- */
function Card({ icon, title, text }) {
  return (
    <div style={card}>
      <div style={cardIcon}>{icon}</div>
      <div>
        <div style={cardTitle}>{title}</div>
        <div style={cardText}>{text}</div>
      </div>
    </div>
  )
}

function WhyCard({ img, title, text }) {
  return (
    <div style={whyCard}>
      <img src={img} alt={title} style={whyIcon}/>
      <h4 style={whyCardTitle}>{title}</h4>
      <p style={whyCardText}>{text}</p>
    </div>
  )
}

/* ---------- Styles ---------- */
const page = { width:'100%', margin:0, padding:'20px 40px', background:'#f8fafc', color:'#0f172a',
  fontFamily:'Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial', boxSizing:'border-box' }

const topBar = { display:'flex', justifyContent:'space-between', alignItems:'center' }
const brand = { margin:0, fontSize:40, fontWeight:800, color:'#22355f', letterSpacing:.2 }
const ctaRow = { display:'flex', gap:10 }
const subtitle = { textAlign:'center', color:'#667085', margin:'8px 0 18px', fontSize:16 }

/* HERO */
const heroWrap = { display:'grid', gridTemplateColumns:'1fr 1fr', gap:32, alignItems:'center', width:'100%' }
const heroLeft = { padding:0 }
const heroTitle = { fontSize:40, lineHeight:1.15, margin:'0 0 10px 0', color:'#1f2a44', fontWeight:700 }
const heroText = { color:'#4b5565', lineHeight:1.6, maxWidth:720, margin:'0 0 12px 0' }
const heroRight = { position:'relative' }
const heroImg = { display:'block', width:'100%', height:420, objectFit:'cover', borderRadius:14 }
const imgShadow = { position:'absolute', left:0, right:0, bottom:-8, height:20, borderRadius:14,
  boxShadow:'0 16px 40px rgba(0,0,0,.25)', pointerEvents:'none' }

/* SECTION */
const sectionTitle = { textAlign:'center', margin:'22px 0 14px', color:'#1f2a44', fontSize:22, fontWeight:800 }
const cardGrid = { display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(260px, 1fr))', gap:20, width:'100%' }
const card = { background:'#fff', borderRadius:12, border:'1px solid #e5e7eb', boxShadow:'0 10px 26px rgba(0,0,0,.08)',
  padding:16, display:'grid', gridTemplateColumns:'44px 1fr', gap:12, alignItems:'flex-start' }
const cardIcon = { width:40, height:40, borderRadius:999, background:'#eef2ff', color:'#274aa3',
  display:'grid', placeItems:'center', fontWeight:700, fontSize:18 }
const cardTitle = { fontWeight:700, marginBottom:6, color:'#1f2a44' }
const cardText  = { color:'#657289', fontSize:14, lineHeight:1.5 }

/* WHY CHOOSE */
const whyWrap = { background:'#f1f5f9', borderRadius:16, padding:'30px 20px', marginTop:40, textAlign:'center' }
const whyTitle = { fontSize:22, fontWeight:800, color:'#1f2a44', marginBottom:20 }
const whyGrid = { display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(240px, 1fr))', gap:20 }
const whyCard = { display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center', padding:16 }
const whyIcon = { width:70, height:70, borderRadius:'50%', marginBottom:12 }
const whyCardTitle = { fontWeight:700, fontSize:16, color:'#1f2a44', marginBottom:6 }
const whyCardText = { color:'#4b5565', fontSize:14, lineHeight:1.5 }
const whyNote = { marginTop:20, fontSize:12, color:'#6b7280' }

/* BUTTONS */
const btnBase = { display:'inline-block', textDecoration:'none', padding:'10px 14px', borderRadius:10,
  fontSize:14, lineHeight:1, border:'1px solid transparent', whiteSpace:'nowrap' }
const btnPrimary = { ...btnBase, background:'#274aa3', color:'#fff', borderColor:'#274aa3' }
const btnPrimaryLg = { ...btnPrimary, padding:'10px 18px' }
const btnOutline = { ...btnBase, background:'#fff', color:'#274aa3', borderColor:'#cdd6f6' }
const btnGhost = { ...btnBase, background:'#274aa3', color:'#fff', borderColor:'#274aa3' }
