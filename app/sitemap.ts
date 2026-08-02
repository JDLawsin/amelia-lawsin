import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";
import { getAllBlogs } from "@/services/blog.service";
import { getAllProperties } from "@/services/property.service";

/**
 * Dynamic sitemap served at /sitemap.xml.
 *
 * Static top-level routes plus every published blog and active property.
 * This route is cached by default and revalidated at the framework's
 * default interval; bumping `pageSize` past realistic counts ensures we
 * enumerate all rows since the underlying service paginates via `take`.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl();

  const [blogs, properties] = await Promise.all([
    getAllBlogs({ pageSize: 1000 }),
    getAllProperties({ pageSize: 1000 }),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/properties`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  const blogRoutes: MetadataRoute.Sitemap = blogs.map((blog) => ({
    url: `${baseUrl}/blog/${blog.slug}`,
    lastModified: blog.publishedAt ?? undefined,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  // Property list select has no timestamp field; intentionally omitting
  // lastModified rather than reporting an inaccurate value.
  const propertyRoutes: MetadataRoute.Sitemap = properties.map((property) => ({
    url: `${baseUrl}/properties/${property.slug}`,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...blogRoutes, ...propertyRoutes];
}
