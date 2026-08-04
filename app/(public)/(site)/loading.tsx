// Route-level loading state for the (public) group. Renders inside the public
// layout, so Navbar/Footer stay visible — this fills only the content slot
// during server data fetches. Uses the brand's A-house mark with a gentle
// pulse animation instead of generic skeleton blocks, so it fits every page
// (Home, About, Contact, listings) and stays on-brand.
export default function Loading() {
  return (
    <main
      className="min-h-[70vh] flex flex-col items-center justify-center px-6"
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      {/* Brand mark — same A-house geometry as components/ui/Logo.tsx, shown
          standalone with a soft pulse + ink glow (see globals.css). */}
      <svg
        width="56"
        height="56"
        viewBox="0 0 42 42"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="animate-brand-pulse"
      >
        <rect x="2" y="2" width="38" height="38" rx="9" fill="#1d1d1f" />
        <path
          d="M21 9 L9 35 L33 35 Z"
          fill="none"
          stroke="#ffffff"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <line
          x1="14"
          y1="26"
          x2="28"
          y2="26"
          stroke="#ffffff"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <rect x="17" y="26" width="8" height="9" rx="1" fill="#ffffff" />
        <line
          x1="21"
          y1="26"
          x2="21"
          y2="35"
          stroke="#1d1d1f"
          strokeWidth="1"
        />
      </svg>

      <p className="mt-5 text-xs text-ash tracking-wide">Loading…</p>
    </main>
  );
}
