"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useLoginPrompt } from "@/hooks/useLoginPrompt";

// ActiveOnlyCheckbox와 같은 자리·스타일을 쓰는 "나의 관심기업" 필터. 비로그인 상태에서
// 누르면 팔로우 목록 자체가 없으니, 토글 대신 로그인 확인 모달을 띄운다.
export function FollowingOnlyCheckbox({ isLoggedIn }: { isLoggedIn: boolean }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { requireLogin, modal } = useLoginPrompt();

  const followingOnly = searchParams.get("followingOnly") === "1";

  const toggle = () =>
    requireLogin(isLoggedIn, () => {
      const params = new URLSearchParams(searchParams.toString());
      if (followingOnly) {
        params.delete("followingOnly");
      } else {
        params.set("followingOnly", "1");
      }
      params.delete("page");
      router.push(`${pathname}?${params.toString()}`);
    });

  return (
    <>
      <label className="flex w-fit shrink-0 cursor-pointer items-center gap-2 text-sm text-neutral-500">
        <input
          type="checkbox"
          checked={followingOnly}
          onChange={toggle}
          className="h-4 w-4 rounded border-neutral-300 text-primary focus:ring-primary"
        />
        나의 관심기업
      </label>
      {modal}
    </>
  );
}
