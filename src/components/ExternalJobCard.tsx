"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bookmark } from "lucide-react";
import { clsx } from "clsx";
import { Badge } from "@/components/Badge";
import { CompanyLogo } from "@/components/CompanyLogo";
import { useToast } from "@/components/ToastProvider";
import { trackEvent } from "@/lib/analytics";
import { ICON_SIZE } from "@/lib/design-tokens";
import { getApplicationStatus } from "@/lib/dday";

export type ExternalJobCardData = {
  id: string;
  title: string;
  companyName: string;
  companyLogo?: string | null;
  sourceUrl: string;
  coreKeywords: string[];
  createdAt: Date;
  applicationDeadline: Date | null;
};

function hostnameOf(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

// 일반 JobCard와 구조/치수를 그대로 맞춰서(각 영역 min-h까지 동일하게) 같은 그리드에
// 섞여도 카드 높이가 흔들리지 않게 한다. 다른 점은 우상단이 저장 토글이 아니라 항상
// 채워진 상태의 삭제 버튼이라는 것뿐이다.
export function ExternalJobCard({ job }: { job: ExternalJobCardData }) {
  const router = useRouter();
  const showToast = useToast();
  const [isPending, startTransition] = useTransition();
  const [removed, setRemoved] = useState(false);

  const remove = () => {
    setRemoved(true);
    trackEvent("External Job Removed", { jobId: job.id });
    showToast("저장한 링크를 삭제했어요");
    startTransition(async () => {
      try {
        const res = await fetch(`/api/mypage/external-jobs/${job.id}`, { method: "DELETE" });
        if (!res.ok) throw new Error("failed");
        router.refresh();
      } catch {
        setRemoved(false);
        trackEvent("External Job Remove Failed", { jobId: job.id });
        showToast("삭제하지 못했어요. 다시 시도해주세요.");
      }
    });
  };

  if (removed) return null;

  const status = getApplicationStatus(job.applicationDeadline);

  return (
    <div className="relative flex h-full flex-col gap-3 rounded-2xl bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(15,23,42,0.08)]">
      <button
        type="button"
        onClick={remove}
        disabled={isPending}
        aria-label="저장한 링크 삭제"
        className="absolute right-2.5 top-2.5 flex shrink-0 items-center justify-end p-1.5 text-primary transition-colors active:scale-[0.92] disabled:opacity-60"
      >
        <Bookmark className={ICON_SIZE.md} fill="currentColor" aria-hidden />
      </button>

      <div className="flex items-center gap-3 pr-12">
        <CompanyLogo
          src={job.companyLogo ?? null}
          alt={job.companyName}
          initial={job.companyName.slice(0, 1)}
          size={48}
        />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-ink">{job.companyName}</p>
          <p className="truncate text-xs text-neutral-400">{hostnameOf(job.sourceUrl)}</p>
        </div>
      </div>

      <Link href={`/mypage/external/${job.id}`} className="flex flex-col gap-3">
        <h3 className="text-h3 line-clamp-2 min-h-11 text-ink">
          {job.title}
        </h3>

        <p className="text-caption line-clamp-3 min-h-16 text-neutral-500">
          {job.coreKeywords.length > 0 ? job.coreKeywords.join(" · ") : ""}
        </p>

        <div className="flex min-h-14 flex-wrap content-start gap-1.5">
          <Badge tone="ink">🔗 링크 저장</Badge>
        </div>
      </Link>

      <div className="mt-auto flex items-center justify-between border-t border-neutral-100 pt-3">
        <p className="text-xs text-neutral-400">링크로 추가</p>
        <p
          className={clsx(
            "text-xs",
            status.urgent && "font-semibold text-negative",
            status.closed && "text-neutral-300",
            !status.urgent && !status.closed && "text-neutral-400"
          )}
        >
          {status.label}
        </p>
      </div>
    </div>
  );
}
