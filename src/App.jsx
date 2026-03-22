import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider, useApp } from './context/AppContext'
import Sidebar from './components/sb1'
import AuthPage from './pages/AuthPage'
import HomePage from './pages/HomePage'
import ProfilePage from './pages/ProfilePage'
import StreakPage from './pages/StreakPage'
import WorkoutPage from './pages/WorkoutPage'
import SettingsPage from './pages/SettingsPage'
import './App.css'

const AppRoutes = () => {
  const { isLoggedIn, isSidebarOpen } = useApp()

  if (!isLoggedIn) return <AuthPage />

  const contentStyle = {
    paddingLeft: window.innerWidth > 768 
      ? (isSidebarOpen ? 'var(--sidebar-w)' : 'var(--sidebar-w-collapsed)') 
      : 'var(--sidebar-w-collapsed)',
    transition: 'padding-left 0.3s ease-in-out'
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content" style={contentStyle}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/streak" element={<StreakPage />} />
          <Route path="/workout" element={<WorkoutPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  )
}
