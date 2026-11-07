// EmptyState.jsx — Empty list placeholder
import { InboxIcon } from 'lucide-react'

export function EmptyState({ icon: Icon = InboxIcon, title = 'Nothing here yet', description = '' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
      <div className="p-5 rounded-full bg-[#1f1f1f]">
        <Icon size={32} className="text-[#4d4d4d]" />
      </div>
      <p className="text-base font-bold text-[#b3b3b3]">{title}</p>
      {description && <p className="text-sm text-[#7c7c7c] max-w-xs">{description}</p>}
    </div>
  )
}
