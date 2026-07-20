const URGENT_THRESHOLD_DAYS = 10;

export type ApplicationStatus = {
  label: string;
  urgent: boolean;
  // 마감일이 지나 더 이상 지원할 수 없는 공고. 상시채용(urgent: false)과는 구분해서 흐리게 표시한다.
  closed?: boolean;
};

// deadline이 없으면 상시채용. 있으면 D-10 이내는 D-n으로 강조, 그보다 여유 있으면 ~M/D로 표기.
export function getApplicationStatus(deadline: Date | null): ApplicationStatus {
  if (!deadline) {
    return { label: "채용 시 마감", urgent: false };
  }

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const deadlineDay = new Date(
    deadline.getFullYear(),
    deadline.getMonth(),
    deadline.getDate()
  );
  const diffDays = Math.round(
    (deadlineDay.getTime() - startOfToday.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays < 0) {
    return { label: "지원마감", urgent: false, closed: true };
  }
  if (diffDays === 0) {
    return { label: "오늘마감", urgent: true };
  }
  if (diffDays <= URGENT_THRESHOLD_DAYS) {
    return { label: `D-${diffDays}`, urgent: true };
  }
  return { label: `~${deadline.getMonth() + 1}/${deadline.getDate()}`, urgent: false };
}
