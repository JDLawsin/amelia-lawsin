import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { getEnvironmentVariables } from "../utils";
import { getRole } from "@/services/profile.service";
import { Role } from "@/app/generated/prisma/browser";

export default async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const { supabaseUrl, supabaseAnonKey } = getEnvironmentVariables();

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (cookiesToSet) => {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        // Re-create the response with updated cookies
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const profile = user ? await getRole(user.id) : null;
  const userRole = profile?.role;
  const pathname = request.nextUrl.pathname;
  const isAdminRoute = pathname.startsWith("/admin");
  const isAdmin = userRole === Role.ADMIN;
  const isAuthRoute = pathname.startsWith("/login");

  if (isAdminRoute) {
    if (!user) return NextResponse.redirect(new URL("/login", request.url));
    if (!isAdmin) return NextResponse.redirect(new URL("/", request.url));
  }

  if (isAuthRoute && user) {
    const destination = isAdmin ? "/admin" : "/";
    return NextResponse.redirect(new URL(destination, request.url));
  }

  return supabaseResponse;
}
