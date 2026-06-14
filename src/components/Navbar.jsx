import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../AuthContext'

export default function Navbar() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const knownRoutes = ['/', '/signup', '/login', '/dashboard']
  const isCafePage = !knownRoutes.includes(location.pathname) && location.pathname.length > 1
  if (isCafePage) return null

  async function handleSignOut() {
    await signOut()
    navigate('/')
  }

  return (
    <nav className="nav">
      <Link to="/" className="nav-logo">book<span>em</span></Link>
      <div className="nav-links">
        {user ? (
          <>
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
            <button className="nav-btn" onClick={handleSignOut}>Sign out</button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">Log in</Link>
            <Link to="/signup"><button className="nav-btn-outline" style={{marginRight:6}}>Log in</button></Link>
            <Link to="/signup"><button className="nav-btn">List your business</button></Link>
          </>
        )}
      </div>
    </nav>
  )
}
