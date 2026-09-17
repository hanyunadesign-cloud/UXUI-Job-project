import { kstDateParts, kstMidnight } from "./kst";

const URGENT_THRESHOLD_DAYS = 15;

export type ApplicationStatus = {
  label: string;
  urgent: boolean;
  // 마감일이 지나 더 이상 지원할 수 없는 공고. 상시채용(urgent: false)과는 구분해서 흐리게 표시한다.
  closed?: boolean;
};

// deadline이 없으면 상시채용. 있으면 D-15 이내는 D-n으로 강조, 그보다 여유 있으면 ~M/D로 표기.
// 날짜 비교는 항상 한국 시간(KST) 기준으로 한다 — 서버 런타임의 기본 타임존(로컬은 보통
// Asia/Seoul, Vercel 프로덕션은 보통 UTC)에 따라 .getDate() 결과가 갈려서, 같은 공고를
// 페이지마다 다른 날짜로 보여주는 문제가 있었다.
export function getApplicationStatus(deadline: Date | null): ApplicationStatus {
  if (!deadline) {
    return { label: "채용 시 마감", urgent: false };
  }

  const today = kstDateParts(new Date());
  const startOfToday = kstMidnight(today.year, today.month, today.day);

  const dl = kstDateParts(deadline);
  const deadlineDay = kstMidnight(dl.year, dl.month, dl.day);

  const diffDays = Math.round(
    (deadlineDay.getTime() - startOfToday.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays < 0) {
    return { label: `지원마감 · D+${-diffDays}`, urgent: false, closed: true };
  }
  if (diffDays === 0) {
    return { label: "오늘마감", urgent: true };
  }
  if (diffDays <= URGENT_THRESHOLD_DAYS) {
    return { label: `D-${diffDays}`, urgent: true };
  }
  return { label: `~${dl.month}/${dl.day}`, urgent: false };
}
