import Link from "next/link";
import { Button } from "@/components/ui/shadcn/button";
import Logo from "@/components/ui/Logo";

// Root-level 404. Renders OUTSIDE the (public) layout, so it provides its own
// minimal chrome (logo + content) rather than relying on Navbar/Footer
// (which need the AuthProvider from the public layout).
export default function NotFound() {
  return (
    <main className="min-h-screen bg-white flex flex-col">
      <header className="px-6 py-6">
        <Link href="/" aria-label="Amelia Lawsin home">
          <Logo />
        </Link>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center -mt-20">
        <p className="text-6xl font-serif font-medium text-ink mb-4">404</p>
        <div className="w-16 h-16 bg-cloud border border-wire rounded-full flex items-center justify-center mb-5">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#86868b"
            strokeWidth="1.5"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <h1 className="text-xl font-serif font-medium text-ink mb-2">
          Page not found
        </h1>
        <p className="text-sm text-ash max-w-xs mb-6">
          The page you&apos;re looking for doesn&apos;t exist or may have been
          moved.
        </p>
        <div className="flex gap-3">
          <Button
            asChild
            className="bg-ink text-white hover:bg-ink/90 rounded-full"
          >
            <Link href="/">Back to home</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="border-wire text-ink hover:bg-cloud rounded-full"
          >
            <Link href="/properties">Browse properties</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
