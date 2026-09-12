import { ChevronRight, UserRound, Briefcase } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Logo from '../components/Logo'
import Card from '../components/Card'
import Screen from '../components/Screen'

const OPTIONS = [
  {
    role: 'customer',
    title: 'Continue as Customer',
    desc: 'Book tickets, track parcels and follow your bus.',
    icon: UserRound,
    accent: 'red',
    iconBg: 'bg-brand-red/10 text-brand-red',
    to: '/login/customer',
  },
  {
    role: 'operator',
    title: 'Continue as Operator',
    desc: 'Manage trips, manifests and parcel logistics.',
    icon: Briefcase,
    accent: 'navy',
    iconBg: 'bg-brand-navy/10 text-brand-navy',
    to: '/login/operator',
  },
]

export default function RolePicker() {
  const navigate = useNavigate()

  return (
    <Screen className="flex h-full flex-col bg-paper px-6 pt-[max(env(safe-area-inset-top),2.5rem)] pb-10">
      <div className="mb-10 flex justify-center">
        <Logo size="lg" />
      </div>
      <h1 className="text-2xl font-extrabold text-ink">Welcome to City Bus</h1>
      <p className="mt-1.5 text-sm text-gray-500">Choose how you'd like to continue.</p>

      <div className="mt-8 flex flex-col gap-4">
        {OPTIONS.map((opt) => (
          <Card key={opt.role} accent={opt.accent} onClick={() => navigate(opt.to)} className="p-4">
            <div className="flex items-center gap-4">
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${opt.iconBg}`}>
                <opt.icon size={22} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-ink">{opt.title}</p>
                <p className="mt-0.5 text-xs text-gray-500 leading-snug">{opt.desc}</p>
              </div>
              <ChevronRight size={20} className="shrink-0 text-gray-300" />
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-auto pt-8 text-center text-xs text-gray-400">
        City Bus (Pvt) Ltd &middot; Harare ↔ Gaborone &amp; beyond
      </div>
    </Screen>
  )
}
