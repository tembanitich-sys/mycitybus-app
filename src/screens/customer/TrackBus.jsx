import { Radar, Navigation } from 'lucide-react'
import Header from '../../components/Header'
import Card from '../../components/Card'
import StatusBadge from '../../components/StatusBadge'
import Screen from '../../components/Screen'
import { FLEET_LOCATIONS } from '../../data/mockData'

export default function TrackBus() {
  return (
    <Screen className="flex h-full flex-col">
      <Header title="Track My Bus" />
      <div className="flex-1 overflow-y-auto px-5 py-5">
        <div className="mb-4 flex items-center gap-2 rounded-xl bg-brand-navy/5 px-4 py-3">
          <Radar size={16} className="text-brand-navy shrink-0" />
          <p className="text-xs text-brand-navy">Live status for all active City Bus departures right now.</p>
        </div>
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
