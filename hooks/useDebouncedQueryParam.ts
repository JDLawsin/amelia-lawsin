"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
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
  const urlValue = searchParams.get(key) ?? "";
  const seed = initialValue !== undefined ? initialValue : urlValue;

  const [localValue, setLocalValue] = useState(seed);
  const debouncedValue = useDebounce(localValue, delay);
  const committedRef = useRef(seed.trim());

  const updateQueryStringRef = useRef(updateQueryString);
  useEffect(() => {
    updateQueryStringRef.current = updateQueryString;
  });

  const trimmedLocal = localValue.trim();
  const trimmedUrl = urlValue.trim();
  const isPending = trimmedLocal !== trimmedUrl;
  const resetKeysKey = resetKeys.join("\0");

  // External URL changes only (chip links, back/forward) — not our own commits.
  useEffect(() => {
    const urlTrimmed = urlValue.trim();
    if (urlTrimmed === committedRef.current) return;

    // User is ahead of the URL — don't pull stale searchParams into the input.
    if (trimmedLocal !== trimmedUrl && trimmedLocal !== committedRef.current) {
      return;
    }

    // Brief empty searchParams during Suspense — ignore if input still matches commit.
    if (
      !urlTrimmed &&
      committedRef.current &&
      trimmedLocal === committedRef.current
    ) {
      // #region agent log
      fetch('http://127.0.0.1:7297/ingest/91344423-1bbd-4415-8571-602252fcdf8a',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'cb2751'},body:JSON.stringify({sessionId:'cb2751',location:'useDebouncedQueryParam.ts:sync-guard',message:'sync skipped empty url flicker',data:{urlTrimmed,committed:committedRef.current,trimmedLocal},timestamp:Date.now(),hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      return;
    }

    // #region agent log
    fetch('http://127.0.0.1:7297/ingest/91344423-1bbd-4415-8571-602252fcdf8a',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'cb2751'},body:JSON.stringify({sessionId:'cb2751',location:'useDebouncedQueryParam.ts:sync-overwrite',message:'sync overwrites local from url',data:{from:trimmedLocal,to:urlTrimmed,committed:committedRef.current,debounced:debouncedValue.trim()},timestamp:Date.now(),hypothesisId:'A,E'})}).catch(()=>{});
    // #endregion
    committedRef.current = urlTrimmed;
    setLocalValue(urlValue);
  }, [urlValue, trimmedLocal, debouncedValue]);

  useEffect(() => {
    const next = debouncedValue.trim();
    if (next === trimmedUrl) return;

    // #region agent log
    fetch('http://127.0.0.1:7297/ingest/91344423-1bbd-4415-8571-602252fcdf8a',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'cb2751'},body:JSON.stringify({sessionId:'cb2751',location:'useDebouncedQueryParam.ts:commit',message:'committing debounced value to url',data:{next,trimmedUrl,local:trimmedLocal},timestamp:Date.now(),hypothesisId:'D'})}).catch(()=>{});
    // #endregion
    committedRef.current = next;

    if (next) {
      updateQueryStringRef.current({ [key]: next }, resetKeys, {
        replace: true,
      });
      return;
    }

    updateQueryStringRef.current({}, [key, ...resetKeys], { replace: true });
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
