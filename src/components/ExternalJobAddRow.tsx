"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { clsx } from "clsx";
import { Link } from "lucide-react";
import { ICON_SIZE } from "@/lib/design-tokens";
import { useToast } from "@/components/ToastProvider";
import { trackEvent } from "@/lib/analytics";
import { useLoginPrompt } from "@/hooks/useLoginPrompt";

export function ExternalJobAddRow({ isLoggedIn }: { isLoggedIn: boolean }) {
  const router = useRouter();
  const showToast = useToast();
  const { requireLogin, modal } = useLoginPrompt();
  const [url, setUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const doSubmit = async () => {
    if (!url.trim() || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/mypage/external-jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "링크를 분석하지 못했어요.");

      setUrl("");
      showToast("공고를 분석해서 저장했어요");
      trackEvent("External Job Link Saved");
      router.refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : "링크를 분석하지 못했어요.";
      trackEvent("External Job Link Save Failed", { reason: message });
      showToast(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 이 기능은 게스트에게 숨기지 않고 그대로 노출한다. 대신 게스트가 실제로 쓰려고
  // 하면(제출 시점) 로그인 유도 모달을 띄운다 — 입력창 자체를 막지 않아 뭘 할 수
  // 있는 기능인지는 보이게 하고, 실행 직전에만 로그인을 요구한다.
  const submit = () => requireLogin(isLoggedIn, doSubmit);

  return (
    <div className="mb-4 flex h-16 items-center gap-2 rounded-2xl border border-neutral-200 bg-white pl-4 pr-3.5">
      <Link className={clsx(ICON_SIZE.sm, "shrink-0 text-neutral-400")} aria-hidden />
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") submit();
        }}
        placeholder="채용공고 링크를 붙여넣으면 AI가 분석해서 저장해요"
        disabled={isSubmitting}
        className="flex-1 bg-transparent text-sm font-medium text-ink placeholder:text-neutral-400 focus:outline-none disabled:opacity-60"
      />
      <button
        type="button"
        onClick={submit}
        disabled={isSubmitting || !url.trim()}
        className="flex shrink-0 items-center justify-center rounded-lg bg-primary px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-strong active:scale-[0.95] disabled:cursor-not-allowed disabled:bg-neutral-300"
      >
        {isSubmitting ? "분석 중..." : "분석하고 저장"}
      </button>
      {modal}
    </div>
  );
}
