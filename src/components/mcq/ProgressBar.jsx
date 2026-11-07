// ProgressBar.jsx — Test progress indicator with smooth green accent animation
export function ProgressBar({ current, total, className = '' }) {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0

  return (
    <div className={['w-full', className].join(' ')}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-bold text-[#b3b3b3] uppercase tracking-widest flex items-center gap-2">
          <span>Question {current} of {total}</span>
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#1ed760] animate-pulse" />
        </span>
        <span className="text-xs font-bold text-[#1ed760] tracking-wider transition-all duration-300">
          {pct}%
        </span>
      </div>
      <div className="w-full h-1.5 bg-[#252525] rounded-full overflow-hidden p-0.5 border border-white/[0.04]">
        <div
          className="h-full bg-gradient-to-r from-[#1db954] to-[#1ed760] rounded-full transition-all duration-500 ease-out shadow-[0_0_10px_rgba(30,215,96,0.6)]"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
