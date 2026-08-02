import DataTable, { DataTableColumn } from "@/components/ui/DataTable";
import {
  InquiryAdminListItem,
  InquiryAdminFilters,
} from "@/services/inquiry.admin.service";
import InquiryRows from "./InquiryRows";

const COLUMNS: DataTableColumn[] = [
  { key: "inquiry", label: "Inquiry", className: "w-[45%]" },
  { key: "source", label: "Source", className: "hidden md:table-cell" },
  { key: "status", label: "Status" },
  { key: "received", label: "Received", className: "hidden lg:table-cell" },
  { key: "actions", label: "Actions", className: "text-right" },
];

type Props = {
  inquiries: InquiryAdminListItem[];
  total: number;
  page: number;
  pageSize: number;
  filters: InquiryAdminFilters;
};

const Inquiries = ({ inquiries, total, page, pageSize }: Props) => (
  <>
    <DataTable
      columns={COLUMNS}
      isEmpty={inquiries.length === 0}
      page={page}
      pageSize={pageSize}
      total={total}
      paginationLabel="inquiries"
    >
      <InquiryRows inquiries={inquiries} />
    </DataTable>
  </>
);

export default Inquiries;
