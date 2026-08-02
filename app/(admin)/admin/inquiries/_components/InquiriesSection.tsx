import {
  getAdminInquiries,
  getAdminInquiriesCount,
  type InquiryAdminFilters,
} from "@/services/inquiry.admin.service";
import Inquiries from "./Inquiries";

type Props = {
  filters: InquiryAdminFilters;
  page: number;
  pageSize: number;
};

const InquiriesSection = async ({ filters, page, pageSize }: Props) => {
  const [inquiries, total] = await Promise.all([
    getAdminInquiries(filters),
    getAdminInquiriesCount(filters),
  ]);

  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs text-ash">
        {total} inquiry{total !== 1 ? "ies" : "y"} total
      </p>

      <Inquiries
        inquiries={inquiries}
        total={total}
        page={page}
        pageSize={pageSize}
        filters={filters}
      />
    </div>
  );
};

export default InquiriesSection;
