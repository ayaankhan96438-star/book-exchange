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
      if (saved) setSelectedIds(JSON.parse(saved) as string[]);
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedIds));
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
