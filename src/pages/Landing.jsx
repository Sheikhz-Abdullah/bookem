import { useNavigate } from 'react-router-dom'

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="page">
      <div className="landing-hero">
        <h1>Your cafe deserves<br /><span>smarter bookings</span></h1>
        <p>Give your customers a beautiful booking page. Manage reservations, menus, and hours — all in one place. Set up in minutes.</p>
        <div className="landing-btns">
          <button className="land-btn-primary" onClick={() => navigate('/signup')}>
            Add your cafe — it's free
          </button>
          <button className="land-btn-sec" onClick={() => navigate('/sandsbistro')}>
            See a live example →
          </button>
        </div>
      </div>

      <div className="landing-features">
        <div className="feat-card">
          <div className="feat-icon">📅</div>
          <div className="feat-title">Online reservations</div>
          <div className="feat-desc">Customers book a table in seconds from their phone. You get notified instantly on WhatsApp.</div>
        </div>
        <div className="feat-card">
          <div className="feat-icon">🍽️</div>
          <div className="feat-title">Digital menu</div>
          <div className="feat-desc">Showcase your menu with photos, calories, protein info, and dietary tags. Update anytime.</div>
        </div>
        <div className="feat-card">
          <div className="feat-icon">⚡</div>
          <div className="feat-title">Live in 2 minutes</div>
          <div className="feat-desc">Sign up, add your menu, and share your link. Your page goes live at bookem.ae/yourcafe instantly.</div>
        </div>
        <div className="feat-card">
          <div className="feat-icon">📊</div>
          <div className="feat-title">Simple dashboard</div>
          <div className="feat-desc">See all bookings, confirm or cancel, manage your menu and hours from one clean screen.</div>
        </div>
        <div className="feat-card">
          <div className="feat-icon">🔔</div>
          <div className="feat-title">Instant alerts</div>
          <div className="feat-desc">Get a WhatsApp message every time someone books. Customers receive automatic confirmations too.</div>
        </div>
        <div className="feat-card">
          <div className="feat-icon">🇦🇪</div>
          <div className="feat-title">Built for UAE</div>
          <div className="feat-desc">UAE prayer times, Friday hours, AED pricing, and Arabic support. Made for the Gulf market.</div>
        </div>
      </div>

      <div className="landing-cta">
        <h2>Ready to get started?</h2>
        <p>Join cafes and restaurants across the UAE already using Bookem.<br />First month completely free.</p>
        <button className="land-btn-primary" onClick={() => navigate('/signup')}>
          Create your free page →
        </button>
      </div>
    </div>
  )
}
