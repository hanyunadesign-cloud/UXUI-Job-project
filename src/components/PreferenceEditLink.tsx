"use client";

import Link from "next/link";
import { trackEvent } from "@/lib/analytics";

// 마이페이지(프로필) "관심사 설정" 카드의 재설정/설정하러 가기 진입점.
// 서버 컴포넌트(profile/page.tsx)에서 바로 onClick을 못 달아서 별도 클라이언트
// 컴포넌트로 뺐다 — ExternalSourceLinkButton과 동일한 패턴.
export function PreferenceEditLink({
  label,
  hasExistingPreference,
}: {
  label: string;
  hasExistingPreference: boolean;
}) {
  return (
    <Link
      href="/onboarding?edit=1"
      onClick={() => trackEvent("Preference Edit Entry Clicked", { hasExistingPreference })}
      className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-medium text-primary-strong transition-colors hover:bg-blue-100"
    >
      {label}
    </Link>
  );
}
