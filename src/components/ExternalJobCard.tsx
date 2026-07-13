"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookmarkIcon as BookmarkSolid } from "@heroicons/react/24/solid";
import { Badge } from "@/components/Badge";
import { CompanyLogo } from "@/components/CompanyLogo";
import { useToast } from "@/components/ToastProvider";

export type ExternalJobCardData = {
  id: string;
  title: string;
  companyName: string;
  sourceUrl: string;
  coreKeywords: string[];
  createdAt: Date;
};

function hostnameOf(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

function formatSavedDate(date: Date): string {
  return `${date.getMonth() + 1}/${date.getDate()} 저장`;
}

// 일반 JobCard와 구조/치수를 그대로 맞춰서 같은 그리드에 섞여도 이질감이 없게 한다.
// 다른 점은 두 가지뿐: 우상단이 저장 토글이 아니라 항상 채워진 상태의 삭제 버튼이고,
// 뱃지 줄에 실제 데이터(플랫폼/산업/규모) 대신 출처를 표시하는 "링크 저장" 뱃지 하나만 온다.
export function ExternalJobCard({ job }: { job: ExternalJobCardData }) {
  const router = useRouter();
  const showToast = useToast();
  const [isPending, startTransition] = useTransition();
  const [removed, setRemoved] = useState(false);

  const remove = () => {
    setRemoved(true);
    showToast("저장한 링크를 삭제했어요");
    startTransition(async () => {
      try {
        const res = await fetch(`/api/mypage/external-jobs/${job.id}`, { method: "DELETE" });
        if (!res.ok) throw new Error("failed");
        router.refresh();
      } catch {
        setRemoved(false);
        showToast("삭제하지 못했어요. 다시 시도해주세요.");
      }
    });
  };

  if (removed) return null;

  return (
    <div className="relative flex h-full flex-col gap-3 rounded-2xl border border-neutral-200 bg-white p-4 transition-colors hover:border-neutral-300">
      <button
        type="button"
        onClick={remove}
        disabled={isPending}
        aria-label="저장한 링크 삭제"
        className="absolute right-2.5 top-2.5 flex shrink-0 items-center justify-end p-1.5 text-primary transition-colors active:scale-[0.92] disabled:opacity-60"
      >
        <BookmarkSolid className="h-6 w-6" aria-hidden />
      </button>

      <div className="flex items-center gap-3 pr-12">
        <CompanyLogo src={null} alt={job.companyName} initial={job.companyName.slice(0, 1)} size={48} />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-ink">{job.companyName}</p>
          <p className="truncate text-xs text-neutral-400">{hostnameOf(job.sourceUrl)}</p>
        </div>
      </div>

      <Link href={`/mypage/external/${job.id}`} className="flex flex-col gap-3">
        <h3 className="line-clamp-2 min-h-11 text-base font-bold leading-snug text-ink">
          {job.title}
        </h3>

        <p className="line-clamp-3 min-h-16 text-sm text-neutral-500">
          {job.coreKeywords.length > 0 ? job.coreKeywords.join(" · ") : ""}
        </p>

        <div className="flex min-h-14 flex-wrap content-start gap-1.5">
          <Badge tone="ink">🔗 링크 저장</Badge>
        </div>
      </Link>

      <div className="mt-auto flex items-center justify-between border-t border-neutral-100 pt-3">
        <p className="text-xs text-neutral-400">링크로 추가</p>
        <p className="text-xs text-neutral-400">{formatSavedDate(job.createdAt)}</p>
      </div>
    </div>
  );
}
