import { useState } from 'react'
import { Camera, Edit2, Check, X } from 'lucide-react'
import { useApp } from '../context/AppContext'
import './ProfilePage.css'

export default function ProfilePage() {
  const { user, setUser, bmi } = useApp()
  const [editingName, setEditingName] = useState(false)
  const [editingData, setEditingData] = useState(false)
  const [tmpName, setTmpName] = useState(user.name)
  const [tmpData, setTmpData] = useState({ age: user.age, height: user.height, weight: user.weight, goal: user.goal, level: user.level })

  const saveName = () => { setUser(u => ({ ...u, name: tmpName })); setEditingName(false) }
  const saveData = () => { setUser(u => ({ ...u, ...tmpData })); setEditingData(false) }

  const bmiVal = bmi()
  const bmiLabel = bmiVal < 18.5 ? 'Underweight' : bmiVal < 25 ? 'Normal' : bmiVal < 30 ? 'Overweight' : 'Obese'
  const bmiColor = bmiVal < 18.5 ? '#60a5fa' : bmiVal < 25 ? 'var(--accent)' : bmiVal < 30 ? 'var(--warn)' : 'var(--danger)'

  return (
    <div className="page fade-up">
      <div className="page-header">
        <h1 className="page-title">Profile</h1>
      </div>

      <div className="profile-grid">
        {/* Avatar card */}
        <div className="card profile-avatar-card">
          <div className="avatar-wrap">
            <div className="big-avatar">
              {user.avatar ? <img src={user.avatar} alt="" /> : <span>{user.name.charAt(0)}</span>}
            </div>
            <button className="avatar-edit-btn" onClick={() => alert('Upload photo')}>
              <Camera size={14} />
            </button>
          </div>

          {editingName ? (
            <div className="name-edit">
              <input value={tmpName} onChange={e => setTmpName(e.target.value)} style={{ textAlign:'center', fontFamily:'var(--font-display)', fontSize:22, letterSpacing:'0.02em' }} />
              <div className="edit-actions">
                <button className="btn btn-primary btn-sm" onClick={saveName}><Check size={14} /></button>
                <button className="btn btn-ghost btn-sm" onClick={() => setEditingName(false)}><X size={14} /></button>
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

          {/* BMI */}
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
        </div>

        {/* User data */}
        <div className="card">
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
            <h3 className="card-heading" style={{margin:0}}>Personal Data</h3>
            {!editingData
              ? <button className="btn btn-ghost btn-sm" onClick={() => setEditingData(true)}><Edit2 size={14} /> Edit</button>
              : <div className="edit-actions">
                  <button className="btn btn-primary btn-sm" onClick={saveData}><Check size={14} /> Save</button>
                  <button className="btn btn-ghost btn-sm" onClick={() => setEditingData(false)}>Cancel</button>
                </div>
            }
          </div>

          <div className="data-grid">
            {[
              { label: 'Age', key: 'age', unit: 'yrs', type:'number' },
              { label: 'Height', key: 'height', unit: 'cm', type:'number' },
              { label: 'Weight', key: 'weight', unit: 'kg', type:'number' },
            ].map(f => (
              <div key={f.key} className="data-field">
                <span className="label">{f.label}</span>
                {editingData
                  ? <input type={f.type} value={tmpData[f.key]} onChange={e => setTmpData(d => ({ ...d, [f.key]: e.target.value }))} />
                  : <div className="data-val">{user[f.key]} <span className="data-unit">{f.unit}</span></div>
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

        {/* AI Stats card */}
        <div className="card ai-stats-card">
          <h3 className="card-heading">AI Analysis</h3>
          <div className="ai-stats">
            {[
              { label: 'Fitness Score', value: 78, color: 'var(--accent)' },
              { label: 'Recovery', value: 85, color: 'var(--accent2)' },
              { label: 'Consistency', value: 62, color: '#a78bfa' },
              { label: 'Nutrition', value: 70, color: 'var(--warn)' },
            ].map(s => (
              <div key={s.label} className="ai-stat-row">
                <div className="ai-stat-info">
                  <span className="ai-stat-label">{s.label}</span>
                  <span className="ai-stat-val" style={{ color: s.color, fontFamily:'var(--font-mono)' }}>{s.value}%</span>
                </div>
                <div className="ai-bar-track">
                  <div className="ai-bar-fill" style={{ width:`${s.value}%`, background:s.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
