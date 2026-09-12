import { Download, Share2 } from 'lucide-react'
import Card from './Card'
import Button from './Button'
import QrCode from './QrCode'
import { useToast } from './Toast'

export default function TicketPass({ ticket, showActions = true }) {
  const showToast = useToast()
  const seatList = ticket.passengers.map((p) => p.seat).join(', ')

  return (
    <Card className="overflow-hidden">
      <div className="bg-brand-navy px-5 py-4 text-white">
        <p className="text-[11px] font-bold uppercase tracking-wider text-white/70">City Bus &middot; Ticket</p>
        <p className="mt-1 text-lg font-extrabold">
          {ticket.from} → {ticket.to}
        </p>
      </div>

      <div className="flex flex-col items-center gap-4 px-5 py-6">
        <QrCode value={ticket.bookingRef} />
        <p className="font-mono text-sm font-bold tracking-wider text-ink">{ticket.bookingRef}</p>
      </div>

      <div className="relative border-t border-dashed border-gray-300 px-5 py-5">
        <div className="absolute -left-3 -top-3 h-6 w-6 rounded-full bg-paper" />
        <div className="absolute -right-3 -top-3 h-6 w-6 rounded-full bg-paper" />
        <dl className="grid grid-cols-2 gap-y-3 text-sm">
          <div>
            <dt className="text-xs text-gray-400">Date</dt>
            <dd className="font-bold text-ink">{new Date(`${ticket.date}T00:00:00`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</dd>
          </div>
          <div>
            <dt className="text-xs text-gray-400">Departure</dt>
            <dd className="font-bold text-ink">{ticket.time}</dd>
          </div>
          <div>
            <dt className="text-xs text-gray-400">Seat{ticket.passengers.length > 1 ? 's' : ''}</dt>
            <dd className="font-bold text-ink">{seatList}</dd>
          </div>
          <div>
            <dt className="text-xs text-gray-400">Bus</dt>
            <dd className="font-bold text-ink">{ticket.busName}</dd>
          </div>
          <div className="col-span-2">
            <dt className="text-xs text-gray-400">Boarding Point</dt>
            <dd className="font-bold text-ink">{ticket.boardingPoint}</dd>
          </div>
          <div className="col-span-2 pt-2 border-t border-gray-100">
            <dt className="text-xs text-gray-400">Passengers</dt>
            {ticket.passengers.map((p, i) => (
              <dd key={i} className="font-semibold text-ink text-sm">
                {p.name} &middot; Seat {p.seat}
              </dd>
            ))}
          </div>
          <div className="col-span-2 pt-2 border-t border-gray-100">
            <dt className="text-xs text-gray-400">Next of Kin</dt>
            <dd className="font-semibold text-ink">
              {ticket.nextOfKin.name} &middot; {ticket.nextOfKin.phone}
            </dd>
          </div>
        </dl>
      </div>

      {showActions && (
        <div className="flex gap-3 px-5 pb-5">
          <Button
            variant="outline"
            icon={Download}
            onClick={() => showToast('Ticket saved to Downloads')}
          >
            Download
          </Button>
          <Button
            variant="secondary"
            icon={Share2}
            onClick={() => showToast('Share sheet opened')}
          >
            Share
          </Button>
        </div>
      )}
    </Card>
  )
}
