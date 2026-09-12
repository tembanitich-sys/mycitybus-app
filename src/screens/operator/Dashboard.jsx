import { useNavigate } from 'react-router-dom'
import { ClipboardList, Megaphone, Satellite, Receipt, PackageSearch, LogOut } from 'lucide-react'
import Card from '../../components/Card'
import Logo from '../../components/Logo'
import Screen from '../../components/Screen'
import { useAppState } from '../../context/AppStateContext'

const TILES = [
  { key: 'manifest', label: 'View Manifest', desc: 'Passenger lists per trip', icon: ClipboardList, to: '/operator/manifest' },
  { key: 'trip-update', label: 'Trip Update', desc: 'Broadcast to passengers', icon: Megaphone, to: '/operator/trip-update' },
  { key: 'ping-fleet', label: 'Ping All Fleet', desc: 'Live bus locations', icon: Satellite, to: '/operator/ping-fleet' },
  { key: 'invoices', label: 'View Invoices', desc: 'Trip fees & commission', icon: Receipt, to: '/operator/invoices' },
  { key: 'parcels', label: 'Luggage & Parcels', desc: 'Register & track cargo', icon: PackageSearch, to: '/operator/parcels' },
]

export default function Dashboard() {
  const navigate = useNavigate()
  const { auth, logout } = useAppState()

  function handleLogout() {
    logout()
    navigate('/role', { replace: true })
  }

  return (
    <Screen className="flex h-full flex-col">
      <div className="shrink-0 bg-brand-navy px-5 pt-[max(env(safe-area-inset-top),1.5rem)] pb-6 text-white">
        <div className="flex items-center justify-between">
          <div className="rounded-lg bg-white/10 px-2 py-1">
            <Logo size="sm" tagline={false} />
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="tap-highlight-none flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold active:bg-white/20"
          >
            <LogOut size={14} /> Log Out
          </button>
        </div>
        <p className="mt-5 text-xs font-bold uppercase tracking-wide text-white/60">Operator Dashboard</p>
        <p className="text-lg font-extrabold">{auth.user?.name}</p>
        <p className="text-sm text-white/70">ID: {auth.user?.operatorId}</p>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-5">
        <div className="grid grid-cols-2 gap-3">
          {TILES.map((t) => (
            <Card key={t.key} className="p-4" onClick={() => navigate(t.to)}>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-navy/10 text-brand-navy mb-3">
                <t.icon size={20} />
              </div>
              <p className="font-bold text-ink text-[14px] leading-snug">{t.label}</p>
              <p className="text-xs text-gray-500 mt-1 leading-snug">{t.desc}</p>
            </Card>
          ))}
        </div>
      </div>
    </Screen>
  )
}
