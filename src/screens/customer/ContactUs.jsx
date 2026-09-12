import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react'
import Header from '../../components/Header'
import Card from '../../components/Card'
import Screen from '../../components/Screen'
import { useToast } from '../../components/Toast'

const CHANNELS = [
  { icon: Phone, label: 'Call Us', value: '+263 242 700 123', hint: 'Mon–Sun, 6am–10pm' },
  { icon: MessageCircle, label: 'WhatsApp', value: '+263 77 700 1234', hint: 'Fastest response' },
  { icon: Mail, label: 'Email', value: 'support@citybus.co.zw', hint: 'Replies within 24h' },
]

export default function ContactUs() {
  const showToast = useToast()

  return (
    <Screen className="flex h-full flex-col">
      <Header title="Contact Us" />
      <div className="flex-1 overflow-y-auto px-5 py-5">
        <p className="text-sm text-gray-500 mb-5">We're here to help with bookings, parcels, or anything else.</p>
        <div className="flex flex-col gap-3">
          {CHANNELS.map((c) => (
            <Card key={c.label} className="p-4" onClick={() => showToast(`Opening ${c.label}…`)}>
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-navy/10 text-brand-navy">
                  <c.icon size={20} />
                </div>
                <div>
                  <p className="font-bold text-ink text-[15px]">{c.label}</p>
                  <p className="text-sm text-brand-navy font-semibold">{c.value}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{c.hint}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Card className="mt-5 p-4" accent="navy">
          <div className="flex items-start gap-3">
            <MapPin size={18} className="text-brand-navy mt-0.5 shrink-0" />
            <div>
              <p className="font-bold text-ink text-[15px]">Head Office</p>
              <p className="text-sm text-gray-500 mt-0.5">Roadport Terminal, Robert Mugabe Road, Harare CBD, Zimbabwe</p>
            </div>
          </div>
        </Card>
      </div>
    </Screen>
  )
}
