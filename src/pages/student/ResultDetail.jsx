// ResultDetail.jsx — Post-test result with correct/wrong answer review
import { useParams, useNavigate } from 'react-router-dom'
import { useData } from '../../contexts/DataContext'
import { useAuth } from '../../contexts/AuthContext'
import { Layout } from '../../components/layout/Layout'
import { Button } from '../../components/ui/Button'
import { QuestionCard } from '../../components/mcq/QuestionCard'
import { Check, X, Minus, Trophy, ArrowLeft, RotateCcw } from 'lucide-react'

export function ResultDetail() {
  const { id } = useParams()
  const { results, questions } = useData()
  const { currentUser } = useAuth()
  const navigate = useNavigate()

  const result = results.find((r) => r.id === id)

  if (!result) {
    return (
      <Layout>
        <div className="text-center py-20">
          <p className="text-[#b3b3b3] mb-4">Result not found.</p>
          <Button variant="secondary" onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </Layout>
    )
  }

  // Guard: student can only see their own result
  if (currentUser.role === 'student' && result.studentId !== currentUser.id) {
    return (
      <Layout>
        <div className="text-center py-20">
          <p className="text-[#f3727f] mb-4">Access denied.</p>
          <Button variant="secondary" onClick={() => navigate('/student')}>Dashboard</Button>
        </div>
      </Layout>
    )
  }

  const pct = result.total > 0 ? Math.round((result.score / result.total) * 100) : 0
  const color = pct >= 70 ? '#1ed760' : pct >= 40 ? '#ffa42b' : '#f3727f'
  const grade = pct >= 90 ? 'Excellent!' : pct >= 70 ? 'Good Job!' : pct >= 40 ? 'Keep Practicing' : 'Needs Improvement'

  const correctCount = result.answers.filter((a) => {
    const q = questions.find((qq) => qq.id === a.questionId)
    return q && a.chosen === q.correctIndex
  }).length
  const wrongCount = result.answers.filter((a) => {
    const q = questions.find((qq) => qq.id === a.questionId)
    return q && a.chosen !== null && a.chosen !== undefined && a.chosen !== q.correctIndex
  }).length
  const skippedCount = result.answers.filter((a) => a.chosen === null || a.chosen === undefined).length

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-[#b3b3b3] hover:text-white transition-all duration-200 hover:-translate-x-1 mb-6 cursor-pointer"
        >
          <ArrowLeft size={14} /> Back
        </button>

        {/* Score card */}
        <div
          className="bg-[#181818]/85 backdrop-blur-md rounded-[8px] p-6 mb-6 text-center border border-white/[0.06] animate-scale-in"
          style={{ boxShadow: 'rgba(0,0,0,0.5) 0px 8px 24px' }}
        >
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border-2 transition-transform duration-300 hover:scale-105"
            style={{ background: `${color}15`, borderColor: `${color}50` }}
          >
            <Trophy size={32} style={{ color }} />
          </div>
          <p className="text-sm font-bold uppercase tracking-widest mb-1" style={{ color }}>{grade}</p>
          <p className="text-5xl font-bold text-white mb-1">{pct}%</p>
          <p className="text-sm text-[#b3b3b3]">
            {result.score} / {result.total} correct
          </p>
          <p className="text-xs text-[#4d4d4d] mt-1">
            {new Date(result.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}{' '}
            at {new Date(result.date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
          </p>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3 mt-6">
            {[
              { label: 'Correct', count: correctCount, color: '#1ed760', icon: Check },
              { label: 'Wrong', count: wrongCount, color: '#f3727f', icon: X },
              { label: 'Skipped', count: skippedCount, color: '#ffa42b', icon: Minus },
            ].map(({ label, count, color: c, icon: Icon }) => (
              <div key={label} className="bg-[#1f1f1f] rounded-[6px] p-3">
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <Icon size={12} style={{ color: c }} />
                  <span className="text-lg font-bold" style={{ color: c }}>{count}</span>
                </div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#b3b3b3]">{label}</p>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex justify-center gap-3 mt-5">
            {currentUser.role === 'student' && (
              <Button variant="primary" onClick={() => navigate('/student/test')}>
                <RotateCcw size={14} /> Retake
              </Button>
            )}
            <Button variant="ghost" onClick={() => navigate(currentUser.role === 'admin' ? '/admin/results' : '/student')}>
              {currentUser.role === 'admin' ? 'All Results' : 'Dashboard'}
            </Button>
          </div>
        </div>

        {/* Question-by-question review */}
        <h2 className="text-base font-bold text-white mb-4">Answer Review</h2>
        <div className="flex flex-col gap-4">
          {result.answers.map((ans, i) => {
            const q = questions.find((qq) => qq.id === ans.questionId)
            if (!q) return null
            const isCorrect = ans.chosen === q.correctIndex
            const skipped = ans.chosen === null || ans.chosen === undefined

            return (
              <div
                key={ans.questionId}
                className="bg-[#181818]/85 backdrop-blur-md rounded-[8px] p-5 border border-white/[0.06]"
                style={{ boxShadow: 'rgba(0,0,0,0.3) 0px 8px 8px' }}
              >
                {/* Status indicator */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs font-bold text-[#4d4d4d]">Q{i + 1}</span>
                  {skipped
                    ? <span className="flex items-center gap-1 text-xs font-bold text-[#ffa42b]"><Minus size={12} /> Skipped</span>
                    : isCorrect
                      ? <span className="flex items-center gap-1 text-xs font-bold text-[#1ed760]"><Check size={12} /> Correct</span>
                      : <span className="flex items-center gap-1 text-xs font-bold text-[#f3727f]"><X size={12} /> Wrong</span>
                  }
                </div>
                <QuestionCard
                  question={q}
                  selectedIndex={ans.chosen ?? -1}
                  showAnswer={true}
                />
              </div>
            )
          })}
        </div>
      </div>
    </Layout>
  )
}
