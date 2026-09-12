import { Outlet, useLocation } from 'react-router-dom'
import BottomNav from '../../components/BottomNav'
import { ToastProvider } from '../../components/Toast'

const TAB_PATHS = ['/customer/home', '/customer/tickets', '/customer/parcels', '/customer/more']

export default function CustomerLayout() {
  const location = useLocation()
  const showTabs = TAB_PATHS.some((p) => location.pathname === p)

  return (
    <ToastProvider>
      <div className="relative flex h-full min-h-0 flex-1 flex-col bg-paper">
        <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
          <Outlet />
        </div>
        {showTabs && <BottomNav />}
      </div>
    </ToastProvider>
  )
}
