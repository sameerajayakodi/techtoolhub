/** TechToolHub mark: a rounded tile with a stylised "hub" of connected nodes */
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
      <path
        d="M9 11h14M16 11v11"
        stroke="#fff"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="9" cy="11" r="2.2" fill="#fff" />
      <circle cx="23" cy="11" r="2.2" fill="#fff" />
      <circle cx="16" cy="22.5" r="2.6" fill="#fff" />
    </svg>
  )
}
