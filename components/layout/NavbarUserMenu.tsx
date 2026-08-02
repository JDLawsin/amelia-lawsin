"use client";

import Link from "next/link";
import { User } from "@supabase/supabase-js";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/shadcn/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/shadcn/avatar";
import { Role } from "@/app/generated/prisma/enums";
import { Nullable } from "@/types";

type Props = {
  user: User;
  role: Nullable<Role>;
  onLogout: () => void;
};

const NavbarUserMenu = ({ user, role, onLogout }: Props) => {
  const avatarUrl =
    user.user_metadata?.avatar_url || user.user_metadata?.picture || "";
  const displayName =
    user.user_metadata?.full_name || user.email?.split("@")[0] || "Account";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={`Account menu for ${displayName}`}
          className="rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2"
        >
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
          onSelect={onLogout}
          variant="destructive"
          className="cursor-pointer"
        >
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NavbarUserMenu;
