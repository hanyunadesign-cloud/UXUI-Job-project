// 비로그인(게스트) 유저의 공고 저장을 브라우저에만 남기는 저장소. 로그인하면
// MixpanelBoot의 병합 로직이 이 목록을 SavedJob(DB)으로 옮기고 비운다.
const GUEST_SAVED_KEY = "uxui_guest_saved_jobs";

export function getGuestSavedJobIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(GUEST_SAVED_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function setGuestSavedJobIds(ids: string[]): void {
  try {
    window.localStorage.setItem(GUEST_SAVED_KEY, JSON.stringify(ids));
  } catch {
    // 프라이빗 모드 등으로 저장이 안 돼도 화면 동작 자체는 계속되게 조용히 무시한다.
  }
}

export function toggleGuestSavedJobId(jobId: string, saved: boolean): void {
  const current = getGuestSavedJobIds();
  const next = saved
    ? Array.from(new Set([...current, jobId]))
    : current.filter((id) => id !== jobId);
  setGuestSavedJobIds(next);
}

export function clearGuestSavedJobIds(): void {
  try {
    window.localStorage.removeItem(GUEST_SAVED_KEY);
  } catch {
    // ignore
  }
}
