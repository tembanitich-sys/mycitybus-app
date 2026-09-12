import { createContext, useCallback, useContext, useMemo, useReducer } from 'react'
import { generateTrips, PARCEL_STATUS_FLOW } from '../data/mockData'

const AppStateContext = createContext(null)

function randomRef(prefix, length = 6) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let out = ''
  for (let i = 0; i < length; i++) out += chars[Math.floor(Math.random() * chars.length)]
  return `${prefix}-${out}`
}

const initialState = {
  auth: { role: null, user: null }, // role: 'customer' | 'operator'
  trips: generateTrips(),
  tickets: [], // { bookingRef, tripId, passengers:[{name,phone,seat}], nextOfKin:{name,phone}, fareUsd, ecocashRef, createdAt, customerPhone }
  parcels: [], // { trackingCode, sender, recipient, from, to, category, categoryLabel, priceUsd, serial, declaredValue, tripId, status, statusHistory:[{status, at}], createdAt }
  broadcasts: [], // { id, message, createdAt }
  recentTrackedCodes: [],
}

function reducer(state, action) {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, auth: { role: action.role, user: action.user } }
    case 'LOGOUT':
      return { ...state, auth: { role: null, user: null } }
    case 'ADD_TICKET':
      return { ...state, tickets: [action.ticket, ...state.tickets] }
    case 'ADD_PARCEL':
      return { ...state, parcels: [action.parcel, ...state.parcels] }
    case 'ADVANCE_PARCEL_STATUS': {
      return {
        ...state,
        parcels: state.parcels.map((p) => {
          if (p.trackingCode !== action.trackingCode) return p
          const currentIdx = PARCEL_STATUS_FLOW.indexOf(p.status)
          const nextIdx = Math.min(currentIdx + 1, PARCEL_STATUS_FLOW.length - 1)
          const nextStatus = PARCEL_STATUS_FLOW[nextIdx]
          if (nextStatus === p.status) return p
          return {
            ...p,
            status: nextStatus,
            statusHistory: [...p.statusHistory, { status: nextStatus, at: new Date().toISOString() }],
          }
        }),
      }
    }
    case 'ADD_BROADCAST':
      return { ...state, broadcasts: [action.broadcast, ...state.broadcasts] }
    case 'ADD_RECENT_TRACKED': {
      const next = [action.code, ...state.recentTrackedCodes.filter((c) => c !== action.code)].slice(0, 5)
      return { ...state, recentTrackedCodes: next }
    }
    default:
      return state
  }
}

export function AppStateProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  const login = useCallback((role, user) => dispatch({ type: 'LOGIN', role, user }), [])
  const logout = useCallback(() => dispatch({ type: 'LOGOUT' }), [])

  const createTicket = useCallback((payload) => {
    const bookingRef = randomRef('CB', 7)
    const ticket = {
      bookingRef,
      createdAt: new Date().toISOString(),
      ...payload,
    }
    dispatch({ type: 'ADD_TICKET', ticket })
    return ticket
  }, [])

  const createParcel = useCallback((payload) => {
    const trackingCode = randomRef('CBP', 6)
    const now = new Date().toISOString()
    const parcel = {
      trackingCode,
      status: 'Registered',
      statusHistory: [{ status: 'Registered', at: now }],
      createdAt: now,
      ...payload,
    }
    dispatch({ type: 'ADD_PARCEL', parcel })
    return parcel
  }, [])

  const advanceParcelStatus = useCallback(
    (trackingCode) => dispatch({ type: 'ADVANCE_PARCEL_STATUS', trackingCode }),
    [],
  )

  const addBroadcast = useCallback((message) => {
    const broadcast = { id: randomRef('MSG', 5), message, createdAt: new Date().toISOString() }
    dispatch({ type: 'ADD_BROADCAST', broadcast })
    return broadcast
  }, [])

  const addRecentTracked = useCallback((code) => dispatch({ type: 'ADD_RECENT_TRACKED', code }), [])

  const findTrip = useCallback((tripId) => state.trips.find((t) => t.id === tripId), [state.trips])
  const findParcel = useCallback(
    (trackingCode) => state.parcels.find((p) => p.trackingCode === trackingCode?.trim().toUpperCase()),
    [state.parcels],
  )

  const value = useMemo(
    () => ({
      ...state,
      login,
      logout,
      createTicket,
      createParcel,
      advanceParcelStatus,
      addBroadcast,
      addRecentTracked,
      findTrip,
      findParcel,
    }),
    [
      state,
      login,
      logout,
      createTicket,
      createParcel,
      advanceParcelStatus,
      addBroadcast,
      addRecentTracked,
      findTrip,
      findParcel,
    ],
  )

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>
}

export function useAppState() {
  const ctx = useContext(AppStateContext)
  if (!ctx) throw new Error('useAppState must be used within AppStateProvider')
  return ctx
}
