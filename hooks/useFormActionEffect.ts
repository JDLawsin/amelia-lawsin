import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Nullable } from "@/types";
import toast from "react-hot-toast";

type BaseFormState = {
  success: boolean;
  message?: string;
  errors?: Record<string, unknown>;
};

type UseFormActionEffectOptions<TState extends BaseFormState> = {
  getRedirectPath?: (state: TState) => string | null | undefined;
  onSuccess?: (state: TState) => void;
  onError?: (state: TState) => void;
  disableToast?: boolean;
  toastFieldErrors?: boolean;
};

export const useFormActionEffect = <TState extends BaseFormState>(
  state: Nullable<TState>,
  options: UseFormActionEffectOptions<TState> = {},
) => {
  const router = useRouter();
  const {
    getRedirectPath,
    onSuccess,
    onError,
    disableToast = false,
    toastFieldErrors = false,
  } = options;

  const prevStateRef = useRef<Nullable<TState>>(null);

  useEffect(() => {
    if (!state || state === prevStateRef.current) return;

    prevStateRef.current = state;

    if (state.success) {
      if (!disableToast && state.message) {
        toast.success(state.message);
      }

      onSuccess?.(state);

      const redirectPath = getRedirectPath?.(state);
      if (redirectPath) {
        router.push(redirectPath);
      }
    }

    if (!state.success) {
      if (!disableToast && state.message) {
        toast.error(state.message);
      }

      if (toastFieldErrors && state.errors) {
        const errorCount = Object.keys(state.errors).length;
        if (errorCount > 0) {
          toast.error(
            `Found ${errorCount} validation error${errorCount > 1 ? "s" : ""}`,
          );
        }
      }

      onError?.(state);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, router, getRedirectPath, onSuccess, onError, disableToast]);
};
