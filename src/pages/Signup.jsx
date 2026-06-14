import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'

export default function Signup() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ email:'', password:'', name:'', slug:'', location:'', phone:'', cuisine:'Cafe & Bistro', seating:'Indoor & Outdoor', description:'' })

  function update(field, value) {
    setForm(f => {
      const u = { ...f, [field]: value }
      if (field === 'name') u.slug = value.toLowerCase().replace(/[^a-z0-9]/g,'').substring(0,30)
      return u
    })
  }

  async function handleSubmit() {
    setLoading(true); setError('')
    const { error } = await signUp(form.email, form.password, {
      name: form.name, slug: form.slug, location: form.location,
      phone: form.phone, cuisine: form.cuisine, seating: form.seating,
      description: form.description,
      hours: JSON.stringify({
        Saturday:{open:'08:00',close:'23:00',enabled:true}, Sunday:{open:'08:00',close:'23:00',enabled:true},
        Monday:{open:'08:00',close:'23:00',enabled:true}, Tuesday:{open:'08:00',close:'23:00',enabled:true},
        Wednesday:{open:'08:00',close:'23:00',enabled:true}, Thursday:{open:'08:00',close:'23:00',enabled:true},
        Friday:{open:'12:00',close:'23:00',enabled:true},
      })
    })
    setLoading(false)
    if (error) { setError(error.message); return }
    navigate('/dashboard')
  }

  return (
    <div className="form-page">
      <div className="form-left">
        <div className="form-box">
          <div className="form-logo">book<span>em</span></div>
          <div className="step-indicator">
            <div className={`step-dot ${step >= 1 ? 'active' : ''}`}></div>
            <div className={`step-dot ${step >= 2 ? 'active' : ''}`}></div>
          </div>

          {step === 1 && (
            <>
              <div className="form-title">Create your account</div>
              <div className="form-sub">Already have an account? <Link to="/login">Log in</Link></div>
              {error && <div className="error-msg">{error}</div>}
              <div className="field"><label>Email address</label><input type="email" placeholder="you@yourcafe.com" value={form.email} onChange={e => update('email', e.target.value)} /></div>
              <div className="field"><label>Password</label><input type="password" placeholder="At least 6 characters" value={form.password} onChange={e => update('password', e.target.value)} /></div>
              <button className="submit-btn" onClick={() => { if(form.email && form.password.length >= 6) { setError(''); setStep(2) } else setError('Please enter a valid email and password.') }}>Continue →</button>
            </>
          )}

          {step === 2 && (
            <>
              <div className="form-title">Set up your profile</div>
              <div className="form-sub">This is what your customers will see on your booking page.</div>
              {error && <div className="error-msg">{error}</div>}
              <div className="field">
                <label>Cafe or restaurant name</label>
                <input type="text" placeholder="e.g. Sands Bistro" value={form.name} onChange={e => update('name', e.target.value)} />
              </div>
              <div className="field">
                <label>Your page URL</label>
                <div style={{display:'flex',alignItems:'center',background:'white',border:'1.5px solid #e5e7eb',borderRadius:8,overflow:'hidden'}}>
                  <span style={{padding:'11px 12px',background:'#f9fafb',borderRight:'1px solid #e5e7eb',fontSize:13,color:'#6b7280',whiteSpace:'nowrap',fontWeight:500}}>bookem.ae/</span>
                  <input style={{border:'none',borderRadius:0,boxShadow:'none',flex:1,outline:'none',padding:'11px 12px',fontSize:14,fontFamily:'inherit'}} type="text" placeholder="sandsbistro" value={form.slug} onChange={e => update('slug', e.target.value.toLowerCase().replace(/[^a-z0-9]/g,''))} />
                </div>
                {form.slug && <div className="slug-preview">✓ bookem.ae/{form.slug}</div>}
              </div>
              <div className="field"><label>Location</label><input type="text" placeholder="e.g. Al Qasba, Sharjah" value={form.location} onChange={e => update('location', e.target.value)} /></div>
              <div className="field"><label>WhatsApp number</label><input type="tel" placeholder="+971 50 000 0000" value={form.phone} onChange={e => update('phone', e.target.value)} /></div>
              <div className="field-row">
                <div className="field"><label>Type</label>
                  <select value={form.cuisine} onChange={e => update('cuisine', e.target.value)}>
                    {['Cafe & Bistro','Arabic','Italian','Asian','Burger & Grill','Seafood','International','Bakery','Brunch'].map(c=><option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="field"><label>Seating</label>
                  <select value={form.seating} onChange={e => update('seating', e.target.value)}>
                    {['Indoor only','Outdoor only','Indoor & Outdoor'].map(s=><option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div className="field"><label>Short description <span style={{fontWeight:400,color:'#9ca3af'}}>(optional)</span></label><textarea placeholder="Tell customers what makes your place special..." value={form.description} onChange={e => update('description', e.target.value)} /></div>
              <div style={{display:'flex',gap:10}}>
                <button style={{flex:1,background:'#f9fafb',border:'1.5px solid #e5e7eb',borderRadius:8,padding:'13px',fontSize:14,fontWeight:600,color:'#6b7280',cursor:'pointer',fontFamily:'inherit'}} onClick={() => setStep(1)}>← Back</button>
                <button className="submit-btn" style={{flex:2,marginTop:0}} disabled={loading||!form.name||!form.slug} onClick={handleSubmit}>
                  {loading ? 'Creating your page...' : 'Launch my page →'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="form-right">
        <div style={{maxWidth:320}}>
          <div style={{fontSize:14,fontWeight:700,color:'#0f0f0f',marginBottom:4}}>What you get with Bookem</div>
          <div style={{fontSize:13,color:'#6b7280',marginBottom:20}}>Everything your cafe needs to accept bookings online.</div>
          <div className="form-preview-card">
            {[
              {icon:'📅',text:'Online booking page at bookem.ae/yourcafe'},
              {icon:'🍽️',text:'Full digital menu with calories & dietary tags'},
              {icon:'🔔',text:'WhatsApp alerts for every new booking'},
              {icon:'📊',text:'Dashboard to manage all reservations'},
              {icon:'⚡',text:'Live in under 2 minutes'},
            ].map((item,i) => (
              <div key={i} className="form-preview-item">
                <div className="form-preview-icon">{item.icon}</div>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
          <div style={{marginTop:16,padding:14,background:'#f0fdf4',border:'1px solid #bbf7d0',borderRadius:10,fontSize:13,color:'#16a34a',fontWeight:600}}>
            ✓ First month completely free
          </div>
        </div>
      </div>
    </div>
  )
}
