// Layout.jsx — Main layout wrapper: Sidebar + content area
import { Sidebar } from './Sidebar'

export function Layout({ children }) {
  return (
    <div className="flex min-h-screen bg-[#121212]">
      <Sidebar />
      <main className="flex-1 min-w-0 md:pl-0 pl-0">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-10">
          {children}
        </div>
      </main>
    </div>
  )
}
