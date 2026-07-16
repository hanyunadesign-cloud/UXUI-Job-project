"use client";

import { useEffect, useRef } from "react";
import { trackEvent } from "@/lib/analytics";

// 서버 컴포넌트인 상세 페이지에서 마운트 시점에 페이지뷰 이벤트를, 이탈 시점에는
// 체류시간 이벤트를 보내기 위한 최소 클라이언트 컴포넌트. 화면에는 아무것도 렌더링하지 않는다.
//
// 이탈은 두 경로로 잡는다: SPA 내 다른 페이지로 이동(React 언마운트)과, 새로고침/탭
// 닫기/외부 이동(pagehide, visibilitychange). 둘 다 걸어두고 sentRef로 중복 전송만 막는다.
export function TrackPageView({
  name,
  props,
  dwellEventName,
}: {
  name: string;
  props?: Record<string, unknown>;
  // 지정하면 페이지를 떠날 때 { ...props, seconds }로 체류시간 이벤트를 함께 보낸다.
  dwellEventName?: string;
}) {
  const startedAtRef = useRef(0);
  const sentRef = useRef(false);

  useEffect(() => {
    trackEvent(name, props);
    startedAtRef.current = Date.now();

    const sendDwell = () => {
      if (sentRef.current || !dwellEventName) return;
      sentRef.current = true;
      const seconds = Math.round((Date.now() - startedAtRef.current) / 1000);
      trackEvent(dwellEventName, { ...props, seconds });
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") sendDwell();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("pagehide", sendDwell);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("pagehide", sendDwell);
      sendDwell();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
