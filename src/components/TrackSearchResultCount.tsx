"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { trackEvent } from "@/lib/analytics";

// 검색/필터가 걸린 채로 목록 페이지가 렌더링됐을 때, 그 조건으로 결과가 몇 건
// 나왔는지 함께 보낸다. "결과가 0건이라 이탈"인지 "결과는 있는데 마음에 안 들어서
// 이탈"인지 구분하기 위한 용도. 같은 컴포넌트 인스턴스가 재사용돼도(예: 필터를 연달아
// 바꾸는 경우) 쿼리 문자열이 바뀔 때마다 다시 보내야 하므로, 마운트가 아니라 쿼리
// 문자열을 의존성으로 건다.
export function TrackSearchResultCount({
  eventName,
  resultCount,
  activeParamKeys,
}: {
  eventName: string;
  resultCount: number;
  // 이 중 하나라도 URL에 있을 때만 "검색/필터가 걸린 조회"로 간주해 이벤트를 보낸다.
  activeParamKeys: string[];
}) {
  const searchParams = useSearchParams();
  const query = searchParams.toString();
  const isActive = activeParamKeys.some((key) => searchParams.has(key));

  useEffect(() => {
    if (!isActive) return;
    trackEvent(eventName, { resultCount, query });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, isActive]);

  return null;
}
