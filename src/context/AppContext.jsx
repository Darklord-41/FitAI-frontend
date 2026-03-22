import { createContext, useContext, useState } from 'react'

const AppContext = createContext(null)

export const AppProvider = ({ children }) => {
  const [theme, setTheme] = useState('dark')
  const [units, setUnits] = useState('metric') // metric | imperial
  const [user, setUser] = useState({
    name: 'Alex Carter',
    email: 'alex@fitai.com',
    avatar: null,
    age: 28,
    height: 178,
    weight: 75,
    goal: 'Build Muscle',
    level: 'Intermediate',
  })
  const [streak, setStreak] = useState(12)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleSidebar = () => setIsSidebarOpen(prev => !prev)
  const closeSidebar = () => setIsSidebarOpen(false)

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    document.documentElement.setAttribute('data-theme', next === 'light' ? 'light' : '')
  }

  const bmi = () => {
    const h = user.height / 100
    return (user.weight / (h * h)).toFixed(1)
  }

  return (
    <AppContext.Provider value={{ theme, toggleTheme, units, setUnits, user, setUser, streak, setStreak, isLoggedIn, setIsLoggedIn, bmi, isSidebarOpen, toggleSidebar, closeSidebar }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
