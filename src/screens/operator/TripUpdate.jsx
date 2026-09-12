import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Send, Megaphone } from 'lucide-react'
import Header from '../../components/Header'
import Card from '../../components/Card'
import Button from '../../components/Button'
import Screen from '../../components/Screen'
import { useToast } from '../../components/Toast'
import { useAppState } from '../../context/AppStateContext'

const TEMPLATES = [
  'Departure delayed by 30 minutes due to traffic at the border post.',
  'Bus CB-101 has arrived safely at Gaborone Bus Rank.',
  'Please be at the terminal 30 minutes before departure.',
]

function formatTime(iso) {
  return new Date(iso).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
}

export default function TripUpdate() {
  const navigate = useNavigate()
  const showToast = useToast()
  const { broadcasts, addBroadcast } = useAppState()
  const [message, setMessage] = useState('')

  function handleSend(e) {
    e.preventDefault()
    if (!message.trim()) return
    addBroadcast(message.trim())
    setMessage('')
    showToast('Broadcast sent to all booked passengers')
  }

  return (
    <Screen className="flex h-full flex-col">
      <Header title="Trip Update" onBack={() => navigate('/operator/dashboard')} />
      <div className="flex-1 overflow-y-auto px-5 py-5">
        <form onSubmit={handleSend}>
          <label className="block text-sm font-bold text-ink mb-1.5">Broadcast message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            placeholder="e.g. Departure delayed by 30 minutes…"
            className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-[15px] focus:border-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-navy/15"
          />
          <div className="mt-2 flex flex-wrap gap-2">
            {TEMPLATES.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setMessage(t)}
                className="tap-highlight-none rounded-full bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-600 active:bg-gray-200"
              >
                {t.slice(0, 28)}…
              </button>
            ))}
          </div>
          <div className="mt-4">
            <Button type="submit" variant="secondary" icon={Send} disabled={!message.trim()}>
              Send Broadcast
            </Button>
          </div>
        </form>

        <div className="mt-8">
          <h2 className="mb-3 text-sm font-extrabold uppercase tracking-wide text-gray-400">Sent Updates</h2>
          {broadcasts.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-10 text-center">
              <Megaphone size={32} className="text-gray-300" />
              <p className="text-sm text-gray-500">No broadcasts sent yet this session.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {broadcasts.map((b) => (
                <Card key={b.id} className="p-3.5" accent="navy">
                  <p className="text-sm text-ink">{b.message}</p>
                  <p className="mt-1.5 text-xs text-gray-400">{formatTime(b.createdAt)}</p>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </Screen>
  )
}
