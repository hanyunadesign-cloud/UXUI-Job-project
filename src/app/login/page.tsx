"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/Button";
import { trackEvent } from "@/lib/analytics";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 px-6 text-center">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium tracking-wide text-neutral-400">UXUI JOB</p>
        <h1 className="text-2xl font-bold text-ink">로그인하고 시작하기</h1>
      </div>
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
    </main>
  );
}
