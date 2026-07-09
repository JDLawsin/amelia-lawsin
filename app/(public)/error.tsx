"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/shadcn/button";

// Public error boundary. Renders INSIDE the (public) layout, so Navbar and
// Footer stay visible — this fills only the content slot. Must be a Client
// Component per the Next.js error-boundary contract.
type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ error, reset }: Props) {
  useEffect(() => {
    // Surface unexpected runtime errors to the console for debugging.
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-[60vh] flex flex-col items-center justify-center px-6 text-center">
      <div className="w-16 h-16 bg-cloud border border-wire rounded-full flex items-center justify-center mb-5">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#86868b"
          strokeWidth="1.5"
        >
          <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      </div>
      <h1 className="text-xl font-serif font-medium text-ink mb-2">
        Something went wrong
      </h1>
      <p className="text-sm text-ash max-w-xs mb-6">
        An unexpected error occurred while loading this page. Please try again.
      </p>
      <div className="flex gap-3">
        <Button
          onClick={reset}
          className="bg-ink text-white hover:bg-ink/90 rounded-full"
        >
          Try again
        </Button>
        <Button
          asChild
          variant="outline"
          className="border-wire text-ink hover:bg-cloud rounded-full"
        >
          <Link href="/">Back to home</Link>
        </Button>
      </div>
    </main>
  );
}
