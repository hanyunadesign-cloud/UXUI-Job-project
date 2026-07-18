"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { LoginPromptModal } from "@/components/LoginPromptModal";
import { trackEvent } from "@/lib/analytics";

// 비로그인 상태에서 저장/팔로우 같은 액션을 시도했을 때, 바로 로그인 페이지로 튕기지 않고
// "로그인하시겠어요?" 확인 모달을 먼저 띄운다. isLoggedIn이면 액션을 바로 실행한다.
export function useLoginPrompt() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const requireLogin = useCallback((isLoggedIn: boolean, action: () => void) => {
    if (isLoggedIn) {
      action();
      return;
    }
    trackEvent("Login Prompt Shown");
    setOpen(true);
  }, []);

  const modal = (
    <LoginPromptModal
      open={open}
      onCancel={() => {
        trackEvent("Login Prompt Cancelled");
        setOpen(false);
      }}
      onConfirm={() => {
        trackEvent("Login Prompt Confirmed");
        router.push("/login?source=gated_modal");
      }}
    />
  );

  return { requireLogin, modal };
}
