import { createSupabaseServerClient } from "@/lib/supabase/server";
import { log } from "@/lib/logger";
import { sanitizeNextPath } from "@/lib/utils";
import { getRole } from "@/services/profile.service";
import { Role } from "@/app/generated/prisma/browser";
import { NextResponse } from "next/server";

export const GET = async (request: Request) => {
  const { searchParams, origin } = new URL(request.url);

  // Extract auth code and optional redirect path
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (!code) {
    log.warn("OAuth callback received without a code");

    return NextResponse.redirect(
      `${origin}/auth/auth-code-error${
        next ? `?next=${encodeURIComponent(next)}` : ""
      }`,
    );
  }

  const supabase = await createSupabaseServerClient();

  // Exchange the auth code for a session
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    log.withError(error).error("OAuth code exchange failed");

    return NextResponse.redirect(
      `${origin}/auth/auth-code-error${
        next ? `?next=${encodeURIComponent(next)}` : ""
      }`,
    );
  }

  // Determine the user's role so we can redirect safely
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const profile = user ? await getRole(user.id) : null;
  const isAdmin = profile?.role === Role.ADMIN;

  const safeNext = sanitizeNextPath(next);
  const baseUrl = `${origin}${safeNext}`;

  if (isAdmin) {
    return NextResponse.redirect(safeNext === "/" ? `${origin}/admin` : baseUrl);
  }

  return NextResponse.redirect(
    safeNext.startsWith("/admin") ? `${origin}/` : baseUrl,
  );
};
