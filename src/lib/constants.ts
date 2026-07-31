export const ROLES = [
  "GUI 디자인",
  "UXUI·프로덕트",
  "UX기획",
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

// STAGES는 CompanyFilterBar/OnboardingWizard 등 여러 곳이 "문자열 배열"로 그대로 쓰고 있어서
// {value, description} 객체로 바꾸지 않고, 설명이 필요한 곳(FilterBar 드롭다운)에서만
// 이 조회용 맵을 따로 참조한다.
export const STAGE_DESCRIPTIONS: Record<string, string> = {
  스타트업: "0to1 단계",
  "유니콘·스케일업": "1to100 단계",
  "대기업·중견": "100to1000 단계",
  에이전시: "클라이언트 컨설팅",
};

export type Role = (typeof ROLES)[number];
export type Platform = (typeof PLATFORMS)[number];
export type Industry = (typeof INDUSTRIES)[number];
export type Stage = (typeof STAGES)[number];
