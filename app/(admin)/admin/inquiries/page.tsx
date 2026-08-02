import PageHeader from "@/components/ui/PageHeader";
import { ITEMS_PER_PAGE } from "@/constants";
import { Suspense } from "react";
import { InquiryAdminStatusFilter } from "@/services/inquiry.admin.service";
import TableSkeleton from "./_components/TableSkeleton";
import FiltersBar from "./_components/FiltersBar";
import InquiriesSection from "./_components/InquiriesSection";

type SearchParams = {
  q?: string;
  status?: string;
  source?: string;
  from?: string;
  to?: string;
  page?: string;
};

type Props = {
  searchParams: Promise<SearchParams>;
};

const InquiriesPage = async ({ searchParams }: Props) => {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page ?? "1"));

  const filters = {
    q: params.q,
    status: (params.status as InquiryAdminStatusFilter) || "all",
    source: params.source,
    from: params.from,
    to: params.to,
    page,
  };

  return (
    <div className="flex flex-col gap-5">
      <PageHeader title="Inquiries" />

      <div className="flex flex-col gap-4">
        <FiltersBar filters={filters} />

        <Suspense fallback={<TableSkeleton />}>
          <InquiriesSection
            filters={filters}
            page={page}
            pageSize={ITEMS_PER_PAGE}
          />
        </Suspense>
      </div>
    </div>
  );
};

export default InquiriesPage;
