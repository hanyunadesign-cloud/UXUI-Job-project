"use client";

import { trackEvent } from "@/lib/analytics";

// ApplyButton과 동일한 패턴 — 외부로 나가는 클릭이라 서버 컴포넌트(마이페이지 링크저장
// 상세페이지)에서 바로 onClick을 못 달아서 별도 클라이언트 컴포넌트로 뺐다.
export function ExternalSourceLinkButton({
  externalJobId,
  companyName,
  sourceUrl,
}: {
  externalJobId: string;
  companyName: string;
  sourceUrl: string;
}) {
  return (
    <a
      href={sourceUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackEvent("External Job Source Link Clicked", { externalJobId, companyName })}
    >
      <button
        type="button"
        className="inline-flex items-center justify-center rounded-[14px] bg-primary px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-strong active:scale-[0.92]"
      >
        원문 보기
      </button>
    </a>
  );
}
