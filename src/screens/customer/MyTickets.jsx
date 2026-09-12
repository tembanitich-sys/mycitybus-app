import { Plus, ChevronRight, TicketX } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Header from '../../components/Header'
import Card from '../../components/Card'
import Button from '../../components/Button'
import StatusBadge from '../../components/StatusBadge'
import Screen from '../../components/Screen'
import { useAppState } from '../../context/AppStateContext'

function formatDate(dateStr) {
  return new Date(`${dateStr}T00:00:00`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function MyTickets() {
  const navigate = useNavigate()
  const { auth, tickets } = useAppState()
  const myTickets = tickets
    .filter((t) => t.customerPhone === auth.user?.phone)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  const now = new Date()

  return (
    <Screen className="flex h-full flex-col">
      <Header title="My Tickets" showBack={false} />
      <div className="flex-1 px-5 pt-5 pb-6">
        <Button icon={Plus} onClick={() => navigate('/customer/book')} className="mb-5">
          Book a Ticket
        </Button>

        {myTickets.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-16 text-center">
            <TicketX size={40} className="text-gray-300" />
            <p className="font-bold text-ink">No tickets yet</p>
            <p className="text-sm text-gray-500">Your booked trips will show up here.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {myTickets.map((t) => {
              const isPast = new Date(`${t.date}T${t.time}`) < now
              return (
                <Card
                  key={t.bookingRef}
                  accent={isPast ? 'none' : 'gold'}
                  className="p-4"
                  onClick={() => navigate(`/customer/ticket/${t.bookingRef}`)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-extrabold text-ink">
                        {t.from} → {t.to}
                      </p>
                      <p className="mt-0.5 text-xs text-gray-500">
                        {formatDate(t.date)} &middot; {t.time} &middot; {t.passengers.length} seat
                        {t.passengers.length > 1 ? 's' : ''}
                      </p>
                    </div>
                    <ChevronRight size={18} className="text-gray-300 shrink-0" />
                  </div>
                  <div className="mt-2">
                    <StatusBadge tone={isPast ? 'grey' : 'green'}>{isPast ? 'Completed' : 'Upcoming'}</StatusBadge>
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </Screen>
  )
}
