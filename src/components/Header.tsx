"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { clsx } from "clsx";

const NAV_ITEMS = [
  { href: "/jobs", label: "홈" },
  { href: "/mypage", label: "마이페이지" },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-10 border-b border-neutral-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex w-full items-center justify-between px-4 py-4 sm:px-6 lg:max-w-[1440px] lg:px-8 3xl:max-w-[1760px] 3xl:px-16">
        <Link href="/jobs" className="text-base font-bold tracking-tight text-ink">
          UXUI Job
        </Link>
        <nav className="flex items-center gap-6">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "text-sm font-medium transition-colors",
                pathname.startsWith(item.href)
                  ? "text-ink"
                  : "text-neutral-400 hover:text-ink"
              )}
            >
              {item.label}
            </Link>
          ))}
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="text-sm font-medium text-neutral-400 transition-colors hover:text-ink"
          >
            로그아웃
          </button>
        </nav>
      </div>
    </header>
  );
}
