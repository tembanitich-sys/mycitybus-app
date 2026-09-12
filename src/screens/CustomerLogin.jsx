import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogIn } from 'lucide-react'
import Header from '../components/Header'
import Button from '../components/Button'
import Screen from '../components/Screen'
import { useAppState } from '../context/AppStateContext'

export default function CustomerLogin() {
  const navigate = useNavigate()
  const { login } = useAppState()
  const [phone, setPhone] = useState('+263 77 123 4567')
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    const cleanPhone = phone.trim()
    if (!/^\+[0-9\s]{8,15}$/.test(cleanPhone)) {
      setError('Enter your phone number in international format, e.g. +263 77 123 4567.')
      return
    }
    if (pin !== '1234') {
      setError('Incorrect PIN. Use 1234 for this demo.')
      return
    }
    setError('')
    setLoading(true)
    window.setTimeout(() => {
      login('customer', { phone: cleanPhone })
      navigate('/customer/home', { replace: true })
    }, 500)
  }

  return (
    <Screen className="flex h-full flex-col bg-paper">
      <Header title="Customer Login" onBack={() => navigate('/role')} />
      <form onSubmit={handleSubmit} className="flex flex-1 flex-col px-6 pt-8">
        <p className="text-sm text-gray-500 mb-6">
          Enter your phone number and PIN to access your City Bus account.
        </p>

        <label className="block text-sm font-bold text-ink mb-1.5">Phone number</label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+263 77 123 4567"
          className="w-full rounded-xl border border-gray-200 bg-white px-4 h-12 text-[15px] focus:border-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-navy/15"
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
          Demo access: any phone number above, PIN <span className="font-bold">1234</span>.
        </div>

        <div className="mt-auto pt-8">
          <Button type="submit" icon={LogIn} loading={loading}>
            Log In
          </Button>
        </div>
      </form>
    </Screen>
  )
}
