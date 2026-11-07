// StudentDashboard.jsx — Student view: test history and quick actions
import { useAuth } from '../../contexts/AuthContext'
import { useData } from '../../contexts/DataContext'
import { Layout } from '../../components/layout/Layout'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { ScoreBadge } from '../../components/ui/Badge'
import { EmptyState } from '../../components/ui/EmptyState'
import { BookOpen, TrendingUp, Award, FileText } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function StudentDashboard() {
  const { currentUser } = useAuth()
  const { results, questions } = useData()
  const navigate = useNavigate()

  const myResults = results
    .filter((r) => r.studentId === currentUser.id)
    .sort((a, b) => new Date(b.date) - new Date(a.date))

  const totalTests  = myResults.length
  const avgScore    = totalTests > 0
    ? Math.round(myResults.reduce((s, r) => s + (r.total > 0 ? (r.score / r.total) * 100 : 0), 0) / totalTests)
    : 0
  const bestScore   = totalTests > 0
    ? Math.max(...myResults.map((r) => (r.total > 0 ? Math.round((r.score / r.total) * 100) : 0)))
    : 0

  const stats = [
    { label: 'Tests Taken', value: totalTests, icon: BookOpen, color: '#539df5' },
    { label: 'Avg. Score', value: totalTests ? `${avgScore}%` : '—', icon: TrendingUp, color: '#1ed760' },
    { label: 'Best Score', value: totalTests ? `${bestScore}%` : '—', icon: Award, color: '#ffa42b' },
    { label: 'Questions', value: questions.length, icon: FileText, color: '#b3b3b3' },
  ]

  return (
    <Layout>
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">
          Welcome back, <span className="text-[#1ed760]">{currentUser.name}</span> 👋
        </h1>
        <p className="text-sm text-[#b3b3b3] mt-1">
          Ready to practice? {questions.length} questions are available.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="bg-[#181818]/80 backdrop-blur-md rounded-[8px] p-5 border border-white/[0.06] hover:border-[#1ed760]/30 hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(0,0,0,0.45)] transition-all duration-250 ease-out cursor-default group"
            style={{ boxShadow: 'rgba(0,0,0,0.3) 0px 8px 8px' }}
          >
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center mb-3 transition-transform duration-200 group-hover:scale-110"
              style={{ background: `${color}20`, border: `1px solid ${color}40` }}
            >
              <Icon size={16} style={{ color }} />
            </div>
            <p className="text-2xl font-bold text-white tracking-tight">{value}</p>
            <p className="text-xs text-[#b3b3b3] mt-0.5 uppercase tracking-widest font-semibold">{label}</p>
          </div>
        ))}
      </div>

      {/* CTA + recent */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Take test CTA */}
        <Card className="lg:col-span-1 flex flex-col items-center justify-center text-center gap-4 py-8">
          <div className="w-16 h-16 rounded-full bg-[#1ed760]/10 border border-[#1ed760]/30 flex items-center justify-center">
            <BookOpen size={28} className="text-[#1ed760]" />
          </div>
          <div>
            <p className="text-base font-bold text-white mb-1">Start a New Test</p>
            <p className="text-xs text-[#b3b3b3]">
              Get a randomized set of {Math.min(questions.length, 10)} questions
            </p>
          </div>
          <Button
            variant="primary"
            size="lg"
            onClick={() => navigate('/student/test')}
            disabled={questions.length === 0}
          >
            Take Test
          </Button>
        </Card>

        {/* Recent results */}
        <Card className="lg:col-span-2 p-0 overflow-hidden">
          <div className="px-5 pt-5 pb-3 border-b border-[#4d4d4d]">
            <h2 className="text-base font-bold text-white">Recent Results</h2>
          </div>
          {myResults.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="No tests taken yet"
              description="Your results will appear here after your first test."
            />
          ) : (
            <div>
              {myResults.slice(0, 5).map((r) => {
                const pct = r.total > 0 ? Math.round((r.score / r.total) * 100) : 0
                const color = pct >= 70 ? '#1ed760' : pct >= 40 ? '#ffa42b' : '#f3727f'
                return (
                  <div
                    key={r.id}
                    onClick={() => navigate(`/student/results/${r.id}`)}
                    className="flex items-center justify-between gap-4 px-5 py-3.5 border-b border-[#1f1f1f] hover:bg-[#1f1f1f]/80 hover:translate-x-0.5 cursor-pointer transition-all duration-200 last:border-0 group"
                  >
                    <div>
                      <p className="text-sm font-bold text-white group-hover:text-[#1ed760] transition-colors">
                        {new Date(r.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                      <p className="text-xs text-[#b3b3b3]">{r.total} questions</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="hidden sm:flex items-center gap-1.5">
                        <div className="w-16 h-1.5 bg-[#4d4d4d] rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all duration-500 ease-out" style={{ width: `${pct}%`, background: color }} />
                        </div>
                      </div>
                      <ScoreBadge score={r.score} total={r.total} />
                    </div>
                  </div>
                )
              })}
              {myResults.length > 5 && (
                <div className="px-5 py-3 text-center">
                  <button
                    onClick={() => navigate('/student/results')}
                    className="text-xs font-bold text-[#1ed760] hover:underline"
                  >
                    View all {myResults.length} results →
                  </button>
                </div>
              )}
            </div>
          )}
        </Card>
      </div>
    </Layout>
  )
}
