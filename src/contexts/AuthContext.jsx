// AuthContext.jsx — manages login state and current user
import { createContext, useContext, useState, useEffect } from 'react'
import { useData } from './DataContext'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const { students } = useData()
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Restore session from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('cca_session')
    if (saved) {
      try {
        setCurrentUser(JSON.parse(saved))
      } catch {
        localStorage.removeItem('cca_session')
      }
    }
    setLoading(false)
  }, [])

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
