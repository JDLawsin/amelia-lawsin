import type { Metadata } from "next";
import FeaturedProperties from "@/components/home/FeaturedProperties";
import HeroSection from "@/components/home/HeroSection";
import StatsBar from "@/components/home/StatsBar";
import WhyChooseSection from "@/components/home/WhyChooseSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import BlogPreviewSection from "@/components/home/BlogPreviewSection";
import FinalCTASection from "@/components/home/FinalCTASection";
import {
  getActiveListingsCount,
  getFeaturedProperties,
  getLatestListing,
} from "@/services/property.service";
import { getLatestBlogs } from "@/services/blog.service";
import { SITE_CONFIG } from "@/constants";
import { ogImageMetadata } from "@/lib/og-metadata";
import { getSiteUrl } from "@/lib/site";
import { organizationJsonLd } from "@/lib/structured-data";
import JsonLd from "@/components/ui/JsonLd";
import {
  HERO_IMAGE_HEIGHT,
  HERO_IMAGE_SIZES,
  HERO_IMAGE_WIDTH,
  PROPERTY_CARD_IMAGE_HEIGHT,
  PROPERTY_CARD_IMAGE_SIZES,
  PROPERTY_CARD_IMAGE_WIDTH,
} from "@/lib/image-layout";
import {
  LcpPreloadLink,
  preloadLcpImage,
} from "@/lib/preload-lcp-image";
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

export const Home = async () => {
  const [featuredProperties, activeListingsCount, latestListing, latestBlogs] =
    await Promise.all([
      getFeaturedProperties(),
      getActiveListingsCount(),
      getLatestListing(),
      getLatestBlogs(),
    ]);

  // Mobile LCP = first featured card (hero is `hidden md:flex` and must not
  // steal the high-priority network slot). Desktop LCP = hero image.
  const mobileLcpProperty = featuredProperties[0];
  const mobileLcpImage = mobileLcpProperty
    ? getPrimaryImage(mobileLcpProperty.images)
    : null;
  if (mobileLcpImage) {
    preloadLcpImage(mobileLcpImage, mobileLcpProperty.title, {
      width: PROPERTY_CARD_IMAGE_WIDTH,
      height: PROPERTY_CARD_IMAGE_HEIGHT,
      sizes: PROPERTY_CARD_IMAGE_SIZES,
    });
  }

  const heroImage = latestListing
    ? getPrimaryImage(latestListing.images)
    : null;

  const baseUrl = getSiteUrl();

  return (
    <main className="bg-white">
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
      <JsonLd data={organizationJsonLd(baseUrl)} />
      <HeroSection latestListing={latestListing} />
      <StatsBar activeListings={activeListingsCount} />
      <FeaturedProperties properties={featuredProperties} />
      <WhyChooseSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <BlogPreviewSection blogs={latestBlogs} />
      <FinalCTASection />
    </main>
  );
};

export default Home;
