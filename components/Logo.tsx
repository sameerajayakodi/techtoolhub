/**
 * TechToolHub mark: a rounded tile holding a 2x2 grid of picked tools. Keep in sync with
 * scripts/generate-brand-assets.mjs, which renders the favicons and logo.png from the same shape.
 */
export default function Logo({ className = 'h-8 w-8' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="tth-g" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6366F1" />
          <stop offset="1" stopColor="#06B6D4" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="8" fill="url(#tth-g)" />
      <rect x="7" y="7" width="8" height="8" rx="2.25" fill="#fff" />
      <rect x="17" y="7" width="8" height="8" rx="2.25" fill="#fff" fillOpacity="0.55" />
      <rect x="7" y="17" width="8" height="8" rx="2.25" fill="#fff" fillOpacity="0.55" />
      <rect x="17" y="17" width="8" height="8" rx="4" fill="#fff" />
    </svg>
  )
}
