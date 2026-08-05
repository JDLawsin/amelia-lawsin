import PageHeader from "@/components/ui/PageHeader";
import { ITEMS_PER_PAGE } from "@/constants";
import { Suspense } from "react";
import TableSkeleton from "./_components/TableSkeleton";
import FiltersBar from "./_components/FiltersBar";
import PropertiesSection from "./_components/PropertiesSection";
import { PropertyStatus, PropertyType } from "@/app/generated/prisma/browser";
import { PropertyAdminVisibilityFilter } from "@/services/property.admin.service";

type SearchParams = {
  q?: string;
  status?: string;
  type?: string;
  visibility?: string;
  page?: string;
};

type Props = {
  searchParams: Promise<SearchParams>;
};

const PropertiesPage = async ({ searchParams }: Props) => {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page ?? "1"));
  const visibility = params.visibility as
    | PropertyAdminVisibilityFilter
    | undefined;

  const filters = {
    q: params.q,
    status: params.status as PropertyStatus | undefined,
    type: params.type as PropertyType | undefined,
    visibility: visibility ?? "all",
    page,
  };

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="Properties"
        actionLabel="New property"
        actionHref="/admin/properties/new"
      />

      <div className="flex flex-col gap-4">
        <FiltersBar filters={filters} />

        <Suspense fallback={<TableSkeleton />}>
          <PropertiesSection
            filters={filters}
            page={page}
            pageSize={ITEMS_PER_PAGE}
          />
        </Suspense>
      </div>
    </div>
  );
};

export default PropertiesPage;
