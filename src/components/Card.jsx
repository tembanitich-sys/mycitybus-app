const ACCENT_MAP = {
  red: 'border-l-brand-red',
  navy: 'border-l-brand-navy',
  gold: 'border-l-brand-gold',
  green: 'border-l-brand-green',
  none: 'border-l-transparent',
}

export default function Card({ children, accent = 'none', className = '', onClick, as: As = 'div' }) {
  return (
    <As
      onClick={onClick}
      className={`rounded-2xl bg-white shadow-card border-l-4 ${ACCENT_MAP[accent]} ${
        onClick ? 'tap-highlight-none active:scale-[0.99] cursor-pointer' : ''
      } ${className}`}
    >
      {children}
    </As>
  )
}
