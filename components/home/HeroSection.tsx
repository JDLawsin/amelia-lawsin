import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/shadcn/button";
import clsx from "clsx";
import { formatPrice, getPrimaryImage, getPropertyLabel } from "@/lib/utils";
import { PropertyListItem } from "@/services/property.service";

type HeroSectionProps = {
  latestListing: PropertyListItem | null;
};

const HeroSection = ({ latestListing }: HeroSectionProps) => {
  const imageUrl = latestListing ? getPrimaryImage(latestListing.images) : null;

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 bg-cloud">
      <div className="flex flex-col justify-center gap-5 px-8 py-16 md:px-16 xl:px-24 border-r border-wire">
        <div
          className={clsx(
            "flex items-center w-fit",
            "text-ink text-sm font-medium",
            "px-4 h-9 rounded-full",
            "border border-wire bg-ink/10",
          )}
        >
          Licensed Real Estate Broker · Cebu
        </div>

        <h1 className="text-4xl xl:text-5xl font-serif font-semibold text-ink leading-tight">
          Find Your Dream <br className="hidden md:block" />
          Property in Cebu
        </h1>

        <p className="text-sm text-ash leading-relaxed">
          Trusted by local buyers, OFWs, and international investors{" "}
          <br className="hidden md:block" />
          across the Philippines
        </p>

        <div className="flex flex-wrap gap-3">
          <Button
            asChild
            className="h-11 px-6 bg-ink text-white hover:bg-ink/90"
          >
            <Link href="/properties">Browse properties</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="h-11 px-6 border-wire text-ink bg-transparent hover:bg-ink/10 hover:text-ink"
          >
            <Link href="/contact">Contact Amelia</Link>
          </Button>
        </div>
      </div>

      <div className="relative hidden md:flex items-end justify-end min-h-105 overflow-hidden bg-cloud">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={latestListing?.title ?? "Latest listing"}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-cloud">
            <span className="text-xs text-ash opacity-50">
              Professional photo of Amelia / luxury property
            </span>
          </div>
        )}

        {imageUrl && (
          <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent" />
        )}

        {latestListing && (
          <Link
            href={`/properties/${latestListing.slug}`}
            className="relative z-10 m-6 bg-white rounded-2xl shadow-apple-lg p-4 min-w-48 hover:shadow-apple-hover transition-shadow duration-200"
          >
            <p className="text-xs text-ash mb-1">Latest listing</p>
            <p className="text-sm font-semibold text-ink line-clamp-1">
              {getPropertyLabel(latestListing)}
            </p>
            <p className="text-sm font-medium text-ink mt-0.5">
              {formatPrice(latestListing)}
            </p>
            {latestListing.city && (
              <p className="text-xs text-fog mt-1">{latestListing.city}</p>
            )}
          </Link>
        )}
      </div>
    </section>
  );
};

export default HeroSection;
