"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/Button";
import { trackEvent } from "@/lib/analytics";
import { TrackPageView } from "@/components/TrackPageView";

// useSearchParams()를 쓰는 컴포넌트는 정적 렌더링 시 Suspense 경계 안에 있어야
// 빌드가 통과한다(안 그러면 prerender 단계에서 에러남).
export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginPageContent />
    </Suspense>
  );
}

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // 랜딩페이지에서 바로 왔는지("landing_direct") vs 게스트로 둘러보다 로그인 유도
  // 모달을 거쳐 왔는지("gated_modal") 구분해서, 로그인 완료까지 이어붙여 분석한다.
  const entrySource = searchParams.get("source") ?? "unknown";

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 px-6 text-center">
      <TrackPageView name="Login Page Viewed" dwellEventName="Login Page Time Spent" />
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium tracking-wide text-neutral-400">UXUI JOB</p>
        <h1 className="text-2xl font-bold text-ink">로그인하고 시작하기</h1>
      </div>
      <div className="flex flex-col items-center gap-3">
        <Button
          variant="secondary"
          className="px-6 py-3 text-sm"
          onClick={() => {
            trackEvent("Login Button Clicked", { entrySource });
            signIn("google", { callbackUrl: `/?entrySource=${entrySource}` });
          }}
        >
          구글 계정으로 로그인
        </Button>
        <button
          type="button"
          onClick={() => {
            trackEvent("Guest Browse Clicked");
            router.push("/jobs");
          }}
          className="text-xs font-medium text-neutral-400 underline-offset-2 hover:text-neutral-600 hover:underline"
        >
          로그인 없이 둘러보기
        </button>
      </div>
    </main>
  );
}
