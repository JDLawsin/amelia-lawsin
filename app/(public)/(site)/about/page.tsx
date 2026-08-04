import type { Metadata } from "next";
import AboutContent from "@/components/about/AboutContent";
import { SITE_CONFIG } from "@/constants";
import { ogImageMetadata } from "@/lib/og-metadata";
import {
  ABOUT_HERO_IMAGE_HEIGHT,
  ABOUT_HERO_IMAGE_SIZES,
  ABOUT_HERO_IMAGE_WIDTH,
} from "@/lib/image-layout";
import { LcpPreloadLink } from "@/lib/preload-lcp-image";

const ogAlt = `About ${SITE_CONFIG.name} — Licensed Real Estate Agent in Cebu`;

export const metadata: Metadata = {
  title: "About Amelia Lawsin — Licensed Real Estate Agent in Cebu",
  description:
    "10+ years helping local buyers, OFWs, and international investors find their dream property in Cebu. PRC Licensed Agent. Free consultation, no commitment required.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About Amelia Lawsin — Licensed Real Estate Agent in Cebu",
    description:
      "10+ years helping local buyers, OFWs, and international investors find their dream property in Cebu.",
    type: "profile",
    images: ogImageMetadata("/about", ogAlt),
  },
  twitter: {
    card: "summary_large_image",
    title: "About Amelia Lawsin — Licensed Real Estate Agent in Cebu",
    description:
      "10+ years helping local buyers, OFWs, and international investors find their dream property in Cebu.",
    images: ogImageMetadata("/about", ogAlt),
  },
};

const AboutPage = () => (
  <>
    <LcpPreloadLink
      src="/amelia.webp"
      alt="Amelia Lawsin — Licensed Real Estate Agent in Cebu"
      width={ABOUT_HERO_IMAGE_WIDTH}
      height={ABOUT_HERO_IMAGE_HEIGHT}
      sizes={ABOUT_HERO_IMAGE_SIZES}
      media="(min-width: 0px)"
    />
    <AboutContent />
  </>
);

export default AboutPage;
