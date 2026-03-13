import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      // Unsplash — for sample/dev images
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      // Cloudinary — for production images (add this now so it's ready)
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default nextConfig;
