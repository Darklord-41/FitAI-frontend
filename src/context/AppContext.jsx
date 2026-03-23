import { createContext, useContext, useState, useEffect } from 'react'
import { api } from '../services/api'

const AppContext = createContext(null)

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [streak, setStreak] = useState(0)
  const [theme, setTheme] = useState('dark')
  const [units, setUnits] = useState('metric')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true) // true while checking stored token

  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const toggleSidebar = () => setIsSidebarOpen(prev => !prev)
  const closeSidebar = () => setIsSidebarOpen(false)

  // ── Restore session on mount ──────────────────────────────────────────────
  useEffect(() => {
    const token = localStorage.getItem('fitai_token')
    if (!token) { setLoading(false); return }

    api.me()
      .then(data => {
        setUser(data.user)
        setStreak(data.user.streak || 0)
        setTheme(data.user.theme || 'dark')
        setUnits(data.user.units || 'metric')
        document.documentElement.setAttribute('data-theme', data.user.theme === 'light' ? 'light' : '')
        setIsLoggedIn(true)
      })
      .catch(() => {
        // Token invalid or expired — clear it
        localStorage.removeItem('fitai_token')
      })
      .finally(() => setLoading(false))
  }, [])

  // ── Login helper ──────────────────────────────────────────────────────────
  const login = (token, userData) => {
    localStorage.setItem('fitai_token', token)
    setUser(userData)
    setStreak(userData.streak || 0)
    setTheme(userData.theme || 'dark')
    setUnits(userData.units || 'metric')
    document.documentElement.setAttribute('data-theme', userData.theme === 'light' ? 'light' : '')
    setIsLoggedIn(true)
  }

  // ── Logout helper ─────────────────────────────────────────────────────────
  const logout = () => {
    localStorage.removeItem('fitai_token')
    setUser(null)
    setStreak(0)
    setIsLoggedIn(false)
    setTheme('dark')
    setUnits('metric')
    document.documentElement.setAttribute('data-theme', '')
  }

  // ── Toggle theme (+ persist to server) ────────────────────────────────────
  const toggleTheme = async () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    document.documentElement.setAttribute('data-theme', next === 'light' ? 'light' : '')
    if (isLoggedIn) {
      try { await api.updateSettings({ theme: next }) } catch (_) { /* ignore */ }
    }
  }

  // ── Change units (+ persist to server) ────────────────────────────────────
  const changeUnits = async (next) => {
    setUnits(next)
    if (isLoggedIn) {
      try {
        const data = await api.updateSettings({ units: next })
        if (data.user) setUser(data.user)
      } catch (_) { /* ignore */ }
    }
  }

  // ── BMI calculator ────────────────────────────────────────────────────────
  const bmi = () => {
    if (!user || !user.height || !user.weight) return 0
    const h = user.height / 100
    return (user.weight / (h * h)).toFixed(1)
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--bg1, #080b10)', color: 'var(--text1, #fff)', fontFamily: 'var(--font-body, sans-serif)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>⚡</div>
          <div>Loading…</div>
        </div>
      </div>
    )
  }

  return (
    <AppContext.Provider value={{
      theme, toggleTheme,
      units, setUnits: changeUnits,
      user, setUser,
      streak, setStreak,
      isLoggedIn, setIsLoggedIn,
      login, logout,
      bmi,
      isSidebarOpen, toggleSidebar, closeSidebar,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
