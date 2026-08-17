import Link from "next/link";
import Image from "next/image";
import {
  HERO_IMAGE_MOBILE_SIZES,
  HERO_IMAGE_SIZES,
  HERO_IMAGE_WIDTH,
} from "@/lib/image-layout";
import { formatPrice, getPrimaryImage, getPropertyLabel } from "@/lib/utils";
import { PropertyListItem } from "@/services/property.service";
import { ctaPrimary, ctaSecondary } from "@/components/ui/cta";

type HeroSectionProps = {
  latestListing: PropertyListItem | null;
};

const listingCardBaseClassName =
  "bg-white shadow-apple-lg hover:shadow-apple-hover transition-shadow duration-200 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2";

const LatestListingCard = ({
  listing,
  className,
  compact = false,
}: {
  listing: PropertyListItem;
  className?: string;
  compact?: boolean;
}) => (
  <Link
    href={`/properties/${listing.slug}`}
    className={[
      listingCardBaseClassName,
      compact ? "rounded-xl py-2.5 pl-3 pr-2" : "rounded-2xl p-4",
      className,
    ]
      .filter(Boolean)
      .join(" ")}
  >
    <p
      className={
        compact
          ? "text-[10px] text-ash mb-0.5"
          : "text-xs text-ash mb-1"
      }
    >
      Latest listing
    </p>
    <p
      className={
        compact
          ? "text-xs font-medium text-ink line-clamp-1 leading-snug"
          : "text-sm font-medium text-ink line-clamp-1"
      }
    >
      {getPropertyLabel(listing)}
    </p>
    <p
      className={
        compact
          ? "text-xs font-medium text-ink leading-snug"
          : "text-sm font-medium text-ink mt-0.5"
      }
    >
      {formatPrice(listing)}
    </p>
    {listing.city && (
      <p
        className={
          compact ? "text-[10px] text-ash mt-0.5" : "text-xs text-ash mt-1"
        }
      >
        {listing.city}
      </p>
    )}
  </Link>
);

const HeroSection = ({ latestListing }: HeroSectionProps) => {
  const imageUrl = latestListing
    ? getPrimaryImage(latestListing.images, {
        width: HERO_IMAGE_WIDTH,
        quality: "auto:best",
      })
    : null;
  const imageAlt = latestListing?.title ?? "Latest listing";

  return (
    <section
      className="grid grid-cols-1 md:grid-cols-[minmax(0,5fr)_minmax(0,8fr)] bg-cloud md:min-h-105"
    >
      <div
        className="flex flex-col justify-center gap-5 px-6 md:px-10 lg:px-12 pt-16 pb-10 md:py-20 border-b md:border-b-0 md:border-r border-wire"
      >
        <p className="text-[10px] font-medium text-ash uppercase tracking-[0.15em]">
          Licensed Real Estate Agent · Cebu
        </p>

        <h1 className="text-4xl xl:text-5xl font-serif font-medium text-ink tracking-tight leading-tight min-h-22 xl:min-h-26">
          Find Your Dream Property in Cebu
        </h1>

        <p className="text-sm text-ash leading-relaxed">
          Trusted by local buyers, OFWs, and international investors across the
          Philippines
        </p>

        <div className="flex flex-wrap gap-3">
          <Link href="/properties" className={ctaPrimary}>
            Browse Properties
          </Link>
          <Link href="/contact" className={ctaSecondary}>
            Contact Amelia
          </Link>
        </div>

        {imageUrl && (
          <div className="md:hidden relative -ml-6 w-[calc(100%+1.5rem)]">
            <div
              className="relative aspect-video max-h-[40vh] overflow-hidden bg-cloud mr-6"
            >
              <Image
                src={imageUrl}
                alt={imageAlt}
                fill
                sizes={HERO_IMAGE_MOBILE_SIZES}
                loading="lazy"
                className="object-cover"
              />
              <div
                className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent"
              />
            </div>
            {latestListing && (
              <LatestListingCard
                listing={latestListing}
                compact
                className="absolute bottom-4 -right-3 z-10 min-w-36 max-w-44"
              />
            )}
          </div>
        )}
      </div>

      <div className="relative hidden md:flex items-end justify-end min-h-105 overflow-hidden bg-cloud">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            sizes={HERO_IMAGE_SIZES}
            // Desktop LCP is preloaded via media-scoped <LcpPreloadLink /> in
            // page.tsx. Keep lazy so mobile does not compete with the featured
            // card LCP slot.
            loading="lazy"
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
          <LatestListingCard
            listing={latestListing}
            className="relative z-10 m-6 min-w-48"
          />
        )}
      </div>
    </section>
  );
};

export default HeroSection;
