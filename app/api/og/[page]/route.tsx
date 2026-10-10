import { createOgImage } from "@/lib/og-image";
import { OG_PAGE_CONFIG, type OgPageId } from "@/lib/og-pages";

const isOgPageId = (value: string): value is OgPageId =>
  value in OG_PAGE_CONFIG;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ page: string }> },
) {
  const { page } = await params;

  if (!isOgPageId(page)) {
    return new Response("Not found", { status: 404 });
  }

  const config = OG_PAGE_CONFIG[page];
  return createOgImage({
    title: config.title,
    subtitle: config.subtitle,
  });
}
