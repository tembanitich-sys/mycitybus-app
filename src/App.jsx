import { Navigate, Route, Routes } from 'react-router-dom'
import PhoneFrame from './components/PhoneFrame'
import RequireRole from './components/RequireRole'

import Splash from './screens/Splash'
import RolePicker from './screens/RolePicker'
import CustomerLogin from './screens/CustomerLogin'
import OperatorLogin from './screens/OperatorLogin'

import CustomerLayout from './screens/customer/CustomerLayout'
import Home from './screens/customer/Home'
import MyTickets from './screens/customer/MyTickets'
import TicketDetail from './screens/customer/TicketDetail'
import BookTicketFlow from './screens/customer/BookTicketFlow'
import TrackParcel from './screens/customer/TrackParcel'
import TrackBus from './screens/customer/TrackBus'
import ContactUs from './screens/customer/ContactUs'
import More from './screens/customer/More'

import OperatorLayout from './screens/operator/OperatorLayout'
import Dashboard from './screens/operator/Dashboard'
import ViewManifest from './screens/operator/ViewManifest'
import TripUpdate from './screens/operator/TripUpdate'
import PingFleet from './screens/operator/PingFleet'
import Invoices from './screens/operator/Invoices'
import LuggageParcels from './screens/operator/LuggageParcels'
import RegisterParcel from './screens/operator/RegisterParcel'
import ParcelRegistered from './screens/operator/ParcelRegistered'

export default function App() {
  return (
    <PhoneFrame>
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/role" element={<RolePicker />} />
        <Route path="/login/customer" element={<CustomerLogin />} />
        <Route path="/login/operator" element={<OperatorLogin />} />

        <Route
          path="/customer"
          element={
            <RequireRole role="customer">
              <CustomerLayout />
            </RequireRole>
          }
        >
          <Route index element={<Navigate to="home" replace />} />
          <Route path="home" element={<Home />} />
          <Route path="tickets" element={<MyTickets />} />
          <Route path="ticket/:bookingRef" element={<TicketDetail />} />
          <Route path="book" element={<BookTicketFlow />} />
          <Route path="parcels" element={<TrackParcel />} />
          <Route path="track-bus" element={<TrackBus />} />
          <Route path="contact" element={<ContactUs />} />
          <Route path="more" element={<More />} />
        </Route>

        <Route
          path="/operator"
          element={
            <RequireRole role="operator">
              <OperatorLayout />
            </RequireRole>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="manifest" element={<ViewManifest />} />
          <Route path="trip-update" element={<TripUpdate />} />
          <Route path="ping-fleet" element={<PingFleet />} />
          <Route path="invoices" element={<Invoices />} />
          <Route path="parcels" element={<LuggageParcels />} />
          <Route path="parcels/register" element={<RegisterParcel />} />
          <Route path="parcels/registered/:trackingCode" element={<ParcelRegistered />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </PhoneFrame>
  )
}
