import { useState } from 'react'
import { PackageSearch, Search } from 'lucide-react'
import Header from '../../components/Header'
import Card from '../../components/Card'
import Button from '../../components/Button'
import StatusBadge from '../../components/StatusBadge'
import ParcelTimeline from '../../components/ParcelTimeline'
import Screen from '../../components/Screen'
import { useAppState } from '../../context/AppStateContext'

const STATUS_TONE = {
  Registered: 'grey',
  'Loaded on Bus': 'gold',
  'In Transit': 'navy',
  Arrived: 'green',
  Collected: 'green',
}

export default function TrackParcel() {
  const { findParcel, addRecentTracked, recentTrackedCodes, parcels } = useAppState()
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)

  function handleTrack(e) {
    e?.preventDefault()
    const trimmed = code.trim()
    if (!trimmed) return
    const found = findParcel(trimmed)
    if (!found) {
      setError('No parcel found with that tracking code.')
      setResult(null)
      return
    }
    setError('')
    setResult(found)
    addRecentTracked(found.trackingCode)
  }

  function trackCode(c) {
    setCode(c)
    const found = findParcel(c)
    if (found) {
      setResult(found)
      setError('')
      addRecentTracked(found.trackingCode)
    }
  }

  const recentParcels = recentTrackedCodes.map((c) => parcels.find((p) => p.trackingCode === c)).filter(Boolean)

  return (
    <Screen className="flex h-full flex-col">
      <Header title="Track a Parcel" showBack={false} />
      <div className="flex-1 overflow-y-auto px-5 py-5">
        <form onSubmit={handleTrack} className="flex gap-2 mb-2">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="e.g. CBP-4F7K2Q"
            className="flex-1 rounded-xl border border-gray-200 bg-white px-4 h-12 text-[15px] font-mono focus:border-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-navy/15"
          />
          <Button type="submit" fullWidth={false} className="px-4" icon={Search} iconPosition="left">
            Track
          </Button>
        </form>
        {error && <p className="text-sm font-semibold text-brand-red mb-4">{error}</p>}

        {!result && recentParcels.length > 0 && (
          <div className="mt-4">
            <p className="mb-2 text-sm font-bold text-ink">Recently tracked</p>
            <div className="flex flex-col gap-2">
              {recentParcels.map((p) => (
                <Card key={p.trackingCode} className="p-3.5" onClick={() => trackCode(p.trackingCode)}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-mono text-sm font-bold text-ink">{p.trackingCode}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {p.from} → {p.to}
                      </p>
                    </div>
                    <StatusBadge tone={STATUS_TONE[p.status]}>{p.status}</StatusBadge>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {!result && recentParcels.length === 0 && (
          <div className="flex flex-col items-center gap-2 py-16 text-center">
            <PackageSearch size={40} className="text-gray-300" />
            <p className="font-bold text-ink">Track any parcel</p>
            <p className="text-sm text-gray-500 max-w-[240px]">
              Enter the tracking code from your parcel receipt to see live status.
            </p>
          </div>
        )}

        {result && (
          <div className="mt-4 flex flex-col gap-4">
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <p className="font-mono text-sm font-extrabold text-ink">{result.trackingCode}</p>
                <StatusBadge tone={STATUS_TONE[result.status]}>{result.status}</StatusBadge>
              </div>
              <p className="mt-2 text-lg font-extrabold text-ink">
                {result.from} → {result.to}
              </p>
              <dl className="mt-3 grid grid-cols-2 gap-y-2 text-sm">
                <div>
                  <dt className="text-xs text-gray-400">Sender</dt>
                  <dd className="font-semibold text-ink">{result.sender.name}</dd>
                </div>
                <div>
                  <dt className="text-xs text-gray-400">Recipient</dt>
                  <dd className="font-semibold text-ink">{result.recipient.name}</dd>
                </div>
                <div>
                  <dt className="text-xs text-gray-400">Category</dt>
                  <dd className="font-semibold text-ink">{result.categoryLabel}</dd>
                </div>
                <div>
                  <dt className="text-xs text-gray-400">Trip</dt>
                  <dd className="font-semibold text-ink">{result.tripLabel}</dd>
                </div>
              </dl>
            </Card>

            <Card className="p-4">
              <p className="mb-4 text-sm font-bold text-ink">Status Timeline</p>
              <ParcelTimeline parcel={result} />
            </Card>
          </div>
        )}
      </div>
    </Screen>
  )
}
