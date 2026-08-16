import { NextRequest, NextResponse } from "next/server";
import updateSession from "./lib/supabase/middleware";

const PUBLIC_POST_MAX_BYTES = 256 * 1024;

export const proxy = async (request: NextRequest) => {
  const pathname = request.nextUrl.pathname;
  const isAdminRoute = pathname.startsWith("/admin");

  if (request.method === "POST" && !isAdminRoute) {
    const contentLength = Number(request.headers.get("content-length") ?? 0);
    if (contentLength > PUBLIC_POST_MAX_BYTES) {
      return new NextResponse("Payload Too Large", { status: 413 });
    }
  }

  const isAuthRoute = pathname.startsWith("/login");
  if (isAdminRoute || isAuthRoute) {
    return await updateSession(request);
  }

  return NextResponse.next();
};

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
