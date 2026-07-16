"use client";

import { useEffect, useRef } from "react";
import { trackEvent } from "@/lib/analytics";

const SCROLL_MILESTONES = [50, 100];

// 서버 컴포넌트인 상세 페이지에서 마운트 시점에 페이지뷰 이벤트를, 이탈 시점에는
// 체류시간 이벤트를, 스크롤 시점에는 스크롤 깊이 이벤트를 보내기 위한 최소 클라이언트
// 컴포넌트. 화면에는 아무것도 렌더링하지 않는다.
//
// 이탈은 두 경로로 잡는다: SPA 내 다른 페이지로 이동(React 언마운트)과, 새로고침/탭
// 닫기/외부 이동(pagehide, visibilitychange). 둘 다 걸어두고 sentRef로 중복 전송만 막는다.
export function TrackPageView({
  name,
  props,
  dwellEventName,
  scrollDepthEventName,
}: {
  name: string;
  props?: Record<string, unknown>;
  // 지정하면 페이지를 떠날 때 { ...props, seconds }로 체류시간 이벤트를 함께 보낸다.
  dwellEventName?: string;
  // 지정하면 페이지 세로 스크롤이 50%, 100% 지점을 지날 때 { ...props, depth }를 보낸다.
  // 각 마일스톤은 페이지당 한 번씩만 보낸다.
  scrollDepthEventName?: string;
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

    let handleScroll: (() => void) | undefined;
    const reachedMilestones = new Set<number>();

    if (scrollDepthEventName) {
      let ticking = false;
      const checkDepth = () => {
        ticking = false;
        const scrollable = document.documentElement.scrollHeight - window.innerHeight;
        // 페이지가 뷰포트보다 짧아 스크롤할 게 없으면 이미 전부 보인 것으로 간주한다.
        const percent = scrollable <= 0 ? 100 : (window.scrollY / scrollable) * 100;
        SCROLL_MILESTONES.forEach((milestone) => {
          if (percent >= milestone && !reachedMilestones.has(milestone)) {
            reachedMilestones.add(milestone);
            trackEvent(scrollDepthEventName, { ...props, depth: milestone });
          }
        });
      };

      handleScroll = () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(checkDepth);
      };

      window.addEventListener("scroll", handleScroll, { passive: true });
      checkDepth();
    }

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("pagehide", sendDwell);
      if (handleScroll) window.removeEventListener("scroll", handleScroll);
      sendDwell();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
