import * as cheerio from "cheerio";
import { prisma } from "./prisma";
import { analyzeJobDescription, judgeJobRelevance, reflowJobDescriptionParagraphs } from "./gemini";
import { findOrCreateCompanyId } from "./company";
import { notifyFollowersOfNewJobs } from "./notifications";
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
// "UX 기획자"처럼 "디자이너/디자인"이 제목에 안 붙는 UX기획 직군도 놓치지 않도록 planner/기획 패턴 포함.
const DESIGN_TITLE_PATTERN =
  /(product designer|ux researcher|ux writer|ux designer|ux engineer|ux\/ui|interaction designer|conversation designer|visual designer|motion designer|contents? designer|gui designer|brand designer|graphic designer|design engineer|ux planner|ux strategist|ux\s*기획|디자이너|디자인)/i;

function inferRole(title: string): string {
  if (/ux researcher|리서처/i.test(title)) return "UX 리서치";
  if (/ux writer|라이터/i.test(title)) return "UX 라이팅";
  if (/ux planner|ux strategist|ux\s*기획/i.test(title)) return "UX기획";
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

export type NewlyIngestedJob = {
  id: string;
  title: string;
  companyName: string;
  role: string;
  industries: string[];
  stage: string;
  platforms: string[];
};

// 스케줄러(Vercel Cron)와 로컬 CLI 스크립트가 함께 사용하는 수집 로직 본체.
export async function ingestJobs(): Promise<{
  count: number;
  archived: number;
  newJobs: NewlyIngestedJob[];
}> {
  let count = 0;
  // 팔로워 알림(기업 단위)과 별개로, 실행 전체에서 새로 생긴 공고를 모아 관심 조건 이메일
  // 다이제스트 발송에 쓴다.
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
    // 회사 채용 페이지 자체(공개 API 엔드포인트가 아니라 사람이 보는 페이지)를 검토 화면에
    // 참고 링크로 남기기 위한 URL.
    const sourceUrl =
      source.provider === "greenhouse"
        ? `https://boards.greenhouse.io/${source.board}`
        : `https://jobs.ashbyhq.com/${source.boardName}`;

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

    // 팔로워 알림은 진짜 신규 공고에만 보내야 하므로(기존 공고 정보 업데이트는 제외),
    // upsert 전에 이미 존재하는지 먼저 확인해 이번 실행에서 새로 생긴 것만 따로 모아둔다.
    const newlyCreated: { id: string; title: string }[] = [];

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

      let savedJob: { id: string; title: string; role: string; industries: string[]; stage: string; platforms: string[] };

      if (existed) {
        // 이미 발행된 공고는 재판단 없이 그대로 최신 내용으로 갱신한다.
        savedJob = await prisma.job.update({ where: { applyUrl: job.applyUrl }, data });
      } else {
        // 검토 대기 중(CandidateJob)인 공고는 매번 다시 판단하지 않고 건너뛴다.
        const existingCandidate = await prisma.candidateJob.findUnique({
          where: { applyUrl: job.applyUrl },
          select: { id: true },
        });
        if (existingCandidate) {
          console.log(`  ↳ ${source.companyName} | ${job.title}: 검토 대기 중, 스킵`);
          continue;
        }

        // 신규 공고만 제목 정규식 통과 후 본문까지 읽고 실제 UXUI 직군인지 한 번 더 판단한다
        // (브랜드/그래픽/산업디자인 등 제목만으로는 정규식에 걸리는 무관 공고를 거르기 위함).
        let judgment;
        try {
          judgment = await judgeJobRelevance(job.title, job.description);
        } catch (error) {
          console.warn(`  ↳ ${source.companyName} | ${job.title}: 적합성 판단 실패, 안전하게 검토 대기로 보냄`, error);
          judgment = { verdict: "ambiguous" as const, note: "AI 판단 실패로 자동 검토 대기 처리됨" };
        }
        await sleep(1000);

        if (judgment.verdict === "reject") {
          console.log(`  ↳ ${source.companyName} | ${job.title}: UXUI 무관 판단, 건너뜀 (${judgment.note ?? "근거 없음"})`);
          continue;
        }

        if (judgment.verdict === "ambiguous") {
          await prisma.candidateJob.create({
            data: {
              companyName: source.companyName,
              companyLogo: source.companyLogo,
              title: job.title,
              applyUrl: job.applyUrl,
              description: job.description,
              sourceUrl,
              aiNote: judgment.note,
            },
          });
          console.log(`  ↳ ${source.companyName} | ${job.title}: 애매함, 검토 대기로 보냄`);
          continue;
        }

        // verdict === "match"
        savedJob = await prisma.job.create({ data });
      }

      if (!existed) {
        newlyCreated.push({ id: savedJob.id, title: savedJob.title });
        allNewJobs.push({
          id: savedJob.id,
          title: savedJob.title,
          companyName: source.companyName,
          role: savedJob.role,
          industries: savedJob.industries,
          stage: savedJob.stage,
          platforms: savedJob.platforms,
        });
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
