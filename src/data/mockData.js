// Static reference data: routes, trips, seat layout, pricing.
// Trips are seeded a few days out from "today" so the demo calendar always has upcoming departures.

export const CITIES = ['Harare', 'Bulawayo', 'Gaborone', 'Victoria Falls']

export const ROUTES = [
  {
    id: 'HRE-GBE',
    from: 'Harare',
    to: 'Gaborone',
    durationLabel: '11h 30m',
    fareUsd: 35,
  },
  {
    id: 'GBE-HRE',
    from: 'Gaborone',
    to: 'Harare',
    durationLabel: '11h 30m',
    fareUsd: 35,
  },
  {
    id: 'HRE-BUQ',
    from: 'Harare',
    to: 'Bulawayo',
    durationLabel: '5h 15m',
    fareUsd: 15,
  },
  {
    id: 'BUQ-HRE',
    from: 'Bulawayo',
    to: 'Harare',
    durationLabel: '5h 15m',
    fareUsd: 15,
  },
  {
    id: 'HRE-VFA',
    from: 'Harare',
    to: 'Victoria Falls',
    durationLabel: '9h 00m',
    fareUsd: 28,
  },
  {
    id: 'VFA-HRE',
    from: 'Victoria Falls',
    to: 'Harare',
    durationLabel: '9h 00m',
    fareUsd: 28,
  },
  {
    id: 'BUQ-GBE',
    from: 'Bulawayo',
    to: 'Gaborone',
    durationLabel: '6h 45m',
    fareUsd: 22,
  },
  {
    id: 'GBE-BUQ',
    from: 'Gaborone',
    to: 'Bulawayo',
    durationLabel: '6h 45m',
    fareUsd: 22,
  },
]

export const BOARDING_POINTS = {
  Harare: ['Roadport Terminal, CBD', 'Fifth Street Bus Stop', 'Newlands Shopping Centre'],
  Bulawayo: ['Egodini Terminal', 'Lobengula Street Rank'],
  Gaborone: ['Gaborone Bus Rank', 'Game City Mall Stop'],
  'Victoria Falls': ['Victoria Falls Town Terminal'],
}

function daysFromNow(n) {
  const d = new Date()
  d.setDate(d.getDate() + n)
  return d.toISOString().slice(0, 10)
}

const DEPARTURE_TIMES = ['06:00', '08:30', '14:00', '19:30']

function makeBus(id) {
  return {
    id,
    plate: id,
    fleetName: `City Bus ${id.split('-')[1]}`,
  }
}

export const BUSES = [makeBus('CB-101'), makeBus('CB-102'), makeBus('CB-103'), makeBus('CB-104')]

// Generate trips for the next 10 days across all routes.
export function generateTrips() {
  const trips = []
  let tripCounter = 1
  for (let day = 0; day < 10; day++) {
    const date = daysFromNow(day)
    ROUTES.forEach((route, ri) => {
      DEPARTURE_TIMES.forEach((time, ti) => {
        // Not every route runs every slot — keep it realistic, a couple of departures/day per route.
        if ((ri + ti) % 2 !== 0) return
        const bus = BUSES[(ri + ti + day) % BUSES.length]
        trips.push({
          id: `TRP-${String(tripCounter).padStart(4, '0')}`,
          routeId: route.id,
          from: route.from,
          to: route.to,
          date,
          time,
          durationLabel: route.durationLabel,
          fareUsd: route.fareUsd,
          busId: bus.id,
          busName: bus.fleetName,
          totalSeats: 44,
        })
        tripCounter++
      })
    })
  }
  return trips
}

// 44-seat coach layout: 11 rows x 4 seats (2-aisle-2), last row is a 5-seat back bench.
export function buildSeatLayout() {
  const rows = []
  for (let r = 1; r <= 10; r++) {
    rows.push([`${r}A`, `${r}B`, null, `${r}C`, `${r}D`])
  }
  rows.push(['11A', '11B', '11C', '11D', '11E'])
  return rows
}

export const PARCEL_CATEGORIES = [
  { id: 'small', label: 'Small Parcel', priceUsd: 8 },
  { id: 'medium', label: 'Medium Parcel', priceUsd: 15 },
  { id: 'excess-luggage', label: 'Excess Luggage 10–20kg', priceUsd: 20 },
  { id: 'cargo', label: 'Cargo / Bulk', priceUsd: 40 },
]

export const PARCEL_STATUS_FLOW = ['Registered', 'Loaded on Bus', 'In Transit', 'Arrived', 'Collected']

export const FLEET_LOCATIONS = [
  { busId: 'CB-101', route: 'Harare → Gaborone', location: 'Approaching Francistown', etaLabel: 'ETA 2h 10m', status: 'On Route' },
  { busId: 'CB-102', route: 'Gaborone → Harare', location: 'Departed Gaborone Rank', etaLabel: 'ETA 10h 40m', status: 'On Route' },
  { busId: 'CB-103', route: 'Harare → Bulawayo', location: 'Kadoma Toll Gate', etaLabel: 'ETA 2h 55m', status: 'On Route' },
  { busId: 'CB-104', route: 'Harare → Victoria Falls', location: 'Roadport Terminal, CBD', etaLabel: 'Boarding', status: 'At Terminal' },
]
