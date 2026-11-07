// ResultsViewer.jsx — Admin: view all results, filter by student
import { useState } from 'react'
import { useData } from '../../contexts/DataContext'
import { Layout } from '../../components/layout/Layout'
import { Card } from '../../components/ui/Card'
import { EmptyState } from '../../components/ui/EmptyState'
import { ScoreBadge } from '../../components/ui/Badge'
import { BarChart2, ChevronDown, ChevronUp, Check, X } from 'lucide-react'

const LABELS = ['A', 'B', 'C', 'D']

function ResultRow({ result, questions, expanded, onToggle }) {
  const pct = result.total > 0 ? Math.round((result.score / result.total) * 100) : 0
  const color = pct >= 70 ? '#1ed760' : pct >= 40 ? '#ffa42b' : '#f3727f'

  return (
    <div className="border-b border-[#1f1f1f] last:border-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 hover:bg-[#1f1f1f]/50 transition-colors text-left"
      >
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div>
            <p className="text-sm font-bold text-white">{new Date(result.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
            <p className="text-xs text-[#b3b3b3]">{new Date(result.date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</p>
          </div>
          <ScoreBadge score={result.score} total={result.total} />
          <div className="hidden sm:flex items-center gap-1.5">
            <div className="w-20 h-1 bg-[#4d4d4d] rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
            </div>
            <span className="text-xs font-bold" style={{ color }}>{pct}%</span>
          </div>
        </div>
        {expanded ? <ChevronUp size={16} className="text-[#b3b3b3] flex-shrink-0" /> : <ChevronDown size={16} className="text-[#b3b3b3] flex-shrink-0" />}
      </button>

      {expanded && (
        <div className="px-5 pb-5">
          <div className="flex flex-col gap-3">
            {result.answers.map((ans, i) => {
              const q = questions.find((qq) => qq.id === ans.questionId)
              if (!q) return null
              const isCorrect = ans.chosen === q.correctIndex
              const noAnswer = ans.chosen === null || ans.chosen === undefined

              return (
                <div key={ans.questionId} className="bg-[#1f1f1f] rounded-[6px] p-4">
                  <div className="flex items-start gap-2 mb-3">
                    <span className="text-xs text-[#4d4d4d] font-bold flex-shrink-0 mt-0.5">{i + 1}.</span>
                    <p className="text-sm font-bold text-white">{q.text}</p>
                    <div className="ml-auto flex-shrink-0">
                      {noAnswer
                        ? <span className="text-[10px] font-bold text-[#ffa42b] uppercase">Skipped</span>
                        : isCorrect
                          ? <Check size={14} className="text-[#1ed760]" />
                          : <X size={14} className="text-[#f3727f]" />
                      }
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {q.options.map((opt, idx) => {
                      let bg = 'bg-[#252525]'
                      let text = 'text-[#b3b3b3]'
                      let border = 'border-transparent'
                      let labelStyle = 'bg-[#1f1f1f] text-[#7c7c7c]'

                      if (idx === q.correctIndex) {
                        bg = 'bg-[#1ed760]/10'; text = 'text-[#1ed760]'; border = 'border-[#1ed760]/30'; labelStyle = 'bg-[#1ed760] text-black'
                      } else if (idx === ans.chosen && !isCorrect) {
                        bg = 'bg-[#f3727f]/10'; text = 'text-[#f3727f]'; border = 'border-[#f3727f]/30'; labelStyle = 'bg-[#f3727f] text-white'
                      }

                      return (
                        <div key={idx} className={`flex items-center gap-2 px-2.5 py-1.5 rounded-[4px] border text-xs ${bg} ${border}`}>
                          <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] flex-shrink-0 ${labelStyle}`}>
                            {LABELS[idx]}
                          </span>
                          <span className={text}>{opt}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export function ResultsViewer() {
  const { results, students, questions } = useData()
  const [selectedStudent, setSelectedStudent] = useState('all')
  const [expanded, setExpanded] = useState({})

  const filtered = selectedStudent === 'all'
    ? results
    : results.filter((r) => r.studentId === selectedStudent)

  const sorted = [...filtered].sort((a, b) => new Date(b.date) - new Date(a.date))

  const toggleExpand = (id) => setExpanded((prev) => ({ ...prev, [id]: !prev[id] }))

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Test Results</h1>
        <p className="text-sm text-[#b3b3b3] mt-1">{results.length} test{results.length !== 1 ? 's' : ''} taken</p>
      </div>

      {/* Filter */}
      <div className="mb-5">
        <select
          value={selectedStudent}
          onChange={(e) => { setSelectedStudent(e.target.value); setExpanded({}) }}
          className="bg-[#1f1f1f] text-white px-4 py-2.5 text-sm rounded-[6px] border border-transparent focus:outline-none focus:border-white cursor-pointer"
          style={{ boxShadow: 'rgb(18,18,18) 0px 1px 0px, rgb(124,124,124) 0px 0px 0px 1px inset' }}
        >
          <option value="all">All Students</option>
          {students.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </div>

      {/* Results */}
      {sorted.length === 0 ? (
        <EmptyState icon={BarChart2} title="No results yet" description="Results will appear here after students take tests." />
      ) : (
        <div className="flex flex-col gap-4">
          {/* Group by student if showing all */}
          {selectedStudent === 'all'
            ? students.map((s) => {
                const sResults = sorted.filter((r) => r.studentId === s.id)
                if (sResults.length === 0) return null
                return (
                  <div key={s.id}>
                    <div className="flex items-center gap-2.5 mb-2 px-1">
                      <div className="w-7 h-7 rounded-full bg-[#1ed760]/15 border border-[#1ed760]/30 flex items-center justify-center">
                        <span className="text-xs font-bold text-[#1ed760] uppercase">{s.name[0]}</span>
                      </div>
                      <span className="text-sm font-bold text-white">{s.name}</span>
                      <span className="text-xs text-[#4d4d4d]">{sResults.length} test{sResults.length !== 1 ? 's' : ''}</span>
                    </div>
                    <Card className="p-0 overflow-hidden">
                      {sResults.map((r) => (
                        <ResultRow
                          key={r.id}
                          result={r}
                          questions={questions}
                          expanded={!!expanded[r.id]}
                          onToggle={() => toggleExpand(r.id)}
                        />
                      ))}
                    </Card>
                  </div>
                )
              })
            : (
              <Card className="p-0 overflow-hidden">
                {sorted.map((r) => (
                  <ResultRow
                    key={r.id}
                    result={r}
                    questions={questions}
                    expanded={!!expanded[r.id]}
                    onToggle={() => toggleExpand(r.id)}
                  />
                ))}
              </Card>
            )
          }
        </div>
      )}
    </Layout>
  )
}
