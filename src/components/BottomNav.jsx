import { Home, Ticket, PackageSearch, MoreHorizontal } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const TABS = [
  { to: '/customer/home', label: 'Home', icon: Home },
  { to: '/customer/tickets', label: 'Tickets', icon: Ticket },
  { to: '/customer/parcels', label: 'Parcels', icon: PackageSearch },
  { to: '/customer/more', label: 'More', icon: MoreHorizontal },
]

export default function BottomNav() {
  return (
    <nav className="shrink-0 z-20 border-t border-gray-200 bg-white/95 backdrop-blur pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-1.5 grid grid-cols-4">
      {TABS.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `tap-highlight-none flex flex-col items-center justify-center gap-0.5 py-1.5 text-[11px] font-semibold ${
              isActive ? 'text-brand-red' : 'text-gray-400'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <Icon size={22} strokeWidth={isActive ? 2.4 : 2} />
              <span>{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
