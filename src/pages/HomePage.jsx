import { useState, useEffect, useCallback } from 'react'
import { Download, CheckSquare, Square, Flame, Dumbbell, Clock, TrendingUp, Loader2, RefreshCw, ChevronLeft, ChevronRight, Undo2 } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { api } from '../services/api'
import { downloadWorkoutPDF } from '../utils/pdfGenerator'
import './HomePage.css'

const CHECKLIST_KEY = 'fitai_checklist'

export default function HomePage() {
  const { user, streak, setStreak } = useApp()
  const [planData, setPlanData] = useState(null)
  const [todayInfo, setTodayInfo] = useState(null)
  const [yesterdayInfo, setYesterdayInfo] = useState(null)
  const [tomorrowInfo, setTomorrowInfo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [completing, setCompleting] = useState(false)
  const [undoing, setUndoing] = useState(false)
  const [regenerating, setRegenerating] = useState(false)
  const [todayCompleted, setTodayCompleted] = useState(false)
  const [selectedDay, setSelectedDay] = useState(null)

  // ── Persist checklist in sessionStorage ───────────────────────────────────
  const [checkedExercises, setCheckedExercises] = useState(() => {
    try {
      const saved = sessionStorage.getItem(CHECKLIST_KEY)
      return saved ? new Set(JSON.parse(saved)) : new Set()
    } catch { return new Set() }
  })

  useEffect(() => {
    sessionStorage.setItem(CHECKLIST_KEY, JSON.stringify([...checkedExercises]))
  }, [checkedExercises])

  // Fetch weekly plan on mount
  useEffect(() => {
    api.getPlan()
      .then(data => {
        setPlanData(data.plan)
        setTodayInfo(data.today)
        setYesterdayInfo(data.yesterday)
        setTomorrowInfo(data.tomorrow)
        setTodayCompleted(data.today?.completed || false)
      })
      .catch(() => { })
      .finally(() => setLoading(false))
  }, [])

  // ── Complete today's workout ──────────────────────────────────────────────
  const handleComplete = async () => {
    setCompleting(true)
    try {
      const data = await api.completeTodayWorkout()
      setStreak(data.streak)
      setTodayCompleted(true)
    } catch (_) { }
    setCompleting(false)
  }

  // ── Undo today's completion ───────────────────────────────────────────────
  const handleUndo = async () => {
    setUndoing(true)
    try {
      const data = await api.undoTodayWorkout()
      setStreak(data.streak)
      setTodayCompleted(false)
    } catch (_) { }
    setUndoing(false)
  }

  // ── Exercises & checklist ─────────────────────────────────────────────────
  const todayExercises = todayInfo?.workout?.exercises || []
  const isRestDay = todayExercises.length === 1 &&
    todayExercises[0]?.name?.toLowerCase().includes('rest')

  const toggleExercise = (i) => {
    setCheckedExercises(prev => {
      const next = new Set(prev)
      next.has(i) ? next.delete(i) : next.add(i)
      return next
    })
  }

  const progress = todayExercises.length > 0 && !isRestDay
    ? Math.round((checkedExercises.size / todayExercises.length) * 100)
    : 0

  // ── PDF data ──────────────────────────────────────────────────────────────
  const pdfData = planData
    ? planData.map(d => ({
      day: d.day,
      exercises: (d.exercises || []).map(ex => ({ name: ex.name, sets: ex.sets })),
    }))
    : []

  // ── Render exercise card ──────────────────────────────────────────────────
  const ExerciseList = ({ exercises, isDimmed = false }) => {
    if (!exercises || exercises.length === 0) return null
    const isRest = exercises.length === 1 && exercises[0]?.name?.toLowerCase().includes('rest')
    return (
      <div className={`exercise-list ${isDimmed ? 'dimmed' : ''}`}>
        {isRest ? (
          <div className="rest-badge">{exercises[0].name} — {exercises[0].sets}</div>
        ) : (
          exercises.map((ex, i) => (
            <div key={i} className="exercise-row">
              <span className="ex-name">{ex.name}</span>
              <span className="ex-sets">{ex.sets}</span>
            </div>
          ))
        )}
      </div>
    )
  }

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
          <h1 className="page-title">Hey, {user?.name?.split(' ')[0] || 'there'} 👋</h1>
          <p className="page-sub">Ready to crush today's session?</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {pdfData.length > 0 && (
            <button className="btn btn-ghost btn-sm" onClick={() => downloadWorkoutPDF(pdfData)}>
              <Download size={15} /> Download PDF
            </button>
          )}
        </div>
      </div>

      {/* Stats bar */}
      <div className="stats-row">
        {[
          { icon: Flame, label: 'Day Streak', value: streak, color: '#ffa502' },
          { icon: Dumbbell, label: 'Today', value: todayCompleted ? '✓ Done' : (isRestDay ? 'Rest' : 'Pending'), color: todayCompleted ? 'var(--accent)' : '#888' },
          { icon: TrendingUp, label: 'Goal', value: user?.goal || '—', color: '#a78bfa' },
          { icon: Clock, label: 'Level', value: user?.level || '—', color: 'var(--accent2)' },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="stat-card card">
            <Icon size={20} style={{ color }} />
            <div className="stat-val">{value}</div>
            <div className="stat-label">{label}</div>
          </div>
        ))}
      </div>

      {!planData && (
        <div className="card ai-banner" style={{ marginBottom: 20 }}>
          <div className="ai-glow" />
          <span className="ai-tag">Get Started</span>
          <h3>No plan yet!</h3>
          <p>Complete your profile (age, height, weight) to generate a personalized AI workout plan.</p>
        </div>
      )}

      {planData && (
        <div className="home-grid">

          {/* ── 3-Day View: Yesterday / Today / Tomorrow ──────────────── */}
          <div className="three-day-section">

            {/* Yesterday */}
            <div className="card day-card day-past">
              <div className="day-card-header">
                <ChevronLeft size={16} />
                <span className="day-card-label">Yesterday</span>
                <span className="day-card-name">{yesterdayInfo?.dayName}</span>
              </div>
              <ExerciseList exercises={yesterdayInfo?.workout?.exercises} isDimmed />
            </div>

            {/* Today */}
            <div className="card day-card day-today">
              <div className="ai-glow" />
              <div className="day-card-header">
                <span className="day-card-label today-label">⚡ Today</span>
                <span className="day-card-name">{todayInfo?.dayName}</span>
                {todayCompleted && <span className="pill accent-pill" style={{ marginLeft: 'auto' }}>✓ Done</span>}
              </div>

              {isRestDay ? (
                <div className="rest-day-card">
                  <h3>Rest Day</h3>
                  <p>{todayExercises[0]?.sets || 'Recover and recharge!'}</p>
                </div>
              ) : (
                <>
                  {todayExercises.length > 0 && (
                    <>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                        <span className="progress-badge">{checkedExercises.size}/{todayExercises.length}</span>
                        <span style={{ fontSize: 12, color: 'var(--text3)' }}>{progress}%</span>
                      </div>
                      <div className="progress-bar-wrap">
                        <div className="progress-bar" style={{ width: `${progress}%` }} />
                      </div>
                      <div className="checklist">
                        {todayExercises.map((ex, i) => (
                          <button key={i} className={`check-item ${checkedExercises.has(i) ? 'checked' : ''}`} onClick={() => toggleExercise(i)}>
                            {checkedExercises.has(i) ? <CheckSquare size={16} /> : <Square size={16} />}
                            <span className="check-name">{ex.name}</span>
                            <span className="check-sets">{ex.sets}</span>
                          </button>
                        ))}
                      </div>
                    </>
                  )}

                  <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                    {!todayCompleted ? (
                      <button
                        className="btn btn-primary"
                        style={{ flex: 1 }}
                        onClick={handleComplete}
                        disabled={completing}
                      >
                        {completing ? <Loader2 size={16} className="spin-icon" /> : <>✓ Mark Today Complete</>}
                      </button>
                    ) : (
                      <button
                        className="btn btn-ghost"
                        style={{ flex: 1, fontSize: 13 }}
                        onClick={handleUndo}
                        disabled={undoing}
                      >
                        {undoing ? <Loader2 size={14} className="spin-icon" /> : <><Undo2 size={14} /> Undo Completion</>}
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Tomorrow */}
            <div className="card day-card day-future">
              <div className="day-card-header">
                <span className="day-card-label">Tomorrow</span>
                <span className="day-card-name">{tomorrowInfo?.dayName}</span>
                <ChevronRight size={16} />
              </div>
              <ExerciseList exercises={tomorrowInfo?.workout?.exercises} isDimmed />
            </div>
          </div>

          {/* ── Full Week Plan (Mon → Sun) ────────────────────────────── */}
          <div className="card">
            <h3 className="card-heading">Full Week Plan</h3>
            <div className="week-list">
              {planData.map((d, i) => {
                const isToday = d.day === todayInfo?.dayName
                const isRest = d.exercises?.length === 1 && d.exercises[0]?.name?.toLowerCase().includes('rest')
                return (
                  <div key={i} className={`week-row ${isToday ? 'today' : ''}`} onClick={() => setSelectedDay(d)} style={{ cursor: 'pointer' }}>
                    <span className="week-day">{d.day.slice(0, 3)}</span>
                    <span className="week-workout">
                      {isRest ? 'Rest Day' : d.exercises?.map(e => e.name).join(', ')}
                    </span>
                    <span className={`week-status ${isToday ? 'active' : ''}`}>
                      {isToday ? (todayCompleted ? '✓' : 'Today') : '—'}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── Modal for Selected Day ─────────────────────────────── */}
      {selectedDay && (
        <div className="modal-overlay" onClick={() => setSelectedDay(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selectedDay.day} Workout</h3>
              <button className="btn-close" onClick={() => setSelectedDay(null)}>✕</button>
            </div>
            <div className="modal-body">
              <ExerciseList exercises={selectedDay.exercises} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}