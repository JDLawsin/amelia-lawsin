import Link from "next/link";
import Logo from "@/components/ui/Logo";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/properties", label: "Properties" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

/** Server-rendered navbar for legal/static pages — no client JS, no auth fetch. */
const LegalNavbar = () => (
  <header className="sticky top-0 z-50 w-full border-b border-wire bg-white/95 backdrop-blur supports-backdrop-filter:bg-white/60 px-6 2xl:px-0 shadow-apple-sm">
    <div className="container flex h-20 max-w-7xl mx-auto items-center justify-between gap-8">
      <Link href="/" className="flex items-center shrink-0">
        <Logo />
      </Link>

      <nav
        className="hidden md:flex items-center gap-1"
        aria-label="Main navigation"
      >
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="inline-flex h-9 items-center px-4 py-2 rounded-md text-sm font-medium text-ash transition-colors hover:bg-cloud hover:text-ink"
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-3">
        <Link
          href="/contact"
          className="hidden md:inline-flex h-10 items-center px-5 rounded-md text-sm font-medium bg-ink text-white hover:bg-ink/90 transition-colors"
        >
          Get in touch
        </Link>

        <details className="md:hidden relative group">
          <summary
            className="list-none cursor-pointer inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-cloud transition-colors [&::-webkit-details-marker]:hidden"
            aria-label="Open navigation menu"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
          </summary>
          <nav
            className="absolute right-0 top-full mt-2 w-52 rounded-xl border border-wire bg-white p-2 shadow-apple-sm"
            aria-label="Mobile navigation"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block rounded-lg px-3 py-2.5 text-sm font-medium text-ash hover:bg-cloud hover:text-ink transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contact"
              className="mt-1 block rounded-lg px-3 py-2.5 text-sm font-medium bg-ink text-white hover:bg-ink/90 transition-colors text-center"
            >
              Get in touch
            </Link>
          </nav>
        </details>
      </div>
    </div>
  </header>
);

export default LegalNavbar;
