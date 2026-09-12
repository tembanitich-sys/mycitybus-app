import { heroImageUrl } from '../assets/heroImage'

// Splash background. Recreated as a CSS gradient + SVG scene since no source photo was available —
// see src/assets/heroImage.js for how to swap in a real photo later with no changes here.
export default function HeroBackground({ className = '' }) {
  if (heroImageUrl) {
    return (
      <div
        className={`absolute inset-0 bg-cover bg-center ${className}`}
        style={{ backgroundImage: `url(${heroImageUrl})` }}
      />
    )
  }

  return (
    <div
      className={`absolute inset-0 overflow-hidden ${className}`}
      style={{ background: 'linear-gradient(160deg, #0b2761 0%, #103888 42%, #6d1730 78%, #b80517 100%)' }}
    >
      <svg viewBox="0 0 390 500" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMax slice">
        {/* distant skyline */}
        <g fill="#ffffff" opacity="0.08">
          <rect x="10" y="300" width="26" height="90" />
          <rect x="42" y="270" width="20" height="120" />
          <rect x="68" y="310" width="30" height="80" />
          <rect x="290" y="280" width="24" height="110" />
          <rect x="320" y="250" width="18" height="140" />
          <rect x="345" y="300" width="28" height="90" />
        </g>
        {/* road */}
        <rect x="0" y="392" width="390" height="8" fill="#ffffff" opacity="0.12" />

        {/* bus silhouette */}
        <g transform="translate(55,300)">
          <rect x="0" y="30" width="280" height="90" rx="16" fill="#ffffff" opacity="0.95" />
          <rect x="0" y="30" width="280" height="34" rx="16" fill="#ffffff" opacity="0.55" />
          <rect x="18" y="70" width="44" height="34" rx="4" fill="#103888" opacity="0.85" />
          <rect x="72" y="70" width="44" height="34" rx="4" fill="#103888" opacity="0.85" />
          <rect x="126" y="70" width="44" height="34" rx="4" fill="#103888" opacity="0.85" />
          <rect x="180" y="70" width="44" height="34" rx="4" fill="#103888" opacity="0.85" />
          <rect x="234" y="70" width="30" height="34" rx="4" fill="#103888" opacity="0.85" />
          <circle cx="55" cy="126" r="17" fill="#15161D" />
          <circle cx="55" cy="126" r="7" fill="#ffffff" opacity="0.5" />
          <circle cx="225" cy="126" r="17" fill="#15161D" />
          <circle cx="225" cy="126" r="7" fill="#ffffff" opacity="0.5" />
          <rect x="256" y="42" width="10" height="14" rx="2" fill="#F0960A" />
        </g>
      </svg>
    </div>
  )
}
