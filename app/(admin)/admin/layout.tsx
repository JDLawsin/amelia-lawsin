import type { ReactNode } from "react";
import DashboardSidebar from "./_components/DashboardSideBar";
import { SidebarProvider } from "@/components/ui/shadcn/sidebar";
import { TooltipProvider } from "@/components/ui/shadcn/tooltip";
import TopBar from "./_components/Topbar";
import { getUser } from "@/services/auth.service";
import AuthProvider from "@/providers/AuthProvider";
import { getRole } from "@/services/profile.service";
import { getUnreadInquiryCount } from "@/services/inquiry.admin.service";

type Props = {
  children: ReactNode;
};

const AdminLayout = async ({ children }: Props) => {
  const user = await getUser();
  const profile = user ? await getRole(user.id) : null;
  const unreadInquiryCount = await getUnreadInquiryCount();

  return (
    <AuthProvider initialUser={user} userRole={profile?.role || null}>
      <TooltipProvider delayDuration={0}>
        <SidebarProvider>
          <div className="flex min-h-screen w-full">
            <DashboardSidebar unreadInquiryCount={unreadInquiryCount} />
            <div className="flex flex-col flex-1 min-w-0">
              <TopBar />
              <main className="flex-1 bg-cloud p-5">{children}</main>
            </div>
          </div>
        </SidebarProvider>
      </TooltipProvider>
    </AuthProvider>
  );
};

export default AdminLayout;
