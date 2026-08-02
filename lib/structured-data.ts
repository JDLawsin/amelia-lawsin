import { SITE_CONFIG } from "@/constants";
import { BlogDetail } from "@/services/blog.service";
import { PropertyDetail } from "@/services/property.service";

const availabilityMap: Record<string, string> = {
  FOR_SALE: "https://schema.org/InStock",
  FOR_RENT: "https://schema.org/InStock",
  PRE_SELLING: "https://schema.org/PreOrder",
  SOLD: "https://schema.org/OutOfStock",
  RENTED: "https://schema.org/OutOfStock",
};

const businessFunctionMap: Record<string, string | undefined> = {
  FOR_SALE: "https://schema.org/Sale",
  FOR_RENT: "https://schema.org/Rent",
  PRE_SELLING: "https://schema.org/Sale",
};

export const organizationJsonLd = (baseUrl: string) => ({
  "@context": "https://schema.org",
  "@type": ["RealEstateAgent", "LocalBusiness"],
  "@id": `${baseUrl}/#organization`,
  name: SITE_CONFIG.name,
  url: baseUrl,
  telephone: SITE_CONFIG.phone,
  email: SITE_CONFIG.email,
  address: {
    "@type": "PostalAddress",
    addressLocality: SITE_CONFIG.location,
    addressCountry: "PH",
  },
  sameAs: [SITE_CONFIG.facebookUrl, SITE_CONFIG.instagramUrl],
});

export const realEstateAgentJsonLd = (baseUrl: string) => ({
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  "@id": `${baseUrl}/about/#profile`,
  name: SITE_CONFIG.name,
  url: `${baseUrl}/about`,
  telephone: SITE_CONFIG.phone,
  email: SITE_CONFIG.email,
  address: {
    "@type": "PostalAddress",
    addressLocality: SITE_CONFIG.location,
    addressCountry: "PH",
  },
  sameAs: [SITE_CONFIG.facebookUrl, SITE_CONFIG.instagramUrl],
});

export const realEstateListingJsonLd = (
  baseUrl: string,
  property: PropertyDetail,
) => {
  const url = `${baseUrl}/properties/${property.slug}`;
  const address: Record<string, unknown> = {
    "@type": "PostalAddress",
    addressCountry: "PH",
  };
  if (property.address) address.streetAddress = property.address;
  if (property.city) address.addressLocality = property.city;

  const offer: Record<string, unknown> = {
    "@type": "Offer",
    priceCurrency: "PHP",
    availability: availabilityMap[property.status],
  };
  if (property.price != null) offer.price = property.price.toString();
  if (businessFunctionMap[property.status]) {
    offer.businessFunction = businessFunctionMap[property.status];
  }

  return {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: property.title,
    url,
    description: property.description,
    image: property.images.map((image) => image.url),
    address,
    offers: offer,
  };
};

export const blogPostingJsonLd = (baseUrl: string, blog: BlogDetail) => ({
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: blog.title,
  description: blog.excerpt,
  url: `${baseUrl}/blog/${blog.slug}`,
  image: blog.coverImage ?? undefined,
  datePublished: blog.publishedAt?.toISOString() ?? undefined,
  dateModified: blog.updatedAt?.toISOString() ?? undefined,
  author: {
    "@type": "Person",
    name: SITE_CONFIG.name,
    url: baseUrl,
  },
  publisher: {
    "@type": "Organization",
    name: SITE_CONFIG.name,
    url: baseUrl,
  },
});

export const breadcrumbListJsonLd = (
  baseUrl: string,
  items: { name: string; url: string }[],
) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: `${baseUrl}${item.url}`,
  })),
});
