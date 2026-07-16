"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { trackEvent } from "@/lib/analytics";

// CompanyFilterBar와 별도 컴포넌트로 분리한 이유: "채용중인 기업"은
// 검색 결과 개수 텍스트(서버 컴포넌트인 page.tsx에서 렌더)와 같은 줄에 위치해야 해서,
// 필터 드롭다운/검색바 줄과는 다른 자리에서 독립적으로 URL 파라미터를 다룬다.
export function ActiveOnlyCheckbox() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeOnly = searchParams.get("activeOnly") === "1";

  const toggle = () => {
    trackEvent("Active Only Toggled", { enabled: !activeOnly });
    const params = new URLSearchParams(searchParams.toString());
    if (activeOnly) {
      params.delete("activeOnly");
    } else {
      params.set("activeOnly", "1");
    }
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <label className="flex w-fit shrink-0 cursor-pointer items-center gap-2 text-sm text-neutral-500">
      <input
        type="checkbox"
        checked={activeOnly}
        onChange={toggle}
        className="h-4 w-4 rounded border-neutral-300 text-primary focus:ring-primary"
      />
      채용중인 기업
    </label>
  );
}
