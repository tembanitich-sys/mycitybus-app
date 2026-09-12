import { ClipboardList } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Header from '../../components/Header'
import Card from '../../components/Card'
import Screen from '../../components/Screen'
import { useAppState } from '../../context/AppStateContext'

function formatDate(dateStr) {
  return new Date(`${dateStr}T00:00:00`).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
}

export default function ViewManifest() {
  const navigate = useNavigate()
  const { tickets } = useAppState()

  const groups = {}
  tickets.forEach((t) => {
    const key = t.tripId
    if (!groups[key]) {
      groups[key] = {
        tripId: t.tripId,
        from: t.from,
        to: t.to,
        date: t.date,
        time: t.time,
        busName: t.busName,
        rows: [],
      }
    }
    t.passengers.forEach((p) => {
      groups[key].rows.push({
        bookingRef: t.bookingRef,
        name: p.name,
        phone: p.phone,
        seat: p.seat,
        nextOfKin: t.nextOfKin,
        boardingPoint: t.boardingPoint,
      })
    })
  })
  const tripGroups = Object.values(groups).sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`))

  return (
    <Screen className="flex h-full flex-col">
      <Header title="View Manifest" onBack={() => navigate('/operator/dashboard')} subtitle="Read-only · auto-generated from bookings" />
      <div className="flex-1 overflow-y-auto px-5 py-5">
        {tripGroups.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-16 text-center">
            <ClipboardList size={40} className="text-gray-300" />
            <p className="font-bold text-ink">No bookings yet</p>
            <p className="text-sm text-gray-500 max-w-[260px]">
              The manifest fills in automatically as customers book tickets through the app.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {tripGroups.map((g) => (
              <Card key={g.tripId} className="overflow-hidden">
                <div className="bg-brand-navy/5 px-4 py-3">
                  <p className="font-extrabold text-ink">
                    {g.from} → {g.to}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {formatDate(g.date)} &middot; {g.time} &middot; {g.busName} &middot; {g.rows.length} passenger
                    {g.rows.length > 1 ? 's' : ''}
                  </p>
                </div>
                <div className="divide-y divide-gray-100">
                  {g.rows.map((r, i) => (
                    <div key={`${r.bookingRef}-${i}`} className="px-4 py-3">
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-ink text-sm">{r.name}</p>
                        <span className="rounded-md bg-gray-100 px-2 py-0.5 text-xs font-bold text-gray-600">
                          Seat {r.seat}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">{r.phone}</p>
                      <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-0.5 text-[11px] text-gray-400">
                        <span>Ref: {r.bookingRef}</span>
                        <span>Boarding: {r.boardingPoint}</span>
                        <span>
                          NoK: {r.nextOfKin.name} ({r.nextOfKin.phone})
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Screen>
  )
}
