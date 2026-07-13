"use client";

import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";
import { MixpanelBoot } from "@/components/MixpanelBoot";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <MixpanelBoot />
      {children}
    </SessionProvider>
  );
}
