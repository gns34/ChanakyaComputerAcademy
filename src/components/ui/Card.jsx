// Card.jsx — Dark surface card matching DESIGN.md
export function Card({ className = '', children, hover = false, ...props }) {
  return (
    <div
      className={[
        'bg-[#181818] rounded-[8px] p-5',
        hover ? 'hover:bg-[#1f1f1f] transition-colors duration-200 cursor-pointer' : '',
        className,
      ].join(' ')}
      style={{ boxShadow: hover ? undefined : 'rgba(0,0,0,0.3) 0px 8px 8px' }}
      {...props}
    >
      {children}
    </div>
  )
}
