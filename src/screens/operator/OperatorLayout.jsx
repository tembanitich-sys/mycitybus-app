import { Outlet } from 'react-router-dom'
import { ToastProvider } from '../../components/Toast'

export default function OperatorLayout() {
  return (
    <ToastProvider>
      <div className="relative flex h-full min-h-0 flex-1 flex-col bg-paper">
        <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
          <Outlet />
        </div>
      </div>
    </ToastProvider>
  )
}
