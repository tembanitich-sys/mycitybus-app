import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Minus, Plus, ArrowRightLeft, Check } from 'lucide-react'
import Header from '../../components/Header'
import Button from '../../components/Button'
import Card from '../../components/Card'
import Screen from '../../components/Screen'
import EcoCashPayment from '../../components/EcoCashPayment'
import TicketPass from '../../components/TicketPass'
import { useAppState } from '../../context/AppStateContext'
import { ROUTES, BOARDING_POINTS, buildSeatLayout } from '../../data/mockData'

const STEP_TITLES = [
  'Choose Direction',
  'Date & Departure',
  'Boarding Point',
  'Passengers',
  'Select Seats',
  'Passenger Details',
  'Next of Kin',
  'Payment Summary',
  'EcoCash Payment',
  'Booking Confirmed',
]

// Deterministic "already taken" seats per trip so the map looks realistic but stable across renders.
function isSeatTaken(tripId, seatId) {
  let hash = 0
  const str = `${tripId}-${seatId}`
  for (let i = 0; i < str.length; i++) hash = (hash * 31 + str.charCodeAt(i)) >>> 0
  return hash % 10 < 3
}

function formatDateLong(dateStr) {
  return new Date(`${dateStr}T00:00:00`).toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
}

export default function BookTicketFlow() {
  const navigate = useNavigate()
  const { auth, trips, createTicket } = useAppState()
  const [step, setStep] = useState(0)

  const [route, setRoute] = useState(ROUTES.find((r) => r.id === 'HRE-GBE'))
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedTrip, setSelectedTrip] = useState(null)
  const [boardingPoint, setBoardingPoint] = useState(null)
  const [passengerCount, setPassengerCount] = useState(1)
  const [selectedSeats, setSelectedSeats] = useState([])
  const [passengers, setPassengers] = useState([])
  const [nextOfKin, setNextOfKin] = useState({ name: '', phone: '' })
  const [ticket, setTicket] = useState(null)

  const upcomingDates = useMemo(() => {
    const set = new Set(trips.filter((t) => t.routeId === route.id).map((t) => t.date))
    return Array.from(set).sort().slice(0, 10)
  }, [trips, route])

  const tripsOnDate = useMemo(
    () => trips.filter((t) => t.routeId === route.id && t.date === selectedDate).sort((a, b) => a.time.localeCompare(b.time)),
    [trips, route, selectedDate],
  )

  const seatRows = useMemo(() => buildSeatLayout(), [])

  function goNext() {
    setStep((s) => Math.min(s + 1, STEP_TITLES.length - 1))
  }
  function goBack() {
    if (step === 0) {
      navigate(-1)
      return
    }
    setStep((s) => s - 1)
  }

  function toggleSeat(seatId) {
    if (!seatId) return
    if (selectedTrip && isSeatTaken(selectedTrip.id, seatId)) return
    setSelectedSeats((prev) => {
      if (prev.includes(seatId)) return prev.filter((s) => s !== seatId)
      if (prev.length >= passengerCount) return prev
      return [...prev, seatId]
    })
  }

  function ensurePassengerSlots(seats) {
    setPassengers(seats.map((seat) => ({ seat, name: '', phone: '' })))
  }

  const totalFare = selectedTrip ? selectedTrip.fareUsd * passengerCount : 0
  const canPayPhone = passengers[0]?.phone || auth.user?.phone || ''

  function handlePaymentSuccess({ ecocashRef }) {
    const created = createTicket({
      tripId: selectedTrip.id,
      from: selectedTrip.from,
      to: selectedTrip.to,
      date: selectedTrip.date,
      time: selectedTrip.time,
      durationLabel: selectedTrip.durationLabel,
      busName: selectedTrip.busName,
      boardingPoint,
      passengers,
      nextOfKin,
      fareUsd: totalFare,
      ecocashRef,
      customerPhone: auth.user?.phone,
    })
    setTicket(created)
    goNext()
  }

  return (
    <Screen className="flex h-full flex-col">
      <Header title={STEP_TITLES[step]} onBack={goBack} subtitle={`Step ${Math.min(step + 1, 9)} of 9`} />
      <div className="flex-1 overflow-y-auto px-5 py-5">
        {step === 0 && (
          <div className="flex flex-col gap-3">
            {ROUTES.map((r) => (
              <Card
                key={r.id}
                accent={route.id === r.id ? 'red' : 'none'}
                className={`p-4 ${route.id === r.id ? 'ring-2 ring-brand-red' : ''}`}
                onClick={() => setRoute(r)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <ArrowRightLeft size={18} className="text-brand-navy" />
                    <div>
                      <p className="font-extrabold text-ink">
                        {r.from} → {r.to}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">{r.durationLabel} &middot; from ${r.fareUsd}</p>
                    </div>
                  </div>
                  {route.id === r.id && <Check size={18} className="text-brand-red" />}
                </div>
              </Card>
            ))}
          </div>
        )}

        {step === 1 && (
          <div>
            <p className="mb-2 text-sm font-bold text-ink">Departure date</p>
            <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-2">
              {upcomingDates.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => {
                    setSelectedDate(d)
                    setSelectedTrip(null)
                  }}
                  className={`tap-highlight-none shrink-0 rounded-xl px-3.5 py-2.5 text-xs font-bold ${
                    selectedDate === d ? 'bg-brand-red text-white' : 'bg-white text-ink border border-gray-200'
                  }`}
                >
                  {formatDateLong(d)}
                </button>
              ))}
            </div>

            {selectedDate && (
              <div className="mt-5 flex flex-col gap-3">
                <p className="text-sm font-bold text-ink">Available departures</p>
                {tripsOnDate.length === 0 && <p className="text-sm text-gray-500">No departures on this date.</p>}
                {tripsOnDate.map((t) => (
                  <Card
                    key={t.id}
                    accent={selectedTrip?.id === t.id ? 'red' : 'none'}
                    className={`p-4 ${selectedTrip?.id === t.id ? 'ring-2 ring-brand-red' : ''}`}
                    onClick={() => setSelectedTrip(t)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-extrabold text-ink">{t.time} departure</p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {t.busName} &middot; {t.durationLabel}
                        </p>
                      </div>
                      <p className="font-extrabold text-brand-navy">${t.fareUsd}</p>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-3">
            {(BOARDING_POINTS[route.from] ?? []).map((bp) => (
              <Card
                key={bp}
                accent={boardingPoint === bp ? 'red' : 'none'}
                className={`p-4 ${boardingPoint === bp ? 'ring-2 ring-brand-red' : ''}`}
                onClick={() => setBoardingPoint(bp)}
              >
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-ink">{bp}</p>
                  {boardingPoint === bp && <Check size={18} className="text-brand-red" />}
                </div>
              </Card>
            ))}
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col items-center gap-6 py-8">
            <p className="text-sm text-gray-500">How many passengers are travelling?</p>
            <div className="flex items-center gap-6">
              <button
                type="button"
                onClick={() => setPassengerCount((c) => Math.max(1, c - 1))}
                className="tap-highlight-none flex h-12 w-12 items-center justify-center rounded-full bg-white border border-gray-200 active:bg-gray-50"
              >
                <Minus size={20} />
              </button>
              <span className="text-4xl font-extrabold text-ink w-14 text-center">{passengerCount}</span>
              <button
                type="button"
                onClick={() => setPassengerCount((c) => Math.min(6, c + 1))}
                className="tap-highlight-none flex h-12 w-12 items-center justify-center rounded-full bg-brand-red text-white active:bg-brand-red-dark"
              >
                <Plus size={20} />
              </button>
            </div>
            <p className="text-xs text-gray-400">Maximum 6 passengers per booking</p>
          </div>
        )}

        {step === 4 && selectedTrip && (
          <div>
            <div className="mb-4 flex items-center justify-center gap-4 text-xs font-semibold">
              <span className="flex items-center gap-1.5">
                <span className="h-3.5 w-3.5 rounded bg-white border border-gray-300" /> Available
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-3.5 w-3.5 rounded bg-brand-red" /> Selected
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-3.5 w-3.5 rounded bg-gray-300" /> Taken
              </span>
            </div>
            <div className="mx-auto flex w-fit flex-col gap-2 rounded-2xl bg-white p-4 shadow-card">
              <div className="mb-2 flex justify-center">
                <div className="rounded-full bg-gray-100 px-3 py-1 text-[10px] font-bold text-gray-400">DRIVER</div>
              </div>
              {seatRows.map((row, ri) => (
                <div key={ri} className="flex justify-center gap-2">
                  {row.map((seatId, si) =>
                    seatId === null ? (
                      <div key={si} className="w-8" />
                    ) : (
                      <button
                        key={seatId}
                        type="button"
                        onClick={() => toggleSeat(seatId)}
                        disabled={isSeatTaken(selectedTrip.id, seatId)}
                        className={`tap-highlight-none flex h-8 w-8 items-center justify-center rounded-md text-[10px] font-bold transition-colors ${
                          isSeatTaken(selectedTrip.id, seatId)
                            ? 'bg-gray-300 text-gray-400 cursor-not-allowed'
                            : selectedSeats.includes(seatId)
                            ? 'bg-brand-red text-white'
                            : 'bg-white border border-gray-300 text-ink active:border-brand-navy'
                        }`}
                      >
                        {seatId}
                      </button>
                    ),
                  )}
                </div>
              ))}
            </div>
            <p className="mt-4 text-center text-sm text-gray-500">
              Selected {selectedSeats.length} of {passengerCount} seat{passengerCount > 1 ? 's' : ''}
            </p>
          </div>
        )}

        {step === 5 && (
          <div className="flex flex-col gap-5">
            {passengers.map((p, idx) => (
              <div key={p.seat}>
                <p className="mb-2 text-sm font-bold text-ink">
                  Passenger {idx + 1} &middot; Seat {p.seat}
                </p>
                <input
                  type="text"
                  placeholder="Full name"
                  value={p.name}
                  onChange={(e) =>
                    setPassengers((prev) => prev.map((pp, i) => (i === idx ? { ...pp, name: e.target.value } : pp)))
                  }
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 h-12 text-[15px] mb-2 focus:border-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-navy/15"
                />
                <input
                  type="tel"
                  placeholder="Phone number"
                  value={p.phone}
                  onChange={(e) =>
                    setPassengers((prev) => prev.map((pp, i) => (i === idx ? { ...pp, phone: e.target.value } : pp)))
                  }
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 h-12 text-[15px] focus:border-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-navy/15"
                />
              </div>
            ))}
          </div>
        )}

        {step === 6 && (
          <div>
            <p className="mb-4 text-sm text-gray-500">
              We'll keep one emergency contact on file for this whole booking.
            </p>
            <label className="block text-sm font-bold text-ink mb-1.5">Next of Kin — full name</label>
            <input
              type="text"
              value={nextOfKin.name}
              onChange={(e) => setNextOfKin((n) => ({ ...n, name: e.target.value }))}
              placeholder="e.g. Rudo Chikafu"
              className="w-full rounded-xl border border-gray-200 bg-white px-4 h-12 text-[15px] mb-4 focus:border-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-navy/15"
            />
            <label className="block text-sm font-bold text-ink mb-1.5">Next of Kin — phone number</label>
            <input
              type="tel"
              value={nextOfKin.phone}
              onChange={(e) => setNextOfKin((n) => ({ ...n, phone: e.target.value }))}
              placeholder="+263 77 987 6543"
              className="w-full rounded-xl border border-gray-200 bg-white px-4 h-12 text-[15px] focus:border-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-navy/15"
            />
          </div>
        )}

        {step === 7 && selectedTrip && (
          <div className="flex flex-col gap-4">
            <Card className="p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-gray-400">Trip Summary</p>
              <p className="mt-2 text-lg font-extrabold text-ink">
                {selectedTrip.from} → {selectedTrip.to}
              </p>
              <p className="text-sm text-gray-500 mt-0.5">
                {formatDateLong(selectedTrip.date)} &middot; {selectedTrip.time} &middot; {boardingPoint}
              </p>
              <p className="text-sm text-gray-500 mt-1">Seats: {selectedSeats.join(', ')}</p>
            </Card>
            <Card className="p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-2">Fare Breakdown</p>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-gray-500">
                  ${selectedTrip.fareUsd} &times; {passengerCount} passenger{passengerCount > 1 ? 's' : ''}
                </span>
                <span className="font-semibold text-ink">${totalFare.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t border-gray-100 pt-2 mt-2 text-base font-extrabold">
                <span>Total Due</span>
                <span className="text-brand-navy">${totalFare.toFixed(2)}</span>
              </div>
            </Card>
          </div>
        )}

        {step === 8 && selectedTrip && (
          <EcoCashPayment
            amountUsd={totalFare}
            purposeLabel={`${selectedTrip.from} → ${selectedTrip.to} ticket (${passengerCount} seat${passengerCount > 1 ? 's' : ''})`}
            defaultPhone={canPayPhone}
            onSuccess={handlePaymentSuccess}
          />
        )}

        {step === 9 && ticket && (
          <div className="flex flex-col items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-green/10">
              <Check size={32} className="text-brand-green" />
            </div>
            <p className="text-xl font-extrabold text-ink">Booking Successful!</p>
            <p className="text-center text-sm text-gray-500 -mt-2">Your seat is confirmed. Safe travels.</p>
            <TicketPass ticket={ticket} />
          </div>
        )}
      </div>

      <div className="shrink-0 border-t border-gray-100 bg-white px-5 py-4">
        {step === 9 ? (
          <Button onClick={() => navigate('/customer/tickets')}>Done</Button>
        ) : step === 8 ? null : (
          <Button
            disabled={
              (step === 1 && !selectedTrip) ||
              (step === 2 && !boardingPoint) ||
              (step === 4 && selectedSeats.length !== passengerCount) ||
              (step === 5 && passengers.some((p) => !p.name.trim() || !p.phone.trim())) ||
              (step === 6 && (!nextOfKin.name.trim() || !nextOfKin.phone.trim()))
            }
            onClick={() => {
              if (step === 4) ensurePassengerSlots(selectedSeats)
              goNext()
            }}
          >
            Continue
          </Button>
        )}
      </div>
    </Screen>
  )
}
