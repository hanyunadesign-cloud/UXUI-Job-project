"use client";

import { useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Button } from "@/components/Button";

export function OnboardingSuccessModal({ initialOpen }: { initialOpen: boolean }) {
  const [open, setOpen] = useState(initialOpen);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (!open) return null;

  const close = () => {
    setOpen(false);
    const params = new URLSearchParams(searchParams.toString());
    params.delete("onboarded");
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname);
  };

  const choose = async (emailOptIn: boolean) => {
    setSubmitting(true);
    try {
      await fetch("/api/onboarding", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailOptIn }),
      });
    } finally {
      setSubmitting(false);
      close();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6">
      <div className="flex w-full max-w-sm flex-col gap-6 rounded-2xl bg-white p-6 text-center shadow-xl">
        <div className="flex flex-col items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-ink text-white">
            ✓
          </div>
          <h2 className="text-lg font-bold text-ink">로그인이 완료되었습니다!</h2>
          <p className="text-sm text-neutral-500">
            관심 조건에 맞는 UXUI 채용공고를 지금부터 살펴보세요.
          </p>
        </div>
        <div className="flex flex-col gap-3 border-t border-neutral-100 pt-6">
          <p className="text-sm font-medium text-ink">이메일로 채용공고 알림을 받으시겠어요?</p>
          <div className="flex justify-center gap-2">
            <Button
              variant="secondary"
              onClick={() => choose(false)}
              disabled={submitting}
              className="flex-1"
            >
              괜찮아요
            </Button>
            <Button onClick={() => choose(true)} disabled={submitting} className="flex-1">
              받을래요
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
