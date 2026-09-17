"use client";

import { useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Check } from "lucide-react";
import { Button } from "@/components/Button";

// 이메일 채용공고 알림은 실제로 발송되지 않는 기능(다이제스트 발송 로직이 꺼져 있음)이라,
// 여기서 신청을 받으면 안 지켜지는 약속을 하게 된다. 그래서 이 화면은 로그인 완료
// 안내만 하고 끝낸다 — 이메일 알림 신청 UI는 절대 다시 넣지 않는다.
export function OnboardingSuccessModal({ initialOpen }: { initialOpen: boolean }) {
  const [open, setOpen] = useState(initialOpen);
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6">
      <div className="flex w-full max-w-sm flex-col gap-6 rounded-2xl bg-white p-6 text-center shadow-sheet">
        <div className="flex flex-col items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white">
            <Check className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden />
          </div>
          <h2 className="text-lg font-bold text-ink">로그인이 완료되었습니다!</h2>
          <p className="text-sm text-neutral-500">
            관심 조건에 맞는 UXUI 채용공고를 지금부터 살펴보세요.
          </p>
        </div>
        <Button onClick={close}>확인</Button>
      </div>
    </div>
  );
}
