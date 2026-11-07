// App.jsx — Route definitions with role-based guards
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'

// Pages
import { LoginPage }       from './pages/LoginPage'
import { AdminDashboard }  from './pages/admin/AdminDashboard'
import { QuestionManager } from './pages/admin/QuestionManager'
import { StudentManager }  from './pages/admin/StudentManager'
import { ResultsViewer }   from './pages/admin/ResultsViewer'
import { StudentDashboard } from './pages/student/StudentDashboard'
import { TakeTest }        from './pages/student/TakeTest'
import { ResultDetail }    from './pages/student/ResultDetail'
import { StudentResults }  from './pages/student/StudentResults'

// ── Guards ─────────────────────────────────────────────────────────────────────
function RequireAuth({ children, role }) {
  const { currentUser, loading } = useAuth()
  if (loading) return <div className="min-h-screen bg-[#07090e]" />
  if (!currentUser) return <Navigate to="/login" replace />
  if (role && currentUser.role !== role) {
    return <Navigate to={currentUser.role === 'admin' ? '/admin' : '/student'} replace />
  }
  return children
}

function RedirectIfLoggedIn({ children }) {
  const { currentUser, loading } = useAuth()
  if (loading) return <div className="min-h-screen bg-[#07090e]" />
  if (currentUser) {
    return <Navigate to={currentUser.role === 'admin' ? '/admin' : '/student'} replace />
  }
  return children
}

// ── App ────────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route
        path="/login"
        element={
          <RedirectIfLoggedIn>
            <LoginPage />
          </RedirectIfLoggedIn>
        }
      />

      {/* Admin routes */}
      <Route
        path="/admin"
        element={<RequireAuth role="admin"><AdminDashboard /></RequireAuth>}
      />
      <Route
        path="/admin/questions"
        element={<RequireAuth role="admin"><QuestionManager /></RequireAuth>}
      />
      <Route
        path="/admin/students"
        element={<RequireAuth role="admin"><StudentManager /></RequireAuth>}
      />
      <Route
        path="/admin/results"
        element={<RequireAuth role="admin"><ResultsViewer /></RequireAuth>}
      />

      {/* Student routes */}
      <Route
        path="/student"
        element={<RequireAuth role="student"><StudentDashboard /></RequireAuth>}
      />
      <Route
        path="/student/test"
        element={<RequireAuth role="student"><TakeTest /></RequireAuth>}
      />
      <Route
        path="/student/results"
        element={<RequireAuth role="student"><StudentResults /></RequireAuth>}
      />
      <Route
        path="/student/results/:id"
        element={<RequireAuth role="student"><ResultDetail /></RequireAuth>}
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
