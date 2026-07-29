"use client";

import { useEffect } from "react";
import { markJobViewed } from "@/lib/viewed-jobs";

// 서버 컴포넌트인 상세 페이지에서, 마운트 시점에 이 공고를 "본 공고"로 기록하기 위한
// 최소 클라이언트 컴포넌트. 화면에는 아무것도 렌더링하지 않는다.
export function MarkJobViewed({ jobId }: { jobId: string }) {
  useEffect(() => {
    markJobViewed(jobId);
  }, [jobId]);

  return null;
}
