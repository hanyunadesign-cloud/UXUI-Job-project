"use client";

import Link from "next/link";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { useLoginPrompt } from "@/hooks/useLoginPrompt";

const linkClassName =
  "inline-flex shrink-0 items-center gap-1 rounded-[14px] bg-white px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-neutral-200 active:scale-[0.95]";

export function ViewFollowingLink({ isLoggedIn }: { isLoggedIn: boolean }) {
  const { requireLogin, modal } = useLoginPrompt();

  if (!isLoggedIn) {
    return (
      <>
        <button type="button" onClick={() => requireLogin(false, () => {})} className={linkClassName}>
          나의 관심기업 보기
          <ChevronRightIcon className="h-4 w-4" aria-hidden />
        </button>
        {modal}
      </>
    );
  }

  return (
    <Link href="/mypage?tab=following" className={linkClassName}>
      나의 관심기업 보기
      <ChevronRightIcon className="h-4 w-4" aria-hidden />
    </Link>
  );
}
