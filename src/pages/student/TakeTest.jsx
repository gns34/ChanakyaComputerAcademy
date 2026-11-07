// TakeTest.jsx — Randomized MCQ test for students
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useData } from '../../contexts/DataContext'
import { Layout } from '../../components/layout/Layout'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { ProgressBar } from '../../components/mcq/ProgressBar'
import { QuestionCard } from '../../components/mcq/QuestionCard'
import { BookOpen, AlertCircle } from 'lucide-react'

const MAX_QUESTIONS = 10

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function TakeTest() {
  const { currentUser } = useAuth()
  const { questions, addResult } = useData()
  const navigate = useNavigate()

  const [testQuestions] = useState(() => shuffle(questions).slice(0, MAX_QUESTIONS))
  const [currentIdx, setCurrentIdx] = useState(0)
  const [answers, setAnswers] = useState({}) // questionId → chosen index
  const [submitOpen, setSubmitOpen] = useState(false)
  const [started, setStarted] = useState(false)

  const currentQ = testQuestions[currentIdx]
  const selectedForCurrent = answers[currentQ?.id] ?? null

  const handleSelect = (idx) => {
    setAnswers((prev) => ({ ...prev, [currentQ.id]: idx }))
  }

  const handleNext = () => {
    if (currentIdx < testQuestions.length - 1) setCurrentIdx((i) => i + 1)
  }

  const handlePrev = () => {
    if (currentIdx > 0) setCurrentIdx((i) => i - 1)
  }

  const handleSubmit = () => {
    // Build answers array
    const answerArr = testQuestions.map((q) => ({
      questionId: q.id,
      chosen: answers[q.id] ?? null,
    }))

    // Calculate score
    const score = answerArr.reduce((sum, ans) => {
      const q = testQuestions.find((qq) => qq.id === ans.questionId)
      return sum + (q && ans.chosen === q.correctIndex ? 1 : 0)
    }, 0)

    const result = addResult({
      studentId: currentUser.id,
      answers: answerArr,
      score,
      total: testQuestions.length,
    })

    navigate(`/student/results/${result.id}`)
  }

  const answeredCount = Object.keys(answers).length
  const unansweredCount = testQuestions.length - answeredCount

  if (questions.length === 0) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
          <div className="p-5 rounded-full bg-[#1f1f1f]">
            <BookOpen size={32} className="text-[#4d4d4d]" />
          </div>
          <p className="text-base font-bold text-[#b3b3b3]">No questions available</p>
          <p className="text-sm text-[#7c7c7c]">Please wait for your teacher to upload questions.</p>
        </div>
      </Layout>
    )
  }

  if (!started) {
    return (
      <Layout>
        <div className="max-w-lg mx-auto">
          <div className="bg-[#181818]/85 backdrop-blur-md rounded-[8px] p-8 text-center border border-white/[0.06]" style={{ boxShadow: 'rgba(0,0,0,0.5) 0px 8px 24px' }}>
            <div className="w-16 h-16 rounded-full bg-[#1ed760]/10 border border-[#1ed760]/30 flex items-center justify-center mx-auto mb-5">
              <BookOpen size={28} className="text-[#1ed760]" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Mock Test</h1>
            <p className="text-sm text-[#b3b3b3] mb-6">
              You will get <span className="text-white font-bold">{Math.min(questions.length, MAX_QUESTIONS)} randomized questions</span>.
              Answer all and submit to see your result with correct answers.
            </p>
            <div className="grid grid-cols-2 gap-3 mb-6 text-left">
              {[
                ['Questions', Math.min(questions.length, MAX_QUESTIONS)],
                ['Type', 'Single Correct'],
                ['Marks', '+1 each'],
                ['Negative', 'None'],
              ].map(([k, v]) => (
                <div key={k} className="bg-[#1f1f1f] rounded-[6px] p-3">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#b3b3b3]">{k}</p>
                  <p className="text-sm font-bold text-white mt-0.5">{v}</p>
                </div>
              ))}
            </div>
            <Button variant="primary" size="lg" className="w-full" onClick={() => setStarted(true)}>
              Start Test
            </Button>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        {/* Progress */}
        <ProgressBar current={currentIdx + 1} total={testQuestions.length} className="mb-6" />

        {/* Question */}
        <div
          key={currentQ?.id}
          className="bg-[#181818]/85 backdrop-blur-md rounded-[8px] p-6 mb-5 border border-white/[0.06] animate-fade-up"
          style={{ boxShadow: 'rgba(0,0,0,0.3) 0px 8px 8px' }}
        >
          <QuestionCard
            question={currentQ}
            selectedIndex={selectedForCurrent}
            onSelect={handleSelect}
          />
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between gap-3">
          <Button variant="secondary" onClick={handlePrev} disabled={currentIdx === 0}>
            ← Previous
          </Button>

          {/* Quick nav dots */}
          <div className="flex gap-1.5 flex-wrap justify-center flex-1">
            {testQuestions.map((q, i) => {
              const isAnswered = answers[q.id] !== undefined
              const isCurrent = i === currentIdx
              return (
                <button
                  key={i}
                  onClick={() => setCurrentIdx(i)}
                  className={[
                    'w-7 h-7 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer active:scale-95',
                    isCurrent
                      ? 'bg-[#1ed760] text-black shadow-[0_0_12px_rgba(30,215,96,0.5)] scale-110'
                      : isAnswered
                        ? 'bg-[#1ed760]/20 text-[#1ed760] border border-[#1ed760]/40 hover:bg-[#1ed760]/30 hover:scale-105'
                        : 'bg-[#1f1f1f] text-[#b3b3b3] border border-[#4d4d4d] hover:border-[#7c7c7c] hover:scale-105',
                  ].join(' ')}
                >
                  {i + 1}
                </button>
              )
            })}
          </div>

          {currentIdx < testQuestions.length - 1 ? (
            <Button variant="secondary" onClick={handleNext}>
              Next →
            </Button>
          ) : (
            <Button variant="primary" onClick={() => setSubmitOpen(true)}>
              Submit
            </Button>
          )}
        </div>
      </div>

      {/* Submit confirmation */}
      <Modal open={submitOpen} onClose={() => setSubmitOpen(false)} title="Submit Test">
        <div className="text-center">
          {unansweredCount > 0 && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-[6px] bg-[#ffa42b]/10 border border-[#ffa42b]/30 mb-5 text-left">
              <AlertCircle size={14} className="text-[#ffa42b] flex-shrink-0" />
              <p className="text-xs text-[#ffa42b]">
                {unansweredCount} question{unansweredCount !== 1 ? 's' : ''} not answered. They will be marked incorrect.
              </p>
            </div>
          )}
          <p className="text-sm text-[#b3b3b3] mb-6">
            You answered <span className="text-white font-bold">{answeredCount}</span> of{' '}
            <span className="text-white font-bold">{testQuestions.length}</span> questions.
            <br />Are you sure you want to submit?
          </p>
          <div className="flex gap-3 justify-center">
            <Button variant="ghost" onClick={() => setSubmitOpen(false)}>
              Review
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              Submit Now
            </Button>
          </div>
        </div>
      </Modal>
    </Layout>
  )
}
