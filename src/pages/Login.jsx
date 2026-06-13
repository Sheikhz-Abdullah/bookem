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
    setLoading(true)
    setError('')
    const { error } = await signIn(email, password)
    setLoading(false)
    if (error) { setError('Wrong email or password. Try again.'); return }
    navigate('/dashboard')
  }

  return (
    <div className="form-page">
      <div className="form-box">
        <div className="form-title">Welcome back</div>
        <div className="form-sub">New to Bookem? <Link to="/signup">Create a free account</Link></div>
        {error && <div className="error-msg">{error}</div>}
        <div className="field">
          <label>Email address</label>
          <input type="email" placeholder="you@yourcafe.com" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleLogin()} />
        </div>
        <div className="field">
          <label>Password</label>
          <input type="password" placeholder="Your password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleLogin()} />
        </div>
        <button className="submit-btn" disabled={loading || !email || !password} onClick={handleLogin}>
          {loading ? 'Logging in...' : 'Log in to dashboard'}
        </button>
      </div>
    </div>
  )
}
