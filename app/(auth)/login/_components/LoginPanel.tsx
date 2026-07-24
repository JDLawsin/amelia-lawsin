"use client";

import { GoogleButton } from "@/components/ui/GoogleButton";
import { useSearchParams } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { Nullable } from "@/types";
import { User } from "@supabase/supabase-js";
import { useState } from "react";

type Props = {
  user: Nullable<User>;
};

const LoginPanel = ({ user }: Props) => {
  const [googleLoading, setGoogleLoading] = useState(false);
  const searchParams = useSearchParams();
  const supabase = getSupabaseBrowserClient();
  const next = searchParams.get("next");

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);

    try {
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/api/auth/callback${
            next ? `?next=${encodeURIComponent(next)}` : ""
          }`,
        },
      });
    } catch (error) {
      console.error("Error loging in with Google:", error);
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center px-8 py-12 lg:px-12">
      <h1 className="text-2xl font-serif font-medium text-ink tracking-tight mb-1">
        Welcome back
      </h1>
      <p className="text-sm text-ash mb-7">
        Sign in to your account to continue
      </p>

      {!user && (
        <GoogleButton onClick={handleGoogleLogin} loading={googleLoading} />
      )}
    </div>
  );
};

export default LoginPanel;
