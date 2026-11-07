/* eslint-disable react-refresh/only-export-components */
// AuthContext.jsx — manages login state and current user with Cloudflare Worker & D1
import { createContext, useContext, useState, useEffect } from 'react'
import { useData } from './DataContext'
import { api } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const { students } = useData()
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('cca_session')
      return saved ? JSON.parse(saved) : null
    } catch {
      localStorage.removeItem('cca_session')
      localStorage.removeItem('cca_token')
      return null
    }
  })
  const [loading, setLoading] = useState(false)
  const [authServiceOnline, setAuthServiceOnline] = useState(null)

  // Check backend health on mount
  useEffect(() => {
    let mounted = true
    api.checkHealth().then((res) => {
      if (mounted) {
        setAuthServiceOnline(Boolean(res?.status === 'online'))
      }
    }).catch(() => {
      if (mounted) setAuthServiceOnline(false)
    })
    return () => {
      mounted = false
    }
  }, [])

  const login = async (username, password) => {
    setLoading(true)
    try {
      // 1. Try Cloudflare Worker D1 Auth API first
      const res = await api.login(username, password)

      if (res.success && res.user) {
        const user = {
          id: res.user.id,
          username: res.user.username,
          name: res.user.name,
          role: res.user.role,
        }
        setCurrentUser(user)
        localStorage.setItem('cca_session', JSON.stringify(user))
        if (res.token) {
          localStorage.setItem('cca_token', res.token)
        }
        setAuthServiceOnline(true)
        setLoading(false)
        return { success: true, role: user.role }
      }

      // 2. If API returned explicit failure (e.g. 401 invalid credentials)
      if (!res.networkError) {
        setLoading(false)
        return { success: false, error: res.error || 'Invalid username or password' }
      }

      // 3. Fallback for offline dev mode if Worker is not currently running
      console.warn('[AuthContext] Backend offline or unreachable. Testing local fallback.')
      setAuthServiceOnline(false)

      // Local Admin check
      if (username === 'admin' && password === 'admin123') {
        const user = { id: 'admin', username: 'admin', role: 'admin', name: 'Administrator' }
        setCurrentUser(user)
        localStorage.setItem('cca_session', JSON.stringify(user))
        setLoading(false)
        return { success: true, role: 'admin', offlineFallback: true }
      }

      // Local Student check
      const student = students.find(
        (s) => s.username?.toLowerCase() === username.toLowerCase() && s.password === password
      )
      if (student) {
        const user = { ...student, role: 'student' }
        setCurrentUser(user)
        localStorage.setItem('cca_session', JSON.stringify(user))
        setLoading(false)
        return { success: true, role: 'student', offlineFallback: true }
      }

      setLoading(false)
      return {
        success: false,
        error: res.error || 'Invalid username or password',
      }
    } catch (err) {
      setLoading(false)
      return {
        success: false,
        error: err.message || 'Authentication request failed.',
      }
    }
  }

  const logout = () => {
    setCurrentUser(null)
    localStorage.removeItem('cca_session')
    localStorage.removeItem('cca_token')
  }

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        login,
        logout,
        loading,
        authServiceOnline,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
