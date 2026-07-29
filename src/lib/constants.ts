export const ROLES = [
  "GUI 디자인",
  "UXUI 디자인",
  "UX 라이팅",
  "UX 리서치",
] as const;

export const PLATFORMS = ["앱", "웹", "모빌리티", "기타"] as const;

export const INDUSTRIES = [
  "IT/서비스",
  "커머스",
  "핀테크",
  "B2B SaaS",
  "AI",
  "유통",
  "모빌리티",
  "게임",
  "에듀테크",
  "헬스케어",
  "SNS",
  "여행/로컬",
] as const;

export const STAGES = [
  "스타트업",
  "유니콘·스케일업",
  "대기업·중견",
  "에이전시",
] as const;

export const EXPERIENCE_LEVELS = [
  { value: "신입", description: "인턴 또는 실무 경험 없음" },
  { value: "주니어", description: "기초적인 업무 수행\n(1~3년차에 준하는 실력)" },
  { value: "미들", description: "준수한 이해도, 프로젝트 전담\n(3~7년차에 준하는 실력)" },
  {
    value: "시니어",
    description: "높은 이해도, 다수로 구성된 팀 리드\n(7년차 이상에 준하는 실력)",
  },
] as const;

export type Role = (typeof ROLES)[number];
export type Platform = (typeof PLATFORMS)[number];
export type Industry = (typeof INDUSTRIES)[number];
export type Stage = (typeof STAGES)[number];
export type ExperienceLevel = (typeof EXPERIENCE_LEVELS)[number]["value"];
