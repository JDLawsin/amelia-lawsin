import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";

/**
 * Served at /robots.txt. Allows crawling of all public content and
 * blocks the admin dashboard, login, and API routes from indexing.
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = getSiteUrl();

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/login", "/api/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
