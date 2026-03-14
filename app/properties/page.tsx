import PropertiesClient from "@/components/ui/properties/PropertiesClient";
import PropertiesLoadingFallback from "@/components/ui/properties/PropertiesLoadingFallback";
import {
  getAllProperties,
  getPropertiesCount,
  PropertyFilters,
} from "@/services/property.service";
import { Suspense } from "react";

const PAGE_SIZE = 9;

type SearchParams = PropertyFilters;
type Props = {
  searchParams: Promise<SearchParams>;
};

const PropertiesPage = async ({ searchParams }: Props) => {
  const params = await searchParams;
  const currentPage = Math.max(1, Number(params.page ?? "1"));
  const filters = {
    q: params.q,
    status: params.status,
    type: params.type,
    city: params.city,
    minPrice: params.minPrice ? Number(params.minPrice) : undefined,
    maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined,
    bedrooms:
      params.bedrooms !== undefined ? Number(params.bedrooms) : undefined,
    special: params.special,
    sort: params.sort ?? "newest",
    page: currentPage,
    pageSize: PAGE_SIZE,
  };

  const [properties, total] = await Promise.all([
    getAllProperties(filters),
    getPropertiesCount(filters),
  ]);

  return (
    <main className="min-h-screen bg-background">
      <div className="bg-brand-green-subtle border-b border-brand-green-muted px-6 py-5">
        <p className="text-xs text-brand-green-light mb-1">
          {"Home"} <span className="mx-1 opacity-50">/</span> {"Properties"}
        </p>
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-2xl font-serif font-semibold text-brand-green leading-tight">
              {"All Properties"}
            </h1>
            <p className="text-sm text-brand-green-light mt-0.5">
              {"Explore listings across Cebu — condos, houses, lots & more"}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-serif font-medium text-brand-gold">
              {total}
            </p>
            <p className="text-xs text-brand-green-light">
              {filters.status || filters.type || filters.q
                ? "matching results"
                : "active listings"}
            </p>
          </div>
        </div>
      </div>

      <Suspense fallback={<PropertiesLoadingFallback />}>
        <PropertiesClient
          properties={properties}
          total={total}
          pageSize={PAGE_SIZE}
        />
      </Suspense>
    </main>
  );
};

export default PropertiesPage;

export async function generateMetadata({ searchParams }: Props) {
  const params = await searchParams;

  const parts: string[] = [];
  if (params.type) parts.push(params.type.replace("_", " ").toLowerCase());
  if (params.status) parts.push(params.status.replace("_", " ").toLowerCase());
  if (params.city) parts.push(`in ${params.city}`);

  const title =
    parts.length > 0
      ? `${parts.join(" ")} properties | Amelia Lawsin`
      : "Properties | Amelia Lawsin Real Estate Cebu";

  return {
    title,
    description: `Browse ${params.type ?? "all"} properties ${params.city ? `in ${params.city}` : "across Cebu"}. Licensed real estate broker Amelia Lawsin.`,
  };
}
