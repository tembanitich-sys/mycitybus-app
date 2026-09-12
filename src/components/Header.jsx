import { ChevronLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function Header({ title, showBack = true, onBack, right = null, subtitle = null }) {
  const navigate = useNavigate()

  return (
    <header className="shrink-0 bg-brand-navy text-white px-4 pt-[max(env(safe-area-inset-top),0.75rem)] pb-3 flex items-center gap-3 shadow-md z-20 relative">
      {showBack ? (
        <button
          type="button"
          onClick={() => (onBack ? onBack() : navigate(-1))}
          className="tap-highlight-none -ml-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full active:bg-white/10"
          aria-label="Go back"
        >
          <ChevronLeft size={24} strokeWidth={2.5} />
        </button>
      ) : (
        <div className="w-9 shrink-0" />
      )}
      <div className="min-w-0 flex-1">
        <h1 className="truncate text-[17px] font-bold leading-tight">{title}</h1>
        {subtitle && <p className="truncate text-xs text-white/70 leading-tight mt-0.5">{subtitle}</p>}
      </div>
      {right && <div className="shrink-0">{right}</div>}
    </header>
  )
}
