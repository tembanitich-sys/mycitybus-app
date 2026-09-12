const TONES = {
  green: 'bg-brand-green/10 text-brand-green-dark',
  gold: 'bg-brand-gold/15 text-[#8a5906]',
  navy: 'bg-brand-navy/10 text-brand-navy',
  red: 'bg-brand-red/10 text-brand-red-dark',
  grey: 'bg-gray-100 text-gray-500',
}

export default function StatusBadge({ children, tone = 'navy', className = '' }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold ${TONES[tone]} ${className}`}>
      {children}
    </span>
  )
}
