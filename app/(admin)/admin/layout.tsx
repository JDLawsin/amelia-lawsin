import type { ReactNode } from "react";
import DashboardSidebar from "./_components/DashboardSideBar";
import { SidebarProvider } from "@/components/ui/shadcn/sidebar";
import { TooltipProvider } from "@/components/ui/shadcn/tooltip";
import TopBar from "./_components/Topbar";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getUser } from "@/services/auth.service";
import AuthProvider from "@/providers/AuthProvider";

type Props = {
  children: ReactNode;
};

const AdminLayout = async ({ children }: Props) => {
  const user = await getUser();

  return (
    <AuthProvider initialUser={user}>
      <TooltipProvider delayDuration={0}>
        <SidebarProvider>
          <div className="flex min-h-screen w-full">
            <DashboardSidebar />
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
