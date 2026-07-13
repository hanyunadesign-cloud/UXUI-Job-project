import * as cheerio from "cheerio";
import { prisma } from "./prisma";
import { analyzeJobDescription } from "./gemini";
import { findOrCreateCompanyId } from "./company";
import { notifyFollowersOfNewJobs } from "./notifications";

// Gemini 무료 티어 분당 요청 한도를 여유 있게 지키기 위한 간격 (새로 분석을 호출했을 때만 대기)
function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

type SourceBase = {
  companyName: string;
  companyLogo: string;
  industry: string;
  stage: string;
  platforms: string[];
  locationIncludes?: string; // 특정 지역 공고만 채택 (예: 서울)
};

// Greenhouse는 회사별로 공개 Job Board API(boards-api.greenhouse.io)를 제공한다.
// https://developers.greenhouse.io/job-board.html
type GreenhouseSource = SourceBase & { provider: "greenhouse"; board: string };

// Ashby도 회사별 공개 Job Board API(api.ashbyhq.com/posting-api)를 제공한다.
type AshbySource = SourceBase & { provider: "ashby"; boardName: string };

type Source = GreenhouseSource | AshbySource;

// 회사별 공식 로고 에셋 URL을 확보하기 어려워, 도메인 기반 파비콘 서비스(Google)를 사용한다.
function faviconFor(domain: string): string {
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
}

const SOURCES: Source[] = [
  {
    provider: "greenhouse",
    board: "daangn",
    companyName: "당근",
    companyLogo: faviconFor("daangn.com"),
    industry: "여행/로컬",
    stage: "유니콘",
    platforms: ["앱", "웹"],
  },
  {
    provider: "greenhouse",
    board: "coupang",
    companyName: "쿠팡",
    companyLogo: faviconFor("coupang.com"),
    industry: "커머스",
    stage: "대기업",
    platforms: ["앱", "웹"],
    locationIncludes: "Seoul",
  },
  {
    provider: "ashby",
    boardName: "miso",
    companyName: "미소",
    companyLogo: faviconFor("miso.kr"),
    industry: "커머스",
    stage: "스타트업",
    platforms: ["앱", "웹"],
    locationIncludes: "Seoul",
  },
  {
    provider: "ashby",
    boardName: "bjakcareer",
    companyName: "Bjak",
    companyLogo: faviconFor("bjak.com"),
    industry: "핀테크",
    stage: "스타트업",
    platforms: ["앱", "웹"],
    locationIncludes: "Seoul",
  },
];

// UX Engineer, Interaction Designer 등 Ashby 계열 공고에서 흔한 직함까지 포괄하도록 확장.
const DESIGN_TITLE_PATTERN =
  /(product designer|ux researcher|ux writer|ux designer|ux engineer|ux\/ui|interaction designer|conversation designer|visual designer|motion designer|contents? designer|gui designer|brand designer|graphic designer|design engineer|디자이너|디자인)/i;

function inferRole(title: string): string {
  if (/ux researcher|리서처/i.test(title)) return "UX 리서치";
  if (/ux writer|라이터/i.test(title)) return "UX 라이팅";
  if (/product designer|프로덕트 디자이너/i.test(title)) return "프로덕트 디자인";
  if (
    /brand designer|graphic designer|design engineer|visual designer|motion designer|contents? designer|그래픽 디자이너/i.test(
      title
    )
  )
    return "GUI 디자인";
  return "UXUI 디자인";
}

// 실제 HTML(엔티티 이중 인코딩 없는 경우)을 정리된 텍스트로 변환하는 공통 로직.
function cleanHtmlToText($: cheerio.CheerioAPI): string {
  $("script, style").remove();
  $("br").replaceWith("\n");
  $("li").each((_, el) => {
    $(el).prepend("- ");
  });
  $("p, div, li, h1, h2, h3, h4, h5, h6, ul, ol, hr, tr").each((_, el) => {
    $(el).append("\n");
  });

  return $.root()
    .text()
    .split("\n")
    .map((line) => line.trim())
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function greenhouseHtmlToText(rawContent: string): string {
  // Greenhouse의 content 필드는 HTML이 엔티티로 한 번 더 인코딩되어 내려온다.
  // (예: "&lt;div&gt;..." 라는 문자열 자체가 저장돼 있음) 그래서 실제 태그를 얻으려면
  // 한 번 디코딩한 결과를 다시 HTML로 파싱해야 한다.
  const decoded = cheerio.load(rawContent).root().text();
  return cleanHtmlToText(cheerio.load(decoded));
}

function ashbyHtmlToText(html: string): string {
  // Ashby의 descriptionHtml은 정상적인 HTML이라 이중 디코딩이 필요 없다.
  return cleanHtmlToText(cheerio.load(html));
}

// 공고 원문에서 구체적인 날짜가 들어간 서류접수 기간만 인정한다.
// "매주 화요일 마감"처럼 반복되는 상대적 마감은 고정 기간이 아니므로 제외하고 상시채용으로 처리한다.
const APPLICATION_PERIOD_PATTERNS = [
  /\d{4}[.\-]\s?\d{1,2}[.\-]\s?\d{1,2}\s?[~\-–]\s?\d{4}[.\-]\s?\d{1,2}[.\-]\s?\d{1,2}/,
  /\d{1,2}월\s?\d{1,2}일\s?[~\-–]\s?\d{1,2}월\s?\d{1,2}일/,
  /\d{4}[.\-]\s?\d{1,2}[.\-]\s?\d{1,2}\s?까지/,
  /\d{1,2}월\s?\d{1,2}일\s?까지/,
];

function extractApplicationPeriod(description: string): string {
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

function extractApplicationDeadline(description: string): Date | null {
  const now = new Date();

  let m = description.match(
    /\d{4}[.\-]\s?\d{1,2}[.\-]\s?\d{1,2}\s?[~\-–]\s?(\d{4})[.\-]\s?(\d{1,2})[.\-]\s?(\d{1,2})/
  );
  if (m) return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));

  m = description.match(/\d{1,2}월\s?\d{1,2}일\s?[~\-–]\s?(\d{1,2})월\s?(\d{1,2})일/);
  if (m) {
    const month = Number(m[1]);
    const day = Number(m[2]);
    return new Date(inferYear(month, day, now), month - 1, day);
  }

  m = description.match(/(\d{4})[.\-]\s?(\d{1,2})[.\-]\s?(\d{1,2})\s?까지/);
  if (m) return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));

  m = description.match(/(\d{1,2})월\s?(\d{1,2})일\s?까지/);
  if (m) {
    const month = Number(m[1]);
    const day = Number(m[2]);
    return new Date(inferYear(month, day, now), month - 1, day);
  }

  return null;
}

function extractEmploymentType(title: string, description: string): string {
  const text = `${title} ${description}`;
  if (/인턴|intern/i.test(text)) return "인턴";
  if (/계약직/.test(text)) return "계약직";
  if (/프리랜서|freelance/i.test(text)) return "프리랜서";
  return "정규직";
}

// 실제 공고 원문은 "경력 5년 이상"이 아니라 "5년 이상의 디자인 경력", "8+ years of experience"처럼
// 숫자가 "경력"이라는 단어보다 먼저 나오거나 아예 영문으로 적힌 경우가 대부분이라, "경력"이 숫자 앞에
// 와야만 매칭되던 기존 정규식은 실제로는 거의 매칭되지 않았다. 숫자+년/years 패턴 자체를 기준으로 찾는다.
function extractExperienceLevel(description: string): string {
  // 범위: "3~5년", "3-5 years"
  let m = description.match(/(\d+)\s*[~\-]\s*(\d+)\s*년/);
  if (m) return `${m[1]}~${m[2]}년`;
  m = description.match(/(\d+)\s*[~\-]\s*(\d+)\+?\s*years?/i);
  if (m) return `${m[1]}~${m[2]}년`;

  // 최소 연차: "5년 이상", "8+ years of experience", "at least 2 years"
  m = description.match(/(\d+)\s*년\s*(이상|이하)/);
  if (m) return `${m[1]}년 ${m[2]}`;
  m = description.match(/(\d+)\+\s*years?/i);
  if (m) return `${m[1]}년 이상`;
  m = description.match(/at least\s*(\d+)\s*years?/i);
  if (m) return `${m[1]}년 이상`;

  if (/신입/.test(description)) return "신입";
  if (/entry[\s-]?level/i.test(description)) return "신입";
  if (/경력무관/.test(description)) return "경력무관";

  return "경력무관";
}

type NormalizedJob = {
  title: string;
  applyUrl: string;
  location: string | null;
  description: string;
};

type GreenhouseJob = {
  id: number;
  title: string;
  absolute_url: string;
  location?: { name?: string };
  content?: string;
};

async function fetchGreenhouseJobs(source: GreenhouseSource): Promise<NormalizedJob[]> {
  const res = await fetch(
    `https://boards-api.greenhouse.io/v1/boards/${source.board}/jobs?content=true`
  );
  if (!res.ok) {
    throw new Error(`Greenhouse fetch failed for ${source.board}: ${res.status}`);
  }
  const data = (await res.json()) as { jobs: GreenhouseJob[] };

  return data.jobs.map((job) => ({
    title: job.title,
    applyUrl: job.absolute_url,
    location: job.location?.name ?? null,
    description: job.content
      ? greenhouseHtmlToText(job.content).slice(0, 5000)
      : job.title,
  }));
}

type AshbyJob = {
  title: string;
  location?: string;
  jobUrl: string;
  descriptionHtml?: string;
};

async function fetchAshbyJobs(source: AshbySource): Promise<NormalizedJob[]> {
  const res = await fetch(
    `https://api.ashbyhq.com/posting-api/job-board/${source.boardName}`
  );
  if (!res.ok) {
    throw new Error(`Ashby fetch failed for ${source.boardName}: ${res.status}`);
  }
  const data = (await res.json()) as { jobs: AshbyJob[] };

  return data.jobs.map((job) => ({
    title: job.title,
    applyUrl: job.jobUrl,
    location: job.location ?? null,
    description: job.descriptionHtml
      ? ashbyHtmlToText(job.descriptionHtml).slice(0, 5000)
      : job.title,
  }));
}

async function fetchSourceJobs(source: Source): Promise<NormalizedJob[]> {
  return source.provider === "greenhouse"
    ? fetchGreenhouseJobs(source)
    : fetchAshbyJobs(source);
}

// 마감된 지 1개월이 지난 공고는 목록에서 제거하되, 통계/복구를 위해 실제로 지우지는 않고
// archivedAt만 채워서 소프트 삭제 처리한다(모든 목록 쿼리는 archivedAt: null 조건으로 걸러낸다).
async function archiveStaleJobs(): Promise<number> {
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  const result = await prisma.job.updateMany({
    where: {
      archivedAt: null,
      applicationDeadline: { lt: oneMonthAgo },
    },
    data: { archivedAt: new Date() },
  });
  return result.count;
}

// 스케줄러(Vercel Cron)와 로컬 CLI 스크립트가 함께 사용하는 수집 로직 본체.
export async function ingestJobs(): Promise<{ count: number; archived: number }> {
  let count = 0;

  for (const source of SOURCES) {
    const jobs = await fetchSourceJobs(source);

    const filtered = jobs.filter((job) => {
      if (!DESIGN_TITLE_PATTERN.test(job.title)) return false;
      if (source.locationIncludes) {
        return (job.location ?? "").includes(source.locationIncludes);
      }
      return true;
    });

    const companyId = await findOrCreateCompanyId(source);
    // 팔로워 알림은 진짜 신규 공고에만 보내야 하므로(기존 공고 정보 업데이트는 제외),
    // upsert 전에 이미 존재하는지 먼저 확인해 이번 실행에서 새로 생긴 것만 따로 모아둔다.
    const newlyCreated: { id: string; title: string }[] = [];

    for (const job of filtered) {
      const data = {
        title: job.title,
        companyName: source.companyName,
        companyLogo: source.companyLogo,
        companyId,
        role: inferRole(job.title),
        platforms: source.platforms,
        industry: source.industry,
        stage: source.stage,
        location: job.location,
        description: job.description,
        applyUrl: job.applyUrl,
        applicationPeriod: extractApplicationPeriod(job.description),
        applicationDeadline: extractApplicationDeadline(job.description),
        employmentType: extractEmploymentType(job.title, job.description),
        experienceLevel: extractExperienceLevel(job.description),
      };

      const existed = await prisma.job.findUnique({
        where: { applyUrl: job.applyUrl },
        select: { id: true },
      });

      const savedJob = await prisma.job.upsert({
        where: { applyUrl: job.applyUrl },
        create: data,
        update: data,
      });

      if (!existed) {
        newlyCreated.push({ id: savedJob.id, title: savedJob.title });
      }

      console.log(`✔ ${source.companyName} | ${job.title}`);
      count += 1;

      // 카드 목록에 바로 핵심 업무 키워드를 보여줄 수 있도록, 상세페이지 방문을 기다리지 않고
      // 수집 시점에 미리 AI 분석을 돌려 캐시(JobAnalysis)를 채워둔다.
      // 이미 캐시가 있으면 무료 티어의 하루 요청 한도를 아끼기 위해 재호출하지 않는다.
      const existingAnalysis = await prisma.jobAnalysis.findUnique({
        where: { jobId: savedJob.id },
      });

      if (existingAnalysis) {
        console.log(`  ↳ AI 분석 캐시 이미 있음, 스킵`);
      } else {
        try {
          const analysis = await analyzeJobDescription(job.description);
          await prisma.jobAnalysis.upsert({
            where: { jobId: savedJob.id },
            create: { jobId: savedJob.id, ...analysis },
            update: analysis,
          });
          console.log(`  ↳ AI 분석 완료`);
        } catch (error) {
          console.warn(`  ↳ AI 분석 실패 (상세페이지 방문 시 재시도됨):`, error);
        }

        await sleep(3000);
      }
    }

    await notifyFollowersOfNewJobs(companyId, source.companyName, newlyCreated);
  }

  const archived = await archiveStaleJobs();
  if (archived > 0) {
    console.log(`\n🗑  마감 1개월 경과 공고 ${archived}건 소프트 삭제(archivedAt 설정) 처리`);
  }

  return { count, archived };
}
