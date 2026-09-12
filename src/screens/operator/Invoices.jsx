import { useNavigate } from 'react-router-dom'
import { Receipt } from 'lucide-react'
import Header from '../../components/Header'
import Card from '../../components/Card'
import Screen from '../../components/Screen'
import { useAppState } from '../../context/AppStateContext'

const COMMISSION_RATE = 0.1

export default function Invoices() {
  const navigate = useNavigate()
  const { tickets } = useAppState()

  const totalRevenue = tickets.reduce((sum, t) => sum + t.fareUsd, 0)
  const totalCommission = totalRevenue * COMMISSION_RATE
  const netToOperator = totalRevenue - totalCommission

  return (
    <Screen className="flex h-full flex-col">
      <Header title="View Invoices" onBack={() => navigate('/operator/dashboard')} />
      <div className="flex-1 overflow-y-auto px-5 py-5">
        <div className="grid grid-cols-2 gap-3 mb-5">
          <Card className="p-4" accent="navy">
            <p className="text-xs text-gray-400">Tickets Sold</p>
            <p className="text-2xl font-extrabold text-ink mt-1">{tickets.length}</p>
          </Card>
          <Card className="p-4" accent="gold">
            <p className="text-xs text-gray-400">Gross Revenue</p>
            <p className="text-2xl font-extrabold text-ink mt-1">${totalRevenue.toFixed(2)}</p>
          </Card>
          <Card className="p-4" accent="red">
            <p className="text-xs text-gray-400">Platform Commission (10%)</p>
            <p className="text-2xl font-extrabold text-ink mt-1">${totalCommission.toFixed(2)}</p>
          </Card>
          <Card className="p-4" accent="green">
            <p className="text-xs text-gray-400">Net to Operator</p>
            <p className="text-2xl font-extrabold text-ink mt-1">${netToOperator.toFixed(2)}</p>
          </Card>
        </div>

        <h2 className="mb-3 text-sm font-extrabold uppercase tracking-wide text-gray-400">Line Items</h2>
        {tickets.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-14 text-center">
            <Receipt size={36} className="text-gray-300" />
            <p className="text-sm text-gray-500">No ticket sales yet this session.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {tickets.map((t) => {
              const commission = t.fareUsd * COMMISSION_RATE
              return (
                <Card key={t.bookingRef} className="p-3.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-ink text-sm">
                        {t.from} → {t.to}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Ref: {t.bookingRef} &middot; {t.passengers.length} seat{t.passengers.length > 1 ? 's' : ''}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-extrabold text-ink text-sm">${t.fareUsd.toFixed(2)}</p>
                      <p className="text-xs text-brand-red font-semibold">-${commission.toFixed(2)} fee</p>
                    </div>
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
