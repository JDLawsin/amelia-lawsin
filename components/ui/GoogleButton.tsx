"use client";

import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./shadcn/button";

interface Props {
  onClick: () => void;
  loading?: boolean;
  className?: string;
}

const GoogleIcon = () => {
  return (
    <svg className="h-5 w-5" viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.73 1.22 9.24 3.61l6.88-6.88C35.89 2.36 30.37 0 24 0 14.64 0 6.56 5.48 2.64 13.44l8 6.21C12.67 13.1 17.84 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.1 24.55c0-1.64-.15-3.21-.42-4.73H24v9h12.4c-.54 2.91-2.2 5.37-4.7 7.04l7.3 5.67C43.95 37.27 46.1 31.43 46.1 24.55z"
      />
      <path
        fill="#FBBC05"
        d="M10.64 28.65a14.5 14.5 0 010-9.3l-8-6.21A23.93 23.93 0 000 24c0 3.87.93 7.52 2.64 10.56l8-6.21z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.92-2.14 15.89-5.82l-7.3-5.67c-2.03 1.36-4.63 2.16-8.59 2.16-6.16 0-11.33-3.6-13.36-8.65l-8 6.21C6.56 42.52 14.64 48 24 48z"
      />
    </svg>
  );
};

export const GoogleButton = ({
  onClick,
  loading = false,
  className,
}: Props) => {
  return (
    <Button
      type="button"
      variant="outline"
      onClick={onClick}
      disabled={loading}
      className={cn(
        "w-full h-11 px-4 flex items-center justify-center gap-3",
        "rounded-xl border border-input bg-white text-foreground",
        "hover:bg-muted transition-all duration-200",
        "shadow-apple-sm hover:shadow-apple-hover",
        "active:scale-[0.98]",
        "disabled:opacity-70 disabled:pointer-events-none",
        className,
      )}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <GoogleIcon />}

      <span className="text-sm font-medium">
        {loading ? "Signing in..." : "Continue with Google"}
      </span>
    </Button>
  );
};
