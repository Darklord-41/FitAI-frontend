import { useState } from 'react'
import { Play, ExternalLink, Search, Filter } from 'lucide-react'
import './WorkoutPage.css'

const categories = ['All', 'Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core', 'Cardio', 'HIIT']

const workouts = [
  { id:1, title:'Chest Day Fundamentals', category:'Chest', duration:'45 min', level:'Intermediate', ytId:'ykJmrZ5v0Oo', thumb:'https://img.youtube.com/vi/ykJmrZ5v0Oo/mqdefault.jpg', views:'2.4M', channel:'Jeff Nippard' },
  { id:2, title:'Full Back Workout', category:'Back', duration:'52 min', level:'Intermediate', ytId:'V8dZ3pyiCBo', thumb:'https://img.youtube.com/vi/V8dZ3pyiCBo/mqdefault.jpg', views:'1.8M', channel:'AthleanX' },
  { id:3, title:'Leg Day Destroyer', category:'Legs', duration:'60 min', level:'Advanced', ytId:'4Go2PKbllzU', thumb:'https://img.youtube.com/vi/4Go2PKbllzU/mqdefault.jpg', views:'3.1M', channel:'Chris Bumstead' },
  { id:4, title:'HIIT Cardio Blast', category:'HIIT', duration:'30 min', level:'Beginner', ytId:'ml6cT4AZdqI', thumb:'https://img.youtube.com/vi/ml6cT4AZdqI/mqdefault.jpg', views:'5.2M', channel:'MuscleBlaze' },
  { id:5, title:'Shoulder & Arms Combo', category:'Shoulders', duration:'40 min', level:'Intermediate', ytId:'6kALZikXxLc', thumb:'https://img.youtube.com/vi/6kALZikXxLc/mqdefault.jpg', views:'1.1M', channel:'Jeff Nippard' },
  { id:6, title:'Core Power Session', category:'Core', duration:'25 min', level:'Beginner', ytId:'DHD1-2P4jJQ', thumb:'https://img.youtube.com/vi/DHD1-2P4jJQ/mqdefault.jpg', views:'4.7M', channel:'FitnessBlender' },
]

const levelColor = l => l === 'Beginner' ? 'var(--accent)' : l === 'Intermediate' ? 'var(--warn)' : 'var(--danger)'

export default function WorkoutPage() {
  const [active, setActive] = useState('All')
  const [search, setSearch] = useState('')

  const filtered = workouts.filter(w =>
    (active === 'All' || w.category === active) &&
    w.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="page fade-up">
      <div className="page-header">
        <div>
          <h1 className="page-title">Workout Library</h1>
          <p className="page-sub">AI-curated tutorial videos from top coaches.</p>
        </div>
      </div>

      {/* Search + filter */}
      <div className="wo-toolbar">
        <div className="search-wrap">
          <Search size={15} className="search-icon" />
          <input placeholder="Search workouts…" value={search} onChange={e => setSearch(e.target.value)} className="search-input" />
        </div>
      </div>

      {/* Category tabs */}
      <div className="cat-tabs">
        {categories.map(c => (
          <button key={c} className={`cat-tab ${active === c ? 'active' : ''}`} onClick={() => setActive(c)}>{c}</button>
        ))}
      </div>

      {/* Videos grid */}
      <div className="wo-grid">
        {filtered.map(w => (
          <div key={w.id} className="wo-card card">
            <div className="wo-thumb">
              <img src={w.thumb} alt={w.title} onError={e => { e.target.style.display='none' }} />
              <div className="wo-overlay">
                <button className="play-btn" onClick={() => window.open(`https://youtube.com/watch?v=${w.ytId}`, '_blank')}>
                  <Play size={22} fill="white" />
                </button>
              </div>
              <span className="wo-duration">{w.duration}</span>
            </div>
            <div className="wo-info">
              <div className="wo-meta-row">
                <span className="wo-category">{w.category}</span>
                <span className="wo-level" style={{ color: levelColor(w.level) }}>{w.level}</span>
              </div>
              <h3 className="wo-title">{w.title}</h3>
              <div className="wo-channel-row">
                <span className="wo-channel">{w.channel}</span>
                <span className="wo-views">{w.views} views</span>
              </div>
              <button
                className="btn btn-ghost btn-sm wo-btn"
                onClick={() => window.open(`https://youtube.com/watch?v=${w.ytId}`, '_blank')}
              >
                <ExternalLink size={13} /> Watch on YouTube
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="empty-state card">
          <Dumbbell size={40} style={{ color:'var(--text3)', marginBottom:12 }} />
          <p style={{ color:'var(--text2)' }}>No workouts found for "{search}"</p>
        </div>
      )}
    </div>
  )
}
