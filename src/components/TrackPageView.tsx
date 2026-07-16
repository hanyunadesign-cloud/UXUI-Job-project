"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

// 서버 컴포넌트인 상세 페이지에서 마운트 시점에 페이지뷰 이벤트 하나를 보내기 위한
// 최소 클라이언트 컴포넌트. 화면에는 아무것도 렌더링하지 않는다.
export function TrackPageView({
  name,
  props,
}: {
  name: string;
  props?: Record<string, unknown>;
}) {
  useEffect(() => {
    trackEvent(name, props);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
