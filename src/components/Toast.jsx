import { createContext, useCallback, useContext, useRef, useState } from 'react'
import { CheckCircle2 } from 'lucide-react'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null)
  const timerRef = useRef(null)

  const showToast = useCallback((message) => {
    setToast({ message, id: Date.now() })
    window.clearTimeout(timerRef.current)
    timerRef.current = window.setTimeout(() => setToast(null), 2400)
  }, [])

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      {toast && (
        <div className="pointer-events-none absolute inset-x-0 bottom-24 z-[100] flex justify-center px-6">
          <div className="pointer-events-auto flex items-center gap-2 rounded-full bg-ink text-white text-sm font-semibold px-4 py-3 shadow-card-lg animate-[fadeIn_0.15s_ease-out]">
            <CheckCircle2 size={18} className="text-brand-green shrink-0" />
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
