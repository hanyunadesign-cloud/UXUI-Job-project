"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import { ProfileMenu } from "@/components/ProfileMenu";
import { trackEvent } from "@/lib/analytics";

// 로컬 미니 시안 전용 GNB 구성 — 기업/IT 동아리 대신 저장 공고·채용 일정을 넣었다.
const NAV_ITEMS = [
  { href: "/jobs", label: "채용 공고" },
  { href: "/mypage", label: "저장 공고" },
  { href: "/calendar", label: "채용 일정" },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-10 border-b border-neutral-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-14 w-full items-center justify-between px-4 sm:px-6 lg:max-w-[1440px] lg:px-8 3xl:max-w-[1760px] 3xl:px-16">
        <Link href="/jobs" className="text-base font-bold tracking-tight text-ink">
          UXUI Job
        </Link>
        <nav className="flex items-center gap-6">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => trackEvent("Header Nav Clicked", { label: item.label, href: item.href })}
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
          <ProfileMenu />
        </nav>
      </div>
    </header>
  );
}
