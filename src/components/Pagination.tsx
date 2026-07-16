"use client";

import Link from "next/link";
import { clsx } from "clsx";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { trackEvent } from "@/lib/analytics";

// 클릭 트래킹을 위해 클라이언트 컴포넌트로 전환했다. 페이지 이동 자체는 여전히
// Link의 기본 네비게이션만으로 충분하다.
export function Pagination({
  currentPage,
  totalPages,
  basePath,
  searchParams,
}: {
  currentPage: number;
  totalPages: number;
  basePath: string;
  searchParams: URLSearchParams;
}) {
  if (totalPages <= 1) return null;

  const hrefFor = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(page));
    return `${basePath}?${params.toString()}`;
  };

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav className="flex items-center justify-center gap-1.5 pt-4" aria-label="페이지네이션">
      <Link
        href={hrefFor(Math.max(1, currentPage - 1))}
        aria-disabled={currentPage === 1}
        onClick={() => trackEvent("Pagination Clicked", { direction: "prev", page: currentPage - 1 })}
        className={clsx(
          "flex h-8 w-8 items-center justify-center rounded-full text-neutral-400 transition-colors",
          currentPage === 1
            ? "pointer-events-none opacity-30"
            : "hover:bg-neutral-100 hover:text-ink"
        )}
      >
        <ChevronLeftIcon className="h-4 w-4" aria-hidden />
      </Link>

      {pages.map((page) => (
        <Link
          key={page}
          href={hrefFor(page)}
          aria-current={page === currentPage ? "page" : undefined}
          onClick={() => trackEvent("Pagination Clicked", { direction: "number", page })}
          className={clsx(
            "flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors",
            page === currentPage
              ? "bg-primary text-white"
              : "text-neutral-500 hover:bg-neutral-100 hover:text-ink"
          )}
        >
          {page}
        </Link>
      ))}

      <Link
        href={hrefFor(Math.min(totalPages, currentPage + 1))}
        aria-disabled={currentPage === totalPages}
        onClick={() => trackEvent("Pagination Clicked", { direction: "next", page: currentPage + 1 })}
        className={clsx(
          "flex h-8 w-8 items-center justify-center rounded-full text-neutral-400 transition-colors",
          currentPage === totalPages
            ? "pointer-events-none opacity-30"
            : "hover:bg-neutral-100 hover:text-ink"
        )}
      >
        <ChevronRightIcon className="h-4 w-4" aria-hidden />
      </Link>
    </nav>
  );
}
