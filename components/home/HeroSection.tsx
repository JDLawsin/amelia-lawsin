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
import { BadgeCheck } from "lucide-react";

type HeroSectionProps = {
  latestListing: PropertyListItem | null;
};

const listingCardBaseClassName =
  "bg-white shadow-apple-lg hover:shadow-apple-hover transition-[box-shadow,transform] duration-200 hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2";

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
      className="grid grid-cols-1 bg-cloud md:min-h-[34rem] md:grid-cols-[minmax(0,5fr)_minmax(0,8fr)]"
    >
      <div
        className="flex flex-col justify-center px-6 pt-14 pb-10 sm:px-8 md:border-r md:border-wire md:px-10 md:py-20 lg:px-14"
      >
        <h1 className="max-w-xl text-4xl font-serif font-medium leading-[1.08] tracking-[-0.025em] text-ink sm:text-5xl md:text-[2.75rem] xl:text-6xl">
          Find Your Dream Property in Cebu
        </h1>

        <p className="mt-6 max-w-lg text-base leading-relaxed text-ash">
          Trusted by local buyers, OFWs, and international investors across the
          Philippines
        </p>

        <div className="mt-7 flex flex-wrap gap-3">
          <Link href="/properties" className={ctaPrimary}>
            Browse Properties
          </Link>
          <Link href="/contact" className={ctaSecondary}>
            Contact Amelia
          </Link>
        </div>

        <p className="mt-7 flex items-center gap-2 text-xs font-medium text-ash">
          <BadgeCheck className="size-4 text-ink" aria-hidden="true" />
          Licensed Real Estate Agent in Cebu
        </p>

        {imageUrl && (
          <div className="relative -mx-6 mt-10 mb-5 md:hidden sm:-mx-8">
            <div
              className="relative aspect-[4/3] max-h-[55vh] overflow-hidden bg-cloud"
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
                className="absolute -bottom-5 right-4 z-10 min-w-40 max-w-48"
              />
            )}
          </div>
        )}
      </div>

      <div className="relative hidden min-h-[34rem] items-end justify-end overflow-hidden bg-cloud md:flex">
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
