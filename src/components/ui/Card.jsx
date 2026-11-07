// Card.jsx — Dark surface card matching DESIGN.md with modern tech glass styling
export function Card({ className = '', children, hover = false, ...props }) {
  return (
    <div
      className={[
        'bg-[#181818]/80 backdrop-blur-md rounded-[8px] p-5 border border-white/[0.06]',
        'transition-all duration-250 ease-out',
        hover
          ? 'hover:-translate-y-0.5 hover:bg-[#1f1f1f]/95 hover:border-[#1ed760]/35 hover:shadow-[0_12px_28px_rgba(0,0,0,0.5),0_0_20px_rgba(30,215,96,0.12)] cursor-pointer'
          : '',
        className,
      ].join(' ')}
      style={{ boxShadow: hover ? undefined : 'rgba(0,0,0,0.35) 0px 8px 16px' }}
      {...props}
    >
      {children}
    </div>
  )
}
