"use client";

import { useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { trackEvent } from "@/lib/analytics";

// 루트 페이지(/)가 로그인 세션을 확인하고 /jobs 또는 /onboarding으로 리다이렉트할 때만
// loginSuccess 쿼리 파라미터를 붙여 보낸다. 즉 이 컴포넌트가 렌더링된다는 것 자체가
// "방금 로그인 흐름을 통해 여기 도착했다"는 뜻이라, Login Button Clicked(클릭 의도)와
// 달리 실제 로그인 성공을 확인하는 신호로 쓸 수 있다. 확인 후에는 URL에서 파라미터를 지운다.
export function LoginSuccessTracker({ isNewUser }: { isNewUser: boolean }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const entrySource = searchParams.get("entrySource") ?? "unknown";
    trackEvent("Login Succeeded", { isNewUser, entrySource });
    const params = new URLSearchParams(searchParams.toString());
    params.delete("loginSuccess");
    params.delete("isNewUser");
    params.delete("entrySource");
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
