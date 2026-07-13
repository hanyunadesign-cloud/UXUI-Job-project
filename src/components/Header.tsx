"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import { ProfileMenu } from "@/components/ProfileMenu";

const NAV_ITEMS = [
  { href: "/jobs", label: "채용" },
  { href: "/companies", label: "기업" },
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
