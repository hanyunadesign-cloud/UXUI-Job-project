"use client";

import { useRouter } from "next/navigation";

// 항상 /jobs로 보내던 고정 링크 대신, 브라우저 히스토리상 바로 이전 페이지로 돌아간다.
export function BackButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.back()}
      className="w-fit text-sm text-neutral-400 hover:text-ink"
    >
      ← 뒤로
    </button>
  );
}
