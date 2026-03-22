const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const getToken = () => localStorage.getItem('fitai_token')

const req = async (method, path, body) => {
  const token = getToken()
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Request failed')
  return data
}

export const api = {
  // Auth
  register: (body) => req('POST', '/auth/register', body),
  login:    (body) => req('POST', '/auth/login', body),
  me:       ()     => req('GET',  '/auth/me'),

  // User
  getProfile:     ()     => req('GET',    '/user/profile'),
  updateProfile:  (body) => req('PUT',    '/user/profile', body),
  updateSettings: (body) => req('PUT',    '/user/settings', body),
  changePassword: (body) => req('PUT',    '/user/password', body),
  deleteAccount:  ()     => req('DELETE', '/user/account'),

  // Workouts
  getWorkouts:     ()          => req('GET',  '/workouts'),
  createWorkout:   (body)      => req('POST', '/workouts', body),
  completeWorkout: (id)        => req('PUT',  `/workouts/${id}/complete`),
  getStreakData:   ()          => req('GET',  '/workouts/streak'),
}
