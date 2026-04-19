"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/shadcn/avatar";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/shadcn/sidebar";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { useAuth } from "@/providers/AuthProvider";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

const UserFooter = () => {
  const { state } = useSidebar();
  const { user, role, isLoading } = useAuth();

  const router = useRouter();
  const supabase = getSupabaseBrowserClient();
  const isExpanded = state === "expanded";

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const avatarUrl =
    user?.user_metadata?.avatar_url || user?.user_metadata?.picture || "";

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          className="h-auto py-2 text-white/50 hover:bg-white/6 hover:text-white rounded-lg mx-1"
          tooltip="Account"
        >
          <Avatar className="h-6 w-6 shrink-0">
            {isLoading ? (
              <div className="h-full w-full animate-pulse rounded-full bg-white/20" />
            ) : (
              <>
                <AvatarImage
                  src={avatarUrl}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
                <AvatarFallback className="bg-white/15 text-white text-[10px]">
                  {user?.user_metadata?.full_name?.[0] ||
                    user?.email?.[0] ||
                    "U"}
                </AvatarFallback>
              </>
            )}
          </Avatar>

          {isExpanded && (
            <div className="flex flex-col leading-tight min-w-0">
              {isLoading ? (
                <>
                  <div className="h-3 w-24 bg-white/20 animate-pulse rounded mb-1" />
                  <div className="h-2 w-12 bg-white/10 animate-pulse rounded" />
                </>
              ) : (
                <>
                  <span className="text-xs font-medium text-white truncate">
                    {user?.user_metadata?.full_name || user?.email}
                  </span>
                  <span className="text-[10px] text-white/40">
                    {role === "ADMIN" ? "Admin" : "Client"}
                  </span>
                </>
              )}
            </div>
          )}
        </SidebarMenuButton>
      </SidebarMenuItem>

      <SidebarMenuItem>
        <SidebarMenuButton
          onClick={handleLogout}
          tooltip="Sign out"
          className="text-white/40 hover:text-red-400 hover:bg-red-400/10 rounded-lg mx-1 transition-colors"
        >
          <LogOut className="shrink-0" />
          {isExpanded && <span className="text-xs">Sign out</span>}
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

export default UserFooter;
