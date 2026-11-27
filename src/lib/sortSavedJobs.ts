import { getApplicationStatus } from "@/lib/dday";

export type SavedSort = "latest" | "deadline";

type Sortable = {
  postedAt: Date;
  applicationDeadline: Date | null;
  applied: boolean;
};

// 저장 공고 페이지 정렬. 홈(/jobs)의 최신순·마감임박순과 같은 기준을 쓴다.
// - 최신순: 공고 등록일(postedAt) 내림차순
// - 마감임박순: 마감일 빠른 순, 마감일 없는(상시) 공고는 뒤로
// 그 다음, 아직 지원 안 한 열린 공고 → 지원완료한 공고 → 지원마감된 공고 순으로 묶는다
// (각 묶음 안에서는 위 정렬 순서를 그대로 유지).
export function sortSavedJobs<T extends Sortable>(items: T[], sort: SavedSort): T[] {
  let sorted: T[];
  if (sort === "deadline") {
    const withDeadline = items
      .filter((i) => i.applicationDeadline)
      .sort((a, b) => a.applicationDeadline!.getTime() - b.applicationDeadline!.getTime());
    const withoutDeadline = items
      .filter((i) => !i.applicationDeadline)
      .sort((a, b) => b.postedAt.getTime() - a.postedAt.getTime());
    sorted = [...withDeadline, ...withoutDeadline];
  } else {
    sorted = [...items].sort((a, b) => b.postedAt.getTime() - a.postedAt.getTime());
  }
  const closed = (i: T) => getApplicationStatus(i.applicationDeadline).closed;
  return [
    ...sorted.filter((i) => !closed(i) && !i.applied),
    ...sorted.filter((i) => !closed(i) && i.applied),
    ...sorted.filter((i) => closed(i)),
  ];
}
