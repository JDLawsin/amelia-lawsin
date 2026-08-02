import Link from "next/link";
import Image from "next/image";
import { formatPrice, getPrimaryImage, getPropertyLabel } from "@/lib/utils";
import { PropertyListItem } from "@/services/property.service";
import { ctaPrimary, ctaSecondary } from "@/components/ui/cta";

type HeroSectionProps = {
  latestListing: PropertyListItem | null;
};

const HeroSection = ({ latestListing }: HeroSectionProps) => {
  const imageUrl = latestListing ? getPrimaryImage(latestListing.images) : null;
  const imageAlt = latestListing?.title ?? "Latest listing";

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 bg-cloud">
      <div className="flex flex-col items-center justify-center border-r border-wire">
        <div className="flex flex-col gap-5 w-full max-w-7xl px-6 py-16 md:py-20">
          <p className="text-[10px] font-medium text-ash uppercase tracking-[0.15em]">
            Licensed Real Estate Agent · Cebu
          </p>

          <h1 className="text-4xl xl:text-5xl font-serif font-medium text-ink tracking-tight leading-tight">
            Find Your Dream <br className="hidden md:block" />
            Property in Cebu
          </h1>

          <p className="text-sm text-ash leading-relaxed">
            Trusted by local buyers, OFWs, and international investors{" "}
            <br className="hidden md:block" />
            across the Philippines
          </p>

          <div className="flex flex-wrap gap-3">
            <Link href="/properties" className={ctaPrimary}>
              Browse properties
            </Link>
            <Link href="/contact" className={ctaSecondary}>
              Contact Amelia
            </Link>
          </div>
        </div>
      </div>

      <div className="relative hidden md:flex items-end justify-end min-h-105 overflow-hidden bg-cloud">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            sizes="(max-width: 1024px) 50vw, 40vw"
            priority
            className="object-cover"
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
            <p className="text-sm font-medium text-ink line-clamp-1">
              {getPropertyLabel(latestListing)}
            </p>
            <p className="text-sm font-medium text-ink mt-0.5">
              {formatPrice(latestListing)}
            </p>
            {latestListing.city && (
              <p className="text-xs text-ash mt-1">{latestListing.city}</p>
            )}
          </Link>
        )}
      </div>
    </section>
  );
};

export default HeroSection;
