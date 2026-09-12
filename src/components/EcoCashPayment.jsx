import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, Loader2, Smartphone } from 'lucide-react'
import Button from './Button'
import Card from './Card'

function generateEcoCashRef() {
  const digits = Math.floor(100000000 + Math.random() * 899999999)
  return `MP${digits}`
}

// Reusable EcoCash Merchant payment simulation used for both ticket and parcel payments.
// step: 'enter' -> 'processing' -> 'success'
export default function EcoCashPayment({ amountUsd, purposeLabel, defaultPhone = '', onSuccess }) {
  const [step, setStep] = useState('enter')
  const [phone, setPhone] = useState(defaultPhone)
  const [error, setError] = useState('')
  const [ecocashRef, setEcocashRef] = useState('')
  const timerRef = useRef(null)

  useEffect(() => () => window.clearTimeout(timerRef.current), [])

  function handleRequestPayment(e) {
    e.preventDefault()
    const trimmed = phone.trim()
    if (!/^\+?[0-9]{9,13}$/.test(trimmed.replace(/\s+/g, ''))) {
      setError('Enter a valid EcoCash-registered phone number.')
      return
    }
    setError('')
    setPhone(trimmed)
    setStep('processing')
    timerRef.current = window.setTimeout(() => {
      const ref = generateEcoCashRef()
      setEcocashRef(ref)
      setStep('success')
    }, 2400)
  }

  return (
    <div className="flex flex-col gap-5">
      <AnimatePresence mode="wait">
        {step === 'enter' && (
          <motion.form
            key="enter"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            onSubmit={handleRequestPayment}
            className="flex flex-col gap-5"
          >
            <Card className="p-5 flex flex-col items-center gap-2 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-green/10">
                <Smartphone size={24} className="text-brand-green" />
              </div>
              <p className="text-sm font-semibold text-gray-500">Amount due</p>
              <p className="text-3xl font-extrabold text-ink">${amountUsd.toFixed(2)}</p>
              <p className="text-xs text-gray-400">{purposeLabel}</p>
            </Card>

            <div>
              <label className="block text-sm font-bold text-ink mb-1.5">EcoCash-registered phone number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+263 77 123 4567"
                className="w-full rounded-xl border border-gray-200 bg-white px-4 h-12 text-[15px] focus:border-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-navy/15"
              />
              {error && <p className="mt-1.5 text-xs font-semibold text-brand-red">{error}</p>}
            </div>

            <Button type="submit" variant="success">
              Request Payment
            </Button>
          </motion.form>
        )}

        {step === 'processing' && (
          <motion.div
            key="processing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="flex flex-col items-center gap-4 py-8 text-center"
          >
            <Loader2 size={44} className="animate-spin text-brand-green" />
            <p className="text-base font-bold text-ink">Awaiting authorization…</p>
            <p className="text-sm text-gray-500 leading-relaxed max-w-[260px]">
              Payment request sent to <span className="font-semibold text-ink">{phone}</span>. Enter your EcoCash
              PIN on your phone to authorize ${amountUsd.toFixed(2)}.
            </p>
            <p className="text-xs text-gray-400">Do not close this screen.</p>
          </motion.div>
        )}

        {step === 'success' && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.22 }}
            className="flex flex-col items-center gap-4 py-6 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 16, delay: 0.05 }}
            >
              <CheckCircle2 size={56} className="text-brand-green" />
            </motion.div>
            <p className="text-lg font-extrabold text-ink">Payment Successful</p>
            <Card className="w-full p-4 text-left" accent="green">
              <dl className="flex flex-col gap-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-gray-500">Amount</dt>
                  <dd className="font-bold text-ink">${amountUsd.toFixed(2)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">EcoCash Ref</dt>
                  <dd className="font-bold text-ink">{ecocashRef}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Phone</dt>
                  <dd className="font-bold text-ink">{phone}</dd>
                </div>
              </dl>
            </Card>
            <Button variant="primary" onClick={() => onSuccess({ ecocashRef, phone })}>
              Continue
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
