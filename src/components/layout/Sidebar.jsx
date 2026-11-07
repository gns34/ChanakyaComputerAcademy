// Sidebar.jsx — Collapsible dark sidebar navigation
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import {
  LayoutDashboard, HelpCircle, Users, BarChart2,
  BookOpen, FileText, LogOut, GraduationCap, Menu, X,
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

export function Sidebar() {
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const nav = currentUser?.role === 'admin' ? adminNav : studentNav

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  const SidebarContent = () => (
    <aside
      className="flex flex-col h-full bg-[#121212] w-64"
      style={{ borderRight: '1px solid #1f1f1f' }}
    >
      {/* Logo */}
      <div className="px-6 pt-6 pb-4 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-[#1ed760] flex items-center justify-center flex-shrink-0">
          <GraduationCap size={18} className="text-black" />
        </div>
        <div>
          <p className="text-sm font-bold text-white leading-tight">Chanakya</p>
          <p className="text-[10px] font-semibold text-[#1ed760] uppercase tracking-widest leading-tight">
            Computer Academy
          </p>
        </div>
      </div>

      {/* User pill */}
      <div className="mx-4 mb-4 px-3 py-2 rounded-[8px] bg-[#1f1f1f] flex items-center gap-2">
        <div className="w-7 h-7 rounded-full bg-[#1ed760]/20 border border-[#1ed760]/40 flex items-center justify-center flex-shrink-0">
          <span className="text-xs font-bold text-[#1ed760] uppercase">
            {currentUser?.name?.[0] ?? 'U'}
          </span>
        </div>
        <div className="min-w-0">
          <p className="text-xs font-bold text-white truncate">{currentUser?.name ?? 'User'}</p>
          <p className="text-[10px] text-[#b3b3b3] capitalize">{currentUser?.role}</p>
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
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) => [
              'flex items-center gap-3 px-3 py-2.5 rounded-[6px]',
              'transition-all duration-150 group text-sm',
              isActive
                ? 'bg-[#1f1f1f] text-white font-bold'
                : 'text-[#b3b3b3] font-normal hover:text-white hover:bg-[#1f1f1f]/50',
            ].join(' ')}
          >
            {({ isActive }) => (
              <>
                <Icon
                  size={16}
                  className={isActive ? 'text-[#1ed760]' : 'text-[#b3b3b3] group-hover:text-white'}
                />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-[#1f1f1f]">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-[6px] text-sm font-normal text-[#b3b3b3] hover:text-[#f3727f] hover:bg-[#f3727f]/10 transition-all duration-150"
        >
          <LogOut size={16} />
          Log Out
        </button>
      </div>
    </aside>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden md:flex flex-col h-screen sticky top-0">
        <SidebarContent />
      </div>

      {/* Mobile hamburger */}
      <div className="md:hidden">
        <button
          onClick={() => setMobileOpen(true)}
          className="fixed top-4 left-4 z-40 w-9 h-9 rounded-full bg-[#1f1f1f] border border-[#4d4d4d] flex items-center justify-center text-white"
        >
          <Menu size={18} />
        </button>

        {/* Overlay */}
        {mobileOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
        )}

        {/* Drawer */}
        <div
          className={[
            'fixed top-0 left-0 h-full z-50 transition-transform duration-300',
            mobileOpen ? 'translate-x-0' : '-translate-x-full',
          ].join(' ')}
        >
          <div className="relative h-full">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 z-10 w-7 h-7 rounded-full bg-[#1f1f1f] flex items-center justify-center text-white"
            >
              <X size={14} />
            </button>
            <SidebarContent />
          </div>
        </div>
      </div>
    </>
  )
}
