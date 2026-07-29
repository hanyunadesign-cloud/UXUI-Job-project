const STORAGE_KEY = "uxui-job-viewed-ids";

// 공고 상세를 한 번이라도 본 유저에게는 "NEW" 뱃지를 다시 안 보여주기 위한 브라우저 로컬 기록.
// 서버에 저장할 만큼 중요한 데이터가 아니라 로그인 여부와 무관하게 기기별로 간단히 localStorage에 둔다.
export function getViewedJobIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function markJobViewed(jobId: string) {
  if (typeof window === "undefined") return;
  try {
    const viewed = new Set(getViewedJobIds());
    viewed.add(jobId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...viewed]));
  } catch {
    // 시크릿 모드 등으로 localStorage를 못 쓰면 NEW 뱃지가 계속 보이는 정도로만 열화시키고 무시한다.
  }
}
