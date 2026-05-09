"use client";

import { useCallback, useRef } from "react";
import { useSyncExternalStore } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  const initialRef = useRef(initialValue);
  const cache = useRef<{ raw: string | null; parsed: T } | null>(null);

  const subscribe = useCallback((cb: () => void) => {
    window.addEventListener("storage", cb);
    return () => window.removeEventListener("storage", cb);
  }, []);

  const getSnapshot = useCallback(() => {
    const raw = window.localStorage.getItem(key);
    if (cache.current?.raw === raw) return cache.current.parsed;
    let parsed: T;
    try {
      parsed = raw !== null ? (JSON.parse(raw) as T) : initialRef.current;
    } catch {
      parsed = initialRef.current;
    }
    cache.current = { raw, parsed };
    return parsed;
  }, [key]);

  // Server snapshot always matches server render — no hydration mismatch
  const getServerSnapshot = useCallback(() => initialRef.current, []);

  const value = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setValue = useCallback(
    (v: T) => {
      try {
        window.localStorage.setItem(key, JSON.stringify(v));
        // Trigger re-read in all subscribers
        window.dispatchEvent(new Event("storage"));
      } catch {}
    },
    [key],
  );

  return [value, setValue] as const;
}
