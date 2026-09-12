import { Bell, Ticket, PackageSearch, Radar, Phone, ChevronRight, MapPin, Calendar } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Card from '../../components/Card'
import Screen from '../../components/Screen'
import Logo from '../../components/Logo'
import { useAppState } from '../../context/AppStateContext'

const QUICK_ACTIONS = [
  { key: 'book', label: 'Book a Ticket', desc: 'Reserve your seat in minutes', icon: Ticket, accent: 'red', to: '/customer/book' },
  { key: 'track-parcel', label: 'Track a Parcel', desc: 'See where your parcel is', icon: PackageSearch, accent: 'gold', to: '/customer/parcels' },
  { key: 'track-bus', label: 'Track My Bus', desc: 'Live status of active trips', icon: Radar, accent: 'navy', to: '/customer/track-bus' },
  { key: 'contact', label: 'Contact Us', desc: 'Talk to City Bus support', icon: Phone, accent: 'green', to: '/customer/contact' },
]

function formatDate(dateStr) {
  return new Date(`${dateStr}T00:00:00`).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
}

export default function Home() {
  const navigate = useNavigate()
  const { auth, tickets } = useAppState()

  const myTickets = tickets.filter((t) => t.customerPhone === auth.user?.phone)
  const now = new Date()
  const upcoming = myTickets
    .filter((t) => new Date(`${t.date}T${t.time}`) >= now)
    .sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`))[0]

  return (
    <Screen className="pb-8">
      <div className="bg-brand-navy px-6 pt-[max(env(safe-area-inset-top),1.5rem)] pb-8 rounded-b-[28px] text-white">
        <div className="flex items-center justify-between">
          <div className="rounded-lg bg-white/10 px-2 py-1">
            <Logo size="sm" tagline={false} />
          </div>
          <button
            type="button"
            aria-label="Notifications"
            className="tap-highlight-none relative flex h-10 w-10 items-center justify-center rounded-full bg-white/10 active:bg-white/20"
          >
            <Bell size={19} />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-brand-gold" />
          </button>
        </div>
        <h1 className="mt-6 text-xl font-extrabold leading-snug">Hello{auth.user?.phone ? ',' : ''}</h1>
        <p className="text-white/80 text-sm mt-0.5">How can we help you today?</p>
      </div>

      <div className="px-5 -mt-4">
        {upcoming ? (
          <Card
            accent="gold"
            className="p-4"
            onClick={() => navigate(`/customer/ticket/${upcoming.bookingRef}`)}
          >
            <p className="text-xs font-bold uppercase tracking-wide text-brand-gold">Upcoming Trip</p>
            <div className="mt-2 flex items-center justify-between">
              <div>
                <p className="text-base font-extrabold text-ink">
                  {upcoming.from} → {upcoming.to}
                </p>
                <div className="mt-1.5 flex items-center gap-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Calendar size={13} /> {formatDate(upcoming.date)}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin size={13} /> {upcoming.time}
                  </span>
                </div>
              </div>
              <ChevronRight size={20} className="text-gray-300" />
            </div>
          </Card>
        ) : (
          <Card className="p-4">
            <p className="text-sm font-semibold text-ink">No upcoming trips yet</p>
            <p className="mt-0.5 text-xs text-gray-500">Book a ticket to see it here.</p>
          </Card>
        )}
      </div>

      <div className="mt-6 px-5">
        <h2 className="mb-3 text-sm font-extrabold uppercase tracking-wide text-gray-400">Quick Actions</h2>
        <div className="flex flex-col gap-3">
          {QUICK_ACTIONS.map((a) => (
            <Card key={a.key} accent={a.accent} className="p-4" onClick={() => navigate(a.to)}>
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
                    {
                      red: 'bg-brand-red/10 text-brand-red',
                      gold: 'bg-brand-gold/15 text-[#8a5906]',
                      navy: 'bg-brand-navy/10 text-brand-navy',
                      green: 'bg-brand-green/10 text-brand-green',
                    }[a.accent]
                  }`}
                >
                  <a.icon size={20} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-ink text-[15px]">{a.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{a.desc}</p>
                </div>
                <ChevronRight size={18} className="shrink-0 text-gray-300" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Screen>
  )
}
