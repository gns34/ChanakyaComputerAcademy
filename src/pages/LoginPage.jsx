// LoginPage.jsx — Shared login for admin & student
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { GraduationCap, Eye, EyeOff, AlertCircle } from 'lucide-react'

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.username.trim() || !form.password.trim()) {
      setError('Please enter both username and password.')
      return
    }
    setLoading(true)
    await new Promise((r) => setTimeout(r, 400)) // small UX delay
    const result = login(form.username.trim(), form.password)
    setLoading(false)
    if (result.success) {
      navigate(result.role === 'admin' ? '/admin' : '/student', { replace: true })
    } else {
      setError(result.error)
    }
  }

  return (
    <div className="min-h-screen bg-[#121212] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10 gap-3">
          <div className="w-16 h-16 rounded-full bg-[#1ed760] flex items-center justify-center">
            <GraduationCap size={32} className="text-black" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white">Chanakya</h1>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#1ed760] mt-0.5">
              Computer Academy
            </p>
          </div>
        </div>

        {/* Card */}
        <div
          className="bg-[#181818] rounded-[8px] px-8 py-8"
          style={{ boxShadow: 'rgba(0,0,0,0.5) 0px 8px 24px' }}
        >
          <h2 className="text-lg font-bold text-white mb-6 text-center">Log In</h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
            <Input
              label="Username"
              placeholder="Enter username"
              autoComplete="username"
              value={form.username}
              onChange={(e) => setForm((p) => ({ ...p, username: e.target.value }))}
            />

            <div className="relative">
              <Input
                label="Password"
                type={showPass ? 'text' : 'password'}
                placeholder="Enter password"
                autoComplete="current-password"
                value={form.password}
                onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowPass((v) => !v)}
                className="absolute right-3 bottom-3 text-[#7c7c7c] hover:text-white transition-colors"
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-[6px] bg-[#f3727f]/10 border border-[#f3727f]/30">
                <AlertCircle size={14} className="text-[#f3727f] flex-shrink-0" />
                <p className="text-xs text-[#f3727f]">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={loading}
              className="w-full mt-2"
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </Button>
          </form>
        </div>

        {/* Hint */}
        <p className="text-center text-xs text-[#4d4d4d] mt-6">
          Admin: <span className="text-[#7c7c7c]">admin / admin123</span>
          &nbsp;&bull;&nbsp;
          Students: use credentials provided by admin
        </p>
      </div>
    </div>
  )
}
