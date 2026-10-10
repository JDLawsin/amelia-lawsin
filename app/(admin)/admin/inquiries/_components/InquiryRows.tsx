import clsx from "clsx";
import { Badge } from "@/components/ui/shadcn/badge";
import ClickableTableRow, {
  ClickableTableCell,
  TableRowActionsCell,
} from "@/components/ui/ClickableTableRow";
import {
  INQUIRY_STATUS_LABELS,
  INQUIRY_STATUS_VARIANTS,
} from "@/constants";
import { InquiryAdminListItem } from "@/services/inquiry.admin.service";
import { formatDate } from "@/lib/utils";
import RowActions from "./RowActions";

const InquiryRows = ({ inquiries }: { inquiries: InquiryAdminListItem[] }) => (
  <>
    {inquiries.map((inquiry) => {
      const status = inquiry.isArchived
        ? "archived"
        : inquiry.status;

      return (
        <ClickableTableRow
          key={inquiry.id}
          href={`/admin/inquiries/${inquiry.id}`}
          className={clsx(
            "hover:bg-cloud/40 transition-colors border-b border-wire/50 last:border-0",
            !inquiry.isRead && "bg-blue-50/50",
          )}
        >
          <ClickableTableCell className="py-3" primary>
            <div className="flex flex-col gap-0.5 min-w-0">
              <div className="flex items-center gap-2">
                <span
                  className={clsx(
                    "w-2 h-2 rounded-full shrink-0",
                    inquiry.isRead ? "bg-transparent" : "bg-blue-500",
                  )}
                  aria-hidden="true"
                />
                <p className="text-sm font-medium text-ink truncate">
                  {inquiry.name}
                </p>
              </div>
              <p className="text-xs text-ash truncate pl-4">{inquiry.email}</p>
              {inquiry.propertyTitle && (
                <p className="text-xs text-fog truncate pl-4">
                  {inquiry.propertyTitle}
                </p>
              )}
            </div>
          </ClickableTableCell>

          <ClickableTableCell className="hidden md:table-cell">
            <span className="text-xs text-ash">{inquiry.source}</span>
          </ClickableTableCell>

          <ClickableTableCell>
            <Badge variant={INQUIRY_STATUS_VARIANTS[status]}>
              {INQUIRY_STATUS_LABELS[status]}
            </Badge>
          </ClickableTableCell>

          <ClickableTableCell className="hidden lg:table-cell">
            <span className="text-xs text-ash">
              {formatDate(inquiry.createdAt)}
            </span>
          </ClickableTableCell>

          <TableRowActionsCell>
            <RowActions inquiry={inquiry} />
          </TableRowActionsCell>
        </ClickableTableRow>
      );
    })}
  </>
);

export default InquiryRows;
