"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { clsx } from "clsx";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

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
    const params = new URLSearchParams(searchParams.toString());
    if (query.trim()) {
      params.set(paramKey, query.trim());
    } else {
      params.delete(paramKey);
    }
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div
      className={clsx(
        "flex h-[47px] w-56 shrink-0 items-center gap-2 rounded-full border border-neutral-200 bg-white px-4",
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
        className="w-full flex-1 bg-transparent text-sm text-ink placeholder:text-neutral-400 focus:outline-none"
      />
      <button
        type="button"
        onClick={submit}
        aria-label="검색"
        className="shrink-0 text-neutral-400 transition-colors hover:text-ink"
      >
        <MagnifyingGlassIcon className="h-4 w-4" aria-hidden />
      </button>
    </div>
  );
}
