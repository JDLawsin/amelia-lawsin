import { STATUS_LABELS, TYPE_LABELS } from "@/constants";
import { prisma } from "@/lib/prisma";
import { getSiteUrl } from "@/lib/site";
import { formatPrice } from "@/lib/utils";

export type ResolvedListing = {
  propertyTitle: string;
  propertySlug: string;
  propertyPrice: string;
  propertyLocation: string;
  propertyStatus: string;
  propertyType: string;
  propertyUrl: string;
};

export async function resolvePublishedListing(
  slug?: string | null,
): Promise<ResolvedListing | null> {
  const trimmed = slug?.trim();
  if (!trimmed) return null;

  const property = await prisma.property.findFirst({
    where: {
      slug: trimmed,
      deletedAt: null,
      isPublished: true,
    },
    select: {
      title: true,
      slug: true,
      type: true,
      status: true,
      price: true,
      priceLabel: true,
      city: true,
      barangay: true,
    },
  });

  if (!property) return null;

  const origin = getSiteUrl().replace(/\/$/, "");
  const propertyUrl = `${origin}/properties/${encodeURIComponent(property.slug)}`;

  return {
    propertyTitle: property.title,
    propertySlug: property.slug,
    propertyPrice: formatPrice(property),
    propertyLocation: [property.barangay, property.city].filter(Boolean).join(", "),
    propertyStatus: STATUS_LABELS[property.status],
    propertyType: TYPE_LABELS[property.type] ?? property.type,
    propertyUrl,
  };
}
