"use client";

import { Info } from "lucide-react";
import { clsx } from "clsx";

// "이렇게 어필하세요" — 스테이지별 rubric(내부 판단 기준, 화면엔 안 보임)을 참고해 AI가
// 고를 법한 포인트를 "공고 원문 근거 → 어필 지시" 형태로만 보여준다. 아직 실제 Gemini
// 파이프라인에 연결하기 전이라, 시범 적용 대상 5개 공고만 손으로 검증한 내용을 그대로
// 하드코딩해서 먼저 확인한다.
//
// 토스 디자인 시스템 문서(그라디언트/이너섀도우 금지, 1px 헤어라인 보더로만 표면을 구분,
// grey-50 fill로 콘텐츠 위계 구분)를 적용해 이전의 글래스모피즘·불규칙 그라디언트 배경을 걷어냈다.
//
// sourceQuote: 포인트가 근거로 삼은 공고 원문 문장(해당 job.description에 정확히 일치해야
// 함) — 클릭 시 이 문장을 "공고 내용" 쪽에서 찾아 스크롤 + 밑줄 표시하는 데 쓴다. 화면에
// 원문 인용을 직접 보여주진 않고(이전 피드백대로) 클릭했을 때만 원문 위치를 가리키는 용도.
type AppealPoint = { title: string; body: string; sourceQuote: string };

// 시범 적용 대상 5개 공고 각각의 어필 포인트 3개씩. job.id로 조회한다.
const APPEAL_POINTS: Record<string, AppealPoint[]> = {
  // 토스인슈어런스
  cms6d6b7e00024l8qf69w38zy: [
    {
      title: "업무 흐름 단위로 설계한 경험",
      body: "화면 하나하나가 아니라 사용자의 전체 업무 흐름을 보고 설계했는지, 반복 업무의 클릭 수와 인지 부하를 얼마나 줄였는지 보여주세요.",
      sourceQuote:
        "화면이 아닌 사용자의 업무 흐름 단위로 UX를 설계하고, 반복 업무의 클릭 수와 인지 부하를 줄이는 것을 설계 기준으로 삼아본 경험",
    },
    {
      title: "데이터 기반 임팩트를 확장 수치",
      body: "문제를 어떤 데이터로 발견했는지뿐 아니라, 그 개선이 다른 화면·서비스로 얼마나 확장됐는지까지 수치로 보여주세요.",
      sourceQuote: "사용자의 정성·정량적 근거로 근본적인 문제를 정의하고 개선한 경험",
    },
    {
      title: '"내 결정이 팀 기준이 됐다"는 이야기',
      body: "혼자 내린 결정이 다른 동료들도 쓰는 기준이 된 경험으로 풀어서 쓰세요.",
      sourceQuote: "디자인의 목적과 가치를 다양한 직군의 동료들에게 설득력 있게 전달하고 조율하는 능력",
    },
  ],
  // 아정당
  cmsk1ir4u0002qae1xik22zn3: [
    {
      title: "논리적 근거로 설득한 경험",
      body: "고객 문제를 어떻게 정의했는지, 그 해결 방향을 논리적 근거로 제안하고 설득한 과정을 보여주세요.",
      sourceQuote: "고객 문제를 정의하고 논리적 근거로 해결 방향을 제안·설득할 수 있어야 합니다",
    },
    {
      title: "디자인 시스템 제작·고도화 경험",
      body: "처음부터 디자인 시스템을 만들었는지, 기존 시스템을 어떻게 고도화했는지 구체적으로 보여주세요.",
      sourceQuote: "디자인 시스템을 제작·고도화할 수 있어야 하고",
    },
    {
      title: "AI 도구로 효율을 높인 경험",
      body: "AI 기반 도구를 프로덕트 디자인이나 팀 업무에 활용해서 효율을 높인 구체적인 사례를 보여주세요.",
      sourceQuote: "AI 기반 도구를 활용해 프로덕트 디자인 또는 팀 업무 효율성을 높여본 경험이 있어야 합니다",
    },
  ],
  // 네이버웹툰
  cmsk1j36a0007qae1rernnein: [
    {
      title: "프로토타이핑과 그래픽 디자인 경험",
      body: "모바일 서비스를 직접 프로토타이핑해본 경험과, 그래픽 디자인 결과물을 함께 보여주세요.",
      sourceQuote: "모바일 서비스 프로토타이핑 경험과 그래픽 디자인 경험이 있어야 하며",
    },
    {
      title: "이미지를 매력적으로 구성한 경험",
      body: "이미지를 어떻게 구성하고 가공해서 더 매력적으로 만들었는지 보여주세요.",
      sourceQuote: "이미지를 매력적으로 구성·가공하는 역량",
    },
    {
      title: "AI로 그래픽을 제작한 경험",
      body: "AI 도구를 활용해서 2D·3D 그래픽을 제작해본 경험이 있다면 구체적으로 보여주세요.",
      sourceQuote: "AI를 활용한 2D·3D 그래픽 제작 경험",
    },
  ],
  // 한패스
  cmsjzgwqj000cx7fc1x7py9zs: [
    {
      title: "언어 장벽 없는 서비스를 설계한 경험",
      body: "국적과 언어가 달라도 누구나 쉽게 쓸 수 있도록 설계한 경험을 구체적으로 보여주세요.",
      sourceQuote: "국적과 언어를 넘어 누구나 쉽고 직관적으로 이용할 수 있는 혁신적인 금융 서비스 경험 설계",
    },
    {
      title: "데이터 기반 그로스 실험 경험",
      body: "크로스셀·업셀을 유도하는 인터페이스를 설계하고, 데이터로 그로스 실험을 수행한 경험을 보여주세요.",
      sourceQuote:
        "서비스 간 크로스셀(Cross-sell) 및 업셀(Up-sell) 유도 인터페이스 설계, 데이터 기반의 그로스 실험 수행",
    },
    {
      title: "문제 정의부터 해결까지의 과정",
      body: "문제를 어떻게 정의했고 어떤 과정으로 해결했는지, 그 안에서 본인이 기여한 부분을 명확히 보여주세요.",
      sourceQuote: "문제 정의 과정 및 해결 프로세스가 잘 드러난 프로젝트 위주 작성, 본인의 기여도 기재",
    },
  ],
  // 엑스에이아이(xAI) — 공고 원문이 영어라 sourceQuote도 영어 그대로 둔다(제목·본문은 한국어 유지).
  cmsjzdz1v000hmmwnyot0wp88: [
    {
      title: "AI 도구로 빠르게 반복한 경험",
      body: "전통적인 도구뿐 아니라 AI 기반 디자인 도구까지 활용해서 빠르게 탐색하고 반복 개선한 경험을 보여주세요.",
      sourceQuote: "Rapidly exploring, prototyping, and iterating using both traditional and AI-assisted design tools",
    },
    {
      title: "정성 리서치와 데이터로 판단한 경험",
      body: "정성적 리서치, 프로덕트 데이터, 그리고 직관을 함께 활용해서 의사결정을 내린 과정을 보여주세요.",
      sourceQuote: "Using qualitative research, product data, and intuition to guide decisions",
    },
    {
      title: "엔드투엔드로 설계한 경험",
      body: "소셜·AI 기반 프로덕트에서 처음부터 끝까지 전체 경험을 설계해본 과정을 보여주세요.",
      sourceQuote: "Designing end-to-end product experiences across social and AI-driven products",
    },
  ],
};

export function AppealPointsCard({
  jobId,
  activeQuote,
  onSelectQuote,
}: {
  jobId: string;
  activeQuote: string | null;
  onSelectQuote: (quote: string) => void;
}) {
  const points = APPEAL_POINTS[jobId];
  if (!points) return null;

  return (
    // "공고 내용" 버튼을 누르면 스크롤이 아래로 이동하는데, sticky가 없으면 이 패널
    // 자체가 화면 밖으로 같이 밀려나서 근거 문장을 밑줄 표시해도 정작 이 패널이 안
    // 보이는 문제가 있었다. lg 2단 레이아웃에서만 상단에 고정되게 한다.
    <div className="rounded-2xl bg-white p-6 lg:sticky lg:top-6 lg:self-start">
      <div className="mb-5 flex items-center gap-1.5">
        <h2 className="text-sm font-semibold tracking-[-0.01em] text-ink">이렇게 어필하세요</h2>
        {/* CSS만으로 동작하는 호버 툴팁이라 클라이언트 컴포넌트 전환 없이 구현 가능 */}
        <div className="group relative flex items-center">
          <Info aria-hidden className="h-3 w-3 text-neutral-300" />
          <div className="pointer-events-none absolute left-1/2 top-full z-10 mt-2 w-56 -translate-x-1/2 break-keep rounded-xl bg-ink px-3 py-2 text-xs leading-relaxed text-white opacity-0 shadow-dropdown transition-opacity group-hover:opacity-100">
            채용공고 원문과 기업 정보를 바탕으로 AI가 분석한 내용이에요.
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        {points.map((point, index) => {
          const isActive = activeQuote === point.sourceQuote;
          return (
            <div
              key={point.title}
              className={clsx(
                "rounded-xl bg-neutral-50 p-[28px] transition-colors",
                isActive && "ring-2 ring-primary ring-inset"
              )}
            >
              <div className="mb-2 flex items-center gap-1.5">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-primary text-xs font-bold text-white">
                  {index + 1}
                </span>
                <p title={point.title} className="min-w-0 truncate text-sm font-semibold tracking-[-0.005em] text-ink">
                  {point.title}
                </p>
              </div>
              <p className="text-sm leading-relaxed tracking-[-0.005em] text-neutral-700">{point.body}</p>
              <button
                type="button"
                onClick={() => onSelectQuote(point.sourceQuote)}
                className="mt-3 text-xs font-semibold text-primary hover:underline"
              >
                공고 내용
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
