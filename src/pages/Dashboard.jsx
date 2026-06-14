import { useState, useEffect } from 'react'
import { useAuth } from '../AuthContext'
import { supabase } from '../supabase'

const DAYS = ['Saturday','Sunday','Monday','Tuesday','Wednesday','Thursday','Friday']

export default function Dashboard() {
  const { cafe, refreshCafe, signOut } = useAuth()
  const [panel, setPanel] = useState('bookings')
  const [bookings, setBookings] = useState([])
  const [menuItems, setMenuItems] = useState([])
  const [filter, setFilter] = useState('all')
  const [hours, setHours] = useState({})
  const [showModal, setShowModal] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [saving, setSaving] = useState(false)
  const [settingsForm, setSettingsForm] = useState({})
  const [newItem, setNewItem] = useState({name:'',category:'',description:'',price:'',calories:'',protein:'',diet:'veg',emoji:'🍽️',badge:''})

  useEffect(() => {
    if (cafe) {
      loadBookings(); loadMenu()
      setHours(cafe.hours ? JSON.parse(cafe.hours) : {})
      setSettingsForm({name:cafe.name||'',location:cafe.location||'',phone:cafe.phone||'',description:cafe.description||'',cuisine:cafe.cuisine||'',seating:cafe.seating||'',maps_link:cafe.maps_link||''})
    }
  }, [cafe])

  async function loadBookings() {
    const { data } = await supabase.from('bookings').select('*').eq('cafe_id', cafe.id).order('created_at', {ascending:false})
    setBookings(data || [])
  }
  async function loadMenu() {
    const { data } = await supabase.from('menu_items').select('*').eq('cafe_id', cafe.id).order('category').order('created_at')
    setMenuItems(data || [])
  }
  async function updateBookingStatus(id, status) {
    await supabase.from('bookings').update({status}).eq('id', id)
    setBookings(b => b.map(bk => bk.id===id ? {...bk,status} : bk))
  }
  async function saveItem() {
    setSaving(true)
    const payload = {...newItem, price:parseFloat(newItem.price), calories:parseInt(newItem.calories)||0, protein:parseInt(newItem.protein)||0}
    if (editItem?.id) await supabase.from('menu_items').update(payload).eq('id', editItem.id)
    else await supabase.from('menu_items').insert({...payload, cafe_id:cafe.id, visible:true})
    await loadMenu(); setSaving(false); setShowModal(false); setEditItem(null)
    setNewItem({name:'',category:'',description:'',price:'',calories:'',protein:'',diet:'veg',emoji:'🍽️',badge:''})
  }
  async function toggleVisibility(item) {
    await supabase.from('menu_items').update({visible:!item.visible}).eq('id',item.id)
    setMenuItems(m => m.map(i => i.id===item.id ? {...i,visible:!i.visible} : i))
  }
  async function deleteItem(id) {
    if(!confirm('Delete this item?')) return
    await supabase.from('menu_items').delete().eq('id',id)
    setMenuItems(m => m.filter(i => i.id!==id))
  }
  function openEdit(item) {
    setEditItem(item)
    setNewItem({name:item.name,category:item.category,description:item.description||'',price:item.price,calories:item.calories||'',protein:item.protein||'',diet:item.diet||'veg',emoji:item.emoji||'🍽️',badge:item.badge||''})
    setShowModal(true)
  }
  async function saveHours() {
    await supabase.from('cafes').update({hours:JSON.stringify(hours)}).eq('id',cafe.id)
    alert('Hours saved!')
  }
  async function saveSettings() {
    setSaving(true)
    await supabase.from('cafes').update(settingsForm).eq('id',cafe.id)
    await refreshCafe(); setSaving(false); alert('Settings saved!')
  }

  const pending = bookings.filter(b=>b.status==='pending').length
  const todayStr = new Date().toISOString().split('T')[0]
  const todayBks = bookings.filter(b=>b.date===todayStr)
  const todayGuests = todayBks.reduce((s,b)=>s+b.guests,0)
  const filtered = filter==='all' ? bookings : bookings.filter(b=>b.status===filter)
  const cats = [...new Set(menuItems.map(i=>i.category))]
  const initials = cafe?.name ? cafe.name.split(' ').map(w=>w[0]).join('').substring(0,2).toUpperCase() : 'CA'

  const navItems = [
    {id:'bookings',label:'Bookings',icon:'📅',badge:pending>0?pending:null},
    {id:'menu',label:'Menu',icon:'🍽️'},
    {id:'hours',label:'Hours',icon:'🕐'},
    {id:'settings',label:'Settings',icon:'⚙️'},
  ]

  return (
    <div className="dash">
      <div className="dash-side">
        <div className="dash-cafe-block">
          <div className="dash-cafe-avatar">{initials}</div>
          <div className="dash-cafe-name">{cafe?.name}</div>
          <div className="dash-cafe-url">bookem.ae/{cafe?.slug}</div>
        </div>
        <div className="dash-nav">
          {navItems.map(item => (
            <div key={item.id} className={`dash-nav-item ${panel===item.id?'active':''}`} onClick={()=>setPanel(item.id)}>
              <span className="dash-nav-icon">{item.icon}</span>
              {item.label}
              {item.badge && <span className="dash-nav-badge">{item.badge}</span>}
            </div>
          ))}
        </div>
        <div className="dash-side-bottom">
          <a href={`/${cafe?.slug}`} target="_blank" className="dash-view-link">View my page ↗</a>
          <button className="dash-signout" onClick={signOut}>Sign out</button>
        </div>
      </div>

      <div className="dash-main">

        {/* BOOKINGS */}
        {panel==='bookings' && (
          <div className="dash-panel active">
            <div className="dash-topbar">
              <div>
                <div className="dash-page-title">Bookings</div>
                <div className="dash-page-sub">{new Date().toLocaleDateString('en-AE',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}</div>
              </div>
            </div>
            <div className="stats-grid">
              <div className="stat-card"><div className="stat-label">Today</div><div className="stat-val">{todayBks.length}</div><div className="stat-sub">reservations</div></div>
              <div className="stat-card"><div className="stat-label">Today's guests</div><div className="stat-val">{todayGuests}</div><div className="stat-sub">expected</div></div>
              <div className="stat-card"><div className="stat-label">Total bookings</div><div className="stat-val">{bookings.length}</div><div className="stat-sub">all time</div></div>
              <div className="stat-card"><div className="stat-label">Pending</div><div className="stat-val stat-warn">{pending}</div><div className="stat-sub">need action</div></div>
            </div>
            <div className="filter-row">
              {['all','pending','confirmed','cancelled'].map(f=>(
                <button key={f} className={`filter-btn ${filter===f?'active':''}`} onClick={()=>setFilter(f)}>{f.charAt(0).toUpperCase()+f.slice(1)}</button>
              ))}
            </div>
            <div className="table-wrap">
              <div className="table-head">
                <div className="th">Guest</div><div className="th">Date</div>
                <div className="th">Time</div><div className="th">Guests</div><div className="th">Status</div>
              </div>
              {filtered.length===0 && (
                <div className="empty-state">
                  <div className="empty-state-icon">📭</div>
                  <h3>No bookings yet</h3>
                  <p>Share your booking page link and customers will start reserving tables.</p>
                </div>
              )}
              {filtered.map(b => (
                <div key={b.id} className="t-row">
                  <div>
                    <div className="t-name">{b.guest_name}{b.notes&&<span style={{fontSize:12,color:'#d97706',fontWeight:500}}> · {b.notes}</span>}</div>
                    <div className="t-sub">{b.guest_phone}</div>
                  </div>
                  <div className="t-cell">{b.date}</div>
                  <div className="t-cell">{b.time}</div>
                  <div className="t-cell">{b.guests} guest{b.guests>1?'s':''}</div>
                  <div>
                    <span className={`status s-${b.status}`}>{b.status.charAt(0).toUpperCase()+b.status.slice(1)}</span>
                    <div className="row-actions">
                      {b.status==='pending'&&<><button className="act-btn act-confirm" onClick={()=>updateBookingStatus(b.id,'confirmed')}>Confirm</button><button className="act-btn act-cancel" onClick={()=>updateBookingStatus(b.id,'cancelled')}>Cancel</button></>}
                      {b.status==='confirmed'&&<button className="act-btn act-cancel" onClick={()=>updateBookingStatus(b.id,'cancelled')}>Cancel</button>}
                      {b.status==='cancelled'&&<button className="act-btn" onClick={()=>updateBookingStatus(b.id,'confirmed')}>Restore</button>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MENU */}
        {panel==='menu' && (
          <div className="dash-panel active">
            <div className="dash-topbar">
              <div><div className="dash-page-title">Menu</div><div className="dash-page-sub">{menuItems.length} items across {cats.length} categories</div></div>
              <button className="dash-btn" onClick={()=>{setEditItem(null);setNewItem({name:'',category:'',description:'',price:'',calories:'',protein:'',diet:'veg',emoji:'🍽️',badge:''});setShowModal(true)}}>+ Add item</button>
            </div>
            {cats.length===0 && (
              <div className="empty-state">
                <div className="empty-state-icon">🍽️</div>
                <h3>No menu items yet</h3>
                <p>Add your first menu item so customers can see what you serve.</p>
                <button className="dash-btn" onClick={()=>setShowModal(true)}>+ Add first item</button>
              </div>
            )}
            {cats.map(cat=>(
              <div key={cat}>
                <div className="menu-section-title"><span>{cat}</span><button onClick={()=>{setEditItem(null);setNewItem(n=>({...n,category:cat}));setShowModal(true)}}>+ Add item</button></div>
                <div className="menu-grid">
                  {menuItems.filter(i=>i.category===cat).map(item=>(
                    <div key={item.id} className={`menu-card-edit ${!item.visible?'hidden':''}`}>
                      <div className="mc-emoji">{item.emoji}</div>
                      <div className="mc-name">{item.name}</div>
                      <div className="mc-meta">{item.calories?`${item.calories} kcal · ${item.protein}g protein`:''}</div>
                      <div className="mc-price">{item.price} AED</div>
                      <div className="mc-footer">
                        <button className="mc-btn" onClick={()=>openEdit(item)}>Edit</button>
                        <span style={{color:'#e5e7eb'}}>·</span>
                        <button className="mc-btn" style={{color:item.visible?'#d97706':'#16a34a'}} onClick={()=>toggleVisibility(item)}>{item.visible?'Hide':'Show'}</button>
                        <span style={{color:'#e5e7eb'}}>·</span>
                        <button className="mc-btn danger" onClick={()=>deleteItem(item.id)}>Delete</button>
                      </div>
                    </div>
                  ))}
                  <div className="add-item-card" onClick={()=>{setEditItem(null);setNewItem(n=>({...n,category:cat}));setShowModal(true)}}>
                    <div className="add-item-card-icon">+</div>Add item
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* HOURS */}
        {panel==='hours' && (
          <div className="dash-panel active">
            <div className="dash-topbar">
              <div><div className="dash-page-title">Opening hours</div><div className="dash-page-sub">Control when customers can make bookings</div></div>
              <button className="dash-btn" onClick={saveHours}>Save hours</button>
            </div>
            <div className="settings-block">
              {DAYS.map(day=>{
                const h = hours[day]||{open:'08:00',close:'23:00',enabled:true}
                return (
                  <div key={day} className="hours-row">
                    <div className="hours-day">{day}</div>
                    <div className="hours-inputs">
                      <input className="hours-input" type="time" value={h.open} disabled={!h.enabled} onChange={e=>setHours(p=>({...p,[day]:{...h,open:e.target.value}}))} />
                      <span className="hours-sep">to</span>
                      <input className="hours-input" type="time" value={h.close} disabled={!h.enabled} onChange={e=>setHours(p=>({...p,[day]:{...h,close:e.target.value}}))} />
                    </div>
                    <label className="toggle"><input type="checkbox" checked={h.enabled} onChange={e=>setHours(p=>({...p,[day]:{...h,enabled:e.target.checked}}))}/><span className="toggle-slider"></span></label>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* SETTINGS */}
        {panel==='settings' && (
          <div className="dash-panel active">
            <div className="dash-topbar">
              <div><div className="dash-page-title">Settings</div><div className="dash-page-sub">Manage your cafe profile</div></div>
              <button className="dash-btn" disabled={saving} onClick={saveSettings}>{saving?'Saving...':'Save changes'}</button>
            </div>
            <div className="settings-block">
              <div className="settings-title">Cafe profile</div>
              <div className="field"><label>Cafe name</label><input type="text" value={settingsForm.name||''} onChange={e=>setSettingsForm(f=>({...f,name:e.target.value}))}/></div>
              <div className="field-row">
                <div className="field"><label>Phone (WhatsApp)</label><input type="tel" value={settingsForm.phone||''} onChange={e=>setSettingsForm(f=>({...f,phone:e.target.value}))}/></div>
                <div className="field"><label>Location</label><input type="text" value={settingsForm.location||''} onChange={e=>setSettingsForm(f=>({...f,location:e.target.value}))}/></div>
              </div>
              <div className="field"><label>Description</label><textarea value={settingsForm.description||''} onChange={e=>setSettingsForm(f=>({...f,description:e.target.value}))}/></div>
              <div className="field"><label>Google Maps Link <span style={{fontWeight:400,color:'#9ca3af'}}>(optional)</span></label><input type="url" placeholder="https://maps.google.com/..." value={settingsForm.maps_link||''} onChange={e=>setSettingsForm(f=>({...f,maps_link:e.target.value}))}/><div className="field-hint">Paste your Google Maps link — customers will see an "Open in Maps" button on your page.</div></div>
              <div className="field-row">
                <div className="field"><label>Cuisine type</label><select value={settingsForm.cuisine||''} onChange={e=>setSettingsForm(f=>({...f,cuisine:e.target.value}))}>
                  {['Cafe & Bistro','Arabic','Italian','Asian','Burger & Grill','Seafood','International','Bakery','Brunch'].map(c=><option key={c}>{c}</option>)}</select></div>
                <div className="field"><label>Seating</label><select value={settingsForm.seating||''} onChange={e=>setSettingsForm(f=>({...f,seating:e.target.value}))}>
                  {['Indoor only','Outdoor only','Indoor & Outdoor'].map(s=><option key={s}>{s}</option>)}</select></div>
              </div>
            </div>
            <div className="settings-block">
              <div className="settings-title">Your booking page</div>
              <div style={{display:'flex',alignItems:'center',gap:12}}>
                <div style={{flex:1,background:'#f9fafb',border:'1px solid #e5e7eb',borderRadius:8,padding:'11px 14px',fontSize:14,color:'#FF6B35',fontWeight:600}}>bookem.ae/{cafe?.slug}</div>
                <button className="dash-btn-outline" onClick={()=>{navigator.clipboard.writeText(`https://bookem.ae/${cafe?.slug}`);alert('Link copied!')}}>Copy</button>
                <a href={`/${cafe?.slug}`} target="_blank"><button className="dash-btn-outline">Open ↗</button></a>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setShowModal(false)}>
          <div className="modal">
            <div className="modal-title">{editItem?'Edit menu item':'Add menu item'}</div>
            <div className="field-row">
              <div className="field"><label>Item name</label><input type="text" value={newItem.name} placeholder="e.g. Shakshuka" onChange={e=>setNewItem(n=>({...n,name:e.target.value}))}/></div>
              <div className="field"><label>Emoji icon</label><input type="text" value={newItem.emoji} placeholder="🍽️" onChange={e=>setNewItem(n=>({...n,emoji:e.target.value}))}/></div>
            </div>
            <div className="field"><label>Category</label><input type="text" value={newItem.category} placeholder="e.g. Breakfast, Mains, Drinks" onChange={e=>setNewItem(n=>({...n,category:e.target.value}))}/></div>
            <div className="field"><label>Description</label><textarea value={newItem.description} placeholder="Short description..." onChange={e=>setNewItem(n=>({...n,description:e.target.value}))}/></div>
            <div className="field-row">
              <div className="field"><label>Price (AED)</label><input type="number" value={newItem.price} placeholder="0" onChange={e=>setNewItem(n=>({...n,price:e.target.value}))}/></div>
              <div className="field"><label>Dietary type</label><select value={newItem.diet} onChange={e=>setNewItem(n=>({...n,diet:e.target.value}))}>
                <option value="veg">🥗 Vegetarian</option><option value="vegan">🌱 Vegan</option>
                <option value="chicken">🍗 Chicken</option><option value="meat">🥩 Meat</option><option value="seafood">🐟 Seafood</option>
              </select></div>
            </div>
            <div className="field-row">
              <div className="field"><label>Calories (kcal)</label><input type="number" value={newItem.calories} placeholder="0" onChange={e=>setNewItem(n=>({...n,calories:e.target.value}))}/></div>
              <div className="field"><label>Protein (g)</label><input type="number" value={newItem.protein} placeholder="0" onChange={e=>setNewItem(n=>({...n,protein:e.target.value}))}/></div>
            </div>
            <div className="field"><label>Badge <span style={{fontWeight:400,color:'#9ca3af'}}>(optional — e.g. "Chef's pick")</span></label><input type="text" value={newItem.badge} placeholder="Chef's pick, New, Best seller..." onChange={e=>setNewItem(n=>({...n,badge:e.target.value}))}/></div>
            <div className="modal-actions">
              <button className="modal-cancel" onClick={()=>setShowModal(false)}>Cancel</button>
              <button className="modal-save" disabled={saving||!newItem.name||!newItem.price} onClick={saveItem}>{saving?'Saving...':(editItem?'Save changes':'Add item')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
