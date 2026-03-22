import { useState } from 'react'
import { Sun, Moon, Ruler, Lock, LogOut, Trash2, ChevronRight, Check } from 'lucide-react'
import { useApp } from '../context/AppContext'
import './SettingsPage.css'

export default function SettingsPage() {
  const { theme, toggleTheme, units, setUnits, setIsLoggedIn } = useApp()
  const [showChangePw, setShowChangePw] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [pw, setPw] = useState({ current: '', next: '', confirm: '' })

  const handleLogout = () => setIsLoggedIn(false)
  const handleDelete = () => setIsLoggedIn(false)

  return (
    <div className="page fade-up">
      <div className="page-header">
        <h1 className="page-title">Settings</h1>
      </div>

      <div className="settings-layout">
        {/* App Theme */}
        <div className="card settings-section">
          <div className="section-head">
            <div className="section-icon" style={{ background: 'rgba(168,139,250,0.15)', color: '#a78bfa' }}>
              {theme === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
            </div>
            <div>
              <div className="section-title">App Theme</div>
              <div className="section-sub">Choose your visual experience</div>
            </div>
          </div>
          <div className="theme-options">
            {['dark', 'light'].map(t => (
              <button
                key={t}
                className={`theme-opt ${theme === t ? 'active' : ''}`}
                onClick={() => { if (theme !== t) toggleTheme() }}
              >
                <div className={`theme-preview ${t}`}>
                  <div className="preview-bar" />
                  <div className="preview-content">
                    <div className="preview-line" />
                    <div className="preview-line short" />
                  </div>
                </div>
                <div className="theme-label">
                  {t === 'dark' ? '🌙 Dark Mode' : '☀️ Light Mode'}
                  {theme === t && <Check size={13} className="check-icon" />}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Measuring Units */}
        <div className="card settings-section">
          <div className="section-head">
            <div className="section-icon" style={{ background: 'rgba(11, 144, 253, 0.11)', color: 'var(--accent)' }}>
              <Ruler size={16} />
            </div>
            <div>
              <div className="section-title">Measuring Units</div>
              <div className="section-sub">Set your preferred measurement system</div>
            </div>
          </div>
          <div className="units-grid">
            {[
              { key: 'metric', label: 'Metric', detail: 'cm, kg' },
              { key: 'imperial', label: 'Imperial', detail: 'ft-in, lbs' },
            ].map(u => (
              <button
                key={u.key}
                className={`unit-opt ${units === u.key ? 'active' : ''}`}
                onClick={() => setUnits(u.key)}
              >
                <div className="unit-label">{u.label}</div>
                <div className="unit-detail">{u.detail}</div>
                {units === u.key && <Check size={14} className="unit-check" />}
              </button>
            ))}
          </div>
        </div>

        {/* Change Password */}
        <div className="card settings-section">
          <div className="section-head">
            <div className="section-icon" style={{ background: 'rgba(0, 167, 245, 0.1)', color: 'var(--accent)' }}>
              <Lock size={16} />
            </div>
            <div>
              <div className="section-title">Change Password</div>
              <div className="section-sub">Update your account security</div>
            </div>
            <button
              className="btn btn-ghost btn-sm section-toggle"
              onClick={() => setShowChangePw(!showChangePw)}
            >
              <ChevronRight size={16} style={{ transform: showChangePw ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
            </button>
          </div>

          {showChangePw && (
            <div className="pw-form fade-up">
              <div className="form-group">
                <label className="label">Current Password</label>
                <input type="password" placeholder="••••••••" value={pw.current} onChange={e => setPw(p => ({ ...p, current: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="label">New Password</label>
                <input type="password" placeholder="••••••••" value={pw.next} onChange={e => setPw(p => ({ ...p, next: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="label">Confirm New Password</label>
                <input type="password" placeholder="••••••••" value={pw.confirm} onChange={e => setPw(p => ({ ...p, confirm: e.target.value }))} />
              </div>
              <div className="pw-actions">
                <button className="btn btn-primary btn-sm" onClick={() => { alert('Password updated!'); setShowChangePw(false); setPw({ current:'', next:'', confirm:'' }) }}>
                  <Check size={14} /> Update Password
                </button>
                <button className="btn btn-ghost btn-sm" onClick={() => setShowChangePw(false)}>Cancel</button>
              </div>
            </div>
          )}
        </div>

        {/* Danger Zone */}
        <div className="card settings-section danger-zone">
          <div className="danger-title">Danger Zone</div>
          <div className="danger-actions">
            {/* Logout */}
            {!showLogoutConfirm ? (
              <button className="btn btn-ghost danger-btn" onClick={() => setShowLogoutConfirm(true)}>
                <LogOut size={16} /> Sign Out
              </button>
            ) : (
              <div className="confirm-row fade-up">
                <span className="confirm-text">Are you sure?</span>
                <button className="btn btn-danger btn-sm" onClick={handleLogout}>Yes, Sign Out</button>
                <button className="btn btn-ghost btn-sm" onClick={() => setShowLogoutConfirm(false)}>Cancel</button>
              </div>
            )}

            {/* Delete Account */}
            {!showDeleteConfirm ? (
              <button className="btn btn-ghost danger-btn delete-btn" onClick={() => setShowDeleteConfirm(true)}>
                <Trash2 size={16} /> Delete Account
              </button>
            ) : (
              <div className="confirm-row fade-up">
                <span className="confirm-text">This is permanent. Are you sure?</span>
                <button className="btn btn-danger btn-sm" onClick={handleDelete}>Yes, Delete</button>
                <button className="btn btn-ghost btn-sm" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
              </div>
            )}
          </div>
        </div>
      </div>

      
    </div>
  )
}
