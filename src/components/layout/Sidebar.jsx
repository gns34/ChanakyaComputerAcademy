// Sidebar.jsx — Collapsible dark sidebar navigation
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import logoImg from '../../assets/logo.png'
import {
  LayoutDashboard, HelpCircle, Users, BarChart2,
  BookOpen, FileText, LogOut, Menu, X,
} from 'lucide-react'
import { useState } from 'react'

const adminNav = [
  { to: '/admin',          label: 'Dashboard',  icon: LayoutDashboard, end: true },
  { to: '/admin/questions',label: 'Questions',  icon: HelpCircle },
  { to: '/admin/students', label: 'Students',   icon: Users },
  { to: '/admin/results',  label: 'Results',    icon: BarChart2 },
]

const studentNav = [
  { to: '/student',        label: 'Dashboard',  icon: LayoutDashboard, end: true },
  { to: '/student/test',   label: 'Take Test',  icon: BookOpen },
  { to: '/student/results',label: 'My Results', icon: FileText },
]

function SidebarContent({ currentUser, nav, onLogout, onNavClick }) {
  return (
    <aside className="flex flex-col h-full bg-[#121212]/85 backdrop-blur-xl w-64 border-r border-white/[0.08]">
      {/* Logo */}
      <div className="px-6 pt-6 pb-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#181818]/90 border border-white/10 p-1 flex items-center justify-center flex-shrink-0 shadow-[0_0_16px_rgba(30,215,96,0.25)]">
          <img
            src={logoImg}
            alt="Chanakya Computer Academy Logo"
            className="w-full h-full object-contain"
          />
        </div>
        <div>
          <p className="text-sm font-bold text-white leading-tight">Chanakya</p>
          <p className="text-[10px] font-semibold text-[#1ed760] uppercase tracking-widest leading-tight">
            Computer Academy
          </p>
        </div>
      </div>

      {/* User pill */}
      <div className="mx-4 mb-4 px-3 py-2 rounded-[8px] bg-[#1f1f1f]/80 border border-white/[0.05] flex items-center gap-2">
        <div className="w-7 h-7 rounded-full bg-[#1ed760]/20 border border-[#1ed760]/40 flex items-center justify-center flex-shrink-0">
          <span className="text-xs font-bold text-[#1ed760] uppercase">
            {currentUser?.name?.[0] ?? 'U'}
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold text-white truncate">{currentUser?.name ?? 'User'}</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1ed760] animate-pulse" />
            <p className="text-[10px] text-[#b3b3b3] capitalize">{currentUser?.role}</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#4d4d4d] px-3 pb-2 pt-1">
          Navigation
        </p>
        {nav.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onNavClick}
            className={({ isActive }) => [
              'flex items-center gap-3 px-3 py-2.5 rounded-[6px]',
              'transition-all duration-200 ease-out group text-sm',
              isActive
                ? 'bg-[#1f1f1f]/90 text-white font-bold border-l-2 border-[#1ed760] shadow-[0_0_12px_rgba(30,215,96,0.15)] translate-x-0.5'
                : 'text-[#b3b3b3] font-normal hover:text-white hover:bg-[#1f1f1f]/60 hover:translate-x-1',
            ].join(' ')}
          >
            {({ isActive }) => (
              <>
                <Icon
                  size={16}
                  className={`transition-colors duration-200 ${isActive ? 'text-[#1ed760]' : 'text-[#b3b3b3] group-hover:text-white'}`}
                />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-white/[0.08]">
        <button
          onClick={onLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-[6px] text-sm font-normal text-[#b3b3b3] hover:text-[#f3727f] hover:bg-[#f3727f]/10 transition-all duration-150 cursor-pointer"
        >
          <LogOut size={16} />
          Log Out
        </button>
      </div>
    </aside>
  )
}

export function Sidebar() {
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const nav = currentUser?.role === 'admin' ? adminNav : studentNav

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden md:flex flex-col h-screen sticky top-0">
        <SidebarContent
          currentUser={currentUser}
          nav={nav}
          onLogout={handleLogout}
        />
      </div>

      {/* Mobile top bar */}
      <div className="md:hidden">
        <div className="fixed top-0 left-0 right-0 z-40 h-14 bg-[#121212]/90 backdrop-blur-xl border-b border-white/[0.08] px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="w-9 h-9 rounded-full bg-[#1f1f1f] border border-[#4d4d4d] flex items-center justify-center text-white cursor-pointer active:scale-95 transition-transform"
              aria-label="Open navigation menu"
            >
              <Menu size={18} />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#181818] border border-white/10 p-0.5 flex items-center justify-center flex-shrink-0">
                <img src={logoImg} alt="Chanakya Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <p className="text-xs font-bold text-white leading-tight">Chanakya</p>
                <p className="text-[8px] font-semibold text-[#1ed760] uppercase tracking-wider leading-tight">
                  Computer Academy
                </p>
              </div>
            </div>
          </div>

          {/* User initials badge */}
          <div className="w-7 h-7 rounded-full bg-[#1ed760]/20 border border-[#1ed760]/40 flex items-center justify-center">
            <span className="text-[10px] font-bold text-[#1ed760] uppercase">
              {currentUser?.name?.[0] ?? 'U'}
            </span>
          </div>
        </div>

        {/* Overlay */}
        {mobileOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm animate-fade-in"
            onClick={() => setMobileOpen(false)}
          />
        )}

        {/* Drawer */}
        <div
          className={[
            'fixed top-0 left-0 h-full z-50 transition-transform duration-300 ease-out',
            mobileOpen ? 'translate-x-0' : '-translate-x-full',
          ].join(' ')}
        >
          <div className="relative h-full">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 z-10 w-7 h-7 rounded-full bg-[#1f1f1f] hover:bg-[#282828] transition-all flex items-center justify-center text-white active:scale-95"
            >
              <X size={14} />
            </button>
            <SidebarContent
              currentUser={currentUser}
              nav={nav}
              onLogout={handleLogout}
              onNavClick={() => setMobileOpen(false)}
            />
          </div>
        </div>
      </div>
    </>
  )
}
