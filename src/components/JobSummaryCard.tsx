import { getApplicationStatus } from "@/lib/dday";

// "공고 요약" 카드 시안 테스트용. 실 데이터 필드(경력/고용형태/직군/지역/마감일/기업 규모)로
// 채운 2열 표 — 사용자가 고른 "시안 A"(회색 박스, 구분선 없음, 레귤러 굵기) 그대로.
export function JobSummaryCard({
  job,
}: {
  job: {
    role: string;
    stage: string;
    location: string | null;
    employmentType: string;
    experienceLevel: string;
    applicationDeadline: Date | null;
  };
}) {
  const deadlineLabel = getApplicationStatus(job.applicationDeadline).label;

  const rows: [string, string][] = [
    ["경력", job.experienceLevel],
    ["고용형태", job.employmentType],
    ["직군", job.role],
    ["지역", job.location ?? "미표기"],
    ["마감일", deadlineLabel],
    ["기업 규모", job.stage],
  ];

  return (
    <div className="mb-10">
      <div className="rounded-2xl bg-neutral-50 p-[28px]">
        <div className="flex flex-col gap-4">
          {Array.from({ length: Math.ceil(rows.length / 2) }).map((_, i) => {
            const [labelA, valueA] = rows[i * 2];
            const pairB = rows[i * 2 + 1];
            return (
              <div key={labelA} className="grid grid-cols-[88px_1fr_88px_1fr] items-center">
                <span className="text-sm text-neutral-400">{labelA}</span>
                <span className="text-sm font-normal text-ink">{valueA}</span>
                {pairB && (
                  <>
                    <span className="text-sm text-neutral-400">{pairB[0]}</span>
                    <span className="text-sm font-normal text-ink">{pairB[1]}</span>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
