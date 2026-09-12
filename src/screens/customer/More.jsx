import { useNavigate } from 'react-router-dom'
import { UserRound, Ticket, Phone, LogOut, ChevronRight } from 'lucide-react'
import Header from '../../components/Header'
import Card from '../../components/Card'
import Button from '../../components/Button'
import Screen from '../../components/Screen'
import { useAppState } from '../../context/AppStateContext'

export default function More() {
  const navigate = useNavigate()
  const { auth, tickets, logout } = useAppState()
  const myTicketCount = tickets.filter((t) => t.customerPhone === auth.user?.phone).length

  function handleLogout() {
    logout()
    navigate('/role', { replace: true })
  }

  return (
    <Screen className="flex h-full flex-col">
      <Header title="More" showBack={false} />
      <div className="flex-1 overflow-y-auto px-5 py-5">
        <Card className="p-4 mb-5">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-brand-navy/10 text-brand-navy">
              <UserRound size={26} />
            </div>
            <div>
              <p className="font-extrabold text-ink text-[16px]">City Bus Customer</p>
              <p className="text-sm text-gray-500">{auth.user?.phone}</p>
            </div>
          </div>
        </Card>

        <div className="flex flex-col gap-3">
          <Card className="p-4" onClick={() => navigate('/customer/tickets')}>
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-red/10 text-brand-red">
                <Ticket size={20} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-ink text-[15px]">My Tickets</p>
                <p className="text-xs text-gray-500 mt-0.5">{myTicketCount} ticket{myTicketCount === 1 ? '' : 's'} booked</p>
              </div>
              <ChevronRight size={18} className="text-gray-300 shrink-0" />
            </div>
          </Card>

          <Card className="p-4" onClick={() => navigate('/customer/contact')}>
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-navy/10 text-brand-navy">
                <Phone size={20} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-ink text-[15px]">Contact Us</p>
                <p className="text-xs text-gray-500 mt-0.5">Support, complaints &amp; feedback</p>
              </div>
              <ChevronRight size={18} className="text-gray-300 shrink-0" />
            </div>
          </Card>
        </div>

        <div className="mt-8">
          <Button variant="outline" icon={LogOut} onClick={handleLogout}>
            Log Out
          </Button>
        </div>
      </div>
    </Screen>
  )
}
