"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

// GNB 우측의 마이페이지 진입점. 로그인 상태에서는 구글 프로필 사진을 트리거로 하는
// 드롭다운(마이페이지/로그아웃)으로 동작하고, 비로그인 상태에서는 기존처럼 텍스트 링크로
// /mypage로 보내 미들웨어가 /login으로 리다이렉트하도록 둔다.
export function ProfileMenu() {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (status === "loading") return null;

  if (status !== "authenticated") {
    return (
      <Link href="/mypage" className="text-sm font-medium text-neutral-400 hover:text-ink">
        마이페이지
      </Link>
    );
  }

  const user = session.user as { name?: string | null; image?: string | null };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="마이페이지 메뉴"
        className="block shrink-0 overflow-hidden rounded-full ring-offset-2 transition-shadow hover:ring-2 hover:ring-neutral-200"
      >
        {user.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={user.image} alt={user.name ?? "프로필"} className="h-8 w-8 rounded-full object-cover" />
        ) : (
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-white">
            {user.name?.slice(0, 1) ?? "U"}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-[calc(100%+8px)] z-20 flex w-40 flex-col gap-0.5 rounded-2xl border border-neutral-200 bg-white p-2 shadow-dropdown">
          <Link
            href="/mypage"
            onClick={() => setIsOpen(false)}
            className="rounded-xl px-3 py-2 text-left text-sm text-neutral-600 transition-colors hover:bg-neutral-50 hover:text-ink"
          >
            마이페이지
          </Link>
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/" })}
            className="rounded-xl px-3 py-2 text-left text-sm text-neutral-600 transition-colors hover:bg-neutral-50 hover:text-ink"
          >
            로그아웃
          </button>
        </div>
      )}
    </div>
  );
}
