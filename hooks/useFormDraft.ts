"use client";

import { useCallback, useEffect, useRef } from "react";
import type { FieldValues, UseFormReturn } from "react-hook-form";
import toast from "react-hot-toast";

type DraftEnvelope<TMeta extends Record<string, unknown> = Record<string, unknown>> =
  {
    values: unknown;
    meta?: TMeta;
    savedAt: number;
  };

const isBrowser = () => typeof window !== "undefined";

/** Strip File/Blob (not JSON-serializable) before persisting */
const toStorable = (value: unknown): unknown => {
  if (value == null) return value;

  if (typeof File !== "undefined" && value instanceof File) {
    return undefined;
  }
  if (typeof Blob !== "undefined" && value instanceof Blob) {
    return undefined;
  }

  if (Array.isArray(value)) {
    return value
      .map((item) => toStorable(item))
      .filter((item) => item !== undefined);
  }

  if (typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [key, nested] of Object.entries(value)) {
      const next = toStorable(nested);
      if (next !== undefined) {
        out[key] = next;
      }
    }
    return out;
  }

  return value;
};

export const clearFormDraft = (storageKey: string) => {
  if (!isBrowser()) return;
  try {
    window.sessionStorage.removeItem(storageKey);
  } catch {
    // ignore quota / private mode
  }
};

const readDraft = <TMeta extends Record<string, unknown>>(
  storageKey: string,
): DraftEnvelope<TMeta> | null => {
  if (!isBrowser()) return null;
  try {
    const raw = window.sessionStorage.getItem(storageKey);
    if (!raw) return null;
    return JSON.parse(raw) as DraftEnvelope<TMeta>;
  } catch {
    return null;
  }
};

const writeDraft = <TMeta extends Record<string, unknown>>(
  storageKey: string,
  values: unknown,
  meta?: TMeta,
) => {
  if (!isBrowser()) return;
  try {
    const envelope: DraftEnvelope<TMeta> = {
      values: toStorable(values),
      meta,
      savedAt: Date.now(),
    };
    window.sessionStorage.setItem(storageKey, JSON.stringify(envelope));
  } catch {
    // ignore quota / private mode
  }
};

type UseFormDraftOptions<
  TFieldValues extends FieldValues,
  TMeta extends Record<string, unknown> = Record<string, unknown>,
> = {
  /** Unique sessionStorage key, e.g. `property-create` */
  storageKey: string;
  form: UseFormReturn<TFieldValues>;
  /** Extra UI state to persist (wizard step, etc.) */
  meta?: TMeta;
  onRestoreMeta?: (meta: TMeta) => void;
  enabled?: boolean;
  debounceMs?: number;
};

/**
 * Persist RHF values in sessionStorage so accidental navigation
 * (back link, sidebar, etc.) doesn't wipe in-progress form work.
 * Also warns on tab close / refresh when the form is dirty.
 *
 * Note: File uploads can't be restored from storage.
 */
export const useFormDraft = <
  TFieldValues extends FieldValues,
  TMeta extends Record<string, unknown> = Record<string, unknown>,
>({
  storageKey,
  form,
  meta,
  onRestoreMeta,
  enabled = true,
  debounceMs = 400,
}: UseFormDraftOptions<TFieldValues, TMeta>) => {
  const readyRef = useRef(false);
  const metaRef = useRef(meta);
  metaRef.current = meta;

  const {
    reset,
    watch,
    getValues,
    formState: { isDirty },
  } = form;

  const isDirtyRef = useRef(isDirty);
  isDirtyRef.current = isDirty;

  // Restore once on mount
  useEffect(() => {
    if (!enabled) {
      readyRef.current = true;
      return;
    }

    const draft = readDraft<TMeta>(storageKey);
    if (draft?.values && typeof draft.values === "object") {
      reset(
        {
          ...getValues(),
          ...(draft.values as Partial<TFieldValues>),
        },
        { keepDefaultValues: true },
      );
      if (draft.meta) {
        onRestoreMeta?.(draft.meta);
      }
      toast.success("Restored unsaved changes", { id: `draft-${storageKey}` });
    }

    readyRef.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps -- restore once per key
  }, [storageKey, enabled]);

  // Debounced save on value changes (only once the form is dirty)
  useEffect(() => {
    if (!enabled) return;

    let timer: ReturnType<typeof setTimeout> | undefined;

    const subscription = watch((values) => {
      if (!readyRef.current || !isDirtyRef.current) return;
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        if (!isDirtyRef.current) return;
        writeDraft(storageKey, values, metaRef.current);
      }, debounceMs);
    });

    return () => {
      if (timer) clearTimeout(timer);
      subscription.unsubscribe();
    };
  }, [watch, storageKey, enabled, debounceMs]);

  // Persist wizard step / meta when dirty
  useEffect(() => {
    if (!enabled || !readyRef.current || !meta || !isDirty) return;
    writeDraft(storageKey, getValues(), meta);
  }, [meta, enabled, storageKey, isDirty, getValues]);

  // Warn on hard navigation / refresh
  useEffect(() => {
    if (!enabled || !isDirty) return;

    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [enabled, isDirty]);

  const clearDraft = useCallback(() => {
    clearFormDraft(storageKey);
  }, [storageKey]);

  return { clearDraft };
};
