export const ROLES = [
  "GUI 디자이너",
  "UXUI 디자이너",
  "프로덕트 디자이너",
  "UX 라이터",
  "UX 리서처",
] as const;

export const PLATFORMS = [
  "웹",
  "앱",
  "태블릿",
  "워치/웨어러블",
  "모빌리티",
  "가전",
  "VR/AR",
] as const;

export const INDUSTRIES = [
  "커머스",
  "핀테크",
  "SNS",
  "여행/로컬",
  "B2B SaaS",
  "헬스케어",
  "모빌리티",
] as const;

export const STAGES = [
  "스타트업",
  "유니콘",
  "중견 기업",
  "대기업",
  "에이전시",
] as const;

export type Role = (typeof ROLES)[number];
export type Platform = (typeof PLATFORMS)[number];
export type Industry = (typeof INDUSTRIES)[number];
export type Stage = (typeof STAGES)[number];
