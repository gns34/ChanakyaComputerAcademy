// Modal.jsx — Dark overlay dialog matching DESIGN.md
import { useEffect } from 'react'
import { X } from 'lucide-react'
import { Button } from './Button'

export function Modal({ open, onClose, title, children, className = '' }) {
  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.75)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className={[
          'bg-[#181818] rounded-[8px] w-full max-w-lg',
          'max-h-[90vh] overflow-y-auto',
          className,
        ].join(' ')}
        style={{ boxShadow: 'rgba(0,0,0,0.5) 0px 8px 24px' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#4d4d4d]">
          <h2 className="text-base font-bold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="text-[#b3b3b3] hover:text-white transition-colors p-1 rounded-full hover:bg-[#1f1f1f]"
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
