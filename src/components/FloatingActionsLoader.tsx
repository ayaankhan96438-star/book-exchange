"use client";

import dynamic from "next/dynamic";

const WhatsAppFloat = dynamic(() => import("@/components/WhatsAppFloat"), { ssr: false, loading: () => null });
const MobileActionBar = dynamic(() => import("@/components/MobileActionBar"), { ssr: false, loading: () => null });

export default function FloatingActionsLoader() {
  return <><WhatsAppFloat /><MobileActionBar /></>;
}
