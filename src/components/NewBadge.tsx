"use client";

import { useEffect, useState } from "react";
import { getViewedJobIds } from "@/lib/viewed-jobs";

// 하이드레이션 불일치를 피하려고 서버/최초 렌더에서는 항상 숨긴 채로 시작하고,
// 마운트 후에만 localStorage를 확인해 "안 본 공고"일 때만 뱃지를 보여준다.
export function NewBadge({ jobId }: { jobId: string }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(!getViewedJobIds().includes(jobId));
  }, [jobId]);

  if (!show) return null;

  return (
    <span className="shrink-0 rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-bold leading-none text-white">
      NEW
    </span>
  );
}
