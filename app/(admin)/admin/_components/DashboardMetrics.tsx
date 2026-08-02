import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/shadcn/card";
import { DashboardMetrics as DashboardMetricsType } from "@/services/dashboard.service";
import { Home, Mail, Star, CheckCircle2 } from "lucide-react";

type Props = {
  metrics: DashboardMetricsType;
};

const DashboardMetrics = ({ metrics }: Props) => {
  const items = [
    {
      label: "Active Listings",
      value: metrics.activeListings,
      icon: Home,
      iconClass: "bg-ink text-white",
    },
    {
      label: "Total Inquiries",
      value: metrics.totalInquiries,
      icon: Mail,
      iconClass: "bg-blue-600 text-white",
    },
    {
      label: "Featured Properties",
      value: metrics.featuredProperties,
      icon: Star,
      iconClass: "bg-amber-500 text-white",
    },
    {
      label: "Sold / Rented",
      value: metrics.recentlySoldOrRented,
      icon: CheckCircle2,
      iconClass: "bg-emerald-600 text-white",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((item) => (
        <Card key={item.label} className="rounded-xl bg-white ring-1 ring-wire">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-ash">
              {item.label}
            </CardTitle>
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-lg ${item.iconClass}`}
            >
              <item.icon className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-ink">{item.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DashboardMetrics;
