"use client";

import { useEffect, useState, useTransition } from "react";
import { clsx } from "clsx";
import { Bookmark } from "lucide-react";
import { useToast } from "@/components/ToastProvider";
import { trackEvent } from "@/lib/analytics";
import { useLoginPrompt } from "@/hooks/useLoginPrompt";
import { ICON_SIZE } from "@/lib/design-tokens";
import { getGuestSavedJobIds, toggleGuestSavedJobId } from "@/lib/guestSaves";

export function SaveButton({
  jobId,
  initialSaved,
  isLoggedIn,
  size = "md",
  source = "job_detail",
}: {
  jobId: string;
  initialSaved: boolean;
  isLoggedIn: boolean;
  size?: "sm" | "md";
  // 이 버튼이 어느 화면에서 눌렸는지 — "상세페이지에서 저장한 건수만" 같은 분석 요청에
  // 답하려면 Job Saved 이벤트에 이 값이 있어야 한다. 기본값은 상세페이지(jobs/[id])
  // 단독 버튼 자리이고, 목록/마이페이지 카드에서는 JobCard가 명시적으로 넘겨준다.
  source?: "job_detail" | "jobs_list" | "mypage_saved" | "company_detail";
}) {
  const [saved, setSaved] = useState(initialSaved);
  const [isPending, startTransition] = useTransition();
  const showToast = useToast();
  const { requireLogin, modal } = useLoginPrompt();

  // 서버는 게스트의 localStorage를 알 수 없어 initialSaved가 항상 false로 내려온다.
  // 마운트 시 클라이언트에서 한 번 더 확인해서 이미 저장해둔 상태면 채워준다.
  useEffect(() => {
    if (isLoggedIn) return;
    setSaved(getGuestSavedJobIds().includes(jobId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, jobId]);

  // 카드 전체가 상세 페이지로 가는 Link이기도 해서, 저장 버튼 클릭이 그 Link로 버블링되어
  // 같이 이동해버리지 않도록 막는다.
  const toggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // 게스트는 로그인 유도 없이 바로 저장(localStorage) — 저장 자체는 누구나, 목록 확인은
    // 로그인 후 마이페이지에서. 로그인하면 이 목록이 계정으로 병합된다(MixpanelBoot 참고).
    if (!isLoggedIn) {
      const next = !saved;
      setSaved(next);
      trackEvent(next ? "Job Saved" : "Job Unsaved", { jobId, source, guest: true });
      showToast(
        next ? "공고가 저장되었습니다" : "공고가 해제되었습니다",
        next ? { label: "보러가기", href: "/mypage" } : undefined
      );
      toggleGuestSavedJobId(jobId, next);
      // 게스트 저장은 SavedJob에 안 남아서, saveCount 누적 집계만이라도 서버에 반영한다.
      // 실패해도 저장 자체(localStorage)는 이미 끝났으니 화면엔 영향 없게 조용히 무시.
      if (next) {
        fetch(`/api/jobs/${jobId}/save-count`, { method: "POST" }).catch(() => {});
      }
      return;
    }

    requireLogin(isLoggedIn, () => {
      const next = !saved;
      setSaved(next);
      trackEvent(next ? "Job Saved" : "Job Unsaved", { jobId, source });
      showToast(
        next ? "공고가 저장되었습니다" : "공고가 해제되었습니다",
        next ? { label: "보러가기", href: "/mypage" } : undefined
      );
      startTransition(async () => {
        try {
          const res = await fetch("/api/saved-jobs", {
            method: next ? "POST" : "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ jobId }),
          });
          if (!res.ok) throw new Error("failed");
        } catch {
          setSaved(!next);
          trackEvent("Job Save Failed", { jobId, action: next ? "save" : "unsave", source });
        }
      });
    });
  };

  // 아이콘을 사방 동일한 패딩으로 감싸 터치 영역을 확보한다. 기존에는 아이콘을 오버사이즈
  // 박스 오른쪽에 justify-end로 붙이는 방식이라 아이콘의 실제 시각적 위치가 카드의 다른
  // 16px(p-4) 기준선과 어긋났다. 패딩 기반으로 바꾸고 카드 쪽 absolute 오프셋에서 이 패딩만큼을
  // 미리 빼서, 아이콘의 실제 가장자리가 카드 콘텐츠의 16px 인셋과 정확히 맞도록 한다.
  // 아이콘 자체 크기도 size에 맞춰 함께 줄여야 좁은 카드 모서리에서 두꺼워 보이지 않는다
  // (md=24px 상세페이지 단독 버튼, sm=20px 카드 모서리처럼 조밀한 자리).
  return (
    <>
      <button
        type="button"
        onClick={toggle}
        disabled={isPending}
        aria-pressed={saved}
        aria-label={saved ? "저장 취소" : "저장하기"}
        className={clsx(
          "flex shrink-0 items-center justify-center rounded-full transition-colors active:scale-[0.92] disabled:opacity-60",
          size === "md" ? "p-2" : "p-1.5",
          saved ? "text-primary" : "text-neutral-300 hover:text-neutral-500"
        )}
      >
        <Bookmark
          className={size === "md" ? ICON_SIZE.lg : ICON_SIZE.md}
          fill={saved ? "currentColor" : "none"}
          aria-hidden
        />
      </button>
      {modal}
    </>
  );
}
