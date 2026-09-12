import { useNavigate, useParams } from 'react-router-dom'
import { CheckCircle2, Download, Printer } from 'lucide-react'
import Header from '../../components/Header'
import Card from '../../components/Card'
import Button from '../../components/Button'
import QrCode from '../../components/QrCode'
import Screen from '../../components/Screen'
import { useToast } from '../../components/Toast'
import { useAppState } from '../../context/AppStateContext'

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function ParcelRegistered() {
  const { trackingCode } = useParams()
  const navigate = useNavigate()
  const showToast = useToast()
  const { findParcel } = useAppState()
  const parcel = findParcel(trackingCode)

  if (!parcel) {
    return (
      <Screen className="flex h-full flex-col">
        <Header title="Parcel" onBack={() => navigate('/operator/parcels')} />
        <div className="flex flex-1 items-center justify-center px-6 text-center text-sm text-gray-500">
          We couldn't find that parcel.
        </div>
      </Screen>
    )
  }

  return (
    <Screen className="flex h-full flex-col">
      <Header title="Parcel Registered" showBack={false} />
      <div className="flex-1 overflow-y-auto px-5 py-6">
        <div className="flex flex-col items-center gap-2 mb-5">
          <CheckCircle2 size={48} className="text-brand-green" />
          <p className="text-xl font-extrabold text-ink text-center">Parcel Registered Successfully!</p>
          <p className="text-sm text-gray-500 text-center">Payment received. The label is ready.</p>
        </div>

        <Card className="overflow-hidden">
          <div className="bg-brand-navy px-5 py-4 text-white">
            <p className="text-[11px] font-bold uppercase tracking-wider text-white/70">City Bus &middot; Parcel Label</p>
            <p className="mt-1 text-lg font-extrabold">
              {parcel.from} → {parcel.to}
            </p>
          </div>
          <div className="flex flex-col items-center gap-3 px-5 py-6">
            <QrCode value={parcel.trackingCode} />
            <p className="font-mono text-base font-bold tracking-wider text-ink">{parcel.trackingCode}</p>
          </div>
          <div className="border-t border-dashed border-gray-300 px-5 py-5">
            <dl className="grid grid-cols-2 gap-y-3 text-sm">
              <div>
                <dt className="text-xs text-gray-400">From</dt>
                <dd className="font-bold text-ink">{parcel.from}</dd>
              </div>
              <div>
                <dt className="text-xs text-gray-400">To</dt>
                <dd className="font-bold text-ink">{parcel.to}</dd>
              </div>
              <div>
                <dt className="text-xs text-gray-400">Sender</dt>
                <dd className="font-bold text-ink">{parcel.sender.name}</dd>
              </div>
              <div>
                <dt className="text-xs text-gray-400">Recipient</dt>
                <dd className="font-bold text-ink">{parcel.recipient.name}</dd>
              </div>
              <div>
                <dt className="text-xs text-gray-400">Trip</dt>
                <dd className="font-bold text-ink">{parcel.tripLabel}</dd>
              </div>
              <div>
                <dt className="text-xs text-gray-400">Date</dt>
                <dd className="font-bold text-ink">{formatDate(parcel.createdAt)}</dd>
              </div>
              <div className="col-span-2">
                <dt className="text-xs text-gray-400">Category</dt>
                <dd className="font-bold text-ink">
                  {parcel.categoryLabel} &middot; ${parcel.priceUsd.toFixed(2)}
                </dd>
              </div>
            </dl>
          </div>
          <div className="flex gap-3 px-5 pb-5">
            <Button variant="outline" icon={Download} onClick={() => showToast('Label saved to Downloads')}>
              Download Label
            </Button>
            <Button variant="secondary" icon={Printer} onClick={() => showToast('Sending label to printer…')}>
              Print Label
            </Button>
          </div>
        </Card>

        <div className="mt-6">
          <Button onClick={() => navigate('/operator/parcels')}>Done</Button>
        </div>
      </div>
    </Screen>
  )
}
