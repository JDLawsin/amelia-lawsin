"use client";

import { SidebarTrigger } from "@/components/ui/shadcn/sidebar";
import { usePathname } from "next/navigation";

// Map routes to readable page titles
const PAGE_TITLES: Record<string, string> = {
  "/admin/dashboard": "Dashboard",
  "/admin/properties": "Properties",
  "/admin/blogs": "Blog",
  "/admin/inquiries": "Inquiries",
  "/admin/settings": "Settings",
};

const getPageTitle = (pathname: string): string => {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];

  const match = Object.keys(PAGE_TITLES).find((key) =>
    pathname.startsWith(key),
  );
  return match ? PAGE_TITLES[match] : "Admin";
};

const TopBar = () => {
  const pathname = usePathname();
  const title = getPageTitle(pathname);

  return (
    <header className="h-14 bg-white border-b border-wire flex items-center px-4 gap-3 sticky top-0 z-10">
      <SidebarTrigger className="lg:hidden text-ash hover:text-ink hover:bg-cloud rounded-lg transition-colors h-8 w-8 flex items-center justify-center shrink-0" />

      <h1 className="text-sm font-medium text-ink">{title}</h1>
    </header>
  );
};

export default TopBar;
