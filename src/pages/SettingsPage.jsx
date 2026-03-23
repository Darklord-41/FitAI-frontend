import { useState } from 'react'
import { Sun, Moon, Ruler, Lock, LogOut, Trash2, ChevronRight, Check, Loader2 } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { api } from '../services/api'
import './SettingsPage.css'

export default function SettingsPage() {
  const { theme, toggleTheme, units, setUnits, logout } = useApp()
  const [showChangePw, setShowChangePw] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [pw, setPw] = useState({ current: '', next: '', confirm: '' })
  const [deletePassword, setDeletePassword] = useState('')
  const [pwLoading, setPwLoading] = useState(false)
  const [pwError, setPwError] = useState('')
  const [pwSuccess, setPwSuccess] = useState('')
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [deleteError, setDeleteError] = useState('')

  // ── Change Password ───────────────────────────────────────────────────
  const handleChangePassword = async () => {
    setPwError(''); setPwSuccess('')
    if (!pw.current || !pw.next || !pw.confirm) {
      setPwError('All fields are required'); return
    }
    if (pw.next.length < 6) {
      setPwError('New password must be at least 6 characters'); return
    }
    if (pw.next !== pw.confirm) {
      setPwError('New passwords do not match'); return
    }
    setPwLoading(true)
    try {
      const data = await api.changePassword({ currentPassword: pw.current, newPassword: pw.next })
      setPwSuccess(data.message || 'Password updated!')
      setPw({ current: '', next: '', confirm: '' })
      setTimeout(() => setShowChangePw(false), 2000)
    } catch (err) {
      setPwError(err.message)
    } finally { setPwLoading(false) }
  }

  // ── Logout ────────────────────────────────────────────────────────────
  const handleLogout = () => {
    logout()
  }

  // ── Delete Account ────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!deletePassword) { setDeleteError('Password is required'); return }
    setDeleteLoading(true); setDeleteError('')
    try {
      await api.deleteAccount({ password: deletePassword })
      logout()
    } catch (err) {
      setDeleteError(err.message)
    } finally { setDeleteLoading(false) }
  }

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
              onClick={() => { setShowChangePw(!showChangePw); setPwError(''); setPwSuccess('') }}
            >
              <ChevronRight size={16} style={{ transform: showChangePw ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
            </button>
          </div>

          {showChangePw && (
            <div className="pw-form fade-up">
              {pwError && <div style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171', padding: '8px 12px', borderRadius: 8, fontSize: 13, marginBottom: 12 }}>{pwError}</div>}
              {pwSuccess && <div style={{ background: 'rgba(0,245,160,0.1)', border: '1px solid rgba(0,245,160,0.25)', color: 'var(--accent)', padding: '8px 12px', borderRadius: 8, fontSize: 13, marginBottom: 12 }}>{pwSuccess}</div>}
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
                <button className="btn btn-primary btn-sm" onClick={handleChangePassword} disabled={pwLoading}>
                  {pwLoading ? <Loader2 size={14} className="spin-icon" /> : <Check size={14} />} Update Password
                </button>
                <button className="btn btn-ghost btn-sm" onClick={() => { setShowChangePw(false); setPwError(''); setPwSuccess('') }}>Cancel</button>
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
              <button className="btn btn-danger-ghost danger-btn" onClick={() => setShowLogoutConfirm(true)}>
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
              <button className="btn btn-danger-ghost danger-btn delete-btn" onClick={() => setShowDeleteConfirm(true)}>
                <Trash2 size={16} /> Delete Account
              </button>
            ) : (
              <div className="confirm-row fade-up">
                <span className="confirm-text">This is permanent. Enter your password to confirm:</span>
                {deleteError && <div style={{ color: '#f87171', fontSize: 13, marginBottom: 8 }}>{deleteError}</div>}
                <input
                  type="password"
                  placeholder="Enter password"
                  value={deletePassword}
                  onChange={e => setDeletePassword(e.target.value)}
                  style={{ marginBottom: 8 }}
                />
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn btn-danger btn-sm" onClick={handleDelete} disabled={deleteLoading}>
                    {deleteLoading ? <Loader2 size={14} className="spin-icon" /> : 'Yes, Delete'}
                  </button>
                  <button className="btn btn-ghost btn-sm" onClick={() => { setShowDeleteConfirm(false); setDeletePassword(''); setDeleteError('') }}>Cancel</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
