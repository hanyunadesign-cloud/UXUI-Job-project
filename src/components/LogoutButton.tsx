"use client";

import { signOut } from "next-auth/react";
import { trackEvent } from "@/lib/analytics";

export function LogoutButton() {
  return (
    <button
      type="button"
      onClick={() => {
        trackEvent("Logout Clicked");
        signOut({ callbackUrl: "/" });
      }}
      className="self-start rounded-lg border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-50 hover:text-ink"
    >
      로그아웃
    </button>
  );
}
