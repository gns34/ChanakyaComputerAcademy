// QuestionCard.jsx — Renders a single MCQ question with option selection
const LABELS = ['A', 'B', 'C', 'D']

export function QuestionCard({ question, selectedIndex, onSelect, showAnswer = false }) {
  if (!question) return null

  return (
    <div className="flex flex-col gap-4">
      {/* Subject tag */}
      {question.subject && (
        <span className="text-xs font-semibold uppercase tracking-widest text-[#539df5]">
          {question.subject}
        </span>
      )}

      {/* Question text */}
      <p className="text-base font-bold text-white leading-relaxed">{question.text}</p>

      {/* Options */}
      <div className="flex flex-col gap-3">
        {question.options.map((opt, idx) => {
          let borderColor = 'border-[#4d4d4d]'
          let bgColor = 'bg-[#1f1f1f] hover:bg-[#252525]'
          let textColor = 'text-white'
          let labelBg = 'bg-[#252525] text-[#b3b3b3]'

          if (showAnswer) {
            if (idx === question.correctIndex) {
              borderColor = 'border-[#1ed760]'
              bgColor = 'bg-[#1ed760]/10'
              textColor = 'text-[#1ed760]'
              labelBg = 'bg-[#1ed760] text-black'
            } else if (idx === selectedIndex && idx !== question.correctIndex) {
              borderColor = 'border-[#f3727f]'
              bgColor = 'bg-[#f3727f]/10'
              textColor = 'text-[#f3727f]'
              labelBg = 'bg-[#f3727f] text-white'
            }
          } else if (selectedIndex === idx) {
            borderColor = 'border-[#1ed760]'
            bgColor = 'bg-[#1ed760]/10'
            textColor = 'text-[#1ed760]'
            labelBg = 'bg-[#1ed760] text-black'
          }

          return (
            <button
              key={idx}
              type="button"
              disabled={showAnswer}
              onClick={() => !showAnswer && onSelect?.(idx)}
              className={[
                'flex items-center gap-3 px-4 py-3 rounded-[8px]',
                'border transition-all duration-150 text-left w-full',
                showAnswer ? 'cursor-default' : 'cursor-pointer',
                borderColor, bgColor,
              ].join(' ')}
            >
              <span className={[
                'w-7 h-7 rounded-full flex items-center justify-center',
                'text-xs font-bold flex-shrink-0 transition-all',
                labelBg,
              ].join(' ')}>
                {LABELS[idx]}
              </span>
              <span className={['text-sm font-normal', textColor].join(' ')}>{opt}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
