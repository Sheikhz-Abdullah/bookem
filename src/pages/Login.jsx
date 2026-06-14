import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'

export default function Login() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin() {
    setLoading(true); setError('')
    const { error } = await signIn(email, password)
    setLoading(false)
    if (error) { setError('Wrong email or password. Please try again.'); return }
    navigate('/dashboard')
  }

  return (
    <div className="form-page">
      <div className="form-left">
        <div className="form-box">
          <div className="form-logo">book<span>em</span></div>
          <div className="form-title">Welcome back</div>
          <div className="form-sub">Don't have an account? <Link to="/signup">Sign up free</Link></div>
          {error && <div className="error-msg">{error}</div>}
          <div className="field"><label>Email address</label><input type="email" placeholder="you@yourcafe.com" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key==='Enter' && handleLogin()} /></div>
          <div className="field"><label>Password</label><input type="password" placeholder="Your password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key==='Enter' && handleLogin()} /></div>
          <button className="submit-btn" disabled={loading||!email||!password} onClick={handleLogin}>
            {loading ? 'Logging in...' : 'Log in to dashboard'}
          </button>
        </div>
      </div>
      <div className="form-right">
        <div style={{maxWidth:320,textAlign:'center'}}>
          <div style={{fontSize:40,marginBottom:20}}>☕</div>
          <div style={{fontSize:20,fontWeight:800,letterSpacing:'-0.3px',marginBottom:10,color:'#0f0f0f'}}>Manage your cafe from anywhere</div>
          <div style={{fontSize:14,color:'#6b7280',lineHeight:1.7}}>See bookings, update your menu, and manage your hours — all from your phone or laptop.</div>
        </div>
      </div>
    </div>
  )
}
