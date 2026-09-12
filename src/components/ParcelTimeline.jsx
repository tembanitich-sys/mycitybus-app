import { Check } from 'lucide-react'
import { PARCEL_STATUS_FLOW } from '../data/mockData'

function formatTimestamp(iso) {
  return new Date(iso).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
}

export default function ParcelTimeline({ parcel }) {
  const currentIdx = PARCEL_STATUS_FLOW.indexOf(parcel.status)

  return (
    <div className="flex flex-col">
      {PARCEL_STATUS_FLOW.map((status, idx) => {
        const done = idx <= currentIdx
        const historyEntry = parcel.statusHistory.find((h) => h.status === status)
        const isLast = idx === PARCEL_STATUS_FLOW.length - 1
        return (
          <div key={status} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                  done ? 'bg-brand-green text-white' : 'bg-gray-200 text-gray-400'
                }`}
              >
                {done ? <Check size={15} strokeWidth={3} /> : <span className="h-2 w-2 rounded-full bg-gray-400" />}
              </div>
              {!isLast && <div className={`w-0.5 flex-1 min-h-[28px] ${done ? 'bg-brand-green' : 'bg-gray-200'}`} />}
            </div>
            <div className="pb-6">
              <p className={`text-sm font-bold ${done ? 'text-ink' : 'text-gray-400'}`}>{status}</p>
              {historyEntry && <p className="text-xs text-gray-400 mt-0.5">{formatTimestamp(historyEntry.at)}</p>}
            </div>
          </div>
        )
      })}
    </div>
  )
}
