import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Zap, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { api } from '../services/api'
import './Auth.css'

export default function AuthPage() {
  const { login } = useApp()

  // mode: login | register | otp | forgot | reset
  const location = useLocation()
  const [mode, setMode] = useState(() => {
    return new URLSearchParams(location.search).get('signup') === 'true' ? 'register' : 'login'
  })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Auth form fields
  const [form, setForm] = useState({
    name: '', email: '', password: '',
    age: '', height: '', weight: '',
    goal: 'Build Muscle', level: 'Beginner',
  })

  // OTP / reset fields
  const [userId, setUserId] = useState(null)
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [forgotEmail, setForgotEmail] = useState('')

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const clearMessages = () => { setError(''); setSuccess('') }

  // ── Register ─────────────────────────────────────────────────────────────
  const handleRegister = async (e) => {
    e.preventDefault()
    clearMessages(); setLoading(true)
    try {
      const body = {
        name: form.name,
        email: form.email,
        password: form.password,
        ...(form.age    ? { age:    Number(form.age) }    : {}),
        ...(form.height ? { height: Number(form.height) } : {}),
        ...(form.weight ? { weight: Number(form.weight) } : {}),
        goal:  form.goal,
        level: form.level,
      }
      const data = await api.register(body)
      setUserId(data.userId)
      setSuccess(data.message)
      setMode('otp')
    } catch (err) {
      setError(err.message)
    } finally { setLoading(false) }
  }

  // ── Login ────────────────────────────────────────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault()
    clearMessages(); setLoading(true)
    try {
      const data = await api.login({ email: form.email, password: form.password })
      login(data.token, data.user)
    } catch (err) {
      // If unverified, the backend sends userId so we can show OTP form
      if (err.message.includes('not verified')) {
        try {
          const resp = await api.login({ email: form.email, password: form.password }).catch(() => null)
          // Parse userId from error response — we need a different approach
        } catch (_) {}
        setError(err.message + ' Use the Register flow to get a new OTP.')
      } else {
        setError(err.message)
      }
    } finally { setLoading(false) }
  }

  // ── Verify OTP ───────────────────────────────────────────────────────────
  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    clearMessages(); setLoading(true)
    try {
      const data = await api.verifyOtp({ userId, otp })
      setSuccess(data.message)
      localStorage.setItem('fitai_plan_generating', 'true')
      login(data.token, data.user)
    } catch (err) {
      setError(err.message)
    } finally { setLoading(false) }
  }

  // ── Resend OTP ───────────────────────────────────────────────────────────
  const handleResendOtp = async () => {
    clearMessages(); setLoading(true)
    try {
      const data = await api.resendOtp({ userId })
      setSuccess(data.message)
    } catch (err) {
      setError(err.message)
    } finally { setLoading(false) }
  }

  // ── Forgot Password ─────────────────────────────────────────────────────
  const handleForgotPassword = async (e) => {
    e.preventDefault()
    clearMessages(); setLoading(true)
    try {
      const data = await api.forgotPassword({ email: forgotEmail })
      setSuccess(data.message)
      if (data.userId) {
        setUserId(data.userId)
        setMode('reset')
      }
    } catch (err) {
      setError(err.message)
    } finally { setLoading(false) }
  }

  // ── Reset Password ──────────────────────────────────────────────────────
  const handleResetPassword = async (e) => {
    e.preventDefault()
    clearMessages(); setLoading(true)
    try {
      const data = await api.resetPassword({ userId, otp, newPassword })
      setSuccess(data.message)
      setTimeout(() => { setMode('login'); clearMessages() }, 2000)
    } catch (err) {
      setError(err.message)
    } finally { setLoading(false) }
  }

  // ── Render helpers ───────────────────────────────────────────────────────
  const Spinner = () => <Loader2 size={16} className="spin-icon" />

  return (
    <div className="auth-bg">
      <div className="orb orb1" />
      <div className="orb orb2" />

      <div className="auth-card fade-up">
        <div className="auth-logo">
          <Zap size={24} />
          <span>FitAI</span>
        </div>

        {/* ── OTP Verification ─────────────────────────────────────────── */}
        {mode === 'otp' && (
          <>
            <h1 className="auth-title">Verify your email</h1>
            <p className="auth-sub">Enter the 6-digit OTP sent to your email.</p>
            {error && <div className="auth-error">{error}</div>}
            {success && <div className="auth-success">{success}</div>}
            <form onSubmit={handleVerifyOtp} className="auth-form">
              <div className="form-group">
                <label className="label">OTP Code</label>
                <input
                  name="otp" type="text" placeholder="123456"
                  value={otp} onChange={e => setOtp(e.target.value)}
                  maxLength={6} required
                  style={{ textAlign: 'center', letterSpacing: 8, fontSize: 22, fontFamily: 'var(--font-mono)' }}
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: 8 }} disabled={loading}>
                {loading ? <Spinner /> : <>Verify <ArrowRight size={16} /></>}
              </button>
            </form>
            <p className="auth-switch">
              Didn't receive it?{' '}
              <button className="switch-btn" onClick={handleResendOtp} disabled={loading}>Resend OTP</button>
            </p>
          </>
        )}

        {/* ── Forgot Password ──────────────────────────────────────────── */}
        {mode === 'forgot' && (
          <>
            <h1 className="auth-title">Forgot password?</h1>
            <p className="auth-sub">Enter your email to receive a reset OTP.</p>
            {error && <div className="auth-error">{error}</div>}
            {success && <div className="auth-success">{success}</div>}
            <form onSubmit={handleForgotPassword} className="auth-form">
              <div className="form-group">
                <label className="label">Email</label>
                <input name="email" type="email" placeholder="you@email.com" value={forgotEmail} onChange={e => setForgotEmail(e.target.value)} required />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: 8 }} disabled={loading}>
                {loading ? <Spinner /> : <>Send OTP <ArrowRight size={16} /></>}
              </button>
            </form>
            <p className="auth-switch">
              <button className="switch-btn" onClick={() => { setMode('login'); clearMessages() }}>Back to Sign In</button>
            </p>
          </>
        )}

        {/* ── Reset Password ───────────────────────────────────────────── */}
        {mode === 'reset' && (
          <>
            <h1 className="auth-title">Reset password</h1>
            <p className="auth-sub">Enter the OTP from your email and your new password.</p>
            {error && <div className="auth-error">{error}</div>}
            {success && <div className="auth-success">{success}</div>}
            <form onSubmit={handleResetPassword} className="auth-form">
              <div className="form-group">
                <label className="label">OTP Code</label>
                <input type="text" placeholder="123456" value={otp} onChange={e => setOtp(e.target.value)} maxLength={6} required
                  style={{ textAlign: 'center', letterSpacing: 8, fontSize: 22, fontFamily: 'var(--font-mono)' }}
                />
              </div>
              <div className="form-group">
                <label className="label">New Password</label>
                <input type="password" placeholder="••••••••" value={newPassword} onChange={e => setNewPassword(e.target.value)} required minLength={6} />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: 8 }} disabled={loading}>
                {loading ? <Spinner /> : <>Reset Password <ArrowRight size={16} /></>}
              </button>
            </form>
            <p className="auth-switch">
              <button className="switch-btn" onClick={() => { setMode('login'); clearMessages() }}>Back to Sign In</button>
            </p>
          </>
        )}

        {/* ── Login / Register ─────────────────────────────────────────── */}
        {(mode === 'login' || mode === 'register') && (
          <>
            <h1 className="auth-title">{mode === 'login' ? 'Welcome back.' : 'Get started.'}</h1>
            <p className="auth-sub">{mode === 'login' ? 'Your AI trainer is waiting.' : 'Build your best self with AI.'}</p>
            {error && <div className="auth-error">{error}</div>}
            {success && <div className="auth-success">{success}</div>}

            <form onSubmit={mode === 'login' ? handleLogin : handleRegister} className="auth-form">
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
                  <div className="form-row two-col">
                    <div className="form-group">
                      <label className="label">Level</label>
                      <select name="level" value={form.level} onChange={handle}>
                        <option>Beginner</option>
                        <option>Intermediate</option>
                        <option>Advanced</option>
                      </select>
                    </div>
                    <div className="form-group" />
                  </div>
                </>
              )}
              <div className="form-group">
                <label className="label">Email</label>
                <input name="email" type="email" placeholder="alex@email.com" value={form.email} onChange={handle} required />
              </div>
              <div className="form-group" style={{ position: 'relative' }}>
                <label className="label">Password</label>
                <input name="password" type={showPass ? 'text' : 'password'} placeholder="••••••••" value={form.password} onChange={handle} required minLength={6} style={{ paddingRight: 44 }} />
                <button type="button" className="eye-btn" onClick={() => setShowPass(!showPass)}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: 8 }} disabled={loading}>
                {loading ? <Spinner /> : <>{mode === 'login' ? 'Sign In' : 'Create Account'} <ArrowRight size={16} /></>}
              </button>
            </form>

            <p className="auth-switch">
              {mode === 'login' ? (
                <>
                  Don't have an account?{' '}
                  <button className="switch-btn" onClick={() => { setMode('register'); clearMessages() }}>Register</button>
                  {' · '}
                  <button className="switch-btn" onClick={() => { setMode('forgot'); clearMessages() }}>Forgot Password?</button>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <button className="switch-btn" onClick={() => { setMode('login'); clearMessages() }}>Sign In</button>
                </>
              )}
            </p>
          </>
        )}
      </div>
    </div>
  )
}
