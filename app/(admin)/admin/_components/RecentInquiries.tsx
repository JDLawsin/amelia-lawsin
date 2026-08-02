import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/shadcn/card";
import { Badge } from "@/components/ui/shadcn/badge";
import {
  INQUIRY_STATUS_LABELS,
  INQUIRY_STATUS_VARIANTS,
} from "@/constants";
import { DashboardRecentInquiry } from "@/services/dashboard.service";
import { formatDate } from "@/lib/utils";
import { ArrowRight, Inbox } from "lucide-react";

type Props = {
  inquiries: DashboardRecentInquiry[];
};

const RecentInquiries = ({ inquiries }: Props) => {
  return (
    <Card className="rounded-xl bg-white ring-1 ring-wire flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base font-medium text-ink">
          Recent Inquiries
        </CardTitle>
        <Link
          href="/admin/inquiries"
          className="text-xs font-medium text-ash hover:text-ink flex items-center gap-1 transition-colors"
        >
          View all
          <ArrowRight className="h-3 w-3" />
        </Link>
      </CardHeader>
      <CardContent className="flex-1">
        {inquiries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <Inbox className="h-8 w-8 text-ash/50 mb-2" />
            <p className="text-sm text-ash">No recent inquiries</p>
            <Link
              href="/admin/inquiries"
              className="text-xs text-ink hover:underline mt-1"
            >
              Go to inquiries
            </Link>
          </div>
        ) : (
          <ul className="flex flex-col divide-y divide-wire/50">
            {inquiries.map((inquiry) => (
              <li key={inquiry.id}>
                <Link
                  href={`/admin/inquiries/${inquiry.id}`}
                  className="group flex flex-col gap-1 py-3 -mx-4 px-4 hover:bg-cloud/50 transition-colors"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      {!inquiry.isRead && (
                        <span className="h-2 w-2 shrink-0 rounded-full bg-blue-500" />
                      )}
                      <span className="text-sm font-medium text-ink truncate">
                        {inquiry.name}
                      </span>
                    </div>
                    <Badge variant={INQUIRY_STATUS_VARIANTS[inquiry.status]}>
                      {INQUIRY_STATUS_LABELS[inquiry.status]}
                    </Badge>
                  </div>
                  <p className="text-xs text-ash truncate pl-4">
                    {inquiry.email}
                  </p>
                  {inquiry.propertyTitle && (
                    <p className="text-xs text-fog truncate pl-4">
                      {inquiry.propertyTitle}
                    </p>
                  )}
                  <p className="text-xs text-ash/70 pl-4">
                    {formatDate(inquiry.createdAt)}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentInquiries;
