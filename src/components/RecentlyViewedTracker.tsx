"use client";

import { useEffect } from "react";

const STORAGE_KEY = "uxui-job:recently-viewed-jobs";
const MAX_ENTRIES = 18;

export type RecentlyViewedJob = {
  id: string;
  title: string;
  companyName: string;
  companyLogo: string | null;
};

// 로컬 미니 시안 전용: 공고 상세를 열어볼 때마다 이 공고를 최근 목록 맨 앞으로 올린다.
// 서버에 저장하지 않고 브라우저 localStorage에만 남기는, 순전히 이 기기 안에서의 기록이다.
export function RecentlyViewedTracker({ job }: { job: RecentlyViewedJob }) {
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const list: RecentlyViewedJob[] = raw ? JSON.parse(raw) : [];
      const next = [job, ...list.filter((j) => j.id !== job.id)].slice(0, MAX_ENTRIES);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // localStorage 접근 불가(프라이빗 모드 등)여도 페이지 동작에는 영향 없게 조용히 무시한다.
    }
  }, [job]);

  return null;
}
