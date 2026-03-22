import { useState } from 'react'
import { Zap, Eye, EyeOff, ArrowRight } from 'lucide-react'
import { useApp } from '../context/AppContext'
import './Auth.css'

export default function AuthPage() {
  const { setIsLoggedIn } = useApp()
  const [mode, setMode] = useState('login') // login | register
  const [showPass, setShowPass] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '', age: '', height: '', weight: '', goal: 'Build Muscle' })

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  const submit = e => { e.preventDefault(); setIsLoggedIn(true) }

  return (
    <div className="auth-bg">
      {/* Ambient orbs */}
      <div className="orb orb1" />
      <div className="orb orb2" />

      <div className="auth-card fade-up">
        <div className="auth-logo">
          <Zap size={24} />
          <span>FitAI</span>
        </div>
        <h1 className="auth-title">{mode === 'login' ? 'Welcome back.' : 'Get started.'}</h1>
        <p className="auth-sub">{mode === 'login' ? 'Your AI trainer is waiting.' : 'Build your best self with AI.'}</p>

        <form onSubmit={submit} className="auth-form">
          {mode === 'register' && (
            <>
              <div className="form-row">
                <div className="form-group">
                  <label className="label">Full Name</label>
                  <input name="name" placeholder="Alex Carter" value={form.name} onChange={handle} required />
                </div>
              </div>
              <div className="form-row two-col">
                <div className="form-group">
                  <label className="label">Age</label>
                  <input name="age" type="number" placeholder="28" value={form.age} onChange={handle} />
                </div>
                <div className="form-group">
                  <label className="label">Goal</label>
                  <select name="goal" value={form.goal} onChange={handle}>
                    <option>Build Muscle</option>
                    <option>Lose Weight</option>
                    <option>Stay Fit</option>
                    <option>Endurance</option>
                  </select>
                </div>
              </div>
              <div className="form-row two-col">
                <div className="form-group">
                  <label className="label">Height (cm)</label>
                  <input name="height" type="number" placeholder="178" value={form.height} onChange={handle} />
                </div>
                <div className="form-group">
                  <label className="label">Weight (kg)</label>
                  <input name="weight" type="number" placeholder="75" value={form.weight} onChange={handle} />
                </div>
              </div>
            </>
          )}
          <div className="form-group">
            <label className="label">Email</label>
            <input name="email" type="email" placeholder="alex@email.com" value={form.email} onChange={handle} required />
          </div>
          <div className="form-group" style={{ position: 'relative' }}>
            <label className="label">Password</label>
            <input name="password" type={showPass ? 'text' : 'password'} placeholder="••••••••" value={form.password} onChange={handle} required style={{ paddingRight: 44 }} />
            <button type="button" className="eye-btn" onClick={() => setShowPass(!showPass)}>
              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: 8 }}>
            {mode === 'login' ? 'Sign In' : 'Create Account'} <ArrowRight size={16} />
          </button>
        </form>

        <p className="auth-switch">
          {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
          {' '}
          <button className="switch-btn" onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
            {mode === 'login' ? 'Register' : 'Sign In'}
          </button>
        </p>
      </div>
    </div>
  )
}
