"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { clsx } from "clsx";
import { Search } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { ICON_SIZE } from "@/lib/design-tokens";

// 사진 속 검색바 스타일(화이트 pill, 우측 돋보기 아이콘)을 재사용하는 공용 검색창.
// paramKey로 어떤 URL 쿼리 파라미터를 읽고 쓸지 결정해, 같은 컴포넌트를 여러 페이지에서
// 서로 다른 검색 대상(기업명/공고명)으로 재사용한다.
export function SearchBar({
  paramKey,
  placeholder,
  className,
}: {
  paramKey: string;
  placeholder: string;
  className?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get(paramKey) ?? "");

  useEffect(() => {
    setQuery(searchParams.get(paramKey) ?? "");
  }, [searchParams, paramKey]);

  const submit = () => {
    const trimmed = query.trim();
    // 값이 안 바뀌었으면(포커스만 빠졌다 들어온 경우 등) 중복 이벤트를 안 보낸다.
    if (trimmed === (searchParams.get(paramKey) ?? "")) return;

    trackEvent("Search Submitted", { paramKey, query: trimmed });
    const params = new URLSearchParams(searchParams.toString());
    if (trimmed) {
      params.set(paramKey, trimmed);
    } else {
      params.delete(paramKey);
    }
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div
      className={clsx(
        "flex h-8 w-72 shrink-0 items-center gap-2 rounded-lg bg-white px-3 shadow-sm",
        className
      )}
    >
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") submit();
        }}
        onBlur={submit}
        placeholder={placeholder}
        className="w-full flex-1 bg-transparent text-sm font-medium text-ink placeholder:text-neutral-300 focus:outline-none"
      />
      <button
        type="button"
        onClick={submit}
        aria-label="검색"
        className="shrink-0 text-neutral-300 transition-colors hover:text-ink"
      >
        <Search className={ICON_SIZE.sm} strokeWidth={1.75} aria-hidden />
      </button>
    </div>
  );
}
