import Link from "next/link";
import { Badge } from "@/components/Badge";
import { SaveButton } from "@/components/SaveButton";
import { CompanyLogo } from "@/components/CompanyLogo";
import { formatLocation } from "@/lib/location";
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
  industry: string;
  stage: string;
  applicationDeadline: Date | null;
  experienceLevel: string;
  taskKeywords: string[];
};

// 뱃지 영역을 2줄로 고정하기 위한 최대 노출 개수. 넘치면 "+N"으로 표시한다.
const MAX_VISIBLE_BADGES = 4;

export function JobCard({ job, saved }: { job: JobCardData; saved: boolean }) {
  const initial = job.companyName.slice(0, 1);

  const allBadges = [...job.platforms, job.industry, job.stage];
  const overflowCount = Math.max(0, allBadges.length - MAX_VISIBLE_BADGES);
  const visibleBadges = overflowCount > 0
    ? allBadges.slice(0, MAX_VISIBLE_BADGES - 1)
    : allBadges;

  const status = getApplicationStatus(job.applicationDeadline);

  return (
    <div
      className={clsx(
        "relative flex h-full flex-col gap-3 rounded-2xl border border-neutral-200 bg-white p-4 transition-colors hover:border-neutral-300",
        status.closed && "opacity-60"
      )}
    >
      {/* SaveButton의 p-1.5(6px) 내부 패딩을 미리 빼서, 아이콘 실제 가장자리가
          카드의 다른 콘텐츠와 동일한 16px 인셋에 오도록 한다 (16 - 6 = 10px). */}
      <div className="absolute right-2.5 top-2.5">
        <SaveButton jobId={job.id} initialSaved={saved} size="sm" />
      </div>

      {/* 프로필 행: 기업 로고/기업명은 카드 나머지 부분과 별도로 기업 프로필로 연결된다 */}
      {job.companyId ? (
        <Link href={`/companies/${job.companyId}`} className="flex items-center gap-3 pr-12">
          <CompanyLogo
            src={job.companyLogo}
            alt={job.companyName}
            initial={initial}
            size={48}
          />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-ink hover:underline">
              {job.companyName}
            </p>
            <p className="truncate text-xs text-neutral-400">
              {formatLocation(job.location) ?? "위치 미정"}
            </p>
          </div>
        </Link>
      ) : (
        <div className="flex items-center gap-3 pr-12">
          <CompanyLogo
            src={job.companyLogo}
            alt={job.companyName}
            initial={initial}
            size={48}
          />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-ink">{job.companyName}</p>
            <p className="truncate text-xs text-neutral-400">
              {formatLocation(job.location) ?? "위치 미정"}
            </p>
          </div>
        </div>
      )}

      <Link href={`/jobs/${job.id}`} className="flex flex-col gap-3">
        {/* 제목: 최대 2줄 고정, 1줄짜리 제목도 동일한 자리를 차지 */}
        <h3 className="line-clamp-2 min-h-11 text-base font-bold leading-snug text-ink">
          {job.title}
        </h3>

        {/* AI 업무 키워드: 최대 3줄 고정 */}
        <p className="line-clamp-3 min-h-16 text-sm text-neutral-500">
          {job.taskKeywords.length > 0 ? job.taskKeywords.join(" · ") : ""}
        </p>

        {/* 뱃지: 최대 2줄 고정, 넘치면 +N */}
        <div className="flex min-h-14 flex-wrap content-start gap-1.5">
          {visibleBadges.map((label, i) => (
            <Badge key={`${label}-${i}`}>{label}</Badge>
          ))}
          {overflowCount > 0 && <Badge>+{overflowCount}</Badge>}
        </div>
      </Link>

      {/* 하단 정보: 위 섹션이 모두 고정 높이라 자연스럽게 맞춰지지만, mt-auto로 이중 보장 */}
      <div className="mt-auto flex items-center justify-between border-t border-neutral-100 pt-3">
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
    </div>
  );
}
