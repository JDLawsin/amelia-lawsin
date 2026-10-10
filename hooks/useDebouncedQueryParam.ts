"use client";

import { useSearchParams } from "next/navigation";
import {
  useCallback,
  useEffect,
  useEffectEvent,
  useRef,
  useState,
} from "react";
import { useDebounce } from "@uidotdev/usehooks";
import useUpdateQueryString from "@/hooks/useQueryString";

const DEFAULT_RESET_KEYS = ["page"];

type Options = {
  /** Debounce delay before committing to the URL. */
  delay?: number;
  /** Query keys to remove when the param is cleared or changed. */
  resetKeys?: string[];
  /** Server-known value — stable seed when Suspense remounts before searchParams. */
  initialValue?: string;
};

/**
 * Local input state + debounced URL sync. Skips router updates when the
 * debounced value already matches the URL (avoids redundant server refetches).
 */
const useDebouncedQueryParam = (
  key: string,
  {
    delay = 300,
    resetKeys = DEFAULT_RESET_KEYS,
    initialValue,
  }: Options = {},
) => {
  const searchParams = useSearchParams();
  const updateQueryString = useUpdateQueryString();
  const updateQueryStringEvent = useEffectEvent(updateQueryString);
  const urlValue = searchParams.get(key) ?? "";
  const seed = initialValue !== undefined ? initialValue : urlValue;

  const [localValue, setLocalValue] = useState(seed);
  const debouncedValue = useDebounce(localValue, delay);
  const committedRef = useRef(seed.trim());

  const trimmedLocal = localValue.trim();
  const trimmedUrl = urlValue.trim();
  const isPending = trimmedLocal !== trimmedUrl;
  const resetKeysKey = JSON.stringify(resetKeys);

  // External URL changes only (chip links, back/forward) — not our own commits.
  useEffect(() => {
    if (trimmedUrl === committedRef.current) return;

    // User is ahead of the URL — don't pull stale searchParams into the input.
    if (trimmedLocal !== trimmedUrl && trimmedLocal !== committedRef.current) {
      return;
    }

    // Brief empty searchParams during Suspense — ignore if input still matches commit.
    if (
      !trimmedUrl &&
      committedRef.current &&
      trimmedLocal === committedRef.current
    ) {
      return;
    }

    committedRef.current = trimmedUrl;
    setLocalValue(urlValue);
  }, [urlValue, trimmedLocal, trimmedUrl]);

  useEffect(() => {
    const next = debouncedValue.trim();
    if (next === trimmedUrl) return;
    const keysToReset = JSON.parse(resetKeysKey) as string[];

    committedRef.current = next;

    if (next) {
      updateQueryStringEvent({ [key]: next }, keysToReset, {
        replace: true,
      });
      return;
    }

    updateQueryStringEvent({}, [key, ...keysToReset], { replace: true });
  }, [debouncedValue, key, resetKeysKey, trimmedUrl]);

  const clear = useCallback(() => {
    setLocalValue("");
  }, []);

  return {
    value: localValue,
    setValue: setLocalValue,
    isPending,
    clear,
    hasValue: trimmedLocal.length > 0,
  };
};

export default useDebouncedQueryParam;
