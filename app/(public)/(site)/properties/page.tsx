import {
  getAllProperties,
  getPropertiesCount,
} from "@/services/property.service";
import { ogImageMetadata } from "@/lib/og-metadata";
import { getSiteUrl } from "@/lib/site";
import { breadcrumbListJsonLd } from "@/lib/structured-data";
import {
  parsePropertyFiltersFromProps,
} from "@/lib/property-browse";
import { DEFAULT_PROPERTIES_PAGE_SIZE } from "@/lib/property-filters";
import JsonLd from "@/components/ui/JsonLd";
import { Suspense } from "react";
import PropertiesLoadingFallback from "./_components/PropertiesLoadingFallback";
import PropertiesClient from "./_components/PropertiesClient";
import PropertiesPageHeader from "./_components/PropertiesPageHeader";

const PAGE_SIZE = DEFAULT_PROPERTIES_PAGE_SIZE;

type SearchParams = Record<string, string | string[] | undefined>;
type Props = {
  searchParams: Promise<SearchParams>;
};

const toFilterParams = (params: SearchParams) => {
  const flat: Record<string, string | number | undefined> = {};
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined) continue;
    flat[key] = Array.isArray(value) ? value[0] : value;
  }
  return flat;
};

const PropertiesPage = async ({ searchParams }: Props) => {
  const params = await searchParams;
  const filters = parsePropertyFiltersFromProps(toFilterParams(params), {
    pageSize: PAGE_SIZE,
  });
  const currentPage = filters.page ?? 1;

  const [properties, total] = await Promise.all([
    getAllProperties(filters),
    getPropertiesCount(filters),
  ]);

  const baseUrl = getSiteUrl();
  const hasActiveFilters =
    Boolean(filters.status) ||
    Boolean(filters.type) ||
    Boolean(filters.q) ||
    Boolean(filters.city) ||
    Boolean(filters.special) ||
    filters.minPrice != null ||
    filters.maxPrice != null ||
    filters.bedrooms != null;

  return (
    <main className="min-h-screen bg-background">
      <JsonLd
        data={breadcrumbListJsonLd(baseUrl, [
          { name: "Home", url: "/" },
          { name: "Properties", url: "/properties" },
        ])}
      />
      <Suspense fallback={null}>
        <PropertiesPageHeader total={total} hasActiveFilters={hasActiveFilters} />
      </Suspense>

      <Suspense fallback={<PropertiesLoadingFallback />}>
        <PropertiesClient
          properties={properties}
          total={total}
          pageSize={PAGE_SIZE}
          currentPage={currentPage}
        />
      </Suspense>
    </main>
  );
};

export default PropertiesPage;

export async function generateMetadata({ searchParams }: Props) {
  const params = await searchParams;
  const flat = toFilterParams(params);

  const parts: string[] = [];
  if (flat.type) parts.push(String(flat.type).replace("_", " ").toLowerCase());
  if (flat.status)
    parts.push(String(flat.status).replace("_", " ").toLowerCase());
  if (flat.city) parts.push(`in ${flat.city}`);

  const title =
    parts.length > 0
      ? `${parts.join(" ")} properties | Amelia Lawsin`
      : "Properties | Amelia Lawsin Real Estate Agent Cebu";

  const description = `Browse ${flat.type ?? "all"} properties ${flat.city ? `in ${flat.city}` : "across Cebu"}. Licensed real estate agent Amelia Lawsin.`;
  const ogAlt = "Browse Cebu properties with Amelia Lawsin";

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: "/properties" },
    openGraph: {
      type: "website",
      title,
      description,
      url: "/properties",
      images: ogImageMetadata("/properties", ogAlt),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImageMetadata("/properties", ogAlt),
    },
  };
}
