// Layout.jsx — Main layout wrapper: Sidebar + content area
import { Sidebar } from './Sidebar'
import { TechBackground } from './TechBackground'

export function Layout({ children }) {
  return (
    <div className="relative min-h-screen bg-[#07090e] text-white flex overflow-x-hidden">
      {/* Attractive Technology Inspired Gradient Background */}
      <TechBackground />

      {/* Main UI Layer */}
      <div className="relative z-10 flex w-full min-h-screen">
        <Sidebar />
        <main className="flex-1 min-w-0 md:pl-0 pl-0">
          <div className="max-w-6xl mx-auto px-4 md:px-8 pt-20 pb-8 md:py-10 animate-fade-up">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
