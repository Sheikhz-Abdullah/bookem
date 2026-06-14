import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from './supabase'

const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [cafe, setCafe] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) loadCafe(session.user.id)
      else setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) loadCafe(session.user.id)
      else { setCafe(null); setLoading(false) }
    })
    return () => subscription.unsubscribe()
  }, [])

  async function loadCafe(userId) {
    const { data } = await supabase.from('cafes').select('*').eq('owner_id', userId).single()
    setCafe(data)
    setLoading(false)
  }

  async function signUp(email, password, cafeData) {
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) return { error }
    if (data.user) {
      const { error: cafeError } = await supabase.from('cafes').insert({
        owner_id: data.user.id,
        ...cafeData
      })
      if (cafeError) return { error: cafeError }
    }
    return { data }
  }

  async function signIn(email, password) {
    return supabase.auth.signInWithPassword({ email, password })
  }

  async function signOut() {
    await supabase.auth.signOut()
    setCafe(null)
  }

  async function refreshCafe() {
    if (user) await loadCafe(user.id)
  }

  return (
    <AuthContext.Provider value={{ user, cafe, loading, signUp, signIn, signOut, refreshCafe }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
