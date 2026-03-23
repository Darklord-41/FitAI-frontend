const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const API_ROOT = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'

const getToken = () => localStorage.getItem('fitai_token')

const req = async (method, path, body) => {
  const token = getToken()
  const opts = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  }
  if (body) opts.body = JSON.stringify(body)

  const res = await fetch(`${BASE}${path}`, opts)
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Request failed')
  return data
}

export const api = {
  // Auth
  register:       (body) => req('POST', '/auth/register', body),
  verifyOtp:      (body) => req('POST', '/auth/verify-otp', body),
  resendOtp:      (body) => req('POST', '/auth/resend-otp', body),
  login:          (body) => req('POST', '/auth/login', body),
  me:             ()     => req('GET',  '/auth/me'),
  forgotPassword: (body) => req('POST', '/auth/forgot-password', body),
  resetPassword:  (body) => req('POST', '/auth/reset-password', body),

  // User
  getProfile:     ()     => req('GET',    '/user/profile'),
  updateProfile:  (body) => req('PUT',    '/user/profile', body),
  updateSettings: (body) => req('PUT',    '/user/settings', body),
  changePassword: (body) => req('PUT',    '/user/password', body),
  deleteAccount:  (body) => req('DELETE', '/user/account', body),

  // Avatar upload (FormData, not JSON)
  uploadAvatar: async (file) => {
    const token = getToken()
    const formData = new FormData()
    formData.append('avatar', file)
    const res = await fetch(`${BASE}/user/avatar`, {
      method: 'POST',
      headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: formData,
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Upload failed')
    return data
  },

  // Fitness Plan (AI-generated weekly plan)
  getPlan:              ()  => req('GET',  '/fitness/plan'),
  completeTodayWorkout: ()  => req('POST', '/fitness/complete-today'),
  undoTodayWorkout:     ()  => req('POST', '/fitness/undo-today'),
  generatePlan:         ()  => req('POST', '/fitness/recommend'),

  // Workouts (legacy CRUD)
  getWorkouts:      (page = 1, limit = 50) => req('GET', `/workouts?page=${page}&limit=${limit}`),
  createWorkout:    (body)   => req('POST', '/workouts', body),
  getWorkoutById:   (id)     => req('GET',  `/workouts/${id}`),
  updateWorkout:    (id, body) => req('PUT', `/workouts/${id}`, body),
  completeWorkout:  (id)     => req('PUT',  `/workouts/${id}/complete`),
  deleteWorkout:    (id)     => req('DELETE', `/workouts/${id}`),

  // Streak
  getStreakData:   ()  => req('GET',  '/workouts/streak'),
  markRestDay:     ()  => req('POST', '/workouts/streak/rest'),

  // Helpers
  avatarUrl: (path) => path ? `${API_ROOT}${path}` : null,
}
