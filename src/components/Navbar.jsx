import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../AuthContext'

export default function Navbar() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // Hide navbar on cafe pages (/:slug) except known routes
  const knownRoutes = ['/', '/signup', '/login', '/dashboard']
  const isKnown = knownRoutes.includes(location.pathname)
  const isCafePage = !isKnown && location.pathname.length > 1

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
            <Link to="/signup"><button className="nav-btn">Get started free</button></Link>
          </>
        )}
      </div>
    </nav>
  )
}
