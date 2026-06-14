import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../supabase'

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']
const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
const TIMES = ['8:00 AM','9:00 AM','10:00 AM','11:00 AM','12:00 PM','1:00 PM','2:00 PM','3:00 PM','5:00 PM','6:00 PM','7:00 PM','8:00 PM']

const DIET_LABELS = { chicken:'🍗 Chicken', meat:'🥩 Meat', vegan:'🌱 Vegan', veg:'🥗 Vegetarian', seafood:'🐟 Seafood' }
const DIET_CLASSES = { chicken:'diet-chicken', meat:'diet-meat', vegan:'diet-vegan', veg:'diet-veg', seafood:'diet-seafood' }

export default function CafePage() {
  const { slug } = useParams()
  const [cafe, setCafe] = useState(null)
  const [menuItems, setMenuItems] = useState([])
  const [bookedSlots, setBookedSlots] = useState([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [tab, setTab] = useState('book')
  const [menuFilter, setMenuFilter] = useState('all')
  const [booked, setBooked] = useState(false)
  const [bookingRef, setBookingRef] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [state, setState] = useState({
    guests: 1,
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
    day: null,
    time: null
  })
  const [form, setForm] = useState({ fname:'', lname:'', phone:'', notes:'' })

  useEffect(() => {
    async function load() {
      const { data: cafeData } = await supabase.from('cafes').select('*').eq('slug', slug).single()
      if (!cafeData) { setNotFound(true); setLoading(false); return }
      setCafe(cafeData)
      document.title = `${cafeData.name} — Bookem`
      const { data: menu } = await supabase.from('menu_items').select('*').eq('cafe_id', cafeData.id).eq('visible', true).order('category').order('created_at')
      setMenuItems(menu || [])
      setLoading(false)
    }
    load()
  }, [slug])

  // Load booked slots when date changes
  useEffect(() => {
    if (!cafe || !state.day) return
    const dateStr = `${state.year}-${String(state.month+1).padStart(2,'0')}-${String(state.day).padStart(2,'0')}`
    supabase.from('bookings')
      .select('time')
      .eq('cafe_id', cafe.id)
      .eq('date', dateStr)
      .neq('status', 'cancelled')
      .then(({ data }) => {
        // Count bookings per slot — mark full if 4+ bookings for same time
        const counts = {}
        ;(data || []).forEach(b => { counts[b.time] = (counts[b.time] || 0) + 1 })
        const full = Object.entries(counts).filter(([,c]) => c >= 4).map(([t]) => t)
        setBookedSlots(full)
      })
  }, [state.day, state.month, state.year, cafe])

  async function confirmBooking() {
    if (!state.day || !state.time || !form.fname || !form.phone) return
    setSubmitting(true)
    const ref = 'BK-' + Math.random().toString(36).substr(2,6).toUpperCase()
    const dateStr = `${state.year}-${String(state.month+1).padStart(2,'0')}-${String(state.day).padStart(2,'0')}`
    await supabase.from('bookings').insert({
      cafe_id: cafe.id,
      guest_name: `${form.fname} ${form.lname}`.trim(),
      guest_phone: form.phone,
      date: dateStr,
      time: state.time,
      guests: state.guests,
      notes: form.notes,
      status: 'pending',
      booking_ref: ref
    })
    setBookingRef(ref)
    setBooked(true)
    setSubmitting(false)
  }

  function renderCalendar() {
    const cells = []
    const today = new Date(); today.setHours(0,0,0,0)
    const first = new Date(state.year, state.month, 1).getDay()
    const total = new Date(state.year, state.month+1, 0).getDate()
    DAYS.forEach(d => cells.push(<div key={`h-${d}`} className="cal-hdr">{d}</div>))
    for (let i=0; i<first; i++) cells.push(<div key={`e-${i}`}></div>)
    for (let d=1; d<=total; d++) {
      const date = new Date(state.year, state.month, d)
      const isPast = date < today
      const isToday = date.getTime() === today.getTime()
      const isSel = state.day === d
      let cls = 'cal-day'
      if (isPast) cls += ' past'
      else if (isSel) cls += ' sel'
      else if (isToday) cls += ' today'
      cells.push(
        <div key={d} className={cls}
          onClick={isPast ? null : () => setState(s => ({...s, day:d, time:null}))}>
          {d}
        </div>
      )
    }
    return cells
  }

  const initials = cafe?.name ? cafe.name.split(' ').map(w=>w[0]).join('').substring(0,2).toUpperCase() : ''
  const filteredMenu = menuFilter === 'all' ? menuItems : menuItems.filter(i => i.diet === menuFilter)
  const menuCats = [...new Set(filteredMenu.map(i => i.category))]
  const gLabel = state.guests === 1 ? '1 guest' : `${state.guests} guests`
  const dLabel = state.day ? `${state.day} ${MONTHS[state.month]} ${state.year}` : null
  const canConfirm = state.day && state.time && form.fname && form.phone
  const hours = cafe?.hours ? JSON.parse(cafe.hours) : {}

  if (loading) return <div className="loading"><div className="spinner"></div></div>

  if (notFound) return (
    <div style={{background:'white',minHeight:'100vh'}}>
      <nav className="cust-nav">
        <div className="cust-nav-logo">book<span>em</span></div>
        <div className="cust-nav-tag">Powered by Bookem</div>
      </nav>
      <div className="not-found">
        <div style={{fontSize:48,marginBottom:16}}>🔍</div>
        <h2>Cafe not found</h2>
        <p>This page doesn't exist yet. Want to create one for your cafe?</p>
        <button className="land-btn-primary" onClick={() => window.location.href='/signup'}>Create your free page →</button>
      </div>
    </div>
  )

  return (
    <div style={{background:'#f9fafb', minHeight:'100vh'}}>
      <nav className="cust-nav">
        <div className="cust-nav-logo">book<span>em</span></div>
        <div className="cust-nav-tag">Powered by Bookem</div>
      </nav>

      <div className="cust-page">
        {/* HERO */}
        <div className="cust-hero">
          <div className="cust-cafe-row">
            <div className="cust-avatar">{initials}</div>
            <div>
              <div className="cust-name">{cafe.name}</div>
              <div className="cust-sub">
                <span className="open-dot"></span>
                {cafe.location}{cafe.location ? ' · ' : ''}Open now
              </div>
            </div>
          </div>
          <div className="cust-tags">
            {cafe.cuisine && <span className="cust-tag">{cafe.cuisine}</span>}
            {cafe.seating && <span className="cust-tag">{cafe.seating}</span>}
          </div>
        </div>

        {/* TABS */}
        <div className="cust-tabs">
          {[['book','Reserve a table'],['menu','Menu'],['info','Info & hours']].map(([id,label]) => (
            <div key={id} className={`cust-tab ${tab===id?'active':''}`} onClick={() => setTab(id)}>{label}</div>
          ))}
        </div>

        {/* BOOKING TAB */}
        {tab === 'book' && (
          <div className="cust-section active">
            {booked ? (
              <div className="success-screen">
                <div className="success-icon">✓</div>
                <h2>You're booked!</h2>
                <p style={{marginBottom:8}}>Confirmation sent to your WhatsApp.</p>
                <p>See you soon at <strong>{cafe.name}</strong>.</p>
                <div className="bk-ref">{bookingRef}</div>
                <p style={{fontSize:13,color:'#9ca3af',marginTop:8}}>Need to cancel? Call us directly.</p>
              </div>
            ) : (
              <>
                {/* GUESTS */}
                <div className="step-lbl">Number of guests</div>
                <div className="guests-grid">
                  {[1,2,3,4,5,6,7,8].map(n => (
                    <div key={n} className={`guest-btn ${state.guests===n?'sel':''}`}
                      onClick={() => setState(s => ({...s, guests:n}))}>
                      <span className="guest-num">{n}{n===8?'+':''}</span>
                      {n === 1 ? '1 guest' : `${n} guests`}
                    </div>
                  ))}
                </div>

                {/* DATE */}
                <div className="step-lbl">Choose a date</div>
                <div className="month-nav">
                  <div className="month-btn" onClick={() => setState(s => {
                    let m=s.month-1, y=s.year
                    if(m<0){m=11;y--}
                    return {...s, month:m, year:y, day:null, time:null}
                  })}>‹</div>
                  <div className="month-lbl">{MONTHS[state.month]} {state.year}</div>
                  <div className="month-btn" onClick={() => setState(s => {
                    let m=s.month+1, y=s.year
                    if(m>11){m=0;y++}
                    return {...s, month:m, year:y, day:null, time:null}
                  })}>›</div>
                </div>
                <div className="cal-grid">{renderCalendar()}</div>

                {/* TIMES */}
                <div className="step-lbl">Pick a time</div>
                <div className="times-grid">
                  {TIMES.map(t => {
                    const isFull = bookedSlots.includes(t)
                    return (
                      <div key={t}
                        className={`time-btn ${isFull ? 'full' : state.time===t ? 'sel' : ''}`}
                        onClick={isFull ? null : () => setState(s => ({...s, time:t}))}>
                        {t}
                        {isFull && <span className="full-lbl">full</span>}
                      </div>
                    )
                  })}
                </div>

                {/* DETAILS */}
                <div className="step-lbl">Your details</div>
                <div className="inp-row" style={{marginBottom:10}}>
                  <input className="cust-input" style={{marginBottom:0}} type="text" placeholder="First name *" value={form.fname} onChange={e=>setForm(f=>({...f,fname:e.target.value}))} />
                  <input className="cust-input" style={{marginBottom:0}} type="text" placeholder="Last name" value={form.lname} onChange={e=>setForm(f=>({...f,lname:e.target.value}))} />
                </div>
                <input className="cust-input" type="tel" placeholder="WhatsApp number (+971...) *" value={form.phone} onChange={e=>setForm(f=>({...f,phone:e.target.value}))} />
                <input className="cust-input" type="text" placeholder="Special requests (optional)" value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))} />

                {/* SUMMARY */}
                <div className="step-lbl" style={{marginTop:16}}>Booking summary</div>
                <div className="summary-box">
                  {[
                    ['Guests', gLabel],
                    dLabel && ['Date', dLabel],
                    state.time && ['Time', state.time],
                    form.fname && ['Name', `${form.fname} ${form.lname}`.trim()],
                    form.phone && ['Phone', form.phone],
                  ].filter(Boolean).map(([l,v]) => (
                    <div key={l} className="sum-row">
                      <span className="sum-lbl">{l}</span>
                      <span className="sum-val">{v}</span>
                    </div>
                  ))}
                  {!dLabel && <div className="sum-empty">Select a date and time above to continue</div>}
                </div>

                <button className="confirm-btn" disabled={!canConfirm || submitting} onClick={confirmBooking}>
                  {submitting ? 'Confirming your booking...' : 'Confirm reservation'}
                </button>
              </>
            )}
          </div>
        )}

        {/* MENU TAB */}
        {tab === 'menu' && (
          <div className="cust-section active">
            <div className="menu-filter-bar">
              {[['all','All items'],['chicken','🍗 Chicken'],['meat','🥩 Meat'],['vegan','🌱 Vegan'],['veg','🥗 Vegetarian'],['seafood','🐟 Seafood']].map(([f,label]) => (
                <button key={f} className={`mf-btn ${menuFilter===f?'active':''}`} onClick={() => setMenuFilter(f)}>{label}</button>
              ))}
            </div>
            {menuItems.length === 0 && (
              <div style={{textAlign:'center',padding:'48px 0',color:'#9ca3af',fontSize:14}}>Menu coming soon</div>
            )}
            {menuCats.map(cat => (
              <div key={cat}>
                <div className="menu-cat-hdr">{cat}</div>
                {filteredMenu.filter(i=>i.category===cat).map(item => (
                  <div key={item.id} className="menu-item-card">
                    <div className="menu-emoji">{item.emoji || '🍽️'}</div>
                    <div className="menu-body">
                      <div className="menu-name-price">
                        <div className="menu-item-name">
                          {item.name}
                          {item.badge && <span className="item-badge">{item.badge}</span>}
                        </div>
                        <div className="menu-item-price">{item.price} AED</div>
                      </div>
                      {item.description && <div className="menu-item-desc">{item.description}</div>}
                      <div className="menu-tags">
                        {item.diet && <span className={`diet-tag ${DIET_CLASSES[item.diet]||''}`}>{DIET_LABELS[item.diet]||item.diet}</span>}
                        {item.calories > 0 && <><div className="macro-sep"></div><div className="macro">🔥 <strong>{item.calories}</strong> kcal</div></>}
                        {item.protein > 0 && <><div className="macro-sep"></div><div className="macro">💪 <strong>{item.protein}g</strong> protein</div></>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* INFO TAB */}
        {tab === 'info' && (
          <div className="cust-section active">
            {cafe.location && (
              <div className="info-block">
                <div className="info-lbl">Address</div>
                <div className="info-val">{cafe.location}</div>
                {cafe.maps_link && (
                  <a href={cafe.maps_link} target="_blank" rel="noopener noreferrer"
                    style={{display:'inline-flex',alignItems:'center',gap:6,marginTop:10,background:'#f0fdf4',border:'1px solid #bbf7d0',borderRadius:8,padding:'8px 14px',fontSize:13,color:'#16a34a',fontWeight:600,textDecoration:'none'}}>
                    📍 Open in Google Maps
                  </a>
                )}
              </div>
            )}
            {cafe.phone && (
              <div className="info-block">
                <div className="info-lbl">Contact</div>
                <div className="info-val">
                  <a href={`tel:${cafe.phone}`} style={{color:'inherit'}}>{cafe.phone}</a>
                </div>
              </div>
            )}
            {cafe.description && (
              <div className="info-block">
                <div className="info-lbl">About</div>
                <div className="info-val">{cafe.description}</div>
              </div>
            )}
            {Object.keys(hours).length > 0 && (
              <div className="info-block">
                <div className="info-lbl">Opening hours</div>
                {Object.entries(hours).map(([day, h]) => h.enabled && (
                  <div key={day} className="hr-row">
                    <span className="hr-day">{day}</span>
                    <span className="hr-time">{h.open} – {h.close}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
