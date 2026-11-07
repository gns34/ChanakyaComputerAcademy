// LoginPage.jsx — Shared login for admin & student with futuristic tech theme
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { TechBackground } from '../components/layout/TechBackground'
import logoImg from '../assets/logo.png'
import { Eye, EyeOff, AlertCircle, ShieldCheck } from 'lucide-react'

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
    <div className="relative min-h-screen bg-[#07090e] flex items-center justify-center p-4 overflow-hidden">
      {/* Technology Inspired Gradient Background */}
      <TechBackground variant="login" />

      <div className="relative z-10 w-full max-w-sm animate-scale-in">
        {/* Logo & Portal Header */}
        <div className="flex flex-col items-center mb-8 gap-3">
          <div className="relative group cursor-default">
            {/* Ambient cyber halo */}
            <div className="absolute -inset-2 rounded-2xl bg-gradient-to-r from-[#1ed760] via-[#00f2fe] to-[#1ed760] opacity-40 blur-md animate-tech-pulse transition-opacity duration-300 group-hover:opacity-65" />
            <div className="relative w-20 h-20 rounded-2xl bg-[#181818]/90 border border-white/10 p-2.5 flex items-center justify-center shadow-[0_0_30px_rgba(30,215,96,0.35)] transition-transform duration-300 group-hover:scale-105">
              <img
                src={logoImg}
                alt="Chanakya Computer Academy Logo"
                className="w-full h-full object-contain filter drop-shadow"
              />
            </div>
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white tracking-tight">Chanakya</h1>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#1ed760] mt-0.5">
              Computer Academy
            </p>
          </div>
        </div>

        {/* Cyber Card with Glassmorphic Depth */}
        <div
          className="relative bg-[#181818]/80 backdrop-blur-xl rounded-[10px] px-8 py-8 border border-white/10"
          style={{
            boxShadow:
              'rgba(0,0,0,0.6) 0px 16px 36px, rgba(30,215,96,0.12) 0px 0px 40px',
          }}
        >
          {/* Tech Corner Accent Markers */}
          <div className="absolute -top-[1px] -left-[1px] w-3 h-3 border-t-2 border-l-2 border-[#1ed760] rounded-tl-[10px]" />
          <div className="absolute -bottom-[1px] -right-[1px] w-3 h-3 border-b-2 border-r-2 border-[#1ed760] rounded-br-[10px]" />

          {/* Security Node Badge */}
          <div className="flex items-center justify-center mb-5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1ed760]/10 border border-[#1ed760]/30 text-[10px] font-mono font-semibold text-[#1ed760] uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1ed760] animate-pulse" />
              <span>SECURE PORTAL // LOGIN</span>
            </div>
          </div>

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
                className="absolute right-3 bottom-3 text-[#7c7c7c] hover:text-white transition-all duration-150 hover:scale-110 active:scale-95 cursor-pointer"
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-[6px] bg-[#f3727f]/10 border border-[#f3727f]/30 animate-fade-up">
                <AlertCircle size={14} className="text-[#f3727f] flex-shrink-0" />
                <p className="text-xs text-[#f3727f]">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={loading}
              className="w-full mt-2 shadow-[0_0_20px_rgba(30,215,96,0.3)] hover:shadow-[0_0_28px_rgba(30,215,96,0.5)] transition-all"
            >
              {loading ? 'Authenticating…' : 'Sign In'}
            </Button>
          </form>
        </div>

        {/* Hint */}
        <p className="text-center text-xs text-[#4d4d4d] mt-6 flex items-center justify-center gap-1 font-mono">
          <ShieldCheck size={13} className="text-[#1ed760]/60 inline" />
          <span>Admin:</span> <span className="text-[#7c7c7c]">admin / admin123</span>
          <span className="text-[#4d4d4d] mx-1">&bull;</span>
          <span>Students:</span> <span className="text-[#7c7c7c]">portal access</span>
        </p>
      </div>
    </div>
  )
}
