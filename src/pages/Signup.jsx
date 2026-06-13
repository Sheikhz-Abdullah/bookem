import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'

export default function Signup() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    email: '', password: '',
    name: '', slug: '', location: '', phone: '',
    cuisine: 'Cafe & Bistro', seating: 'Indoor & Outdoor', description: ''
  })

  function update(field, value) {
    setForm(f => {
      const updated = { ...f, [field]: value }
      if (field === 'name') {
        updated.slug = value.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 30)
      }
      return updated
    })
  }

  async function handleSubmit() {
    setLoading(true)
    setError('')
    const { error } = await signUp(form.email, form.password, {
      name: form.name,
      slug: form.slug,
      location: form.location,
      phone: form.phone,
      cuisine: form.cuisine,
      seating: form.seating,
      description: form.description,
      hours: JSON.stringify({
        Saturday: { open: '08:00', close: '23:00', enabled: true },
        Sunday: { open: '08:00', close: '23:00', enabled: true },
        Monday: { open: '08:00', close: '23:00', enabled: true },
        Tuesday: { open: '08:00', close: '23:00', enabled: true },
        Wednesday: { open: '08:00', close: '23:00', enabled: true },
        Thursday: { open: '08:00', close: '23:00', enabled: true },
        Friday: { open: '12:00', close: '23:00', enabled: true },
      })
    })
    setLoading(false)
    if (error) { setError(error.message); return }
    navigate('/dashboard')
  }

  return (
    <div className="form-page">
      <div className="form-box">
        {step === 1 && (
          <>
            <div className="form-title">Create your account</div>
            <div className="form-sub">Already have an account? <Link to="/login">Log in</Link></div>
            {error && <div className="error-msg">{error}</div>}
            <div className="field">
              <label>Email address</label>
              <input type="email" placeholder="you@yourcafe.com" value={form.email} onChange={e => update('email', e.target.value)} />
            </div>
            <div className="field">
              <label>Password</label>
              <input type="password" placeholder="At least 8 characters" value={form.password} onChange={e => update('password', e.target.value)} />
            </div>
            <button className="submit-btn" onClick={() => { if (form.email && form.password.length >= 6) setStep(2); else setError('Please fill in all fields'); }}>
              Continue →
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <div className="form-title">Set up your cafe</div>
            <div className="form-sub">This is what customers will see on your booking page.</div>
            {error && <div className="error-msg">{error}</div>}
            <div className="field">
              <label>Cafe name</label>
              <input type="text" placeholder="e.g. Sands Bistro" value={form.name} onChange={e => update('name', e.target.value)} />
            </div>
            <div className="field">
              <label>Your page URL</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', whiteSpace: 'nowrap' }}>bookem.ae/</span>
                <input type="text" placeholder="sandsbistro" value={form.slug} onChange={e => update('slug', e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ''))} />
              </div>
            </div>
            <div className="field">
              <label>Location</label>
              <input type="text" placeholder="e.g. Al Qasba, Sharjah" value={form.location} onChange={e => update('location', e.target.value)} />
            </div>
            <div className="field">
              <label>WhatsApp number (for booking alerts)</label>
              <input type="tel" placeholder="+971 50 000 0000" value={form.phone} onChange={e => update('phone', e.target.value)} />
            </div>
            <div className="field-row">
              <div className="field">
                <label>Cuisine type</label>
                <select value={form.cuisine} onChange={e => update('cuisine', e.target.value)}>
                  <option>Cafe & Bistro</option>
                  <option>Arabic</option>
                  <option>Italian</option>
                  <option>Asian</option>
                  <option>Burger & Grill</option>
                  <option>Seafood</option>
                  <option>International</option>
                  <option>Bakery</option>
                </select>
              </div>
              <div className="field">
                <label>Seating</label>
                <select value={form.seating} onChange={e => update('seating', e.target.value)}>
                  <option>Indoor only</option>
                  <option>Outdoor only</option>
                  <option>Indoor & Outdoor</option>
                </select>
              </div>
            </div>
            <div className="field">
              <label>Short description (optional)</label>
              <textarea placeholder="Tell customers what makes your place special..." value={form.description} onChange={e => update('description', e.target.value)} />
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="submit-btn" style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)', flex: 1, marginTop: 8 }} onClick={() => setStep(1)}>← Back</button>
              <button className="submit-btn" style={{ flex: 2 }} disabled={loading || !form.name || !form.slug} onClick={handleSubmit}>
                {loading ? 'Creating your page...' : 'Launch my cafe page →'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
