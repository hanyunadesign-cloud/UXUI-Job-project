"use client";

import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/Button";
import { trackEvent } from "@/lib/analytics";
import { TrackPageView } from "@/components/TrackPageView";

export default function LoginPage() {
  const router = useRouter();

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
            trackEvent("Login Button Clicked");
            signIn("google", { callbackUrl: "/" });
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
