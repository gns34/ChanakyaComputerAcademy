// Button.jsx — Pill button variants matching DESIGN.md
import { forwardRef } from 'react'

const variants = {
  primary:  'bg-[#1ed760] text-black hover:bg-[#17b34e] active:scale-95',
  secondary:'bg-[#1f1f1f] text-white hover:bg-[#2a2a2a] border border-[#4d4d4d] active:scale-95',
  ghost:    'bg-transparent text-white hover:bg-[#1f1f1f] border border-[#7c7c7c] active:scale-95',
  danger:   'bg-transparent text-[#f3727f] hover:bg-[#f3727f]/10 border border-[#f3727f] active:scale-95',
  dark:     'bg-[#121212] text-white hover:bg-[#1a1a1a] border border-[#4d4d4d] active:scale-95',
}

const sizes = {
  sm:  'px-4 py-1.5 text-xs',
  md:  'px-6 py-2 text-sm',
  lg:  'px-10 py-3 text-sm',
}

export const Button = forwardRef(function Button(
  { variant = 'secondary', size = 'md', className = '', disabled, children, ...props },
  ref
) {
  return (
    <button
      ref={ref}
      disabled={disabled}
      className={[
        'inline-flex items-center justify-center gap-2',
        'rounded-[9999px] font-bold uppercase tracking-widest',
        'transition-all duration-150 cursor-pointer whitespace-nowrap select-none',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1ed760]',
        disabled ? 'opacity-40 cursor-not-allowed' : '',
        variants[variant] ?? variants.secondary,
        sizes[size] ?? sizes.md,
        className,
      ].join(' ')}
      {...props}
    >
      {children}
    </button>
  )
})
