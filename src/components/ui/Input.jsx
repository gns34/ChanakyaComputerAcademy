// Input.jsx — Dark pill/rect inputs matching DESIGN.md
import { forwardRef } from 'react'

export const Input = forwardRef(function Input(
  { label, error, className = '', pill = false, ...props },
  ref
) {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label className="text-xs font-bold uppercase tracking-widest text-[#b3b3b3]">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={[
          'w-full bg-[#1f1f1f] text-white placeholder-[#7c7c7c]',
          'px-4 py-3 text-sm font-normal',
          'transition-all duration-200 ease-out outline-none',
          pill ? 'rounded-[500px]' : 'rounded-[6px]',
          error
            ? 'border border-[#f3727f] focus:ring-2 focus:ring-[#f3727f]/20'
            : 'border border-transparent focus:border-[#1ed760] focus:ring-2 focus:ring-[#1ed760]/20',
          className,
        ].join(' ')}
        style={{ boxShadow: 'rgb(18,18,18) 0px 1px 0px, rgb(124,124,124) 0px 0px 0px 1px inset' }}
        {...props}
      />
      {error && <p className="text-xs text-[#f3727f] mt-0.5">{error}</p>}
    </div>
  )
})
