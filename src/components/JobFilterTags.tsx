import Link from "next/link";

// 채용공고 상세페이지 시안: 기존 정적 뱃지(Badge.tsx)와 완전히 같은 스타일을 그대로 쓰되,
// 클릭하면 그 값으로 필터링된 목록으로 이동하는 링크로만 바꾼다 — 튀는 새 스타일(파란
// 알약)은 사용자가 "너무 눈에 띈다"고 반려해서, 눈에 띄지 않는 기존 룩을 유지한다.
// 직군(role)·기업규모(stage)는 빼고 산업·매체만 보여준다 — 필터 바 순서(경력·규모·산업·
// 매체·업무) 중 이 두 카테고리만 순서대로 남긴다.
// 1개 공고 한정 시안이라 다른 공고에 영향 없이 jobs/[id]/page.tsx에서 조건부로만 렌더링한다.
type JobFilterTagsProps = {
  industries: string[];
  platforms: string[];
};

function Tag({ paramKey, value }: { paramKey: string; value: string }) {
  return (
    <Link
      href={`/jobs?${paramKey}=${encodeURIComponent(value)}`}
      className="inline-flex items-center rounded-md border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs font-medium text-neutral-600 transition-colors hover:border-neutral-300 hover:bg-neutral-100"
    >
      {value}
    </Link>
  );
}

export function JobFilterTags({ industries, platforms }: JobFilterTagsProps) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {industries.map((industry) => (
        <Tag key={industry} paramKey="industry" value={industry} />
      ))}
      {platforms.map((platform) => (
        <Tag key={platform} paramKey="platform" value={platform} />
      ))}
    </div>
  );
}
