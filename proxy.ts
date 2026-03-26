import { createSupabaseServerClient } from "@/lib/supabase-auth-server-client";
import { NextRequest, NextResponse } from "next/server";
import { getRole } from "./services/profile.service";
import { Role } from "./app/generated/prisma/enums";

export const proxy = async (request: NextRequest) => {
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const pathname = request.nextUrl.pathname;

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const profile = user ? await getRole(user.id) : null;
  const userRole = profile?.role;

  // Only ADMIN can access /admin and all its sub-pages
  if (pathname.startsWith("/admin")) {
    if (!user || userRole !== Role.ADMIN) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  if (pathname.startsWith("/login")) {
    if (user && userRole == Role.ADMIN) {
      return NextResponse.redirect(new URL("/admin", request.url));
    } else {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return response;
};
