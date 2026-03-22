import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Home, User, Flame, Dumbbell, Settings, Zap, ChevronLeft, ChevronRight } from 'lucide-react'
import { useApp } from '../context/AppContext'
import './sb1.css'
 
const nav = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/profile', icon: User, label: 'Profile' },
  { to: '/streak', icon: Flame, label: 'Streak' },
  { to: '/workout', icon: Dumbbell, label: 'Workout' },
  { to: '/settings', icon: Settings, label: 'Settings' },
]
 
export default function Sidebar() {
  const { user, streak, isSidebarOpen, toggleSidebar } = useApp()
  const [collapsed, setCollapsed] = useState(false)
 
  return (
    <>
      <aside className={`sidebar ${!isSidebarOpen ? 'collapsed' : ''}`}>
        {/* Logo */}
        <div className="sidebar-logo">
          <Zap size={22} className="logo-icon" />
          <span className="logo-text">FitAI</span>

          <button
          className="sidebar-toggle"
          onClick={toggleSidebar}
          aria-label={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
          {!isSidebarOpen ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
        </div>

        
 
        {/* User mini */}
        <div className="sidebar-user">
          <div className="user-avatar">
            {user.avatar
              ? <img src={user.avatar} alt="" />
              : <span>{user.name.charAt(0)}</span>
            }
          </div>
          <div className="user-info">
            <div className="user-name">{user.name}</div>
            <div className="user-level">{user.goal}</div>
          </div>
        </div>
 
        {/* Streak badge */}
        <div className="sidebar-streak">
          <Flame size={14} />
          <span className="streak-label">{streak} day streak</span>
        </div>
 
        {/* Nav */}
        <nav className="sidebar-nav">
          {nav.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              title={label}
            >
              <Icon size={18} className="nav-icon" />
              <span className="nav-label">{label}</span>
            </NavLink>
          ))}
        </nav>
 
        <div className="sidebar-footer">
          <span className="sidebar-version">v2.4.1 · AI-Powered</span>
        </div>
 
        {/* Universal toggle button — always visible */}
        
      </aside>
    </>
  )
}