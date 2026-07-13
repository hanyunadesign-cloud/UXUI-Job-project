// 온보딩에서 수집하는 4개 항목(관심 직무/플랫폼/도메인/스테이지) 중, 구직자에게 더 결정적인
// 정보일수록 가중치를 높게 뒀다: 직무 불일치는 사실상 무관한 공고이므로 가장 크게, 플랫폼은
// 여러 값을 동시에 관심 등록하는 경우가 많아 항목당 가중치는 작게 잡았다.
const WEIGHTS = {
  role: 40,
  industry: 25,
  stage: 20,
  platform: 5, // 겹치는 플랫폼 1개당
};

export type MatchableJob = {
  role: string;
  industry: string;
  stage: string;
  platforms: string[];
};

export type MatchPreference = {
  roles: string[];
  industries: string[];
  stages: string[];
  platforms: string[];
};

export function computeMatchScore(
  job: MatchableJob,
  preference: MatchPreference | null
): number {
  if (!preference) return 0;

  let score = 0;
  if (preference.roles.includes(job.role)) score += WEIGHTS.role;
  if (preference.industries.includes(job.industry)) score += WEIGHTS.industry;
  if (preference.stages.includes(job.stage)) score += WEIGHTS.stage;

  const platformMatches = job.platforms.filter((p) =>
    preference.platforms.includes(p)
  ).length;
  score += platformMatches * WEIGHTS.platform;

  return score;
}

export type MatchableCompany = {
  industry: string;
  stage: string;
};

// "추천 기업" 정렬용. Company는 role/platform 정보가 없어 job 매칭과 같은 가중치 중
// industry/stage만 재사용한다.
export function computeCompanyMatchScore(
  company: MatchableCompany,
  preference: MatchPreference | null
): number {
  if (!preference) return 0;

  let score = 0;
  if (preference.industries.includes(company.industry)) score += WEIGHTS.industry;
  if (preference.stages.includes(company.stage)) score += WEIGHTS.stage;

  return score;
}
