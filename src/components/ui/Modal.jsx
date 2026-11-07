// Modal.jsx — Dark overlay dialog matching DESIGN.md with smooth animated entrance
import { useEffect } from 'react'
import { X } from 'lucide-react'

export function Modal({ open, onClose, title, children, className = '' }) {
  // Lock body scroll when open and handle Escape key
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') onClose?.()
      }
      window.addEventListener('keydown', handleKeyDown)
      return () => {
        document.body.style.overflow = ''
        window.removeEventListener('keydown', handleKeyDown)
      }
    } else {
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in"
      onClick={(e) => e.target === e.currentTarget && onClose?.()}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={[
          'bg-[#181818] rounded-[8px] w-full max-w-lg border border-white/[0.08]',
          'max-h-[90vh] overflow-y-auto animate-scale-in',
          'shadow-[0_16px_40px_rgba(0,0,0,0.7)]',
          className,
        ].join(' ')}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#4d4d4d]/60">
          <h2 className="text-base font-bold text-white tracking-wide">{title}</h2>
          <button
            onClick={onClose}
            className="text-[#b3b3b3] hover:text-white transition-all duration-200 p-1.5 rounded-full hover:bg-[#1f1f1f] hover:rotate-90 active:scale-95 cursor-pointer"
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  )
}
