'use client';

import { useEffect, useState } from 'react';

/** Subscribe to a live data source. Returns null while the first snapshot loads. */
export function useLive<T>(
  subscribe: ((cb: (rows: T[]) => void) => () => void) | null,
  deps: unknown[],
): T[] | null {
  const [rows, setRows] = useState<T[] | null>(null);
  useEffect(() => {
    setRows(null);
    if (!subscribe) return;
    return subscribe(setRows);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return rows;
}

/** State saved to localStorage so a login survives page reloads. */
export function useStoredState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) setValue(JSON.parse(raw));
    } catch {}
    setLoaded(true);
  }, [key]);

  const update = (next: T) => {
    setValue(next);
    try {
      if (next === null) localStorage.removeItem(key);
      else localStorage.setItem(key, JSON.stringify(next));
    } catch {}
  };

  return [value, update, loaded] as const;
}

/** Current time that re-renders every second (for countdowns). */
export function useNow(intervalMs = 1000) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(t);
  }, [intervalMs]);
  return now;
}
