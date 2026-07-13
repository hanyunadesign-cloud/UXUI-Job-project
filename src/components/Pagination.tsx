import Link from "next/link";
import { clsx } from "clsx";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

// 서버 컴포넌트로 구현: 페이지 이동은 링크 클릭만으로 충분해 클라이언트 JS가 필요 없다.
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
