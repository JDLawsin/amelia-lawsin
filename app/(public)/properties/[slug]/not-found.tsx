import { Button } from "@/components/ui/shadcn/button";
import Link from "next/link";

const PropertyNotFound = () => {
  return (
    <main className="min-h-[60vh] flex flex-col items-center justify-center px-6 text-center">
      <div className="w-16 h-16 bg-cloud rounded-full flex items-center justify-center mb-5 border border-wire">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#86868b"
          strokeWidth="1.5"
        >
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      </div>
      <h1 className="text-xl font-serif font-medium text-ink mb-2">
        Property not found
      </h1>
      <p className="text-sm text-ash max-w-xs mb-6">
        This listing may have been sold, removed, or the link may be incorrect.
      </p>
      <div className="flex gap-3">
        <Button asChild className="bg-ink text-white hover:bg-ink/90">
          <Link href="/properties">Browse all properties</Link>
        </Button>
        <Button
          asChild
          variant="outline"
          className="border-wire text-ink hover:bg-cloud"
        >
          <Link href="/contact">Contact Amelia</Link>
        </Button>
      </div>
    </main>
  );
};

export default PropertyNotFound;
