"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LinkIcon } from "@heroicons/react/24/outline";
import { useToast } from "@/components/ToastProvider";

export function ExternalJobAddRow() {
  const router = useRouter();
  const showToast = useToast();
  const [url, setUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async () => {
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
      router.refresh();
    } catch (error) {
      showToast(error instanceof Error ? error.message : "링크를 분석하지 못했어요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mb-4 flex h-16 items-center gap-2 rounded-2xl border border-neutral-200 bg-white pl-4 pr-2">
      <LinkIcon className="h-4 w-4 shrink-0 text-neutral-400" aria-hidden />
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
        className="flex h-[47px] shrink-0 items-center justify-center rounded-[14px] bg-primary px-5 text-sm font-medium text-white transition-colors hover:bg-primary-strong active:scale-[0.95] disabled:cursor-not-allowed disabled:bg-neutral-300"
      >
        {isSubmitting ? "분석 중..." : "분석하고 저장"}
      </button>
    </div>
  );
}
