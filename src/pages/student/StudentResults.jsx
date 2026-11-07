// StudentResults.jsx — Student: list of all their results
import { useAuth } from '../../contexts/AuthContext'
import { useData } from '../../contexts/DataContext'
import { Layout } from '../../components/layout/Layout'
import { Card } from '../../components/ui/Card'
import { EmptyState } from '../../components/ui/EmptyState'
import { ScoreBadge } from '../../components/ui/Badge'
import { FileText } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function StudentResults() {
  const { currentUser } = useAuth()
  const { results } = useData()
  const navigate = useNavigate()

  const myResults = results
    .filter((r) => r.studentId === currentUser.id)
    .sort((a, b) => new Date(b.date) - new Date(a.date))

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">My Results</h1>
        <p className="text-sm text-[#b3b3b3] mt-1">{myResults.length} test{myResults.length !== 1 ? 's' : ''} completed</p>
      </div>

      {myResults.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No results yet"
          description="Take a test to see your results here."
        />
      ) : (
        <Card className="p-0 overflow-hidden">
          {myResults.map((r, i) => {
            const pct = r.total > 0 ? Math.round((r.score / r.total) * 100) : 0
            const color = pct >= 70 ? '#1ed760' : pct >= 40 ? '#ffa42b' : '#f3727f'
            return (
              <div
                key={r.id}
                onClick={() => navigate(`/student/results/${r.id}`)}
                className="flex items-center justify-between gap-4 px-5 py-4 border-b border-[#1f1f1f] hover:bg-[#1f1f1f]/80 hover:translate-x-0.5 cursor-pointer transition-all duration-200 last:border-0 group"
              >
                <div className="flex items-center gap-4">
                  <span className="text-xs font-bold text-[#4d4d4d] w-5 text-right">{i + 1}</span>
                  <div>
                    <p className="text-sm font-bold text-white group-hover:text-[#1ed760] transition-colors">
                      {new Date(r.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                    <p className="text-xs text-[#b3b3b3]">
                      {new Date(r.date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="hidden sm:flex items-center gap-1.5">
                    <div className="w-20 h-1.5 bg-[#4d4d4d] rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-500 ease-out" style={{ width: `${pct}%`, background: color }} />
                    </div>
                    <span className="text-xs font-bold" style={{ color }}>{pct}%</span>
                  </div>
                  <ScoreBadge score={r.score} total={r.total} />
                </div>
              </div>
            )
          })}
        </Card>
      )}
    </Layout>
  )
}
