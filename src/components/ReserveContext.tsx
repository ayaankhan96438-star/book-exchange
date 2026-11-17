"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

type ReserveContextValue = {
  selectedIds: string[];
  addBook: (id: string) => void;
  removeBook: (id: string) => void;
  clear: () => void;
};

const ReserveContext = createContext<ReserveContextValue | null>(null);
const STORAGE_KEY = "bookshop-reserve-list-v1";

export function ReserveProvider({ children }: { children: React.ReactNode }) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: unknown = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setSelectedIds(parsed.filter((item): item is string => typeof item === "string").slice(0, 10));
        }
      }
    } catch {
      // Storage may be disabled or contain stale data; the in-memory list still works.
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedIds));
    } catch {
      // Keep the reserve list usable for this session when storage is unavailable.
    }
  }, [ready, selectedIds]);

  const value = useMemo(() => ({
    selectedIds,
    addBook: (id: string) => setSelectedIds((current) => current.includes(id) ? current : [...current, id].slice(0, 10)),
    removeBook: (id: string) => setSelectedIds((current) => current.filter((item) => item !== id)),
    clear: () => setSelectedIds([]),
  }), [selectedIds]);

  return <ReserveContext.Provider value={value}>{children}</ReserveContext.Provider>;
}

export function useReserveList() {
  const value = useContext(ReserveContext);
  if (!value) throw new Error("useReserveList must be used inside ReserveProvider");
  return value;
}
