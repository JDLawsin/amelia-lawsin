"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/shadcn/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/shadcn/navigation-menu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/shadcn/sheet";
import { cn } from "@/lib/utils";
import Logo from "../ui/Logo";
import { useAuth } from "@/providers/AuthProvider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/shadcn/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/shadcn/avatar";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/properties", label: "Properties" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const HamburgerIcon = ({
  className,
  ...props
}: React.SVGAttributes<SVGElement>) => (
  <svg
    aria-label="Menu"
    className={cn("pointer-events-none", className)}
    fill="none"
    height={16}
    role="img"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
    width={16}
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      className="origin-center -translate-y-1.75 transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-315"
      d="M4 12L20 12"
    />
    <path
      className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45"
      d="M4 12H20"
    />
    <path
      className="origin-center translate-y-1.75 transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-135"
      d="M4 12H20"
    />
  </svg>
);

export const Navbar = () => {
  const pathname = usePathname();
  const { user, role } = useAuth();
  const router = useRouter();
  const supabase = getSupabaseBrowserClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const avatarUrl =
    user?.user_metadata?.avatar_url || user?.user_metadata?.picture || "";

  return (
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

        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList className="gap-1">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <NavigationMenuItem key={link.href}>
                  <Link
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
                </NavigationMenuItem>
              );
            })}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-3">
          <Button
            asChild
            className="hidden md:inline-flex h-10 px-5 bg-ink text-white hover:bg-ink/90"
          >
            <Link href="/contact">{"Get in touch"}</Link>
          </Button>

          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="rounded-full focus:outline-none">
                  <Avatar className="h-9 w-9">
                    <AvatarImage
                      src={avatarUrl}
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                    <AvatarFallback>
                      {user.user_metadata?.full_name?.[0] ||
                        user.email?.[0] ||
                        "U"}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-48">
                {role === "ADMIN" && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin">Dashboard</Link>
                  </DropdownMenuItem>
                )}

                <DropdownMenuItem
                  onSelect={handleLogout}
                  variant="destructive"
                  className="cursor-pointer"
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden group h-9 w-9"
              >
                <HamburgerIcon />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-6">
              <SheetHeader className="sr-only">
                <SheetTitle>Navigation Menu</SheetTitle>
                <SheetDescription>Mobile site navigation menu</SheetDescription>
              </SheetHeader>
              <SheetClose asChild>
                <Link href="/" className="mb-8 block">
                  <Logo />
                </Link>
              </SheetClose>
              <nav className="flex flex-col gap-1">
                {NAV_LINKS.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <SheetClose key={link.href} asChild>
                      <Link
                        href={link.href}
                        className={cn(
                          "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                          "hover:bg-cloud hover:text-ink",
                          isActive
                            ? "bg-cloud text-ink font-semibold"
                            : "text-ash",
                        )}
                      >
                        {link.label}
                      </Link>
                    </SheetClose>
                  );
                })}
              </nav>
              <div className="mt-6 pt-6 border-t border-wire">
                <SheetClose asChild>
                  <Button
                    asChild
                    className="w-full bg-ink text-white hover:bg-ink/90"
                  >
                    <Link href="/contact">{"Get in touch"}</Link>
                  </Button>
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export { HamburgerIcon };
export default Navbar;
