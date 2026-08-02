import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/shadcn/card";
import { Badge } from "@/components/ui/shadcn/badge";
import {
  STATUS_LABELS,
  STATUS_VARIANT,
  TYPE_LABELS,
} from "@/constants";
import { DashboardRecentProperty } from "@/services/dashboard.service";
import { formatDate } from "@/lib/utils";
import { ArrowRight, Building2 } from "lucide-react";

type Props = {
  properties: DashboardRecentProperty[];
};

const RecentProperties = ({ properties }: Props) => {
  return (
    <Card className="rounded-xl bg-white ring-1 ring-wire flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base font-medium text-ink">
          Recent Property Activity
        </CardTitle>
        <Link
          href="/admin/properties"
          className="text-xs font-medium text-ash hover:text-ink flex items-center gap-1 transition-colors"
        >
          View all
          <ArrowRight className="h-3 w-3" />
        </Link>
      </CardHeader>
      <CardContent className="flex-1">
        {properties.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <Building2 className="h-8 w-8 text-ash/50 mb-2" />
            <p className="text-sm text-ash">No recent properties</p>
            <Link
              href="/admin/properties/new"
              className="text-xs text-ink hover:underline mt-1"
            >
              Add a property
            </Link>
          </div>
        ) : (
          <ul className="flex flex-col divide-y divide-wire/50">
            {properties.map((property) => {
              const imageUrl = property.images[0]?.url;

              return (
                <li key={property.id}>
                  <Link
                    href={`/admin/properties/${property.slug}/update`}
                    className="group flex items-start gap-3 py-3 -mx-4 px-4 hover:bg-cloud/50 transition-colors"
                  >
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-cloud">
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={property.title}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-ash/50">
                          <Building2 className="h-5 w-5" />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-1 min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-medium text-ink truncate">
                          {property.title}
                        </span>
                        <Badge variant={STATUS_VARIANT[property.status]}>
                          {STATUS_LABELS[property.status]}
                        </Badge>
                      </div>
                      <p className="text-xs text-ash truncate">
                        {TYPE_LABELS[property.type] ?? property.type} ·{" "}
                        {formatDate(property.createdAt)}
                      </p>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentProperties;
