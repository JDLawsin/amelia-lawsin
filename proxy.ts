import { NextRequest } from "next/server";
import updateSession from "./lib/supabase/middleware";

export const proxy = async (request: NextRequest) => {
  return await updateSession(request);
};

export const config = {
  matcher: ["/login", "/admin/:path*"],
};
