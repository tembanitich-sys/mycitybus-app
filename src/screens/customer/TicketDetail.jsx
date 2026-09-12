import { useParams, useNavigate } from 'react-router-dom'
import Header from '../../components/Header'
import TicketPass from '../../components/TicketPass'
import Screen from '../../components/Screen'
import { useAppState } from '../../context/AppStateContext'

export default function TicketDetail() {
  const { bookingRef } = useParams()
  const navigate = useNavigate()
  const { tickets } = useAppState()
  const ticket = tickets.find((t) => t.bookingRef === bookingRef)

  if (!ticket) {
    return (
      <Screen className="flex h-full flex-col">
        <Header title="Ticket" onBack={() => navigate('/customer/tickets')} />
        <div className="flex flex-1 items-center justify-center px-6 text-center text-sm text-gray-500">
          We couldn't find that ticket.
        </div>
      </Screen>
    )
  }

  return (
    <Screen className="flex h-full flex-col">
      <Header title="Ticket Details" onBack={() => navigate('/customer/tickets')} />
      <div className="flex-1 px-5 py-5">
        <TicketPass ticket={ticket} />
      </div>
    </Screen>
  )
}
