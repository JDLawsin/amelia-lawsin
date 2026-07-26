import PageHeader from "@/components/ui/PageHeader";
import {
  getDashboardMetrics,
  getRecentInquiries,
  getRecentProperties,
} from "@/services/dashboard.service";
import DashboardMetrics from "./_components/DashboardMetrics";
import QuickActions from "./_components/QuickActions";
import RecentInquiries from "./_components/RecentInquiries";
import RecentProperties from "./_components/RecentProperties";

const AdminDashboardPage = async () => {
  const [metrics, recentInquiries, recentProperties] = await Promise.all([
    getDashboardMetrics(),
    getRecentInquiries(),
    getRecentProperties(),
  ]);

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="Dashboard"
        actionLabel="Add property"
        actionHref="/admin/properties/new"
      />

      <QuickActions />

      <DashboardMetrics metrics={metrics} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <RecentInquiries inquiries={recentInquiries} />
        <RecentProperties properties={recentProperties} />
      </div>
    </div>
  );
};

export default AdminDashboardPage;
