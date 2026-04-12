import { getUser } from "@/services/auth.service";
import { getRole } from "@/services/profile.service";
import { redirect } from "next/navigation";

type ServerAction<TArgs extends unknown[], TReturn> = (
  ...args: TArgs
) => Promise<TReturn>;
export const withAdminAuth =
  <TArgs extends unknown[], TReturn>(
    action: ServerAction<TArgs, TReturn>,
  ): ServerAction<TArgs, TReturn> =>
  async (...args: TArgs): Promise<TReturn> => {
    const authUser = await getUser();
    const profile = authUser ? await getRole(authUser.id) : null;

    if (!profile || !authUser) {
      console.error("Unauthorized access attempt to admin action");
      redirect("/login");
    }

    if (profile.role !== "ADMIN") {
      console.error("Non-admin user attempted to access admin action");
      redirect("/");
    }

    return action(...args);
  };
