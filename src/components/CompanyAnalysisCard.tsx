"use client";

import { useState } from "react";
import { ExternalLink, Info, ChevronDown } from "lucide-react";
import { clsx } from "clsx";
import { STAGES } from "@/lib/constants";

// "기업 정보" 탭 시범 적용 대상 5개 공고 한정 콘텐츠(AppealPointsCard와 동일한 패턴).
// 링크는 DB에 없는 필드라 AI 추정 대신 직접 웹 검색으로 확인한 값만 쓴다. 확인 못 한
// 항목(디자인 블로그 등)은 지어내지 않고 null로 둬서 "확인 안 됨"으로 표시한다. 채용공고
// 게재 부서 항목은 정보 가치가 낮아 제외했다.
type CompanyAnalysisData = {
  companyUrl: string | null;
  designBlogUrl: string | null;
  stage: (typeof STAGES)[number];
  domainPrimary: string;
  domainSecondary: string;
  domainKeywords: [string, string, string];
  problemLede: string;
  problemRest: string;
};

// 스테이지별 지원 전략 자료("규모.pdf") 기준 — 회사마다 새로 쓰지 않고, 이 회사가 속한
// 스테이지에 맞는 문장 하나를 그대로 재사용한다. 회사 스테이지 카드 값 바로 아래 표시.
const STAGE_FIT: Record<(typeof STAGES)[number], string> = {
  스타트업:
    "가설을 빠르게 검증하며 0에서 1을 만드는 단계예요. 빠른 실행력과 MVP로 성과를 내는 역량을 중요하게 봐요.",
  "유니콘·스케일업":
    "성장과 리텐션을 반복 가능한 시스템으로 만드는 단계예요. 개발자·기획자와 협업하며 디자인을 주도하고, 데이터로 빠르게 개선하는 힘을 중요하게 봐요.",
  "대기업·중견":
    "안정성과 이해관계자 정렬이 중요한 조직이에요. 근거를 갖추고 프로세스를 지키며 신중하게 판단하는 능력을 중요하게 봐요.",
  에이전시:
    "클라이언트의 의도를 이해하고 설득하는 곳이에요. 크리에이티브 전달력과 다양한 스타일을 소화하는 스토리텔링 역량을 중요하게 봐요.",
};

// 스테이지별로 중요하게 보는 역량 3개. 사용자가 최종 확정한 값이라 STAGE_FIT을 다시 손보더라도
// 이 목록은 별도로 재확인받기 전까지 그대로 유지한다.
const STAGE_KEYWORDS: Record<(typeof STAGES)[number], [string, string, string]> = {
  스타트업: ["제너럴리스트", "실험 검증", "빠른 출시"],
  "유니콘·스케일업": ["데이터 개선", "리텐션", "협업 리드"],
  "대기업·중견": ["스페셜리스트", "이해관계자 조율", "시스템 준수"],
  에이전시: ["클라이언트 설득", "컨셉 제안", "다양한 산업군"],
};

// 시범 적용 대상 5개 공고 각각의 회사 분석. job.id로 조회한다.
const COMPANY_ANALYSIS: Record<string, CompanyAnalysisData> = {
  // 토스인슈어런스
  cms6d6b7e00024l8qf69w38zy: {
    companyUrl: "https://tossinsu.com",
    designBlogUrl: "https://toss.tech/category/design",
    stage: "유니콘·스케일업",
    domainPrimary: "핀테크 · 보험",
    domainSecondary:
      "보험과 기술을 결합한 인슈어테크 서비스예요. 법인보험대리점(GA)으로서 보험설계사와 고객을 연결하는 플랫폼을 만들어요.",
    domainKeywords: ["인슈어테크", "보험 GA", "B2C·B2B"],
    problemLede: "보험 설계사와 고객 사이의 정보 비대칭·번거로운 절차를 제품으로 줄이는 게 핵심 문제예요.",
    problemRest:
      "설계사에게는 반복 업무 효율을, 고객에게는 직관적인 가입·상담 경험을 만드는 B2C·B2B 제품을 함께 만들어요.",
  },
  // 아정당
  cmsk1ir4u0002qae1xik22zn3: {
    companyUrl: "https://recruit.ajd.co.kr",
    designBlogUrl: null,
    stage: "유니콘·스케일업",
    domainPrimary: "홈서비스 · O2O",
    domainSecondary:
      "이사·청소 같은 생활 서비스를 전문가와 연결하는 O2O 플랫폼이에요. 복잡한 예약·매칭 과정을 제품으로 편리하게 만들어요.",
    domainKeywords: ["O2O", "생활 서비스", "디자인 시스템"],
    problemLede: "이사·청소처럼 복잡한 생활 서비스를 예약하는 과정을 더 쉽게 만드는 게 핵심 문제예요.",
    problemRest: "고객이 겪는 문제를 논리적 근거로 정의하고, 일관된 디자인 시스템으로 풀어내는 프로덕트를 만들어요.",
  },
  // 네이버웹툰
  cmsk1j36a0007qae1rernnein: {
    companyUrl: "https://recruit.webtoonscorp.com",
    designBlogUrl: null,
    stage: "대기업·중견",
    domainPrimary: "콘텐츠 · 엔터테인먼트",
    domainSecondary:
      "전 세계 이용자에게 웹툰을 서비스하는 콘텐츠 플랫폼이에요. 작가와 독자를 연결하는 커뮤니티 기능과 창작 도구까지 함께 만들어요.",
    domainKeywords: ["웹툰", "콘텐츠 플랫폼", "글로벌"],
    problemLede: "작가와 독자가 웹툰 생태계 안에서 더 잘 만나고 소통하게 만드는 게 핵심 문제예요.",
    problemRest: "작가홈·유저홈 같은 공통 커뮤니티 플랫폼으로, 한국과 글로벌 이용자 모두에게 일관된 경험을 만들어요.",
  },
  // 한패스
  cmsjzgwqj000cx7fc1x7py9zs: {
    companyUrl: "https://www.hanpass.com",
    designBlogUrl: null,
    stage: "유니콘·스케일업",
    domainPrimary: "핀테크 · 외국인금융",
    domainSecondary:
      "외국인 고객을 위한 해외송금·금융 서비스를 만드는 핀테크예요. 송금을 넘어 교통, 통신, 커리어 매칭까지 생활 전반의 금융 경험을 확장하고 있어요.",
    domainKeywords: ["핀테크", "해외송금", "외국인 고객"],
    problemLede: "외국인 고객이 낯선 한국에서 겪는 복잡한 금융 절차를 쉽게 만드는 게 핵심 문제예요.",
    problemRest: "언어와 제도가 낯선 고객도 직관적으로 쓸 수 있는 해외송금·금융 서비스를 만들어요.",
  },
  // 엑스에이아이(xAI)
  cmsjzdz1v000hmmwnyot0wp88: {
    companyUrl: "https://x.ai",
    designBlogUrl: null,
    stage: "유니콘·스케일업",
    domainPrimary: "AI",
    domainSecondary: "우주를 이해하는 AI 시스템을 만드는 걸 미션으로 하는 AI 기업이에요. 소셜·AI 기반 프로덕트 전반의 경험을 설계해요.",
    domainKeywords: ["AI", "소셜 프로덕트", "글로벌"],
    problemLede: "AI가 만드는 새로운 경험을, 사람이 실제로 쓸 수 있는 제품으로 다듬는 게 핵심 문제예요.",
    problemRest: "빠르게 움직이는 팀에서, AI 도구까지 활용해 프로덕트 경험을 처음부터 끝까지 설계해요.",
  },
};

// 처음 보는 유저도 "스테이지"·"도메인"이 뭔지 바로 알 수 있도록 라벨 옆에 다는 설명 툴팁.
function InfoTip({ text }: { text: string }) {
  return (
    <span className="group relative inline-flex items-center">
      <Info aria-hidden className="h-3 w-3 text-neutral-300" />
      <span className="pointer-events-none absolute left-1/2 top-full z-10 mt-2 w-56 -translate-x-1/2 break-keep rounded-xl bg-ink px-3 py-2 text-xs leading-relaxed text-white opacity-0 shadow-dropdown transition-opacity group-hover:opacity-100">
        {text}
      </span>
    </span>
  );
}

// lucide-react엔 filled(솔리드) 변형이 없어서, 토스 앱 특유의 "소프트 틴트 사각 배지"
// 아이콘 룩을 위해 이 두 아이콘만 직접 채움 도형으로 그린다.
function BarChartIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <rect x="3" y="13.5" width="4.2" height="7" rx="1.2" />
      <rect x="9.9" y="8.5" width="4.2" height="12" rx="1.2" />
      <rect x="16.8" y="3.5" width="4.2" height="17" rx="1.2" />
    </svg>
  );
}

// 손잡이는 선(stroke)으로, 몸통은 채움(fill)으로 — 아래 CheckCircleIcon의 체크마크 선과
// 두께(strokeWidth 2)를 맞춰서 두 아이콘이 한 세트로 보이게 한다.
function BriefcaseIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <rect x="7" y="3.6" width="10" height="4.3" rx="1.6" fill="none" stroke="currentColor" strokeWidth={2} />
      <rect x="2" y="7.4" width="20" height="13" rx="2.5" />
      <rect x="2" y="11.7" width="20" height="2.2" fill="white" />
    </svg>
  );
}

function CheckCircleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <circle cx="12" cy="12" r="10" />
      <path d="M7.3 12.3l3 3 6.4-7" fill="none" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LinkChip({ href, label }: { href: string | null; label: string }) {
  if (!href) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-400">
        {label} · 확인 안 됨
      </span>
    );
  }
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-600 transition-colors hover:border-primary hover:text-primary"
    >
      {label}
      <ExternalLink aria-hidden className="h-3 w-3" />
    </a>
  );
}

// 토스 설정/약관 화면과 같은 "행 전체를 눌러 펼치는" 아코디언 타일. 라벨·값은 항상 보이고
// 세부 설명(+태그)은 접혀 있다가 펼쳐진다.
function ExpandableTile({
  icon,
  iconBg,
  iconColor,
  label,
  infoText,
  value,
  tags,
  children,
}: {
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  label: string;
  infoText: string;
  value: string;
  tags: readonly string[];
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  // 태그가 3개면 타일 폭에서 2줄로 밀리는 경우가 있어서, 접힌 상태에선 앞 2개 + "···"만
  // 보여주고 나머지는 펼쳤을 때(children 위에 전체 태그 목록으로) 보여준다.
  const visibleTags = tags.slice(0, 2);
  const hasMoreTags = tags.length > visibleTags.length;

  return (
    <div className="rounded-xl bg-neutral-50 p-[28px]">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-start justify-between gap-2 text-left"
      >
        <div>
          <div className="mb-4 flex items-center gap-2 text-sm tracking-[-0.005em] text-neutral-400">
            <span className={clsx("flex h-6 w-6 shrink-0 items-center justify-center rounded-lg", iconBg, iconColor)}>
              {icon}
            </span>
            <span>{label}</span>
            <InfoTip text={infoText} />
          </div>
          <p className="text-sm font-semibold tracking-[-0.005em] text-ink">{value}</p>
          <div className="mt-2 flex flex-nowrap items-center gap-1.5 overflow-hidden">
            {visibleTags.map((tag) => (
              <span
                key={tag}
                className="shrink-0 rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-600"
              >
                {tag}
              </span>
            ))}
            {hasMoreTags && <span className="shrink-0 text-xs font-medium text-neutral-400">···</span>}
          </div>
        </div>
        <ChevronDown
          aria-hidden
          className={clsx(
            "mt-1 h-4 w-4 shrink-0 text-neutral-300 transition-transform",
            open && "rotate-180 text-neutral-500"
          )}
        />
      </button>
      <div
        className={clsx(
          "overflow-hidden transition-[max-height] duration-300 ease-in-out",
          open ? "max-h-60" : "max-h-0"
        )}
      >
        <div className="pt-5">
          {hasMoreTags && (
            <div className="mb-3 flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-600"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}

export function CompanyAnalysisCard({ jobId }: { jobId: string }) {
  const data = COMPANY_ANALYSIS[jobId];
  if (!data) return null;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap gap-2">
        <LinkChip href={data.companyUrl} label="홈페이지" />
        <LinkChip href={data.designBlogUrl} label="디자인 블로그" />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <ExpandableTile
          icon={<BarChartIcon className="h-3.5 w-3.5" />}
          iconBg="bg-blue-50"
          iconColor="text-primary"
          label="스테이지"
          infoText="스타트업부터 대기업까지, 기업이 현재 어떤 단계에 있는지에 따라 요구되는 역량이 달라요."
          value={data.stage}
          tags={STAGE_KEYWORDS[data.stage]}
        >
          <p className="text-sm leading-relaxed tracking-[-0.005em] text-neutral-700">
            {STAGE_FIT[data.stage]}
          </p>
        </ExpandableTile>

        <ExpandableTile
          icon={<BriefcaseIcon className="h-3.5 w-3.5" />}
          iconBg="bg-[oklch(0.962_0.045_162)]"
          iconColor="text-positive"
          label="도메인"
          infoText="해당 기업이 어떤 산업군의 서비스를 운영 중인지 확인하세요."
          value={data.domainPrimary}
          tags={data.domainKeywords}
        >
          <p className="text-sm leading-relaxed tracking-[-0.005em] text-neutral-700">
            {data.domainSecondary}
          </p>
        </ExpandableTile>
      </div>

      <div className="rounded-xl bg-neutral-50 p-[28px]">
        <div className="mb-4 flex items-center gap-2 text-sm tracking-[-0.005em] text-neutral-400">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[#FFDEE8] text-[#FF4E85]">
            <CheckCircleIcon className="h-3.5 w-3.5" />
          </span>
          <span>해결하려는 문제</span>
          <InfoTip text="채용공고와 기업 정보를 바탕으로 분석한, 회사의 핵심 문제예요." />
        </div>
        <p className="text-sm leading-relaxed tracking-[-0.005em] text-neutral-700">
          <mark className="bg-blue-50 font-bold text-ink">{data.problemLede}</mark> {data.problemRest}
        </p>
      </div>
    </div>
  );
}
