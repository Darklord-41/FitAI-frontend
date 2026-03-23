import { useState, useRef } from 'react'
import { Camera, Edit2, Check, X, Loader2, CalendarDays, Clock } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { api } from '../services/api'
import './ProfilePage.css'

export default function ProfilePage() {
  const { user, setUser, bmi, units } = useApp()
  const [editingName, setEditingName] = useState(false)
  const [editingData, setEditingData] = useState(false)
  const [tmpName, setTmpName] = useState(user?.name || '')
  const [tmpData, setTmpData] = useState({
    age: user?.age || '',
    height: user?.height || '',
    weight: user?.weight || '',
    goal: user?.goal || 'Stay Fit',
    level: user?.level || 'Beginner',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef(null)

  // ── Units helpers ──────────────────────────────────────────────────────────
  const isImperial = units === 'imperial'
  const heightUnit = isImperial ? 'in' : 'cm'
  const weightUnit = isImperial ? 'lbs' : 'kg'

  // Display values with unit conversion
  const displayHeight = (val) => {
    if (!val) return '—'
    if (isImperial) {
      const inches = Math.round(val / 2.54)
      const ft = Math.floor(inches / 12)
      const remaining = inches % 12
      return `${ft}'${remaining}"`
    }
    return val
  }

  const displayWeight = (val) => {
    if (!val) return '—'
    if (isImperial) return Math.round(val * 2.205)
    return val
  }

  // ── Joined info ────────────────────────────────────────────────────────────
  const joinedDate = user?.createdAt ? new Date(user.createdAt) : null
  const joinedStr = joinedDate?.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

  const getDuration = () => {
    if (!joinedDate) return '—'
    const diffMs = Date.now() - joinedDate.getTime()
    const days = Math.floor(diffMs / 86400000)
    if (days < 1) return 'Today'
    if (days < 30) return `${days} day${days > 1 ? 's' : ''}`
    const months = Math.floor(days / 30)
    if (months < 12) return `${months} month${months > 1 ? 's' : ''}`
    const years = Math.floor(months / 12)
    const rem = months % 12
    return rem > 0 ? `${years}y ${rem}m` : `${years} year${years > 1 ? 's' : ''}`
  }

  // ── Save handlers ─────────────────────────────────────────────────────────
  const saveName = async () => {
    setSaving(true); setError('')
    try {
      const data = await api.updateProfile({ name: tmpName })
      setUser(data.user)
      setEditingName(false)
    } catch (err) {
      setError(err.message)
    } finally { setSaving(false) }
  }

  const saveData = async () => {
    setSaving(true); setError('')
    try {
      // Convert imperial input back to metric for storage
      let height = tmpData.height ? Number(tmpData.height) : null
      let weight = tmpData.weight ? Number(tmpData.weight) : null
      if (isImperial && height) height = Math.round(height * 2.54) // inches → cm
      if (isImperial && weight) weight = Math.round(weight / 2.205) // lbs → kg

      const body = {
        age: tmpData.age ? Number(tmpData.age) : null,
        height,
        weight,
        goal: tmpData.goal,
        level: tmpData.level,
      }
      const data = await api.updateProfile(body)
      setUser(data.user)
      setEditingData(false)
      if (data.planRegenerated) {
        setError('')
        alert('✅ Your weekly workout plan has been updated based on your new data!')
      }
    } catch (err) {
      setError(err.message)
    } finally { setSaving(false) }
  }

  // ── Avatar upload ─────────────────────────────────────────────────────────
  const handleAvatarClick = () => fileInputRef.current?.click()

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true); setError('')
    try {
      const data = await api.uploadAvatar(file)
      setUser(data.user)
    } catch (err) {
      setError(err.message)
    } finally { setUploading(false) }
  }

  const bmiVal = bmi()
  const bmiLabel = bmiVal < 18.5 ? 'Underweight' : bmiVal < 25 ? 'Normal' : bmiVal < 30 ? 'Overweight' : 'Obese'
  const bmiColor = bmiVal < 18.5 ? '#60a5fa' : bmiVal < 25 ? 'var(--accent)' : bmiVal < 30 ? 'var(--warn)' : 'var(--danger)'

  if (!user) return null

  const avatarSrc = user.avatar ? api.avatarUrl(user.avatar) : null

  return (
    <div className="page fade-up">
      <div className="page-header">
        <h1 className="page-title">Profile</h1>
      </div>

      {error && <div style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171', padding: '10px 14px', borderRadius: 10, fontSize: 13, marginBottom: 16 }}>{error}</div>}

      <div className="profile-grid">
        {/* Avatar card */}
        <div className="card profile-avatar-card">
          <div className="avatar-wrap">
            <div className="big-avatar">
              {avatarSrc
                ? <img src={avatarSrc} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                : <span>{user.name?.charAt(0)}</span>
              }
              {uploading && <div className="avatar-uploading"><Loader2 size={20} className="spin-icon" /></div>}
            </div>
            <button className="avatar-edit-btn" onClick={handleAvatarClick} disabled={uploading}>
              <Camera size={14} />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleAvatarChange}
            />
          </div>

          {editingName ? (
            <div className="name-edit">
              <input value={tmpName} onChange={e => setTmpName(e.target.value)} style={{ textAlign:'center', fontFamily:'var(--font-display)', fontSize:22, letterSpacing:'0.02em' }} />
              <div className="edit-actions">
                <button className="btn btn-primary btn-sm" onClick={saveName} disabled={saving}>
                  {saving ? <Loader2 size={14} className="spin-icon" /> : <Check size={14} />}
                </button>
                <button className="btn btn-ghost btn-sm" onClick={() => { setEditingName(false); setTmpName(user.name) }}><X size={14} /></button>
              </div>
            </div>
          ) : (
            <div className="profile-name-row">
              <h2 className="profile-name">{user.name}</h2>
              <button className="icon-btn" onClick={() => setEditingName(true)}><Edit2 size={14} /></button>
            </div>
          )}

          <div className="profile-goal-badge">{user.goal}</div>
          <div className="profile-email">{user.email}</div>

          {/* Joined info */}
          <div className="joined-info">
            <div className="joined-item">
              <CalendarDays size={14} />
              <span>Joined {joinedStr || '—'}</span>
            </div>
            <div className="joined-item">
              <Clock size={14} />
              <span>Member for {getDuration()}</span>
            </div>
          </div>

          {/* BMI */}
          {bmiVal > 0 && (
            <div className="bmi-card">
              <div className="bmi-top">
                <span className="label" style={{marginBottom:0}}>BMI</span>
                <span style={{ color: bmiColor, fontFamily:'var(--font-mono)', fontSize:24, fontWeight:500 }}>{bmiVal}</span>
              </div>
              <div className="bmi-bar-track">
                <div className="bmi-bar-fill" style={{ width:`${Math.min(100, ((bmiVal - 15) / 25) * 100)}%`, background:bmiColor }} />
              </div>
              <span style={{ fontSize:12, color: bmiColor }}>{bmiLabel}</span>
            </div>
          )}
        </div>

        {/* User data */}
        <div className="card">
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
            <h3 className="card-heading" style={{margin:0}}>Personal Data</h3>
            {!editingData
              ? <button className="btn btn-ghost btn-sm" onClick={() => { setEditingData(true); setTmpData({ age: user.age || '', height: isImperial && user.height ? Math.round(user.height / 2.54) : (user.height || ''), weight: isImperial && user.weight ? Math.round(user.weight * 2.205) : (user.weight || ''), goal: user.goal || 'Stay Fit', level: user.level || 'Beginner' }) }}><Edit2 size={14} /> Edit</button>
              : <div className="edit-actions">
                  <button className="btn btn-primary btn-sm" onClick={saveData} disabled={saving}>
                    {saving ? <Loader2 size={14} className="spin-icon" /> : <Check size={14} />} Save
                  </button>
                  <button className="btn btn-ghost btn-sm" onClick={() => setEditingData(false)}>Cancel</button>
                </div>
            }
          </div>

          <div className="data-grid">
            {[
              { label: 'Age', key: 'age', unit: 'yrs', type:'number' },
              { label: 'Height', key: 'height', unit: heightUnit, type:'number' },
              { label: 'Weight', key: 'weight', unit: weightUnit, type:'number' },
            ].map(f => (
              <div key={f.key} className="data-field">
                <span className="label">{f.label}</span>
                {editingData
                  ? <input type={f.type} value={tmpData[f.key]} onChange={e => setTmpData(d => ({ ...d, [f.key]: e.target.value }))} />
                  : <div className="data-val">
                      {f.key === 'height' ? displayHeight(user[f.key]) : f.key === 'weight' ? displayWeight(user[f.key]) : (user[f.key] || '—')}
                      {' '}<span className="data-unit">{user[f.key] ? (f.key === 'height' && isImperial ? '' : f.unit) : ''}</span>
                    </div>
                }
              </div>
            ))}
            <div className="data-field">
              <span className="label">Fitness Goal</span>
              {editingData
                ? <select value={tmpData.goal} onChange={e => setTmpData(d => ({ ...d, goal: e.target.value }))}>
                    {['Build Muscle','Lose Weight','Stay Fit','Endurance'].map(g => <option key={g}>{g}</option>)}
                  </select>
                : <div className="data-val">{user.goal}</div>
              }
            </div>
            <div className="data-field">
              <span className="label">Experience Level</span>
              {editingData
                ? <select value={tmpData.level} onChange={e => setTmpData(d => ({ ...d, level: e.target.value }))}>
                    {['Beginner','Intermediate','Advanced'].map(l => <option key={l}>{l}</option>)}
                  </select>
                : <div className="data-val">{user.level}</div>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
