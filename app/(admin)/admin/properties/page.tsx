import {
  getAdminProperties,
  getAdminPropertiesCount,
} from "@/services/property.admin.service";
import PageHeader from "@/components/ui/PageHeader";
import { ITEMS_PER_PAGE } from "@/constants";
import Properties from "./_components/Properties";
import { Suspense } from "react";
import TableSkeleton from "./_components/TableSkeleton";
import FiltersBar from "./_components/FiltersBar";
import { PropertyStatus, PropertyType } from "@/app/generated/prisma/browser";

type SearchParams = {
  q?: string;
  status?: string;
  type?: string;
  page?: string;
};

type Props = {
  searchParams: Promise<SearchParams>;
};

const PropertiesPage = async ({ searchParams }: Props) => {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page ?? "1"));

  const filters = {
    q: params.q,
    status: params.status as PropertyStatus | undefined,
    type: params.type as PropertyType | undefined,
    page,
  };

  const [properties, total] = await Promise.all([
    getAdminProperties(filters),
    getAdminPropertiesCount(filters),
  ]);

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="Properties"
        subtitle={`${total} listing${total !== 1 ? "s" : ""} total`}
        actionLabel="New property"
        actionHref="/admin/properties/new"
      />

      <div className="flex flex-col gap-4">
        <FiltersBar filters={filters} />

        <Suspense fallback={<TableSkeleton />}>
          <Properties
            properties={properties}
            total={total}
            page={page}
            pageSize={ITEMS_PER_PAGE}
            filters={filters}
          />
        </Suspense>
      </div>
    </div>
  );
};

export default PropertiesPage;
