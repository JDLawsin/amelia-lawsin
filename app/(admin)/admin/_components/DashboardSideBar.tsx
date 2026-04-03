"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/ui/Logo";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/shadcn/sidebar";
import {
  LayoutDashboardIcon,
  Mail,
  PenTool,
  Settings,
  House,
} from "lucide-react";
import clsx from "clsx";
import UserFooter from "./UserFooter";
import { User } from "@supabase/supabase-js";
import { Nullable } from "@/types";

const SIDE_BAR = [
  {
    groupName: "Main",
    menus: [
      {
        title: "Dashboard",
        url: "/admin/dashboard",
        icon: LayoutDashboardIcon,
      },
    ],
  },
  {
    groupName: "Content",
    menus: [
      { title: "Properties", url: "/admin/properties", icon: House },
      { title: "Blog", url: "/admin/blogs", icon: PenTool },
    ],
  },
  {
    groupName: "Inbox",
    menus: [{ title: "Inquiries", url: "/admin/inquiries", icon: Mail }],
  },
  {
    groupName: "System",
    menus: [{ title: "Settings", url: "/admin/settings", icon: Settings }],
  },
];

const DashboardSidebar = () => {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" className="bg-ink border-r border-white/8">
      <SidebarHeader className="bg-ink border-b border-white/8 py-3 px-3">
        <div className="flex items-center justify-between gap-2">
          <div className="group-data-[collapsible=icon]:hidden">
            <Logo variant="dark" />
          </div>
          <SidebarTrigger className="hidden lg:flex text-white/40 hover:text-white hover:bg-white/10 rounded-lg h-8 w-8 items-center justify-center shrink-0" />
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-ink pt-2">
        {SIDE_BAR.map((group) => (
          <SidebarGroup key={group.groupName}>
            <SidebarGroupLabel className="text-white/30 text-[10px] tracking-widest uppercase px-3">
              {group.groupName}
            </SidebarGroupLabel>

            <SidebarGroupContent>
              <SidebarMenu>
                {group.menus.map((menu) => {
                  const isActive =
                    menu.url === "/admin/dashboard"
                      ? pathname === menu.url
                      : pathname.startsWith(menu.url);

                  return (
                    <SidebarMenuItem key={menu.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        tooltip={menu.title}
                        className={clsx(
                          "rounded-lg mx-1 transition-colors",
                          isActive
                            ? "bg-white/10 text-white hover:bg-white/15 hover:text-white"
                            : "text-white/50 hover:bg-white/8 hover:text-white",
                        )}
                      >
                        <Link href={menu.url}>
                          <menu.icon className="shrink-0" />
                          <span>{menu.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="bg-ink border-t border-white/8">
        <UserFooter />
      </SidebarFooter>
    </Sidebar>
  );
};

export default DashboardSidebar;
