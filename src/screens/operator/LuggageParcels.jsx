import { useNavigate } from 'react-router-dom'
import { Plus, ArrowRightCircle, PackageSearch } from 'lucide-react'
import Header from '../../components/Header'
import Card from '../../components/Card'
import Button from '../../components/Button'
import StatusBadge from '../../components/StatusBadge'
import Screen from '../../components/Screen'
import { useToast } from '../../components/Toast'
import { useAppState } from '../../context/AppStateContext'
import { PARCEL_STATUS_FLOW } from '../../data/mockData'

const STATUS_TONE = {
  Registered: 'grey',
  'Loaded on Bus': 'gold',
  'In Transit': 'navy',
  Arrived: 'green',
  Collected: 'green',
}

export default function LuggageParcels() {
  const navigate = useNavigate()
  const showToast = useToast()
  const { parcels, advanceParcelStatus } = useAppState()

  function handleAdvance(p) {
    advanceParcelStatus(p.trackingCode)
    const idx = PARCEL_STATUS_FLOW.indexOf(p.status)
    const nextStatus = PARCEL_STATUS_FLOW[Math.min(idx + 1, PARCEL_STATUS_FLOW.length - 1)]
    showToast(`${p.trackingCode} marked as "${nextStatus}"`)
  }

  return (
    <Screen className="flex h-full flex-col">
      <Header title="Luggage & Parcels" onBack={() => navigate('/operator/dashboard')} />
      <div className="flex-1 overflow-y-auto px-5 py-5">
        <Button icon={Plus} onClick={() => navigate('/operator/parcels/register')} className="mb-5">
          Register Parcel
        </Button>

        {parcels.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-14 text-center">
            <PackageSearch size={36} className="text-gray-300" />
            <p className="font-bold text-ink">No parcels registered</p>
            <p className="text-sm text-gray-500">Registered parcels and luggage will appear here.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {parcels.map((p) => {
              const isFinal = p.status === 'Collected'
              const idx = PARCEL_STATUS_FLOW.indexOf(p.status)
              const nextStatus = PARCEL_STATUS_FLOW[Math.min(idx + 1, PARCEL_STATUS_FLOW.length - 1)]
              return (
                <Card key={p.trackingCode} className="p-4">
                  <div className="flex items-center justify-between">
                    <p className="font-mono text-sm font-extrabold text-ink">{p.trackingCode}</p>
                    <StatusBadge tone={STATUS_TONE[p.status]}>{p.status}</StatusBadge>
                  </div>
                  <p className="mt-1.5 text-sm font-bold text-ink">
                    {p.from} → {p.to}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {p.categoryLabel} &middot; {p.sender.name} → {p.recipient.name}
                  </p>
                  {!isFinal && (
                    <Button
                      variant="outline"
                      size="sm"
                      icon={ArrowRightCircle}
                      className="mt-3"
                      onClick={() => handleAdvance(p)}
                    >
                      Advance to "{nextStatus}"
                    </Button>
                  )}
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </Screen>
  )
}
