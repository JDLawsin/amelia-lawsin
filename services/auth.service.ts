import { createSupabaseServerClient } from "@/lib/supabase-auth-server-client";
import { User } from "@supabase/supabase-js";

export const getUser = async (): Promise<User | null> => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    return null;
  }

  return data.user;
};
