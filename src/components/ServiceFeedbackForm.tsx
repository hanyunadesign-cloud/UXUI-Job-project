"use client";

import { useState } from "react";
import { clsx } from "clsx";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/Button";
import { useToast } from "@/components/ToastProvider";
import { trackEvent } from "@/lib/analytics";

const CATEGORIES = ["불편했어요", "이런 기능이 있으면 좋겠어요", "기타"] as const;

const PLACEHOLDER = "예) 관심 기업 알림을 카카오톡으로도 받고 싶어요";

export function ServiceFeedbackForm() {
  const [category, setCategory] = useState<(typeof CATEGORIES)[number] | null>(null);
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const showToast = useToast();

  const canSubmit = content.trim().length > 0 && !isSubmitting;

  const submit = async () => {
    if (!canSubmit) return;
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/service-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, content: content.trim() }),
      });
      if (!res.ok) throw new Error("failed");
      trackEvent("Service Feedback Submitted", { category });
      showToast("의견이 전달됐어요. 감사해요!");
      setSubmitted(true);
      setCategory(null);
      setContent("");
    } catch {
      showToast("전송에 실패했어요. 다시 시도해주세요");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-neutral-200 bg-white px-6 py-16 text-center">
        <CheckCircleIcon className="h-9 w-9 text-primary" aria-hidden />
        <div className="flex flex-col gap-1">
          <p className="text-base font-semibold text-ink">의견을 잘 전달받았어요</p>
          <p className="text-sm text-neutral-400">꼼꼼히 읽고 서비스 개선에 반영할게요</p>
        </div>
        <Button variant="tertiary" className="mt-2" onClick={() => setSubmitted(false)}>
          다른 의견 남기기
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-neutral-200 bg-white p-6">
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((option) => {
          const isSelected = category === option;
          return (
            <button
              key={option}
              type="button"
              onClick={() => setCategory(isSelected ? null : option)}
              aria-pressed={isSelected}
              className={clsx(
                "rounded-full border px-4 py-2 text-sm font-medium transition-colors active:scale-[0.95]",
                isSelected
                  ? "border-primary bg-blue-50 text-primary"
                  : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300"
              )}
            >
              {option}
            </button>
          );
        })}
      </div>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={PLACEHOLDER}
        disabled={isSubmitting}
        rows={6}
        maxLength={2000}
        className="w-full resize-none rounded-2xl border border-neutral-300 p-4 text-sm text-ink placeholder:text-neutral-400 focus:border-primary focus:outline-none disabled:opacity-60"
      />

      <div className="flex items-center justify-between">
        <p className="text-xs text-neutral-400">{content.trim().length} / 2000</p>
        <Button onClick={submit} disabled={!canSubmit}>
          의견 보내기
        </Button>
      </div>
    </div>
  );
}
