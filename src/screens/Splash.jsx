import { ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import HeroBackground from '../components/HeroBackground'
import Logo from '../components/Logo'
import Button from '../components/Button'
import Screen from '../components/Screen'

export default function Splash() {
  const navigate = useNavigate()

  return (
    <Screen className="relative h-full w-full">
      <HeroBackground />
      {/* Scrim: transparent top -> near-black bottom, for legible white text */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(to bottom, rgba(5,7,18,0) 0%, rgba(5,7,18,0.35) 45%, rgba(5,7,18,0.92) 88%)' }}
      />

      <div className="relative flex h-full flex-col justify-end px-6 pb-10 pt-14">
        <div className="mb-8 inline-flex w-fit rounded-2xl bg-white px-4 py-2.5 shadow-card-lg">
          <Logo size="md" />
        </div>

        <h1 className="text-[32px] font-extrabold leading-[1.1] text-white drop-shadow-sm">
          Travel. Send Parcels.
          <br />
          Track it all in one app.
        </h1>
        <p className="mt-3 text-[15px] font-medium text-white/85">
          Fast, reliable coach travel and parcel delivery on the Harare ↔ Gaborone route — and beyond.
        </p>

        <div className="mt-8">
          <Button variant="primary" size="lg" icon={ArrowRight} onClick={() => navigate('/role')}>
            Get Started
          </Button>
        </div>
      </div>
    </Screen>
  )
}
