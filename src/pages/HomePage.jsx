import { useState } from 'react'
import { Download, CheckSquare, Square, ChevronRight, Flame, Dumbbell, Clock, TrendingUp } from 'lucide-react'
import { useApp } from '../context/AppContext'
import './HomePage.css'
import { downloadWorkoutPDF } from '../utils/pdfGenerator';

const weekPlan = [
  { day: 'Mon', workout: 'Upper Body Strength', done: true },
  { day: 'Tue', workout: 'HIIT Cardio', done: true },
  { day: 'Wed', workout: 'Rest & Recovery', done: true },
  { day: 'Thu', workout: 'Lower Body Power', done: false },
  { day: 'Fri', workout: 'Core & Mobility', done: false },
  { day: 'Sat', workout: 'Full Body Circuit', done: false },
  { day: 'Sun', workout: 'Active Rest', done: false },
]

const todayChecklist = [
  { id: 1, task: '3 sets of bench press (12 reps)', done: true },
  { id: 2, task: '4 sets of pull-ups (8 reps)', done: true },
  { id: 3, task: 'Shoulder press (3×10)', done: false },
  { id: 4, task: 'Tricep dips (3×12)', done: false },
  { id: 5, task: '10 min cool-down stretch', done: false },
]

export default function HomePage() {
  const { user, streak } = useApp()
  const [checklist, setChecklist] = useState(todayChecklist)

  const toggle = id => setChecklist(c => c.map(t => t.id === id ? { ...t, done: !t.done } : t))
  const completed = checklist.filter(t => t.done).length
  const progress = Math.round((completed / checklist.length) * 100)

  return (
    <div className="page fade-up">
      <div className="page-header">
        <div>
          <h1 className="page-title">Hey, {user.name.split(' ')[0]} 👋</h1>
          <p className="page-sub">Ready to crush today's session?</p>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={() => downloadWorkoutPDF(workoutData)}>
          <Download size={15} /> Download Plan PDF
        </button>
      </div>

      {/* Stats bar */}
      <div className="stats-row">
        {[
          { icon: Flame, label: 'Day Streak', value: streak, color: '#ffa502' },
          { icon: Dumbbell, label: 'Workouts Done', value: 47, color: 'var(--accent)' },
          { icon: Clock, label: 'Avg Duration', value: '42 min', color: 'var(--accent2)' },
          { icon: TrendingUp, label: 'This Week', value: '3/5', color: '#a78bfa' },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="stat-card card">
            <Icon size={20} style={{ color }} />
            <div className="stat-val">{value}</div>
            <div className="stat-label">{label}</div>
          </div>
        ))}
      </div>

      <div className="home-grid">
        {/* AI Info Banner */}
        <div className="card ai-banner">
          <div className="ai-glow" />
          <span className="ai-tag">AI Recommendation</span>
          <h3>Today: Upper Body Strength</h3>
          <p>Based on your recovery data and last session, today focuses on chest, back, and shoulders. Estimated 45 minutes.</p>
          <div className="plan-pills">
            <span className="pill">Chest</span>
            <span className="pill">Back</span>
            <span className="pill">Shoulders</span>
            <span className="pill accent-pill">Intermediate</span>
          </div>
        </div>

        {/* Week Plan */}
        <div className="card">
          <h3 className="card-heading">Weekly Plan</h3>
          <div className="week-list">
            {weekPlan.map((d, i) => (
              <div key={d.day} className={`week-row ${i === 3 ? 'today' : ''}`}>
                <span className="week-day">{d.day}</span>
                <span className="week-workout">{d.workout}</span>
                <span className={`week-status ${d.done ? 'done' : i === 3 ? 'active' : ''}`}>
                  {d.done ? '✓' : i === 3 ? 'Today' : '—'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Daily Checklist */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 className="card-heading" style={{ margin: 0 }}>Today's Checklist</h3>
            <span className="progress-badge">{completed}/{checklist.length}</span>
          </div>
          <div className="progress-bar-wrap">
            <div className="progress-bar" style={{ width: `${progress}%` }} />
          </div>
          <div className="checklist">
            {checklist.map(t => (
              <button key={t.id} className={`check-item ${t.done ? 'checked' : ''}`} onClick={() => toggle(t.id)}>
                {t.done ? <CheckSquare size={16} /> : <Square size={16} />}
                <span>{t.task}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Last Workout */}
        <div className="card">
          <h3 className="card-heading">Last Workout</h3>
          <div className="last-workout">
            <div className="lw-header">
              <div>
                <div className="lw-name">Lower Body Power</div>
                <div className="lw-meta">2 days ago · 52 min</div>
              </div>
              <span className="pill accent-pill">Completed</span>
            </div>
            <div className="lw-stats">
              {[['Sets', '18'], ['Reps', '174'], ['Vol.', '3,240 kg']].map(([k, v]) => (
                <div key={k} className="lw-stat">
                  <div className="lw-stat-val">{v}</div>
                  <div className="lw-stat-key">{k}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}




const workoutData = [
    { 
        day: 'Monday', 
        exercises: [
            { name: 'Push-ups', sets: '3 sets × 12 reps' },
            { name: 'Bench Press', sets: '4 sets × 8 reps' },
            { name: 'Dumbbell Flies', sets: '3 sets × 10 reps' },
            { name: 'Tricep Dips', sets: '3 sets × 12 reps' }
        ]
    },
    { 
        day: 'Tuesday', 
        exercises: [
            { name: 'Squats', sets: '4 sets × 10 reps' },
            { name: 'Leg Press', sets: '3 sets × 12 reps' },
            { name: 'Lunges', sets: '3 sets × 10 reps' },
            { name: 'Leg Curls', sets: '3 sets × 12 reps' }
        ]
    },
    { 
        day: 'Wednesday', 
        exercises: [
            { name: 'Cardio Run', sets: '5 km • 40 min' },
            { name: 'Jump Rope', sets: '3 sets × 50 reps' },
            { name: 'Burpees', sets: '3 sets × 15 reps' },
            { name: 'Mountain Climbers', sets: '3 sets × 30 sec' }
        ]
    },
    { 
        day: 'Thursday', 
        exercises: [
            { name: 'Pull-ups', sets: '4 sets × 8 reps' },
            { name: 'Barbell Rows', sets: '4 sets × 10 reps' },
            { name: 'Lat Pulldowns', sets: '3 sets × 12 reps' },
            { name: 'Bicep Curls', sets: '3 sets × 10 reps' }
        ]
    },
    { 
        day: 'Friday', 
        exercises: [
            { name: 'Deadlifts', sets: '4 sets × 6 reps' },
            { name: 'Shoulder Press', sets: '3 sets × 10 reps' },
            { name: 'Lateral Raises', sets: '3 sets × 12 reps' },
            { name: 'Face Pulls', sets: '3 sets × 15 reps' }
        ]
    },
    { 
        day: 'Saturday', 
        exercises: [
            { name: 'Basketball', sets: '60 min' },
            { name: 'Agility Ladder', sets: '3 sets × 1 min' },
            { name: 'Box Jumps', sets: '3 sets × 10 reps' },
            { name: 'Sprint Training', sets: '6 × 100m' }
        ]
    },
    { 
        day: 'Sunday', 
        exercises: [
            { name: 'Yoga', sets: '45 min' },
            { name: 'Stretching', sets: '20 min' },
            { name: 'Meditation', sets: '15 min' },
            { name: 'Walking', sets: '30 min • Casual' }
        ]
    }
];