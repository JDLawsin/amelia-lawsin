import { createSupabaseServerClient } from "@/lib/supabase/server";
import { log } from "@/lib/logger";
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

  // Redirect to the intended path or fallback to homepage
  return NextResponse.redirect(`${origin}/admin${next}`);
};
