// Badge.jsx — Pill badge for status/score
const styles = {
  success: 'bg-[#1ed760]/15 text-[#1ed760] border border-[#1ed760]/30',
  error:   'bg-[#f3727f]/15 text-[#f3727f] border border-[#f3727f]/30',
  warning: 'bg-[#ffa42b]/15 text-[#ffa42b] border border-[#ffa42b]/30',
  info:    'bg-[#539df5]/15 text-[#539df5] border border-[#539df5]/30',
  muted:   'bg-[#1f1f1f] text-[#b3b3b3] border border-[#4d4d4d]',
}

export function Badge({ variant = 'muted', className = '', children }) {
  return (
    <span
      className={[
        'inline-flex items-center px-2.5 py-0.5',
        'rounded-[9999px] text-[10.5px] font-semibold capitalize',
        styles[variant] ?? styles.muted,
        className,
      ].join(' ')}
    >
      {children}
    </span>
  )
}

export function ScoreBadge({ score, total }) {
  const pct = total > 0 ? Math.round((score / total) * 100) : 0
  const variant = pct >= 70 ? 'success' : pct >= 40 ? 'warning' : 'error'
  return (
    <Badge variant={variant}>
      {score}/{total} ({pct}%)
    </Badge>
  )
}
