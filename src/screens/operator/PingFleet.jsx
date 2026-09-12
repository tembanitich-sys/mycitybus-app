import { useNavigate } from 'react-router-dom'
import { Satellite, Navigation } from 'lucide-react'
import Header from '../../components/Header'
import Card from '../../components/Card'
import StatusBadge from '../../components/StatusBadge'
import Button from '../../components/Button'
import Screen from '../../components/Screen'
import { useToast } from '../../components/Toast'
import { FLEET_LOCATIONS } from '../../data/mockData'

export default function PingFleet() {
  const navigate = useNavigate()
  const showToast = useToast()

  return (
    <Screen className="flex h-full flex-col">
      <Header title="Ping All Fleet" onBack={() => navigate('/operator/dashboard')} />
      <div className="flex-1 overflow-y-auto px-5 py-5">
        <Button
          variant="secondary"
          icon={Satellite}
          className="mb-5"
          onClick={() => showToast('Location ping sent to all active buses')}
        >
          Ping All Buses Now
        </Button>
        <div className="flex flex-col gap-3">
          {FLEET_LOCATIONS.map((bus) => (
            <Card key={bus.busId} accent={bus.status === 'On Route' ? 'green' : 'gold'} className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-extrabold text-ink">{bus.busId}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{bus.route}</p>
                </div>
                <StatusBadge tone={bus.status === 'On Route' ? 'green' : 'gold'}>{bus.status}</StatusBadge>
              </div>
              <div className="mt-3 flex items-center gap-2 text-sm text-ink">
                <Navigation size={14} className="text-brand-navy shrink-0" />
                <span className="font-semibold">{bus.location}</span>
              </div>
              <p className="mt-1 text-xs text-gray-400">{bus.etaLabel}</p>
            </Card>
          ))}
        </div>
      </div>
    </Screen>
  )
}
