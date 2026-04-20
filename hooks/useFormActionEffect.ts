import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { FormState } from "@/actions/property.action";
import { Nullable } from "@/types";
import toast from "react-hot-toast";

type UseFormActionEffectOptions = {
  getRedirectPath?: (state: FormState) => string | null | undefined;
  onSuccess?: (state: FormState) => void;
  onError?: (state: FormState) => void;
  disableToast?: boolean;
  toastFieldErrors?: boolean;
};

export const useFormActionEffect = (
  state: Nullable<FormState>,
  options: UseFormActionEffectOptions = {},
) => {
  const router = useRouter();
  const {
    getRedirectPath,
    onSuccess,
    onError,
    disableToast = false,
    toastFieldErrors = false,
  } = options;

  const prevStateRef = useRef<Nullable<FormState>>(null);

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
  }, [state, router, getRedirectPath, onSuccess, onError, disableToast]);
};
