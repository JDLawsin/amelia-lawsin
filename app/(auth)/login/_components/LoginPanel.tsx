"use client";

import { GoogleButton } from "@/components/ui/GoogleButton";
import { ErrorState, Nullable } from "@/types";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FormEvent, useActionState, useState } from "react";
import { FormInput } from "@/components/ui/FormInput";
import { Login, LoginSchema } from "../_schema/login.schema";
import { login } from "../_actions/login.actions";

const LoginPanel = () => {
  const [googleLoading, setGoogleLoading] = useState(false);
  const searchParams = useSearchParams();
  const justReset = searchParams.get("reset") === "success";
  const [state, formAction, isPending] = useActionState(login, null);

  return (
    <div className="flex flex-col justify-center px-8 py-12 lg:px-12">
      <h1 className="text-2xl font-serif font-medium text-ink tracking-tight mb-1">
        Welcome back
      </h1>
      <p className="text-sm text-ash mb-7">
        Sign in to your account to continue
      </p>

      {justReset && (
        <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-5">
          <p className="text-xs text-green-700">
            Password updated — sign in below.
          </p>
        </div>
      )}

      <GoogleButton onClick={() => {}} loading={googleLoading} />

      <div className="flex items-center gap-3 my-5">
        <div className="flex-1 h-px bg-wire" />
        <span className="text-xs text-fog">or</span>
        <div className="flex-1 h-px bg-wire" />
      </div>

      <form action={formAction} className="flex flex-col gap-4">
        <FormInput
          id="email"
          name="email"
          label="Email address"
          type="email"
          placeholder="you@email.com"
          autoComplete="email"
          required
          errors={state?.errors?.email}
        />

        <FormInput
          id="password"
          name="password"
          label="Password"
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
          required
          errors={state?.errors?.password}
          rightSlot={
            <Link
              href="/forgot-password"
              className="text-xs text-ink hover:text-ash"
            >
              Forgot password?
            </Link>
          }
        />
        <button
          type="submit"
          disabled={isPending}
          className="w-full h-10 bg-ink text-white text-sm font-medium rounded-xl hover:bg-ink/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mt-1"
        >
          {isPending ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <p className="text-sm text-ash text-center mt-6">
        {"Don't have an account?"}{" "}
        <Link
          href="/register"
          className="text-ink font-medium underline underline-offset-2 hover:text-ash transition-colors"
        >
          Create one
        </Link>
      </p>
    </div>
  );
};

export default LoginPanel;
