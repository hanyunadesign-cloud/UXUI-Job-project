import { prisma } from "./prisma";
import { analyzeJobDescription, classifyJobPosting, reflowJobDescriptionParagraphs } from "./gemini";
import { findOrCreateCompanyId } from "./company";
import type { Job } from "@prisma/client";

// ingest-jobs.ts(그린하우스/애시비 자동 수집)와 candidate-jobs API(스케줄 에이전트가 발견한
// 공고)가 공통으로 쓰는 텍스트 추출 로직. 원래 ingest-jobs.ts 안에 있던 걸 그대로 옮겼다
// (로직 변경 없음).

// 공고 원문에서 구체적인 날짜가 들어간 서류접수 기간만 인정한다.
// "매주 화요일 마감"처럼 반복되는 상대적 마감은 고정 기간이 아니므로 제외하고 상시채용으로 처리한다.
// 날짜 구분자는 "."/"-" 뿐 아니라 "/"(예: 2026/08/17)도 실제 공고 원문에서 흔히 쓰여서 함께 받는다.
const APPLICATION_PERIOD_PATTERNS = [
  // 첫 날짜와 "~" 사이에도 "(수) 15:00" 같은 요일/시각 표기가 흔히 끼어들어 약간의 간격을 허용한다.
  /\d{4}[.\-\/]\s?\d{1,2}[.\-\/]\s?\d{1,2}.{0,12}?[~\-–]\s?\d{4}[.\-\/]\s?\d{1,2}[.\-\/]\s?\d{1,2}/,
  /(\d{4})년\s?\d{1,2}월\s?\d{1,2}일.{0,12}?[~\-–]\s?(\d{4}년\s?)?\d{1,2}월\s?\d{1,2}일/,
  /\d{1,2}월\s?\d{1,2}일\s?[~\-–]\s?\d{1,2}월\s?\d{1,2}일/,
  // 날짜와 "까지" 사이에 "(화) 24시" 같은 요일/시각 표기가 끼어드는 경우가 흔해서 약간의
  // 간격을 허용한다(너무 넓게 잡으면 엉뚱한 "까지"와 묶일 수 있어 12자로 제한).
  /\d{4}[.\-\/]\s?\d{1,2}[.\-\/]\s?\d{1,2}.{0,12}?까지/,
  /\d{4}년\s?\d{1,2}월\s?\d{1,2}일.{0,12}?까지/,
  /\d{1,2}월\s?\d{1,2}일\s?까지/,
  // "~2026.08.21(금) 23:59"처럼 "까지"도 없이 "~"만 붙은 채로 끝나는 경우("~"가 "이 날짜까지"의
  // 줄임 표기로 흔히 쓰인다). "까지"는 있어도 되고 없어도 된다.
  /~\s?\d{4}[.\-\/]\s?\d{1,2}[.\-\/]\s?\d{1,2}(?:.{0,12}?까지)?/,
  // "접수 마감일: 2026/08/17"처럼 범위나 "까지" 없이 마감 라벨 바로 뒤에 날짜만 오는 경우.
  /(?:접수\s?마감일?|모집\s?마감일?|마감일자|마감일)\s*[:：]?\s*\d{4}[.\-\/]\s?\d{1,2}[.\-\/]\s?\d{1,2}/,
  /(?:접수\s?마감일?|모집\s?마감일?|마감일자|마감일)\s*[:：]?\s*\d{4}년\s?\d{1,2}월\s?\d{1,2}일/,
];

export function extractApplicationPeriod(description: string): string {
  for (const pattern of APPLICATION_PERIOD_PATTERNS) {
    const match = description.match(pattern);
    if (match) return match[0].replace(/\s+/g, " ").trim();
  }
  return "상시채용";
}

// 연도가 없는 "MM월 DD일" 표기는 이미 지난 날짜면 마감일이 과거일 수 없으므로 내년으로 간주한다.
function inferYear(month: number, day: number, now: Date): number {
  const year = now.getFullYear();
  const candidate = new Date(year, month - 1, day);
  if (candidate.getTime() < now.getTime() - 24 * 60 * 60 * 1000) {
    return year + 1;
  }
  return year;
}

export function extractApplicationDeadline(description: string): Date | null {
  const now = new Date();

  // 날짜 구분자는 "."/"-" 뿐 아니라 "/"(예: 2026/08/17)도 실제 공고 원문에서 흔히 쓰인다.
  // 첫 날짜와 "~" 사이에도 "(수) 15:00" 같은 요일/시각 표기가 흔히 끼어들어 약간의 간격을 허용한다.
  let m = description.match(
    /\d{4}[.\-\/]\s?\d{1,2}[.\-\/]\s?\d{1,2}.{0,12}?[~\-–]\s?(\d{4})[.\-\/]\s?(\d{1,2})[.\-\/]\s?(\d{1,2})/
  );
  if (m) return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));

  m = description.match(
    /(?:\d{4}년\s?)?\d{1,2}월\s?\d{1,2}일.{0,12}?[~\-–]\s?(\d{4})년\s?(\d{1,2})월\s?(\d{1,2})일/
  );
  if (m) return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));

  m = description.match(/\d{1,2}월\s?\d{1,2}일\s?[~\-–]\s?(\d{1,2})월\s?(\d{1,2})일/);
  if (m) {
    const month = Number(m[1]);
    const day = Number(m[2]);
    return new Date(inferYear(month, day, now), month - 1, day);
  }

  // 날짜와 "까지" 사이에 "(화) 24시" 같은 요일/시각 표기가 끼어드는 경우가 흔해서 약간의
  // 간격을 허용한다(너무 넓게 잡으면 엉뚱한 "까지"와 묶일 수 있어 12자로 제한).
  m = description.match(/(\d{4})[.\-\/]\s?(\d{1,2})[.\-\/]\s?(\d{1,2}).{0,12}?까지/);
  if (m) return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));

  m = description.match(/(\d{4})년\s?(\d{1,2})월\s?(\d{1,2})일.{0,12}?까지/);
  if (m) return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));

  m = description.match(/(\d{1,2})월\s?(\d{1,2})일\s?까지/);
  if (m) {
    const month = Number(m[1]);
    const day = Number(m[2]);
    return new Date(inferYear(month, day, now), month - 1, day);
  }

  // "~2026.08.21(금) 23:59"처럼 "까지"도 없이 "~"만 붙은 채로 끝나는 경우("~"가 "이 날짜까지"의
  // 줄임 표기로 흔히 쓰인다). "까지"는 있어도 되고 없어도 된다.
  m = description.match(/~\s?(\d{4})[.\-\/]\s?(\d{1,2})[.\-\/]\s?(\d{1,2})/);
  if (m) return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));

  // "접수 마감일: 2026/08/17"처럼 범위나 "까지" 없이 마감 라벨 바로 뒤에 날짜만 오는 경우.
  m = description.match(
    /(?:접수\s?마감일?|모집\s?마감일?|마감일자|마감일)\s*[:：]?\s*(\d{4})[.\-\/]\s?(\d{1,2})[.\-\/]\s?(\d{1,2})/
  );
  if (m) return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));

  m = description.match(
    /(?:접수\s?마감일?|모집\s?마감일?|마감일자|마감일)\s*[:：]?\s*(\d{4})년\s?(\d{1,2})월\s?(\d{1,2})일/
  );
  if (m) return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));

  return null;
}

export function extractEmploymentType(title: string, description: string): string {
  const text = `${title} ${description}`;
  if (/인턴|intern/i.test(text)) return "인턴";
  if (/계약직/.test(text)) return "계약직";
  if (/프리랜서|freelance/i.test(text)) return "프리랜서";
  return "정규직";
}

// 실제 공고 원문은 "경력 5년 이상"이 아니라 "5년 이상의 디자인 경력", "8+ years of experience"처럼
// 숫자가 "경력"이라는 단어보다 먼저 나오거나 아예 영문으로 적힌 경우가 대부분이라, "경력"이 숫자 앞에
// 와야만 매칭되던 기존 정규식은 실제로는 거의 매칭되지 않았다. 숫자+년/years 패턴 자체를 기준으로 찾는다.
// 제목의 "(7년 이상)"처럼 본문에는 안 반복되고 제목에만 있는 경우가 많아 title도 같이 본다
// (extractEmploymentType과 동일한 이유).
export function extractExperienceLevel(title: string, description: string): string {
  const text = `${title} ${description}`;

  // 범위: "3~5년", "3-5 years"
  let m = text.match(/(\d+)\s*[~\-]\s*(\d+)\s*년/);
  if (m) return `${m[1]}~${m[2]}년`;
  m = text.match(/(\d+)\s*[~\-]\s*(\d+)\+?\s*years?/i);
  if (m) return `${m[1]}~${m[2]}년`;

  // 최소 연차: "5년 이상", "8+ years of experience", "at least 2 years"
  m = text.match(/(\d+)\s*년\s*(이상|이하)/);
  if (m) return `${m[1]}년 ${m[2]}`;
  m = text.match(/(\d+)\+\s*years?/i);
  if (m) return `${m[1]}년 이상`;
  m = text.match(/at least\s*(\d+)\s*years?/i);
  if (m) return `${m[1]}년 이상`;

  if (/신입/.test(text)) return "신입";
  if (/entry[\s-]?level/i.test(text)) return "신입";
  if (/경력무관/.test(text)) return "경력무관";

  return "경력무관";
}

export type JobCandidateInput = {
  companyName: string;
  companyLogo?: string | null;
  title: string;
  applyUrl: string;
  description: string;
  location?: string | null;
};

// candidate-jobs API의 "verdict=match" 경로 전용 — 스케줄 에이전트가 채용 페이지를 직접 읽고
// UXUI 직군이 명확하다고 판단한 공고를 실제 Job으로 발행한다. 회사는 이미 Company 테이블에
// 있는 걸로 가정(대상 8개 기업 전부 기존에 등록돼있음)하고, 그 회사의 industries/stage를
// 그대로 물려받는다 — 에이전트가 산업/규모까지 판단하게 하지 않고 이미 정제된 값을 재사용한다.
export async function createJobFromCandidate(candidate: JobCandidateInput): Promise<Job> {
  // 스케줄 에이전트가 페이지에서 그대로 긁어온 원문이든, 검토 화면에서 승인한 CandidateJob의
  // 저장된 원문이든, 줄바꿈/문단 구조가 지저분할 수 있어 발행 직전에 한 번 정리한다.
  const description = await reflowJobDescriptionParagraphs(candidate.description).catch((error) => {
    console.warn(`  ↳ 문단 정리 실패, 원본 텍스트 사용 (${candidate.applyUrl})`, error);
    return candidate.description;
  });

  const classification = await classifyJobPosting(candidate.title, description);

  const companyId = await findOrCreateCompanyId({
    companyName: candidate.companyName,
    companyLogo: candidate.companyLogo ?? null,
    industries: [],
    stage: "유니콘·스케일업",
  });
  const company = await prisma.company.findUniqueOrThrow({ where: { id: companyId } });

  const job = await prisma.job.create({
    data: {
      title: candidate.title,
      companyName: candidate.companyName,
      companyLogo: candidate.companyLogo ?? company.logo,
      companyId,
      role: classification.role,
      platforms: classification.platforms,
      industries: company.industries,
      stage: company.stage,
      location: candidate.location ?? null,
      description,
      applyUrl: candidate.applyUrl,
      applicationPeriod: extractApplicationPeriod(description),
      applicationDeadline: extractApplicationDeadline(description),
      employmentType: extractEmploymentType(candidate.title, description),
      experienceLevel: classification.experienceLevel,
    },
  });

  try {
    const analysis = await analyzeJobDescription(description);
    await prisma.jobAnalysis.create({ data: { jobId: job.id, ...analysis } });
  } catch (error) {
    console.warn(`  ↳ AI 분석 실패 (상세페이지 방문 시 재시도됨): ${job.id}`, error);
  }

  return job;
}
