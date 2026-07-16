"use client";

import { useRouter, usePathname } from "next/navigation";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { trackEvent } from "@/lib/analytics";

// 항상 /jobs로 보내던 고정 링크 대신, 브라우저 히스토리상 바로 이전 페이지로 돌아간다.
export function BackButton() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <button
      type="button"
      onClick={() => {
        trackEvent("Back Button Clicked", { from: pathname });
        router.back();
      }}
      className="inline-flex w-fit items-center gap-1 text-sm text-neutral-400 hover:text-ink"
    >
      <ArrowLeftIcon className="h-4 w-4" aria-hidden />
      뒤로
    </button>
  );
}
