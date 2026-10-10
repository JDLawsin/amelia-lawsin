"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/shadcn/button";
import { Sheet, SheetTrigger } from "@/components/ui/shadcn/sheet";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import Logo from "../ui/Logo";
import { useAuth } from "@/providers/AuthProvider";
import MobileToolsButtons from "@/components/tools/MobileToolsButtons";
import NavbarMobileMenu from "@/components/layout/NavbarMobileMenu";

const NavbarUserMenu = dynamic(
  () => import("@/components/layout/NavbarUserMenu"),
  { ssr: false },
);

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/properties", label: "Properties" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export const Navbar = () => {
  const pathname = usePathname();
  const { user, role } = useAuth();
  const router = useRouter();
  const supabase = getSupabaseBrowserClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <Sheet>
      <header
        className={cn(
          "sticky top-0 z-50 w-full",
          "border-b border-wire",
          "bg-white/95 backdrop-blur supports-backdrop-filter:bg-white/60",
          "px-6 2xl:px-0",
          "shadow-apple-sm",
        )}
      >
        <div className="container flex h-20 max-w-7xl mx-auto items-center justify-between gap-8">
          <Link href="/" className="flex items-center shrink-0">
            <Logo />
          </Link>

          <nav
            className="hidden md:flex items-center gap-1"
            aria-label="Main navigation"
          >
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "inline-flex h-9 items-center px-4 py-2 rounded-md",
                    "text-sm font-medium transition-colors",
                    "hover:bg-cloud hover:text-ink",
                    isActive ? "text-ink font-semibold" : "text-ash",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-1 sm:gap-3">
            <MobileToolsButtons />

            <Button
              asChild
              className="hidden md:inline-flex h-10 px-5 bg-ink text-white hover:bg-ink/90"
            >
              <Link href="/contact">{"Get in touch"}</Link>
            </Button>

            {user && (
              <NavbarUserMenu user={user} role={role} onLogout={handleLogout} />
            )}

            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden h-9 w-9"
                aria-label="Open navigation menu"
                onPointerDown={(event) => {
                  event.currentTarget.blur();
                }}
              >
                <Menu className="size-4" aria-hidden="true" />
              </Button>
            </SheetTrigger>
          </div>
        </div>
      </header>
      <NavbarMobileMenu links={NAV_LINKS} />
    </Sheet>
  );
};

export default Navbar;
