/**
 * Resolves the canonical site origin used for SEO: metadataBase, sitemap.xml,
 * and robots.txt. Falls back to localhost for local dev when the env var is
 * not set. Set NEXT_PUBLIC_SITE_URL to the production origin in your environment.
 */
export function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}
