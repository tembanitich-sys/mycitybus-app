# MyCity Bus

A polished, click-through mobile app prototype for **City Bus**, a coach operator running the
Harare ↔ Gaborone route (and beyond). Built for a client-facing demo — no real backend, no real
payment processor, everything is simulated client-side with realistic mock data.

## Stack

- **React 19 + Vite** — app shell and dev/build tooling
- **Tailwind CSS v4** (`@tailwindcss/vite`) — styling, with brand colors defined as design tokens in `src/index.css`
- **React Router** (`HashRouter`) — routing; hash-based so the built app works from any static file server with zero server config
- **Framer Motion** — screen transitions and the EcoCash payment animation
- **lucide-react** — icon set, bundled via npm (no CDN)
- **qrcode.react** — QR code generation for tickets and parcel labels, bundled via npm (no CDN)
- **@fontsource/inter** — the app's font, bundled via npm so nothing loads over the network at runtime

Everything is installed via npm and bundled by Vite — the production build has **no CDN
dependency** and works fully offline once loaded.

## Getting started

```bash
npm install
npm run dev       # local dev server with HMR
npm run build     # production build to dist/ (fully static, offline-capable)
npm run preview   # serve the production build locally
```

## Demo credentials

The app opens to a role picker. Each role has its own login:

- **Customer** — any phone number in international format (e.g. `+263 77 123 4567`), PIN `1234`
- **Operator** — Operator ID `CB001`, PIN `1234`

## What's simulated

- **EcoCash Merchant payment** — used for both ticket purchases and parcel registration.
  Enter a phone number → "Request Payment" → a brief processing screen → a generated EcoCash
  reference number and a success screen. No real EcoCash API is called.
- **Manifest** — read-only, and auto-populated live from ticket bookings made in the running
  session (both customer and operator screens read from the same in-memory store).
- **Parcel tracking** — customers can only *track* a parcel by code; registering a parcel is
  operator-only. Operators advance a parcel's status (Registered → Loaded on Bus → In Transit →
  Arrived → Collected) and the customer's tracking timeline reflects it immediately.
- **Fleet locations, broadcasts, invoices** — static/derived mock data, no real telemetry.

State lives in a single React context (`src/context/AppStateContext.jsx`) for the lifetime of the
tab. It's seeded with a handful of realistic routes and trips on load; nothing persists across a
full page reload.

## Project structure

```
src/
  assets/          Swap-in points for real image assets (see below)
  components/      Shared UI: Logo, PhoneFrame, Header, BottomNav, Button, Card, EcoCashPayment...
  context/         AppStateContext — the in-memory store (auth, trips, tickets, parcels)
  data/            Mock reference data (routes, trips, seat layout, parcel categories)
  screens/         One folder per app area: customer/, operator/, plus shared entry screens
```

## About the visual assets

No real `logo.png` / `bus-hero.jpg` files were available when this was built, so both were
recreated in code instead of using placeholders:

- **Logo** — `src/components/Logo.jsx` is a reusable component (bold italic wordmark, red "City" /
  navy "Bus", red dot accent, "Connecting Cities" tagline), not a static image, so it stays crisp
  at any size.
- **Splash hero** — `src/components/HeroBackground.jsx` is a CSS gradient + inline SVG scene
  (skyline + bus silhouette) standing in for a photo.

If real photo assets ever land, drop `bus-hero.jpg` into `src/assets/` and uncomment the two lines
in `src/assets/heroImage.js` — `HeroBackground` will pick it up automatically with no other code
changes needed.

## Design system

| Token       | Hex       | Use                                              |
|-------------|-----------|---------------------------------------------------|
| Brand red   | `#E2071F` | Primary CTAs, active tab, accents                  |
| Navy        | `#103888` | Header bars, operator primary, secondary CTAs      |
| Gold        | `#F0960A` | Highlights, price call-outs, badges                |
| Green       | `#10A848` | Success states, available seats, confirmations     |
| Ink         | `#15161D` | Primary text                                       |
| Paper       | `#F3F3F6` | App background                                     |

Defined as Tailwind theme tokens in `src/index.css` (`@theme` block) — e.g. `bg-brand-red`,
`text-brand-navy`.
