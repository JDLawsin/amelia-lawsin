import { SITE_CONFIG } from "@/constants";
import { getSiteUrl } from "@/lib/site";
import { getAllBlogs, type BlogPreviewItem } from "@/services/blog.service";

const FEED_TITLE = `${SITE_CONFIG.name} — Real Estate Blog`;
const FEED_DESCRIPTION =
  "Expert advice on buying, financing, and investing in Cebu real estate from licensed agent Amelia Lawsin.";
const FEED_LIMIT = 50;

const escapeXml = (value: string): string =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const toRfc822 = (date: Date): string => date.toUTCString();

const renderItem = (post: BlogPreviewItem, baseUrl: string): string => {
  const link = `${baseUrl}/blog/${post.slug}`;
  const pubDate = post.publishedAt ? toRfc822(post.publishedAt) : "";
  const author = `${SITE_CONFIG.email} (${SITE_CONFIG.name})`;

  return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${escapeXml(link)}</link>
      <guid isPermaLink="true">${escapeXml(link)}</guid>
      <description>${escapeXml(post.excerpt)}</description>
      ${pubDate ? `<pubDate>${pubDate}</pubDate>` : ""}
      <author>${escapeXml(author)}</author>
    </item>`;
};

export const buildBlogRssFeed = async (): Promise<string> => {
  const baseUrl = getSiteUrl();
  const blogUrl = `${baseUrl}/blog`;
  const feedUrl = `${baseUrl}/feed.xml`;

  const posts = await getAllBlogs({ pageSize: FEED_LIMIT });
  const latestDate = posts.find((post) => post.publishedAt)?.publishedAt;
  const lastBuildDate = latestDate ? toRfc822(latestDate) : toRfc822(new Date());

  const items = posts.map((post) => renderItem(post, baseUrl)).join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(FEED_TITLE)}</title>
    <link>${escapeXml(blogUrl)}</link>
    <description>${escapeXml(FEED_DESCRIPTION)}</description>
    <language>en-ph</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${escapeXml(feedUrl)}" rel="self" type="application/rss+xml" />
    <managingEditor>${escapeXml(`${SITE_CONFIG.email} (${SITE_CONFIG.name})`)}</managingEditor>
    <webMaster>${escapeXml(`${SITE_CONFIG.email} (${SITE_CONFIG.name})`)}</webMaster>${items}
  </channel>
</rss>`;
};
