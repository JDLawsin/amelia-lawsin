"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/shadcn/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/shadcn/sheet";
import { cn } from "@/lib/utils";
import Logo from "../ui/Logo";

type NavLink = { href: string; label: string };

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  links: NavLink[];
};

const NavbarMobileMenu = ({ open, onOpenChange, links }: Props) => {
  const pathname = usePathname();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
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
        <nav className="flex flex-col gap-1" aria-label="Main">
          {links.map((link) => {
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
  );
};

export default NavbarMobileMenu;
