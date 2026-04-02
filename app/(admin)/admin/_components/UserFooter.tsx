"use client";

import { Avatar, AvatarFallback } from "@/components/ui/shadcn/avatar";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/shadcn/sidebar";
import { getSupabaseBrowserClient } from "@/lib/supabase-auth-browser-client";
import { Nullable } from "@/types";
import { User } from "@supabase/supabase-js";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

type Props = {
  user: Nullable<User>;
};

const UserFooter = ({ user }: Props) => {
  const { state } = useSidebar();
  const supabase = getSupabaseBrowserClient();
  const router = useRouter();
  const isExpanded = state === "expanded";

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          className="h-auto py-2 text-white/50 hover:bg-white/6 hover:text-white rounded-lg mx-1"
          tooltip="Account"
        >
          <Avatar className="h-6 w-6 shrink-0">
            <AvatarFallback className="bg-white/15 text-white text-[10px]">
              AL
            </AvatarFallback>
          </Avatar>
          {isExpanded && (
            <div className="flex flex-col leading-tight min-w-0">
              <span className="text-xs font-medium text-white truncate">
                {user?.email}
              </span>
              <span className="text-[10px] text-white/40">Admin</span>
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
