import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogIn } from 'lucide-react'
import Header from '../components/Header'
import Button from '../components/Button'
import Screen from '../components/Screen'
import { useAppState } from '../context/AppStateContext'

export default function OperatorLogin() {
  const navigate = useNavigate()
  const { login } = useAppState()
  const [operatorId, setOperatorId] = useState('CB001')
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    const id = operatorId.trim().toUpperCase()
    if (id !== 'CB001') {
      setError('Unknown Operator ID. Use CB001 for this demo.')
      return
    }
    if (pin !== '1234') {
      setError('Incorrect PIN. Use 1234 for this demo.')
      return
    }
    setError('')
    setLoading(true)
    window.setTimeout(() => {
      login('operator', { operatorId: id, name: 'Tendai Moyo' })
      navigate('/operator/dashboard', { replace: true })
    }, 500)
  }

  return (
    <Screen className="flex h-full flex-col bg-paper">
      <Header title="Operator Login" onBack={() => navigate('/role')} />
      <form onSubmit={handleSubmit} className="flex flex-1 flex-col px-6 pt-8">
        <p className="text-sm text-gray-500 mb-6">Sign in with your Operator ID and PIN to manage trips and cargo.</p>

        <label className="block text-sm font-bold text-ink mb-1.5">Operator ID</label>
        <input
          type="text"
          value={operatorId}
          onChange={(e) => setOperatorId(e.target.value)}
          placeholder="CB001"
          className="w-full rounded-xl border border-gray-200 bg-white px-4 h-12 text-[15px] uppercase tracking-wide focus:border-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-navy/15"
        />

        <label className="block text-sm font-bold text-ink mb-1.5 mt-4">PIN</label>
        <input
          type="password"
          inputMode="numeric"
          maxLength={4}
          value={pin}
          onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
          placeholder="••••"
          className="w-full rounded-xl border border-gray-200 bg-white px-4 h-12 text-[15px] tracking-[0.4em] focus:border-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-navy/15"
        />

        {error && <p className="mt-3 text-sm font-semibold text-brand-red">{error}</p>}

        <div className="mt-6 rounded-xl bg-brand-navy/5 px-4 py-3 text-xs text-brand-navy">
          Demo access: ID <span className="font-bold">CB001</span>, PIN <span className="font-bold">1234</span>.
        </div>

        <div className="mt-auto pt-8">
          <Button type="submit" variant="secondary" icon={LogIn} loading={loading}>
            Log In
          </Button>
        </div>
      </form>
    </Screen>
  )
}
