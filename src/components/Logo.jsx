// Recreated wordmark (no source logo.png was available) — bold italic "City" (red) + "Bus" (navy)
// with a small red dot accent, plus a "Connecting Cities" tagline. Swap in a real <img> here later if
// logo.png ever lands in src/assets/.

const SIZE_MAP = {
  sm: { text: 'text-lg', tag: 'text-[8px]', gap: 'gap-0' },
  md: { text: 'text-2xl', tag: 'text-[10px]', gap: 'gap-0.5' },
  lg: { text: 'text-4xl', tag: 'text-xs', gap: 'gap-1' },
}

export default function Logo({ size = 'md', tagline = true, className = '' }) {
  const s = SIZE_MAP[size] ?? SIZE_MAP.md

  return (
    <div className={`inline-flex flex-col items-start ${s.gap} ${className}`}>
      <div className={`relative flex items-baseline font-extrabold italic tracking-tight leading-none ${s.text}`}>
        <span className="text-brand-red">City</span>
        <span className="relative text-brand-navy">
          Bus
          <span
            aria-hidden
            className="absolute -top-[0.55em] left-[0.32em] block rounded-full bg-brand-red"
            style={{ width: '0.16em', height: '0.16em' }}
          />
        </span>
      </div>
      {tagline && (
        <span className={`font-bold uppercase text-gray-500 tracking-[0.14em] ${s.tag}`}>Connecting Cities</span>
      )}
    </div>
  )
}
