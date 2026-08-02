"use client";

type StoreApi = {
  subscribe: (listener: () => void) => () => void;
  read: () => string[];
  write: (slugs: string[]) => void;
  notify: () => void;
};

export const createLocalStorageStore = (
  storageKey: string,
  legacyKey?: string,
): StoreApi => {
  const migrateLegacyValue = () => {
    if (typeof window === "undefined" || !legacyKey) return;
    try {
      const legacyValue = window.localStorage.getItem(legacyKey);
      if (legacyValue && !window.localStorage.getItem(storageKey)) {
        window.localStorage.setItem(storageKey, legacyValue);
        window.localStorage.removeItem(legacyKey);
      }
    } catch {
      // Ignore migration errors.
    }
  };

  const SERVER_SNAPSHOT: string[] = [];
  let cachedRaw: string | null = null;
  let cachedValue: string[] = SERVER_SNAPSHOT;
  let listeners: (() => void)[] = [];

  const read = (): string[] => {
    if (typeof window === "undefined") return SERVER_SNAPSHOT;

    migrateLegacyValue();

    let raw: string | null;
    try {
      raw = window.localStorage.getItem(storageKey);
    } catch {
      return cachedValue;
    }

    if (raw === cachedRaw) return cachedValue;
    cachedRaw = raw;

    try {
      const parsed: unknown = raw ? JSON.parse(raw) : [];
      cachedValue = Array.isArray(parsed)
        ? parsed.filter((s): s is string => typeof s === "string")
        : [];
    } catch {
      cachedValue = [];
    }
    return cachedValue;
  };

  const write = (slugs: string[]) => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(slugs));
      cachedRaw = null;
    } catch {
      // Ignore storage errors (private mode, quota exceeded).
    }
  };

  const notify = () => {
    listeners.forEach((listener) => listener());
  };

  const subscribe = (listener: () => void) => {
    listeners = [...listeners, listener];

    const handleStorage = (e: StorageEvent) => {
      if (e.key === storageKey) listener();
    };
    window.addEventListener("storage", handleStorage);

    return () => {
      listeners = listeners.filter((l) => l !== listener);
      window.removeEventListener("storage", handleStorage);
    };
  };

  return { subscribe, read, write, notify };
};
