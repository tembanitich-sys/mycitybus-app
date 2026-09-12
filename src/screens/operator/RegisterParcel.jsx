import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../../components/Header'
import Button from '../../components/Button'
import Card from '../../components/Card'
import Screen from '../../components/Screen'
import EcoCashPayment from '../../components/EcoCashPayment'
import { useAppState } from '../../context/AppStateContext'
import { CITIES, PARCEL_CATEGORIES } from '../../data/mockData'

const FIELD_CLASS =
  'w-full rounded-xl border border-gray-200 bg-white px-4 h-12 text-[15px] focus:border-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-navy/15'

function formatTripOption(t) {
  const d = new Date(`${t.date}T00:00:00`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
  return `${t.id} · ${d} ${t.time} · ${t.busName}`
}

export default function RegisterParcel() {
  const navigate = useNavigate()
  const { trips, createParcel } = useAppState()
  const [step, setStep] = useState('form')
  const [form, setForm] = useState({
    senderName: '',
    senderPhone: '',
    recipientName: '',
    recipientPhone: '',
    origin: 'Harare',
    destination: 'Gaborone',
    description: '',
    categoryId: PARCEL_CATEGORIES[0].id,
    serial: '',
    declaredValue: '',
    tripId: '',
  })
  const [error, setError] = useState('')

  const eligibleTrips = useMemo(
    () => trips.filter((t) => t.from === form.origin && t.to === form.destination).slice(0, 12),
    [trips, form.origin, form.destination],
  )

  const category = PARCEL_CATEGORIES.find((c) => c.id === form.categoryId)
  const selectedTrip = trips.find((t) => t.id === form.tripId)

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (
      !form.senderName.trim() ||
      !form.senderPhone.trim() ||
      !form.recipientName.trim() ||
      !form.recipientPhone.trim() ||
      !form.description.trim() ||
      !form.tripId
    ) {
      setError('Please fill in all required fields, including the trip.')
      return
    }
    if (form.origin === form.destination) {
      setError('Origin and destination must be different.')
      return
    }
    setError('')
    setStep('payment')
  }

  function handlePaymentSuccess({ ecocashRef }) {
    const parcel = createParcel({
      sender: { name: form.senderName.trim(), phone: form.senderPhone.trim() },
      recipient: { name: form.recipientName.trim(), phone: form.recipientPhone.trim() },
      from: form.origin,
      to: form.destination,
      description: form.description.trim(),
      category: form.categoryId,
      categoryLabel: category.label,
      priceUsd: category.priceUsd,
      serial: form.serial.trim(),
      declaredValue: form.declaredValue ? Number(form.declaredValue) : null,
      tripId: form.tripId,
      tripLabel: selectedTrip ? formatTripOption(selectedTrip) : form.tripId,
      ecocashRef,
    })
    navigate(`/operator/parcels/registered/${parcel.trackingCode}`, { replace: true })
  }

  if (step === 'payment') {
    return (
      <Screen className="flex h-full flex-col">
        <Header title="EcoCash Payment" onBack={() => setStep('form')} />
        <div className="flex-1 overflow-y-auto px-5 py-5">
          <EcoCashPayment
            amountUsd={category.priceUsd}
            purposeLabel={`${category.label} · ${form.origin} → ${form.destination}`}
            defaultPhone={form.senderPhone}
            onSuccess={handlePaymentSuccess}
          />
        </div>
      </Screen>
    )
  }

  return (
    <Screen className="flex h-full flex-col">
      <Header title="Register Parcel" onBack={() => navigate('/operator/parcels')} />
      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-5 py-5">
        <p className="mb-4 text-xs font-extrabold uppercase tracking-wide text-gray-400">Sender</p>
        <div className="flex flex-col gap-3 mb-5">
          <input
            className={FIELD_CLASS}
            placeholder="Sender full name"
            value={form.senderName}
            onChange={(e) => update('senderName', e.target.value)}
          />
          <input
            className={FIELD_CLASS}
            placeholder="Sender phone number"
            type="tel"
            value={form.senderPhone}
            onChange={(e) => update('senderPhone', e.target.value)}
          />
        </div>

        <p className="mb-4 text-xs font-extrabold uppercase tracking-wide text-gray-400">Recipient</p>
        <div className="flex flex-col gap-3 mb-5">
          <input
            className={FIELD_CLASS}
            placeholder="Recipient full name"
            value={form.recipientName}
            onChange={(e) => update('recipientName', e.target.value)}
          />
          <input
            className={FIELD_CLASS}
            placeholder="Recipient phone number"
            type="tel"
            value={form.recipientPhone}
            onChange={(e) => update('recipientPhone', e.target.value)}
          />
        </div>

        <p className="mb-4 text-xs font-extrabold uppercase tracking-wide text-gray-400">Parcel Details</p>
        <div className="flex flex-col gap-3 mb-5">
          <div className="grid grid-cols-2 gap-3">
            <select className={FIELD_CLASS} value={form.origin} onChange={(e) => update('origin', e.target.value)}>
              {CITIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <select
              className={FIELD_CLASS}
              value={form.destination}
              onChange={(e) => update('destination', e.target.value)}
            >
              {CITIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <input
            className={FIELD_CLASS}
            placeholder="Description of item(s)"
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
          />
          <select className={FIELD_CLASS} value={form.categoryId} onChange={(e) => update('categoryId', e.target.value)}>
            {PARCEL_CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label} — ${c.priceUsd}
              </option>
            ))}
          </select>
          <input
            className={FIELD_CLASS}
            placeholder="Serial / IMEI (optional)"
            value={form.serial}
            onChange={(e) => update('serial', e.target.value)}
          />
          <input
            className={FIELD_CLASS}
            placeholder="Declared value (USD, optional)"
            type="number"
            min="0"
            value={form.declaredValue}
            onChange={(e) => update('declaredValue', e.target.value)}
          />
          <select className={FIELD_CLASS} value={form.tripId} onChange={(e) => update('tripId', e.target.value)}>
            <option value="">Select trip / bus…</option>
            {eligibleTrips.map((t) => (
              <option key={t.id} value={t.id}>
                {formatTripOption(t)}
              </option>
            ))}
          </select>
          {eligibleTrips.length === 0 && (
            <p className="text-xs text-gray-400">No upcoming trips for this route yet — try another origin/destination.</p>
          )}
        </div>

        <Card className="p-4 mb-5" accent="gold">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-500">Amount due</p>
            <p className="text-xl font-extrabold text-ink">${category.priceUsd.toFixed(2)}</p>
          </div>
        </Card>

        {error && <p className="mb-4 text-sm font-semibold text-brand-red">{error}</p>}

        <Button type="submit">Continue to Payment</Button>
      </form>
    </Screen>
  )
}
