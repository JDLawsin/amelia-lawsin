import type { NextConfig } from "next";

/**
 * Disable streaming metadata so `<meta name="description">` is always in `<head>`.
 * Lighthouse/Unlighthouse navigate with a mobile Chrome UA (not HeadlessChrome), so
 * bot-only regexes miss audits and SEO scores cap at 92. See LH-017.
 */
const HTML_LIMITED_BOTS = /.*/;

const nextConfig: NextConfig = {
  htmlLimitedBots: HTML_LIMITED_BOTS,
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [128, 256, 384, 512, 640, 800],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
    inlineCss: true,
    optimizePackageImports: [
      "lucide-react",
      "radix-ui",
      "@supabase/supabase-js",
      "@uidotdev/usehooks",
    ],
  },
};

export default nextConfig;
