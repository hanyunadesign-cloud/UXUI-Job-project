import Link from "next/link";
import { SaveButton } from "@/components/SaveButton";
import { CompanyLogo } from "@/components/CompanyLogo";
import { NewBadge } from "@/components/NewBadge";
import { getApplicationStatus } from "@/lib/dday";
import { clsx } from "clsx";

export type JobCardData = {
  id: string;
  title: string;
  companyName: string;
  companyLogo: string | null;
  companyId: string | null;
  location: string | null;
  platforms: string[];
  industries: string[];
  stage: string;
  applicationDeadline: Date | null;
  experienceLevel: string;
  taskKeywords: string[];
};

export function JobCard({
  job,
  saved,
  isLoggedIn,
  isNew,
}: {
  job: JobCardData;
  saved: boolean;
  isLoggedIn: boolean;
  isNew?: boolean;
}) {
  const initial = job.companyName.slice(0, 1);

  const status = getApplicationStatus(job.applicationDeadline);

  return (
    <Link
      href={`/jobs/${job.id}`}
      className={clsx(
        "relative flex h-full flex-col gap-3 rounded-2xl bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(15,23,42,0.08)]",
        status.closed && "opacity-60"
      )}
    >
      {/* SaveButton의 p-1.5(6px) 내부 패딩을 미리 빼서, 아이콘 실제 가장자리가
          카드의 다른 콘텐츠와 동일한 16px 인셋에 오도록 한다 (16 - 6 = 10px). */}
      <div className="absolute right-2.5 top-2.5">
        <SaveButton jobId={job.id} initialSaved={saved} isLoggedIn={isLoggedIn} size="sm" />
      </div>

      {/* 프로필 행: 기업 로고/기업명은 클릭해도 아무 데도 이동하지 않는 순수 표시 정보다 */}
      <div className="flex items-center gap-3 pr-12">
        <CompanyLogo
          src={job.companyLogo}
          alt={job.companyName}
          initial={initial}
          size={48}
        />
        <p className="flex min-w-0 items-center gap-1.5">
          <span className="truncate text-sm font-semibold text-ink">{job.companyName}</span>
          {isNew && <NewBadge jobId={job.id} />}
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {/* 제목: 최대 2줄 고정, 1줄짜리 제목도 동일한 자리를 차지 */}
        <h3 className="text-h3 line-clamp-2 min-h-8 text-ink">
          {job.title}
        </h3>

        {/* AI 업무 키워드: 카드에서는 2개까지만, 1줄로 고정(넘치면 말줄임). 메타 정보라 caption 톤 */}
        <p className="text-caption line-clamp-1 min-h-4 text-neutral-500">
          {job.taskKeywords.slice(0, 2).join(" · ")}
        </p>
      </div>

      {/* 하단 정보: 위 섹션이 모두 고정 높이라 자연스럽게 맞춰지지만, mt-auto로 이중 보장.
          구분선으로 위 직무 설명과 시각적으로 분리한다. */}
      <div className="mt-auto flex items-center justify-between border-t border-neutral-100 pt-2">
        <p className="text-xs text-neutral-400">{job.experienceLevel}</p>
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
    </Link>
  );
}
