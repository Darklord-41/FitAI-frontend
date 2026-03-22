import { useApp } from '../context/AppContext'
import { Flame } from 'lucide-react'
import './StreakPage.css'

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const DAYS = ['S','M','T','W','T','F','S']

// Generate fake streak data for the last 3 months
const generateCalData = () => {
  const today = new Date()
  const data = {}
  for (let i = 0; i < 90; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    const key = d.toISOString().split('T')[0]
    const rand = Math.random()
    data[key] = rand > 0.3 ? (rand > 0.7 ? 'intense' : 'done') : 'missed'
  }
  // last 12 days always done (streak)
  for (let i = 0; i < 12; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    data[d.toISOString().split('T')[0]] = i === 0 ? 'today' : 'done'
  }
  return data
}

const calData = generateCalData()

const getMonthCells = (year, month) => {
  const first = new Date(year, month, 1).getDay()
  const days = new Date(year, month + 1, 0).getDate()
  const cells = []
  for (let i = 0; i < first; i++) cells.push(null)
  for (let d = 1; d <= days; d++) {
    const key = `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`
    cells.push({ day: d, key, status: calData[key] || 'none' })
  }
  return cells
}

export default function StreakPage() {
  const { streak } = useApp()
  const today = new Date()

  const months = [
    { year: today.getFullYear(), month: today.getMonth() - 2 < 0 ? today.getMonth() + 10 : today.getMonth() - 2 },
    { year: today.getFullYear(), month: today.getMonth() - 1 < 0 ? 11 : today.getMonth() - 1 },
    { year: today.getFullYear(), month: today.getMonth() },
  ]

  const streakStats = [
    { label: 'Current Streak', value: `${streak} days`, color: 'var(--warn)' },
    { label: 'Longest Streak', value: '24 days', color: 'var(--accent)' },
    { label: 'This Month', value: '18/31', color: 'var(--accent2)' },
    { label: 'Total Sessions', value: '143', color: '#a78bfa' },
  ]

  return (
    <div className="page fade-up">
      <div className="page-header">
        <div>
          <h1 className="page-title">Streak</h1>
          <p className="page-sub">Your consistency is your superpower.</p>
        </div>
      </div>

      {/* Big streak counter */}
      <div className="card streak-hero">
        <div className="streak-orb" />
        <Flame size={48} className="streak-flame" />
        <div className="streak-num">{streak}</div>
        <div className="streak-label">Day Streak</div>
        <div className="streak-msg">Keep going — you're on fire! 🔥</div>
      </div>

      {/* Stats */}
      <div className="streak-stats-row">
        {streakStats.map(s => (
          <div key={s.label} className="card streak-stat">
            <div className="ss-val" style={{ color: s.color }}>{s.value}</div>
            <div className="ss-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Calendar months */}
      <div className="cal-section">
        {months.map(({ year, month }) => {
          const mIdx = month < 0 ? month + 12 : month
          const cells = getMonthCells(year, mIdx)
          return (
            <div key={`${year}-${mIdx}`} className="card cal-month">
              <h3 className="cal-title">{MONTHS[mIdx]} {year}</h3>
              <div className="cal-days-header">
                {DAYS.map((d, i) => <span key={i} className="cal-day-label">{d}</span>)}
              </div>
              <div className="cal-grid">
                {cells.map((cell, i) => (
                  cell ? (
                    <div
                      key={cell.key}
                      className={`cal-cell ${cell.status}`}
                      title={`${cell.day} ${MONTHS[mIdx]}`}
                    >
                      <span>{cell.day}</span>
                    </div>
                  ) : <div key={`e${i}`} />
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="cal-legend card">
        {[
          { cls: 'done', label: 'Workout done' },
          { cls: 'intense', label: 'Intense session' },
          { cls: 'today', label: 'Today' },
          { cls: 'missed', label: 'Missed' },
          { cls: 'none', label: 'No data' },
        ].map(l => (
          <div key={l.cls} className="legend-item">
            <div className={`cal-cell ${l.cls}`} style={{ width:20, height:20, fontSize:0 }} />
            <span>{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
