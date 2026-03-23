import { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import { api } from '../services/api'
import { Flame, Loader2, ChevronLeft, ChevronRight } from 'lucide-react'
import './StreakPage.css'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

const getMonthCells = (year, month, calData) => {
  const first = new Date(year, month, 1).getDay()
  const days = new Date(year, month + 1, 0).getDate()
  const cells = []
  for (let i = 0; i < first; i++) cells.push(null)
  for (let d = 1; d <= days; d++) {
    const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    cells.push({ day: d, key, status: calData[key] || 'none' })
  }
  return cells
}

export default function StreakPage() {
  const { streak, setStreak } = useApp()
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentStreak, setCurrentStreak] = useState(streak)
  const [longestStreak, setLongestStreak] = useState(0)
  const [lastWorkoutDate, setLastWorkoutDate] = useState(null)

  // ── Month navigation state ──────────────────────────────────────────────
  // monthOffset = 0 means "current set" (shows 3 months ending with current month)
  // monthOffset = 1 means "shift 1 month back", etc.
  const [monthOffset, setMonthOffset] = useState(0)

  useEffect(() => {
    api.getStreakData()
      .then(data => {
        setEntries(data.entries || [])
        setCurrentStreak(data.currentStreak || 0)
        setStreak(data.currentStreak || 0)
        setLastWorkoutDate(data.lastWorkoutDate)
        setLongestStreak(data.longestStreak || 0)
      })
      .catch(() => { })
      .finally(() => setLoading(false))
  }, [])

  // Build calendar data from entries
  const calData = {}
  const todayStr = (() => {
    const d = new Date()
    return [
      d.getFullYear(),
      String(d.getMonth() + 1).padStart(2, '0'),
      String(d.getDate()).padStart(2, '0'),
    ].join('-')
  })()

  // Find earliest entry to know where to start filling missed days
  const earliestDate = entries.length > 0
    ? entries.reduce((min, e) => e.date < min ? e.date : min, entries[0].date)
    : todayStr

  // Map known entries
  entries.forEach(e => {
    if (e.date === todayStr) {
      calData[e.date] = 'today'
    } else {
      calData[e.date] = (e.status === 'done' || e.status === 'intense') ? 'done' : 'missed'
    }
  })

  // Iterate from earliestDate up to yesterday to mark gaps as missed
  if (earliestDate < todayStr) {
    let curr = new Date(earliestDate + 'T00:00:00')
    const end = new Date(todayStr + 'T00:00:00')
    while (curr < end) {
      const key = [
        curr.getFullYear(),
        String(curr.getMonth() + 1).padStart(2, '0'),
        String(curr.getDate()).padStart(2, '0'),
      ].join('-')
      if (!calData[key]) {
        calData[key] = 'missed'
      }
      curr.setDate(curr.getDate() + 1)
    }
  }

  // Always mark today
  calData[todayStr] = 'today'

  const today = new Date()

  // Generate 3 months based on offset
  const months = []
  for (let i = 2; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth() - monthOffset - i, 1)
    months.push({ year: d.getFullYear(), month: d.getMonth() })
  }

  // Check if we can go forward (don't go beyond current month)
  const canGoForward = monthOffset > 0

  // Compute stats from entries
  const doneEntries = entries.filter(e => e.status === 'done' || e.status === 'intense')
  const totalSessions = doneEntries.length

  // This month
  const thisMonthPrefix = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`
  const thisMonthDone = doneEntries.filter(e => e.date.startsWith(thisMonthPrefix)).length
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()

  const streakStats = [
    { label: 'Current Streak', value: `${currentStreak} days`, color: 'var(--warn)' },
    { label: 'Longest Ever', value: `${longestStreak} days`, color: 'var(--accent)' },
    { label: 'This Month', value: `${thisMonthDone}/${daysInMonth}`, color: 'var(--accent2)' },
    { label: 'Total Sessions', value: `${totalSessions}`, color: '#a78bfa' },
  ]

  if (loading) {
    return (
      <div className="page fade-up" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <Loader2 size={32} className="spin-icon" style={{ color: 'var(--accent)' }} />
      </div>
    )
  }

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
        <div className="streak-num">{currentStreak}</div>
        <div className="streak-label">Day Streak</div>
        <div className="streak-msg">
          {currentStreak > 0 ? "Keep going — you're on fire! 🔥" : 'Start a workout to begin your streak! 💪'}
        </div>
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

      {/* Month navigation */}
      <div className="cal-nav">
        <button className="btn btn-ghost btn-sm" onClick={() => setMonthOffset(o => o + 1)}>
          <ChevronLeft size={16} /> Older
        </button>
        <span className="cal-nav-label">
          {MONTHS[months[0].month]} {months[0].year} — {MONTHS[months[2].month]} {months[2].year}
        </span>
        <button className="btn btn-ghost btn-sm" onClick={() => setMonthOffset(o => Math.max(0, o - 1))} disabled={!canGoForward}>
          Newer <ChevronRight size={16} />
        </button>
      </div>

      {/* Calendar months */}
      <div className="cal-section">
        {months.map(({ year, month }) => {
          const cells = getMonthCells(year, month, calData)
          return (
            <div key={`${year}-${month}`} className="card cal-month">
              <h3 className="cal-title">{MONTHS[month]} {year}</h3>
              <div className="cal-days-header">
                {DAYS.map((d, i) => <span key={i} className="cal-day-label">{d}</span>)}
              </div>
              <div className="cal-grid">
                {cells.map((cell, i) => (
                  cell ? (
                    <div
                      key={cell.key}
                      className={`cal-cell ${cell.status}`}
                      title={`${cell.day} ${MONTHS[month]}`}
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

      {/* Legend — only Today, Done, Missed */}
      <div className="cal-legend card">
        {[
          { cls: 'today', label: 'Today' },
          { cls: 'done', label: 'Workout done' },
          { cls: 'missed', label: 'Missed' },
        ].map(l => (
          <div key={l.cls} className="legend-item">
            <div className={`cal-cell ${l.cls}`} style={{ width: 20, height: 20, fontSize: 0 }} />
            <span>{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
