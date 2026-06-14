import { useNavigate } from 'react-router-dom'

export default function Landing() {
  const navigate = useNavigate()
  return (
    <div>
      {/* HERO */}
      <div className="landing-hero">
        <div className="landing-badge">🇦🇪 Built for the UAE & GCC market</div>
        <h1>Instantly book cafes &<br /><span>restaurants nearby</span></h1>
        <p>The all-in-one platform for cafes and restaurants. Accept bookings, showcase your menu, and grow your business — all from one simple link.</p>
        <div className="landing-btns">
          <button className="land-btn-primary" onClick={() => navigate('/signup')}>List your cafe — it's free →</button>
          <button className="land-btn-sec" onClick={() => navigate('/sandsbistro')}>See a live example</button>
        </div>
        <div className="landing-stats">
          <div className="landing-stat"><div className="landing-stat-num">2 min</div><div className="landing-stat-label">Setup time</div></div>
          <div className="landing-stat"><div className="landing-stat-num">0 AED</div><div className="landing-stat-label">To get started</div></div>
          <div className="landing-stat"><div className="landing-stat-num">24/7</div><div className="landing-stat-label">Bookings while you sleep</div></div>
          <div className="landing-stat"><div className="landing-stat-num">∞</div><div className="landing-stat-label">Menu items</div></div>
        </div>
      </div>

      {/* PREVIEW */}
      <div className="landing-preview" style={{maxWidth:900,margin:'0 auto 80px'}}>
        <div className="landing-preview-bar">
          <div className="preview-dot" style={{background:'#ff5f57'}}></div>
          <div className="preview-dot" style={{background:'#febc2e'}}></div>
          <div className="preview-dot" style={{background:'#28c840'}}></div>
          <div className="preview-url">bookem.ae/sandsbistro</div>
        </div>
        <div className="preview-inner">
          <div className="preview-card">
            <div className="preview-card-img" style={{background:'#fff4f0'}}>☕</div>
            <div className="preview-card-name">Sands Bistro</div>
            <div className="preview-card-sub">Al Qasba, Sharjah · Open now</div>
            <div className="preview-card-btn">Reserve a table</div>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:12}}>
            <div className="preview-card" style={{padding:16}}>
              <div style={{fontSize:12,fontWeight:700,color:'#6b7280',marginBottom:8,textTransform:'uppercase',letterSpacing:'0.5px'}}>Today's bookings</div>
              {['12:00 PM · Ahmed · 2 guests','7:00 PM · Sara · 4 guests','8:30 PM · Khalid · 3 guests'].map((b,i) => (
                <div key={i} style={{fontSize:12,color:'#374151',padding:'6px 0',borderBottom:'1px solid #f3f4f6',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <span>{b}</span>
                  <span style={{fontSize:10,background:'#f0fdf4',color:'#16a34a',padding:'2px 8px',borderRadius:20,fontWeight:600}}>Confirmed</span>
                </div>
              ))}
            </div>
            <div className="preview-card" style={{padding:16,background:'#fff4f0',border:'1px solid rgba(255,107,53,0.2)'}}>
              <div style={{fontSize:13,fontWeight:700,color:'#FF6B35',marginBottom:4}}>Your page is live</div>
              <div style={{fontSize:12,color:'#6b7280'}}>bookem.ae/yourcafe</div>
            </div>
          </div>
        </div>
      </div>

      {/* FEATURES */}
      <div style={{textAlign:'center',padding:'0 32px 48px'}}>
        <div className="section-label">Everything you need</div>
        <div className="section-title" style={{maxWidth:500,margin:'0 auto 48px'}}>One platform. Every tool your cafe needs.</div>
      </div>
      <div className="landing-features">
        {[
          {icon:'📅',title:'Online reservations',desc:'Customers book a table in seconds from their phone. No phone calls, no paper. You get notified instantly.'},
          {icon:'🍽️',title:'Digital menu',desc:'Showcase your full menu with food photos, calories, protein info, and dietary labels — vegan, chicken, meat, seafood.'},
          {icon:'⚡',title:'Live in 2 minutes',desc:'Sign up, add your details, and share your link. Your page goes live at bookem.ae/yourcafe instantly.'},
          {icon:'📊',title:'Bookings dashboard',desc:'See all reservations in one place. Confirm, cancel, or reschedule with one tap. Never miss a booking.'},
          {icon:'🔔',title:'WhatsApp alerts',desc:'Get a WhatsApp notification the moment someone books. Customers get automatic confirmation too.'},
          {icon:'🇦🇪',title:'Built for UAE',desc:'UAE-first design. AED pricing, Friday hours, Arabic support coming soon. Made for the Gulf market.'},
        ].map((f,i) => (
          <div key={i} className="feat-card">
            <div className="feat-icon">{f.icon}</div>
            <div className="feat-title">{f.title}</div>
            <div className="feat-desc">{f.desc}</div>
          </div>
        ))}
      </div>

      {/* HOW IT WORKS */}
      <div className="landing-how" style={{textAlign:'center',maxWidth:'100%',padding:'0 32px 80px'}}>
        <div className="section-label">How it works</div>
        <div className="section-title">Up and running in minutes</div>
        <div className="how-steps">
          {[
            {num:1,title:'Create your account',desc:'Sign up free. No credit card needed. Enter your cafe name and you get a unique page link instantly.'},
            {num:2,title:'Add your menu & hours',desc:'Upload your menu items with photos, prices, calories, and dietary tags. Set your opening hours.'},
            {num:3,title:'Share your link',desc:'Post bookem.ae/yourcafe on Instagram, WhatsApp, Google Maps. Customers start booking immediately.'},
          ].map(s => (
            <div key={s.num} className="how-step">
              <div className="how-step-num">{s.num}</div>
              <div className="how-step-title">{s.title}</div>
              <div className="how-step-desc">{s.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{padding:'0 32px'}}>
        <div className="landing-cta">
          <h2>Ready to fill your tables?</h2>
          <p>Join cafes and restaurants across the UAE already using Bookem. First month completely free — no credit card required.</p>
          <button className="land-btn-white" onClick={() => navigate('/signup')}>Add your cafe for free →</button>
        </div>
      </div>

      {/* FOOTER */}
      <div className="landing-footer">
        <div className="landing-footer-logo">book<span>em</span></div>
        <p>© 2026 Bookem. Made with ❤️ for the UAE.</p>
      </div>
    </div>
  )
}
