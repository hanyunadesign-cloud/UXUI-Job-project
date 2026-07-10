"use client";

import { useEffect, useState, useCallback } from "react";
import { Badge } from "@/components/Badge";

type Analysis = {
  coreKeywords: string[];
  resumeTip: string;
};

type Status = "loading" | "success" | "error";

export function AnalysisPanel({
  jobId,
  initialAnalysis,
}: {
  jobId: string;
  initialAnalysis: Analysis | null;
}) {
  const [status, setStatus] = useState<Status>(initialAnalysis ? "success" : "loading");
  const [analysis, setAnalysis] = useState<Analysis | null>(initialAnalysis);

  const runAnalysis = useCallback(async () => {
    setStatus("loading");
    try {
      const res = await fetch(`/api/jobs/${jobId}/analyze`, { method: "POST" });
      if (!res.ok) throw new Error("analysis failed");
      const data: Analysis = await res.json();
      setAnalysis(data);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }, [jobId]);

  useEffect(() => {
    if (!initialAnalysis) {
      runAnalysis();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="rounded-2xl border border-neutral-200 p-6">
      <h2 className="mb-4 text-sm font-semibold text-ink">AI 분석</h2>

      {status === "loading" && (
        <div className="flex flex-col gap-3">
          <div className="h-4 w-2/3 animate-pulse rounded bg-neutral-100" />
          <div className="h-4 w-1/2 animate-pulse rounded bg-neutral-100" />
          <div className="h-4 w-5/6 animate-pulse rounded bg-neutral-100" />
        </div>
      )}

      {status === "error" && (
        <div className="flex flex-col items-start gap-3">
          <p className="text-sm text-neutral-500">지금은 분석이 어려워요</p>
          <button
            type="button"
            onClick={runAnalysis}
            className="rounded-full border border-neutral-300 px-4 py-1.5 text-xs font-medium text-ink hover:bg-neutral-50"
          >
            다시 시도
          </button>
        </div>
      )}

      {status === "success" && analysis && (
        <div className="flex flex-col gap-4">
          <div>
            <p className="mb-2 text-xs font-medium text-neutral-400">핵심 역량 키워드</p>
            <div className="flex flex-wrap gap-1.5">
              {analysis.coreKeywords.map((keyword) => (
                <Badge key={keyword}>{keyword}</Badge>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-xs font-medium text-neutral-400">이력서/포트폴리오 어필 포인트</p>
            <p className="text-sm leading-relaxed text-ink">{analysis.resumeTip}</p>
          </div>
        </div>
      )}
    </div>
  );
}
