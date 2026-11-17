"use client";

import dynamic from "next/dynamic";
import { useReserveList } from "@/components/ReserveContext";

const ReserveListButton = dynamic(() => import("@/components/ReserveListButton"), {
  ssr: false,
  loading: () => null,
});

export default function ReserveListButtonLoader() {
  const { selectedIds } = useReserveList();
  if (selectedIds.length === 0) return null;
  return <ReserveListButton />;
}
