import type { Metadata } from "next";
import { Suspense } from "react";
import HomeContent from "@/components/home/HomeContent";
import HomeLoadingSkeleton from "@/components/home/HomeLoadingSkeleton";
import { SITE_CONFIG } from "@/constants";
import {
  getCachedFeaturedProperties,
  getCachedLatestListing,
} from "@/lib/home-cache";
import {
  HERO_IMAGE_HEIGHT,
  HERO_IMAGE_SIZES,
  HERO_IMAGE_WIDTH,
  PROPERTY_CARD_IMAGE_HEIGHT,
  PROPERTY_CARD_IMAGE_SIZES,
  PROPERTY_CARD_IMAGE_WIDTH,
} from "@/lib/image-layout";
import { ogImageMetadata } from "@/lib/og-metadata";
import { LcpPreloadLink } from "@/lib/preload-lcp-image";
import { getPrimaryImage } from "@/lib/utils";

const title = `${SITE_CONFIG.name} — Licensed Real Estate Agent in ${SITE_CONFIG.location}`;
const description = `Find condos, house & lot, townhouses, and pre-selling properties in ${SITE_CONFIG.location} with ${SITE_CONFIG.name}. Get expert guidance on Pag-IBIG, bank, and in-house financing — trusted by local buyers, OFWs, and investors.`;
const ogAlt = `${SITE_CONFIG.name} — Licensed Real Estate Agent in Cebu`;

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_PH",
    siteName: SITE_CONFIG.name,
    title,
    description,
    url: "/",
    images: ogImageMetadata("/", ogAlt),
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ogImageMetadata("/", ogAlt),
  },
};

const Home = async () => {
  const [latestListing, featuredProperties] = await Promise.all([
    getCachedLatestListing(),
    getCachedFeaturedProperties(1),
  ]);

  const heroImage = latestListing
    ? getPrimaryImage(latestListing.images)
    : null;
  const mobileLcpProperty = featuredProperties[0];
  const mobileLcpImage = mobileLcpProperty
    ? getPrimaryImage(mobileLcpProperty.images)
    : null;

  return (
    <>
      {heroImage && (
        <LcpPreloadLink
          src={heroImage}
          alt={latestListing?.title ?? "Latest listing"}
          width={HERO_IMAGE_WIDTH}
          height={HERO_IMAGE_HEIGHT}
          sizes={HERO_IMAGE_SIZES}
          media="(min-width: 768px)"
        />
      )}
      {mobileLcpImage && mobileLcpProperty && (
        <LcpPreloadLink
          src={mobileLcpImage}
          alt={mobileLcpProperty.title}
          width={PROPERTY_CARD_IMAGE_WIDTH}
          height={PROPERTY_CARD_IMAGE_HEIGHT}
          sizes={PROPERTY_CARD_IMAGE_SIZES}
          media="(max-width: 767px)"
        />
      )}
      <Suspense fallback={<HomeLoadingSkeleton />}>
        <HomeContent />
      </Suspense>
    </>
  );
};

export default Home;
