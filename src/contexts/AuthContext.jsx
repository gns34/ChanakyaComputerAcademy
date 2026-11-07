/* eslint-disable react-refresh/only-export-components */
// AuthContext.jsx — manages login state and current user
import { createContext, useContext, useState } from 'react'
import { useData } from './DataContext'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const { students } = useData()
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('cca_session')
      return saved ? JSON.parse(saved) : null
    } catch {
      localStorage.removeItem('cca_session')
      return null
    }
  })
  const loading = false

  const login = (username, password) => {
    // Admin check
    if (username === 'admin' && password === 'admin123') {
      const user = { id: 'admin', username: 'admin', role: 'admin', name: 'Admin' }
      setCurrentUser(user)
      localStorage.setItem('cca_session', JSON.stringify(user))
      return { success: true, role: 'admin' }
    }

    // Student check
    const student = students.find(
      (s) => s.username === username && s.password === password
    )
    if (student) {
      const user = { ...student, role: 'student' }
      setCurrentUser(user)
      localStorage.setItem('cca_session', JSON.stringify(user))
      return { success: true, role: 'student' }
    }

    return { success: false, error: 'Invalid username or password' }
  }

  const logout = () => {
    setCurrentUser(null)
    localStorage.removeItem('cca_session')
  }

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
