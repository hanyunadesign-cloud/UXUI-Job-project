import * as cheerio from "cheerio";
import { prisma } from "./prisma";
import { analyzeJobForPanel, reflowJobDescriptionParagraphs } from "./gemini";
import { findOrCreateCompanyId } from "./company";
import {
  extractApplicationPeriod,
  extractApplicationDeadline,
  extractEmploymentType,
  extractExperienceLevel,
} from "./job-intake";

// Gemini 무료 티어 분당 요청 한도를 여유 있게 지키기 위한 간격 (새로 분석을 호출했을 때만 대기)
function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

type SourceBase = {
  companyName: string;
  companyLogo: string;
  industries: string[];
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
    industries: ["IT/서비스", "커머스"],
    stage: "유니콘·스케일업",
    platforms: ["앱", "웹"],
  },
  {
    provider: "greenhouse",
    board: "coupang",
    companyName: "쿠팡",
    companyLogo: faviconFor("coupang.com"),
    industries: ["커머스"],
    stage: "대기업·중견",
    platforms: ["앱", "웹"],
    locationIncludes: "Seoul",
  },
  // 미소는 애시비 공개 API(boardName: "miso")가 404로 죽었다 — 채용 페이지 자체가
  // NineHire(miso.ninehire.site/careerboard)로 옮겨갔는데, 이 플랫폼은 공고 목록을
  // 클라이언트에서만 불러와서 SSR에도 API에도 안 잡힌다(2026-07-31 확인). 다시 API 기반
  // 자동화는 불가능하니, 스케줄 클라우드 에이전트(candidate-jobs 파이프라인) 쪽에 편입시켜야 함.
  {
    provider: "ashby",
    boardName: "bjakcareer",
    companyName: "Bjak",
    companyLogo: faviconFor("bjak.com"),
    industries: ["핀테크"],
    stage: "유니콘·스케일업",
    platforms: ["앱", "웹"],
    locationIncludes: "Seoul",
  },
];

// UX Engineer, Interaction Designer 등 Ashby 계열 공고에서 흔한 직함까지 포괄하도록 확장.
// "UX 기획자"처럼 "디자이너/디자인"이 제목에 안 붙는 UX 기획 직군도 놓치지 않도록 planner/기획 패턴 포함.
const DESIGN_TITLE_PATTERN =
  /(product designer|ux researcher|ux writer|ux designer|ux engineer|ux\/ui|interaction designer|conversation designer|visual designer|motion designer|contents? designer|gui designer|brand designer|graphic designer|design engineer|ux planner|ux strategist|ux\s*기획|디자이너|디자인)/i;

function inferRole(title: string): string {
  if (/ux researcher|리서처/i.test(title)) return "UX 리서치";
  if (/ux writer|라이터/i.test(title)) return "UX 라이팅";
  if (/ux planner|ux strategist|ux\s*기획/i.test(title)) return "UX 기획";
  if (
    /brand designer|graphic designer|design engineer|visual designer|motion designer|contents? designer|그래픽 디자이너/i.test(
      title
    )
  )
    return "GUI 디자인";
  return "UXUI·프로덕트";
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

  return (
    $.root()
      .text()
      .split("\n")
      .map((line) => line.trim())
      .join("\n")
      .replace(/\n{3,}/g, "\n\n")
      // 원본 HTML이 <li>를 줄바꿈으로 예쁘게 들여쓰기해둔 경우, 그 원본 개행 문자까지
      // .text()가 그대로 끌고 와서 우리가 붙인 \n과 합쳐져 불릿 항목 사이에 의도치 않은
      // 빈 줄이 생긴다(원본은 촘촘한 목록인데 결과는 한 줄씩 띄엄띄엄 벌어짐). 연속된
      // "- " 항목 사이의 빈 줄만 제거해 목록을 다시 촘촘하게 만든다.
      .replace(/^(- .*)\n\n(?=- )/gm, "$1\n")
      .trim()
  );
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
    applyUrl: buildApplyUrl(source, job),
    location: job.location?.name ?? null,
    description: job.content
      ? greenhouseHtmlToText(job.content).slice(0, 5000)
      : job.title,
  }));
}

// 그린하우스 API가 주는 absolute_url을 그대로 썼더니, 당근은 이 링크(about.daangn.com에
// gh_jid 쿼리로 특정 공고를 띄우는 임베드 위젯)가 깨져서 회사 소개 페이지로만 연결됐다.
// 당근은 별도 채용 전용 사이트(careers.daangn.com)의 링크가 실제로 동작해서, 이 회사만
// URL을 다시 만든다. 그 외 회사는 absolute_url을 그대로 쓴다.
function buildApplyUrl(source: GreenhouseSource, job: GreenhouseJob): string {
  if (source.board === "daangn") {
    return `https://careers.daangn.com/jobs/role/${job.id}/`;
  }
  return job.absolute_url;
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

// 마감된 지 10일이 지난 공고는 목록에서 제거하되, 통계/복구를 위해 실제로 지우지는 않고
// archivedAt만 채워서 소프트 삭제 처리한다(모든 목록 쿼리는 archivedAt: null 조건으로 걸러낸다).
const CLOSED_RETENTION_DAYS = 10;

async function archiveStaleJobs(): Promise<number> {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - CLOSED_RETENTION_DAYS);

  const result = await prisma.job.updateMany({
    where: {
      archivedAt: null,
      applicationDeadline: { lt: cutoff },
    },
    data: { archivedAt: new Date() },
  });
  return result.count;
}

export type NewlyIngestedJob = {
  id: string;
  title: string;
  companyName: string;
  role: string;
  industries: string[];
  stage: string;
  platforms: string[];
};

// 스케줄러(Vercel Cron)와 로컬 CLI 스크립트가 함께 사용하는 갱신 로직 본체.
// 신규 공고 자동 업로드는 하지 않는다 — 이미 올라온 공고의 내용/마감일 갱신과 소스에서
// 사라진 공고의 자동 archive만 수행한다. newJobs는 그래서 항상 빈 배열이다(호출부인
// fetch-jobs 크론의 관심 조건 이메일 다이제스트 발송 로직과의 호환을 위해 반환 형태만 유지).
export async function ingestJobs(): Promise<{
  count: number;
  archived: number;
  newJobs: NewlyIngestedJob[];
}> {
  let count = 0;
  const allNewJobs: NewlyIngestedJob[] = [];

  for (const source of SOURCES) {
    // 소스 하나가 실패해도(API 스펙 변경, 일시적 다운 등) 나머지 소스는 계속 처리되게 격리한다.
    // 예전엔 여기서 던진 에러가 함수 전체를 중단시켜서, 목록 뒷순서 소스가 통째로 스킵됐었다.
    try {
    const jobs = await fetchSourceJobs(source);

    const filtered = jobs.filter((job) => {
      if (!DESIGN_TITLE_PATTERN.test(job.title)) return false;
      if (source.locationIncludes) {
        return (job.location ?? "").includes(source.locationIncludes);
      }
      return true;
    });

    const companyId = await findOrCreateCompanyId(source);

    // 소스 피드에서 더 이상 보이지 않는(마감·삭제된) 공고는 자동으로 archive 처리한다.
    // "상시채용"이라 마감일이 없는 공고는 아래 archiveStaleJobs()의 날짜 기준으로는 절대
    // 안 걸러지므로, 소스 피드 자체와 직접 비교하는 게 죽은 링크를 잡아내는 유일한 방법이다.
    const liveUrls = filtered.map((job) => job.applyUrl);
    const staleResult = await prisma.job.updateMany({
      where: {
        companyName: source.companyName,
        archivedAt: null,
        applyUrl: { notIn: liveUrls },
      },
      data: { archivedAt: new Date() },
    });
    if (staleResult.count > 0) {
      console.log(`  ↳ ${source.companyName}: 소스에서 사라진 공고 ${staleResult.count}건 자동 archive`);
    }

    for (const job of filtered) {
      // 원본 HTML이 문장마다 별도 <p>로 쪼개져 있는 경우가 많아, 같은 주제의 문장들도
      // 전부 빈 줄로 떨어져 문단처럼 안 보이는 문제가 있다. 매일 소스에서 다시 받아오는
      // 원문 그대로 저장하면 한 번 정리해도 다음 실행에서 도로 원상복구되므로, 매번
      // 저장 직전에 정리한다(기존 공고 갱신 포함).
      try {
        job.description = await reflowJobDescriptionParagraphs(job.description);
      } catch (error) {
        console.warn(`  ↳ ${source.companyName} | ${job.title}: 문단 정리 실패, 원본 텍스트 사용`, error);
      }
      await sleep(1000);

      const data = {
        title: job.title,
        companyName: source.companyName,
        companyLogo: source.companyLogo,
        companyId,
        role: inferRole(job.title),
        platforms: source.platforms,
        industries: source.industries,
        stage: source.stage,
        location: job.location,
        description: job.description,
        applyUrl: job.applyUrl,
        applicationPeriod: extractApplicationPeriod(job.description),
        applicationDeadline: extractApplicationDeadline(job.description),
        employmentType: extractEmploymentType(job.title, job.description),
        experienceLevel: extractExperienceLevel(job.title, job.description),
      };

      const existed = await prisma.job.findUnique({
        where: { applyUrl: job.applyUrl },
        select: { id: true },
      });

      // 신규 공고는 더 이상 자동으로 올리지 않는다 — 자동화는 이미 올라온 공고의 내용/마감일
      // 갱신(아래)과 소스에서 사라진 공고의 자동 archive(위)까지만이다. 새 공고 등록은 사람이
      // 직접 한다.
      if (!existed) continue;

      // 이미 발행된 공고는 재판단 없이 그대로 최신 내용으로 갱신한다.
      const savedJob = await prisma.job.update({ where: { applyUrl: job.applyUrl }, data });

      console.log(`✔ ${source.companyName} | ${job.title} (갱신)`);
      count += 1;

      // 카드 목록에 바로 핵심 업무 키워드를 보여줄 수 있도록, 상세페이지 방문을 기다리지 않고
      // 수집 시점에 미리 AI 분석을 돌려 캐시(JobAnalysis)를 채워둔다. appealPoints가 이미 있으면
      // (구버전 캐시가 아니라 이 파이프라인으로 채워진 최신 캐시면) 무료 티어 하루 요청 한도를
      // 아끼기 위해 재호출하지 않는다 — appealPoints가 없는 캐시(과거 analyzeJobDescription만
      // 쓰던 시절 생성된 것)는 "이렇게 어필하세요"/"기업 정보" 탭이 구버전 AnalysisPanel로
      // 떨어지는 원인이라, 매일 배치에서 조금씩 다시 채워 나간다(재현 방지).
      const existingAnalysis = await prisma.jobAnalysis.findUnique({
        where: { jobId: savedJob.id },
      });

      if (existingAnalysis?.appealPoints) {
        console.log(`  ↳ AI 분석 캐시 이미 있음, 스킵`);
      } else {
        try {
          const analysis = await analyzeJobForPanel(job.title, source.companyName, job.description);
          // AI가 만든 sourceQuote는 사람이 검증할 수 없어서, 저장 전에 실제로 공고 원문의
          // 정확한 부분 문자열인지 코드로 다시 확인한다 — 안 맞는 항목은 조용히 제외한다.
          const verifiedAppealPoints = analysis.appealPoints
            .filter((p) => job.description.includes(p.sourceQuote))
            .slice(0, 3);

          await prisma.jobAnalysis.upsert({
            where: { jobId: savedJob.id },
            create: {
              jobId: savedJob.id,
              coreKeywords: analysis.coreKeywords,
              resumeTip: analysis.resumeTip,
              taskKeywords: analysis.taskKeywords,
              domainPrimary: analysis.domainPrimary,
              domainSecondary: analysis.domainSecondary,
              domainKeywords: analysis.domainKeywords,
              problemLede: analysis.problemLede,
              problemRest: analysis.problemRest,
              appealPoints: verifiedAppealPoints,
            },
            update: {
              coreKeywords: analysis.coreKeywords,
              resumeTip: analysis.resumeTip,
              taskKeywords: analysis.taskKeywords,
              domainPrimary: analysis.domainPrimary,
              domainSecondary: analysis.domainSecondary,
              domainKeywords: analysis.domainKeywords,
              problemLede: analysis.problemLede,
              problemRest: analysis.problemRest,
              appealPoints: verifiedAppealPoints,
            },
          });
          console.log(`  ↳ AI 분석 완료 (어필 포인트 ${verifiedAppealPoints.length}개)`);
        } catch (error) {
          console.warn(`  ↳ AI 분석 실패 (상세페이지 방문 시 재시도됨):`, error);
        }

        await sleep(3000);
      }
    }
    } catch (error) {
      console.error(`✗ ${source.companyName} 소스 처리 실패, 다음 소스로 넘어감:`, error);
    }
  }

  const archived = await archiveStaleJobs();
  if (archived > 0) {
    console.log(`\n🗑  마감 1개월 경과 공고 ${archived}건 소프트 삭제(archivedAt 설정) 처리`);
  }

  return { count, archived, newJobs: allNewJobs };
}
