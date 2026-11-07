// ProgressBar.jsx — Test progress indicator with green accent
export function ProgressBar({ current, total, className = '' }) {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0

  return (
    <div className={['w-full', className].join(' ')}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-bold text-[#b3b3b3] uppercase tracking-widest">
          Question {current} of {total}
        </span>
        <span className="text-xs font-bold text-[#1ed760]">{pct}%</span>
      </div>
      <div className="w-full h-1 bg-[#4d4d4d] rounded-full overflow-hidden">
        <div
          className="h-full bg-[#1ed760] rounded-full transition-all duration-300 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
