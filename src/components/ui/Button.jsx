// Button.jsx — Pill button variants matching DESIGN.md
import { forwardRef } from 'react'

const variants = {
  primary:  'bg-[#1ed760] text-black hover:bg-[#1db954] hover:shadow-[0_0_20px_rgba(30,215,96,0.38)] active:scale-[0.97]',
  secondary:'bg-[#1f1f1f] text-white hover:bg-[#282828] hover:border-[#7c7c7c] border border-[#4d4d4d] active:scale-[0.97]',
  ghost:    'bg-transparent text-white hover:bg-[#1f1f1f] hover:border-white border border-[#7c7c7c] active:scale-[0.97]',
  danger:   'bg-transparent text-[#f3727f] hover:bg-[#f3727f]/15 border border-[#f3727f] hover:shadow-[0_0_15px_rgba(243,114,127,0.25)] active:scale-[0.97]',
  dark:     'bg-[#121212] text-white hover:bg-[#1f1f1f] hover:border-[#7c7c7c] border border-[#4d4d4d] active:scale-[0.97]',
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
        'transition-all duration-200 ease-out cursor-pointer whitespace-nowrap select-none',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1ed760]',
        disabled ? 'opacity-40 cursor-not-allowed active:scale-100 hover:shadow-none' : '',
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
