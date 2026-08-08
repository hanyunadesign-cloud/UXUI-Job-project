"use client";

import { Info } from "lucide-react";
import { clsx } from "clsx";

// "이렇게 어필하세요" — 스테이지별 rubric(내부 판단 기준, 화면엔 안 보임)을 참고해 AI가
// 고를 법한 포인트를 "공고 원문 근거 → 어필 지시" 형태로만 보여준다. 아직 실제 Gemini
// 파이프라인에 연결하기 전이라, 검증한 내용을 그대로 하드코딩해서 job.id로 조회한다.
// page.tsx가 이 맵을 export해서 가져다 쓴다 — job.id가 여기 있는지로 "이 공고에 기업 정보/
// 어필 포인트 UI를 보여줄지"를 판단해서, 공고 id 목록을 페이지 쪽에 따로 유지하지 않는다.
//
// 토스 디자인 시스템 문서(그라디언트/이너섀도우 금지, 1px 헤어라인 보더로만 표면을 구분,
// grey-50 fill로 콘텐츠 위계 구분)를 적용해 이전의 글래스모피즘·불규칙 그라디언트 배경을 걷어냈다.
//
// sourceQuote: 포인트가 근거로 삼은 공고 원문 문장(해당 job.description에 정확히 일치해야
// 함) — 클릭 시 이 문장을 "공고 내용" 쪽에서 찾아 스크롤 + 밑줄 표시하는 데 쓴다. 화면에
// 원문 인용을 직접 보여주진 않고(이전 피드백대로) 클릭했을 때만 원문 위치를 가리키는 용도.
type AppealPoint = { title: string; body: string; sourceQuote: string };

// 공고 각각의 어필 포인트 3개씩. job.id로 조회한다.
export const APPEAL_POINTS: Record<string, AppealPoint[]> = {
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
  cmsddhx5g00021hhjtkk4ciui: [
    { title: "Unity UGUI 적용 경험", body: "기획된 UI를 Unity UGUI로 직접 구현해본 경험을 구체적으로 보여주세요.", sourceQuote: "Unity UGUI 적용" },
    { title: "2D 모바일 게임 출시 경험", body: "출시까지 이어진 2D 모바일 게임 프로젝트 경험이 있다면 강조하세요.", sourceQuote: "2D 모바일 게임 출시 경험" },
    { title: "캐주얼 게임 UI/UX 설계 역량", body: "캐주얼 게임의 특성을 이해하고 유니크하게 풀어낸 UI/UX 설계 사례를 보여주세요.", sourceQuote: "캐주얼 게임 특성 이해 및 유니크한 UI/UX 설계 가능" },
  ],
  cms6ct19300058458zv7hm88w: [
    { title: "다양한 플랫폼 화면설계 경험", body: "모바일 앱 외에도 웹/앱 Front와 Admin 화면을 설계해본 경험을 포트폴리오에 담아주세요.", sourceQuote: "모바일 앱 외 다양한 플랫폼 화면설계 및 유저시나리오, 플로우 설계" },
    { title: "커머스 서비스 출시 경험", body: "웹/모바일 커머스 서비스를 실제 출시까지 경험한 사례가 있다면 강조하세요.", sourceQuote: "웹/모바일 서비스 출시 경험 보유자" },
    { title: "UX 전략 분석·보고 역량", body: "UX 전략 컨설팅을 위한 분석과 보고자료를 작성해본 경험을 구체적으로 보여주세요.", sourceQuote: "UX 전략 컨설팅을 위한 분석 및 보고자료 작성" },
  ],
  cmrwfyj7g00175rh9jd05a0ro: [
    { title: "금융 상품 엔드투엔드 디자인 경험", body: "보험, 결제, 클레임 등 금융 상품의 전체 경험을 컨셉부터 프로덕션까지 설계해본 과정을 보여주세요.", sourceQuote: "Design end-to-end product experiences from concept to production." },
    { title: "복잡한 플로우를 단순화한 경험", body: "복잡한 금융 워크플로우를 직관적인 경험으로 단순화한 구체적 사례를 보여주세요.", sourceQuote: "Ability to simplify complex workflows into intuitive experiences." },
    { title: "디자인 시스템 구축·운영 경험", body: "재사용 가능한 컴포넌트 라이브러리와 디자인 시스템을 만들고 운영한 경험을 보여주세요.", sourceQuote: "Build and maintain scalable design systems and reusable UI components." },
  ],
  cmrdl1y8q000l5xp5cpdbz9vm: [
    { title: "AI 인터페이스 상태 설계 경험", body: "idle, thinking, acting 같은 AI 시스템의 다양한 상태를 사용자에게 명확히 전달하는 인터랙션을 설계해본 경험을 보여주세요.", sourceQuote: "Define interaction states for AI interfaces: idle, thinking, acting, waiting, uncertain, interrupted, failed, and recovered." },
    { title: "Human-in-the-loop 컨트롤 설계 경험", body: "사용자가 AI의 결정을 검토하고 필요하면 개입할 수 있는 컨트롤을 설계해본 경험을 구체적으로 보여주세요.", sourceQuote: "Design human-in-the-loop controls - how users review AI decisions, override actions, and stay informed without micromanaging." },
    { title: "마이크로 인터랙션 설계 역량", body: "상태 전환, 예외 케이스, 실패 처리 같은 세밀한 단위의 인터랙션을 설계할 수 있다는 걸 사례로 보여주세요.", sourceQuote: "Ability to design at the micro level - states, transitions, edge cases, and failure handling." },
  ],
  cmrdl1vrs000k5xp572f1hd9y: [
    { title: "AI 대화 플로우 설계 경험", body: "챗, 태스크 완료 등 다양한 상황의 AI 대화 플로우를 설계해본 경험을 보여주세요.", sourceQuote: "Design conversational flows for AI interactions across chat, task completion, and assistant-guided workflows." },
    { title: "불확실성 커뮤니케이션 설계", body: "AI가 불확실함을 드러내고 에러나 한계를 사용자에게 명확히 전달하도록 설계한 경험을 보여주세요.", sourceQuote: "Define how the AI sets expectations, signals uncertainty, asks for input, and communicates errors or limitations." },
    { title: "멀티턴 대화 설계 경험", body: "여러 턴에 걸친 프롬프트 플로우, 에러 복구, 맥락 전달까지 설계해본 경험을 구체적으로 보여주세요.", sourceQuote: "Ability to design multi-turn interactions, including prompting flows, error recovery, clarification, and context handoff." },
  ],
  cmrdl1tbm000j5xp5is2eep3d: [
    { title: "멀티플랫폼 앱 UX 오너십 경험", body: "iOS, Android, 웹 등 여러 플랫폼에서 핵심 사용자 경험을 책임지고 설계해본 경험을 보여주세요.", sourceQuote: "Own UX for A1's core app surfaces across iOS, Android, and web." },
    { title: "AI 상태 전반을 아우른 플로우 설계", body: "로딩부터 실패, 복구까지 AI가 거치는 다양한 상태를 사용자 플로우로 설계해본 경험을 보여주세요.", sourceQuote: "Map and design the full range of AI states a user encounters - loading, thinking, acting, waiting, completing, stalling, failing, and recovering." },
    { title: "사용성 리서치 기반 개선 경험", body: "사용자가 신뢰를 잃거나 불확실함을 느끼는 지점을 리서치로 찾아 개선한 경험을 보여주세요.", sourceQuote: "Conduct usability research to understand where users lose trust, feel uncertain, or disengage." },
  ],
  cmrdl1qvw000i5xp5hss0iawo: [
    { title: "AI 인터페이스 모션 설계 경험", body: "로딩, 스트리밍 응답, 진행 상태 등 AI 인터페이스 전반의 모션을 설계해본 경험을 보여주세요.", sourceQuote: "Design motion and animation for AI product interfaces, including loading states, streaming responses, task progress, and system transitions." },
    { title: "상태 전달용 애니메이션 패턴 개발", body: "불확실함, 대기, 실패, 복구 같은 상태를 모션으로 표현한 패턴을 만들어본 경험을 보여주세요.", sourceQuote: "Develop animation patterns for uncertainty, thinking states, waiting states, failure, recovery, and asynchronous AI processes." },
    { title: "기능적 모션 설계 관점", body: "모션을 장식이 아니라 혼란을 줄이는 기능으로 활용한 판단 기준을 사례로 보여주세요.", sourceQuote: "Use motion to reduce confusion, not add decoration." },
  ],
  cmrdl1ofx000h5xp5b27ze69b: [
    { title: "제품 전반 비주얼 언어 설계 경험", body: "웹과 모바일을 아우르는 비주얼 언어와 디자인 시스템, UI 컴포넌트를 설계해본 경험을 보여주세요.", sourceQuote: "Design the visual language, design system, and UI components for A1's product across web and mobile." },
    { title: "AI 콘텐츠 가시성 패턴 설계", body: "AI가 생성한 콘텐츠와 시스템 상태, 신뢰도를 사용자가 한눈에 구분할 수 있는 비주얼 패턴을 만들어본 경험을 보여주세요.", sourceQuote: "Create visual patterns that help users parse AI-generated content, distinguish system states, and understand confidence and reliability signals." },
    { title: "디자인 시스템 구축 기여 경험", body: "Figma로 디자인 시스템을 만들거나 기여해본 경험을 구체적으로 보여주세요.", sourceQuote: "Proficiency in Figma and experience building or contributing to design systems." },
  ],
  cmrdl1lz5000g5xp5lviefcgo: [
    { title: "휴먼-AI 워크플로우 패턴 설계", body: "프롬프팅, 검토, 확인, 수정 등 사람과 AI가 함께 일하는 흐름의 인터랙션 패턴을 설계해본 경험을 보여주세요.", sourceQuote: "Create interaction patterns for human-AI workflows, including prompting, review, confirmation, correction, handoff, and recovery." },
    { title: "복잡한 AI 기능을 명확한 플로우로 전환", body: "다단계의 복잡한 AI 기능을 통제 가능하고 일상적으로 쓸 수 있는 플로우로 바꿔본 경험을 보여주세요.", sourceQuote: "Turn complex, multi-step AI capabilities into flows that are clear, controllable, and usable in everyday contexts." },
    { title: "경량 사용자 리서치 진행 경험", body: "사용성 테스트로 마찰이나 신뢰 문제, 실패 지점을 직접 찾아낸 경험을 보여주세요.", sourceQuote: "Run lightweight user research and usability tests to identify friction, trust issues, and failure points." },
  ],
  cmrdl1j2a000f5xp54oay0vyg: [
    { title: "인터랙션 모델 프로토타이핑 경험", body: "스트리밍 응답이나 실시간 피드백 같은 새로운 HCI 인터랙션 모델을 실제 동작하는 프로토타입으로 만들어본 경험을 보여주세요.", sourceQuote: "Create functional prototypes of new HCI interaction models, including streaming responses, multi-step task flows, real-time feedback loops, and system state visibility." },
    { title: "프론트엔드 엔지니어링 역량", body: "React, TypeScript 등으로 직접 구현까지 해본 프론트엔드 역량을 코드나 결과물로 보여주세요.", sourceQuote: "Strong frontend engineering skills in React, TypeScript, or equivalent." },
    { title: "상태 표현 UI 패턴 실험 경험", body: "진행 상황, 불확실성, 실패, 복구 같은 상태를 명확히 보여주는 UI 패턴을 실험해본 경험을 보여주세요.", sourceQuote: "Experiment with UI patterns that show progress, uncertainty, confidence, failure, and recovery clearly to users." },
  ],
  cms6ct14z000284580pftjxtz: [
    { title: "생성형 AI 활용 콘텐츠 제작 경험", body: "AI 툴로 반복 콘텐츠 제작을 효율화하면서 브랜드 톤앤매너를 지킨 작업물을 보여주세요.", sourceQuote: "생성형 AI를 활용해 반복 콘텐츠 제작은 효율화하고 브랜드 톤앤매너에 맞게 디렉팅할 수 있는 분" },
    { title: "웹콘텐츠 디자인 제작 경험", body: "상세페이지, 광고배너, 썸네일 등 실제 브랜드 웹콘텐츠를 제작해본 작업물을 포트폴리오에 담아주세요.", sourceQuote: "자사 브랜드 웹콘텐츠(상세페이지, 광고배너, 썸네일 등) 디자인 제작" },
    { title: "브랜드 가이드 기반 디자인 적용 역량", body: "브랜드 톤앤매너와 가이드 기준을 이해하고 실제 디자인에 반영한 사례를 보여주세요.", sourceQuote: "브랜드 톤앤매너와 가이드 기준을 이해하고 디자인에 적용할 수 있으신 분" },
  ],
  cmsjzfu8w0007x7fcqsli4km3: [
    { title: "디자인시스템 기반 UX 설계 경험", body: "UDS 같은 자체 디자인시스템을 기준으로 고객경험을 설계해본 경험을 보여주세요.", sourceQuote: "모바일 프로덕트 UDS 기반 고객경험 설계 및 디자인" },
    { title: "NPS 기반 UX 개선 제안 경험", body: "NPS 같은 정량 지표를 바탕으로 UX 문제를 진단하고 개선 시나리오를 제안해본 경험을 보여주세요.", sourceQuote: "모바일 NPS 기반 UX 인덱싱 및 개선 시나리오 디자인·제안" },
    { title: "벤치마킹 기반 UX 리서치 경험", body: "국내외 서비스를 벤치마킹하고 리서치로 인사이트를 도출해본 경험을 구체적으로 보여주세요.", sourceQuote: "국내외 서비스 벤치마킹 및 UX 리서치를 통한 인사이트 발굴" },
  ],
  cmrf5xd4b0008nkt5m8sot323: [
    { title: "글로벌 대응 UI 구조 설계 경험", body: "다양한 모바일 해상도와 글로벌 서비스 환경을 고려해 UI 구조를 설계해본 경험을 보여주세요.", sourceQuote: "다양한 모바일 해상도와 글로벌 서비스 대응을 고려한 UI 구조 설계" },
    { title: "플레이 경험 기반 UI 흐름 설계 역량", body: "실제 게임 플레이 경험을 바탕으로 UI 흐름을 설계해본 사례를 보여주세요.", sourceQuote: "게임 플레이 경험을 기반으로 UI 흐름을 설계할 수 있는 분" },
    { title: "서브컬처 게임 GUI 컨셉·연출 경험", body: "서브컬처 게임의 UX/UI 프로세스 전반과 GUI 컨셉, 연출을 다뤄본 경험을 보여주세요.", sourceQuote: "서브컬처 게임의 전반적인 UX/UI 프로세스 설계, GUI 컨셉과 연출" },
  ],
  cmrf5xakd0005nkt5h2fnv8ke: [
    { title: "글로벌 타겟 캐주얼 게임 UI 설계 경험", body: "메타 씬과 인게임을 아우르는 글로벌 타겟 UI 컨셉과 레이아웃을 설계해본 경험을 보여주세요.", sourceQuote: "글로벌 타겟, 신규 캐주얼 게임 UI 컨셉 및 레이아웃 설계 (메타 씬 / 인게임)" },
    { title: "북미 스타일 UI 레퍼런스 분석 경험", body: "북미풍 캐주얼 게임의 UI를 분석하고 재해석해본 경험을 구체적으로 보여주세요.", sourceQuote: "북미풍 캐주얼 게임의 UI 레퍼런스 분석 및 재해석 능력이 있으신 분" },
    { title: "캐주얼 게임 UI 스타일 구축 역량", body: "UI 레이아웃, 타이포그래피, 컬러시스템까지 캐주얼 게임만의 스타일을 설계해본 경험을 보여주세요.", sourceQuote: "캐주얼한 게임 UI 스타일(UI 레이아웃, 타이포그래픽, 컬러시스템 설계)을 보유하신 분" },
  ],
  cmrf23cpw0005b2fnd656kk6x: [
    { title: "프로젝트 목적 기반 UX/UI 설계 경험", body: "프로젝트 목적에 맞춰 UX/UI를 설계하고 디자인 방향을 제안해본 경험을 보여주세요.", sourceQuote: "프로젝트 목적에 부합하는 UX/UI 설계 및 디자인" },
    { title: "사용자 조사 기반 인사이트 도출 경험", body: "사용자 조사와 데이터 분석을 통해 디자인 방향성과 인사이트를 도출해본 과정을 구체적으로 보여주세요.", sourceQuote: "사용자 조사 및 데이터 분석을 통해 디자인 방향성과 인사이트 도출" },
    { title: "인터랙션 이해 기반 시각 표현력", body: "인터페이스와 인터랙션에 대한 이해를 바탕으로 본인 생각을 시각적으로 설득력 있게 표현한 작업물을 보여주세요.", sourceQuote: "인터페이스/인터랙션에 대한 이해가 높고, 본인의 의견을 시각적으로 멋지게 표현할 수 있는 분" },
  ],
  cmrf238700002b2fnbtxzftm3: [
    { title: "요구사항의 화면설계 구체화 경험", body: "고객사 요구사항을 IA, Flow, Wireframe, 화면설계서로 구체화해본 실무 경험을 보여주세요.", sourceQuote: "고객사 요구사항을 IA, Flow, Wireframe, 화면설계서로 구체화하고, 디자인·개발 협업을 통해 서비스 오픈까지 연결되는 실무 경험을 할 수 있습니다." },
    { title: "디자이너·개발자 협업 경험", body: "화면설계서를 기준으로 디자이너, 개발자와 협업해 서비스를 오픈까지 이끈 경험을 보여주세요.", sourceQuote: "화면설계서/정의서를 기반으로 디자이너, 개발자와 협업해 본 경험" },
    { title: "운영·개편 프로젝트 경험", body: "이미 운영 중인 서비스의 개편이나 레거시 개선 프로젝트를 경험해봤다면 구체적으로 보여주세요.", sourceQuote: "운영, 개편, 레거시 개선 프로젝트를 경험해 보신 분" },
  ],
  cmrlguh030008gq5j6a4q4t8g: [
    { title: "모바일 서비스 운영 UI 설계 경험", body: "실제 운영 중인 모바일 서비스의 UX/UI 화면을 설계하고 디자인해본 경험을 보여주세요.", sourceQuote: "모바일 서비스 운영 UX/UI 화면 설계 및 디자인" },
    { title: "디자인 시스템 기반 UI 설계 경험", body: "디자인 시스템의 컴포넌트와 규칙을 기준으로 UI를 설계해본 경험을 구체적으로 보여주세요.", sourceQuote: "디자인 시스템 기반 UI 설계 경험 있으신 분" },
    { title: "프로모션·이벤트 운영 디자인 경험", body: "서비스 운영을 위한 프로모션, 이벤트 디자인을 만들어본 경험이 있다면 강조하세요.", sourceQuote: "모바일 서비스 UX/UI 디자인 및 운영 경험 있으신 분(프로모션, 이벤트 등 운영 디자인 경험 포함)" },
  ],
  cmrt6jgn4000h14dq53oqle9x: [
    { title: "사용자 문제 정의 및 개선 방향 수립 경험", body: "사용자 문제를 정의하고 제품 개선 방향을 직접 수립해본 경험을 보여주세요.", sourceQuote: "사용자 문제 정의 및 제품 개선 방향 수립" },
    { title: "퍼널 분석·A/B 테스트 설계 경험", body: "퍼널을 분석하고 A/B 테스트를 직접 설계해본 경험을 구체적인 수치와 함께 보여주세요.", sourceQuote: "퍼널 분석 및 A/B 테스트 설계" },
    { title: "모바일 서비스 5년 이상 UX/UI 경력", body: "모바일 앱이나 플랫폼에서 제품 기획부터 화면 디자인까지 수행한 경력을 보여주세요.", sourceQuote: "모바일 앱/플랫폼 UX/UI 5년 이상 경력" },
  ],
  cmrlhc2dj001gvkz6ve5bpein: [
    { title: "서브컬처 게임 GUI 컨셉·연출 경험", body: "서브컬처 프로젝트의 GUI 컨셉 제안부터 연출까지 담당해본 경험을 보여주세요.", sourceQuote: "서브컬쳐 PC/콘솔 프로젝트의 GUI 디자인/컨셉 제안/제작 및 연출 전반을 담당하고, UI 관련 리소스 파일을 관리합니다." },
    { title: "Unity 기반 UI 연출 제작 역량", body: "Unity6 엔진으로 다이나믹한 UI 연출과 리소스를 직접 제작해본 경험을 보여주세요.", sourceQuote: "Unity6 엔진 활용 및 리소스 제작, 다이나믹한 UI 연출 제작 역량" },
    { title: "AI 활용 컨셉 제시 역량", body: "AI 툴로 다양한 컨셉과 시안을 빠르게 제시해본 경험이 있다면 보여주세요.", sourceQuote: "AI를 활용해 다양한 컨셉/시안을 제시할 수 있는 역량" },
  ],
  cmrt6jfqv000814dqn8ecxql4: [
    { title: "라이브 서비스 운영 경험", body: "출시 후에도 계속 운영되는 라이브 게임에서 UI를 관리하고 개선해본 경험을 보여주세요.", sourceQuote: "라이브 게임의 서비스를 경험이 있으신 분" },
    { title: "과금·시스템 UI 설계 이해", body: "인앱결제, 상점 등 과금 UI와 시스템 UI를 구조적으로 설계한 경험을 구체적으로 보여주세요.", sourceQuote: "시스템 UI 및 과금 UI 구성에 대한 깊은 이해가 있으신 분" },
    { title: "UI 모션 작업 경험", body: "After Effects 등으로 UI 연출·모션을 직접 제작한 결과물을 포트폴리오에 담아보세요.", sourceQuote: "After Effects를 활용한 UI 모션 작업 가능하신 분" },
  ],
  cmsddkbtj000c1hhj8ahzluhg: [
    { title: "생성형 AI 이미지 제작 경험", body: "미드저니, 스테이블 디퓨전 등 생성형 AI 도구로 이미지를 직접 만들어본 경험을 포트폴리오에 담아보세요.", sourceQuote: "생성형 인공지능 기반 이미지 제작 도구 활용 경험(제미나이, 지피티, 시드림, 미드저니, 포토샵 등)" },
    { title: "그래픽 툴 활용 능숙도", body: "포토샵, 일러스트레이터, 피그마 등으로 완성도 있게 작업한 결과물을 보여주세요.", sourceQuote: "그래픽 디자인 툴 활용 능숙(포토샵, 일러스트레이터, 피그마 등)" },
    { title: "비주얼 트렌드 감각", body: "최신 비주얼 트렌드를 반영해 감각적으로 표현한 작업물을 구체적으로 소개해보세요.", sourceQuote: "최신 비주얼 트렌드 이해 및 감각적 디자인 표현" },
  ],
  cmrf58k5s0005ig1vijuaqjyx: [
    { title: "기획~출시 전 과정 참여 경험", body: "기획부터 디자인, 출시까지 서비스 전체 프로세스에 참여했던 경험을 구체적으로 보여주세요.", sourceQuote: "서비스의 기획부터 디자인, 출시까지 전체 프로세스에 참여한 경험이 있는 분" },
    { title: "컴포넌트 기반 UI 설계 경험", body: "디자인 시스템 컴포넌트를 활용해 일관성 있는 UI를 설계한 사례를 보여주세요.", sourceQuote: "컴포넌트 기반의 디자인 사고에 익숙하며, 일관성 있는 UI를 설계할 수 있는 분" },
    { title: "생성형 AI 워크플로우 활용 경험", body: "생성형 AI나 바이브 코딩을 활용해 디자인 제작 과정을 개선한 경험이 있다면 소개해보세요.", sourceQuote: "생성형 AI 및 바이브 코딩 기반 워크플로우를 활용한 디자인 제작 프로세스 개선" },
  ],
  cmrf5xpnt000nnkt5m5sjr8j1: [
    { title: "UI/UX 설계 문서화 능력", body: "사용성을 근거로 UI/UX를 설계하고 이를 문서로 정리한 경험을 보여주세요.", sourceQuote: "사용성을 바탕으로 한 UI/UX설계 및 문서 작성 능력" },
    { title: "게임 출시·서비스 UX 경험", body: "게임을 개발해 출시했거나, 실서비스 중인 프로덕트의 UX를 설계·개선한 경험을 정리해보세요.", sourceQuote: "게임 개발 및 출시 경험, 또는 실제 서비스 중인 프로덕트의 UX설계/개선 경험" },
    { title: "MMORPG 플레이 경험", body: "MMORPG를 실제로 깊이 플레이해본 경험과 그로부터 얻은 UX 인사이트를 보여주세요.", sourceQuote: "MMORPG에 대한 애정과 풍부한 플레이 경험" },
  ],
  cmrf5xn2e000knkt51zc7c3r4: [
    { title: "언리얼 UMG 위젯 제작 경험", body: "언리얼 엔진의 UMG로 UI 위젯을 직접 제작하고 유지보수한 경험을 보여주세요.", sourceQuote: "언리얼 엔진 5의 UMG 기반 UI 위젯 제작 및 유지보수" },
    { title: "UI 구조 설계 경험", body: "언리얼 엔진에서 UI 구조를 설계하고 확장 가능하게 만든 경험을 구체적으로 소개해보세요.", sourceQuote: "언리얼 엔진 4 이상에서의 UI 구조 설계 경험" },
    { title: "타임라인 UI 애니메이션 구현", body: "타임라인을 활용해 UI 연출과 애니메이션을 직접 구현한 사례를 보여주세요.", sourceQuote: "타임라인을 활용한 UI 연출 및 애니메이션 구현 능력" },
  ],
  cmrf5xkkz000hnkt5r78ulaly: [
    { title: "컨셉 기반 레이아웃 설계 경험", body: "게임 컨셉에 어울리는 레이아웃을 도출한 작업 과정을 보여주세요.", sourceQuote: "컨셉에 어울리는 레이아웃 도출이 가능한 분" },
    { title: "그래픽 리소스 제작 능력", body: "아이콘 드로잉 등 그래픽 리소스를 직접 제작한 결과물을 포트폴리오에 담아보세요.", sourceQuote: "아이콘 드로잉 등의 그래픽 리소스 제작 가능한 분" },
    { title: "Photoshop 활용 능력", body: "Adobe Photoshop 등 그래픽 툴을 능숙하게 다룬 작업물을 보여주세요.", sourceQuote: "Adobe Photoshop 등 그래픽 툴에 능숙한 분" },
  ],
  cmrf5xi3b000enkt5uneop9s5: [
    { title: "게임 분위기 맞춤 UI 아트 경험", body: "게임의 테마와 분위기에 맞춰 UI 아트를 제작한 경험을 구체적으로 보여주세요.", sourceQuote: "게임의 분위기와 테마에 맞는 UI 아트를 만들 수 있는 분" },
    { title: "사용성 기반 레이아웃 설계 경험", body: "UX와 사용성을 고려해 레이아웃을 설계한 과정을 보여주세요.", sourceQuote: "UX와 사용성 측면을 잘 이해하고 레이아웃 설계를 할 수 있는 분" },
    { title: "언리얼 엔진 구조 설계 경험", body: "언리얼 엔진 기반으로 확장성을 고려한 UI 시안을 제작한 경험을 소개해보세요.", sourceQuote: "언리얼 엔진 기반의 구조 설계와 확장성을 고려해 시안을 제작할 수 있는 분" },
  ],
  cmrf5xflq000bnkt5cdpjd6hw: [
    { title: "UI 문서화·리뷰 능력", body: "담당 UI/UX를 세부적으로 문서화하고 논리적으로 리뷰한 경험을 보여주세요.", sourceQuote: "담당 UI/UX에 대한 세부 문서화와 논리적인 리뷰 능력" },
    { title: "UI 기준·규칙 수립 경험", body: "게임 내 UI 적용 기준과 사용 규칙을 세우고 관리해본 경험을 구체적으로 소개해보세요.", sourceQuote: "게임 내 적용되는 UI에 대한 기준과 사용 규칙을 수립하고 관리할 수 있는 능력" },
    { title: "해외 UI 로컬라이징 대응 경험", body: "UI를 해외 버전으로 로컬라이징하며 겪은 이슈와 대응 과정을 보여주세요.", sourceQuote: "로스트아크 해외 UI 로컬라이징 대응" },
  ],
  cmsjzdl4e000cmmwncpm14hhd: [
    { title: "아티스트 마케팅 콘텐츠 기획 경험", body: "아티스트나 브랜드의 마케팅 콘텐츠를 기획하고 디자인한 경험을 보여주세요.", sourceQuote: "소속 아티스트 마케팅 콘텐츠 기획 및 디자인" },
    { title: "이미지 리터칭 역량", body: "사진 보정과 이미지 리터칭 작업물을 전/후 비교로 보여주면 좋아요.", sourceQuote: "사진 보정 및 이미지 리터칭 역량" },
    { title: "비주얼 커뮤니케이션 역량", body: "콘텐츠 기획 의도를 비주얼로 명확하게 전달한 사례를 소개해보세요.", sourceQuote: "콘텐츠 기획 및 비주얼 커뮤니케이션 역량" },
  ],
  cmrlhbjey0010vkz6udd8s4s2: [
    { title: "복잡한 워크플로우 구조화 경험", body: "복잡한 프로세스를 직관적인 경험으로 재구조화한 사례를 구체적으로 보여주세요.", sourceQuote: "복잡한 채용 검증 워크플로우를 직관적인 경험으로 구조화합니다" },
    { title: "문제 정의부터 해결까지 리드한 경험", body: "고객 문제를 스스로 정의하고 해결까지 이끈 과정을 보여주세요.", sourceQuote: "문제 정의부터 해결까지 이끈 경험" },
    { title: "디자인 시스템 구축·관리 경험", body: "Figma로 디자인 시스템을 만들고 운영한 경험을 구체적으로 소개해보세요.", sourceQuote: "Figma로 디자인 시스템 구축/관리 역량" },
  ],
  cmrt6jf6g000214dq0kffx0aa: [
    { title: "광고주 센터 인터페이스 설계 경험", body: "광고주 대상 관리자 화면처럼 복잡한 인터페이스를 설계한 경험을 보여주세요.", sourceQuote: "Figma 기반 웹/앱 화면 개선, 광고주 센터 인터페이스 설계" },
    { title: "사용자 문제 정의·해결 역량", body: "사용자 관점에서 문제를 정의하고 해결책을 도출한 과정을 구체적으로 보여주세요.", sourceQuote: "사용자 관점에서 문제를 정의하고 해결할 수 있는 역량" },
    { title: "초기 서비스 출시 경험", body: "0에서 1을 만드는 초기 서비스 출시 과정에 참여한 경험을 소개해보세요.", sourceQuote: "초기 서비스 출시 경험" },
  ],
  cmsjzcuxn0002mmwn9quqquyl: [
    { title: "이커머스 UX/UI 디자인 경험", body: "이커머스 플랫폼의 UX/UI를 설계한 프로젝트 경험을 보여주세요.", sourceQuote: "이커머스 플랫폼 UX/UI 디자인" },
    { title: "디자인 방향성 제안 경험", body: "크리에이티브한 아이디어로 디자인 방향성을 제안하고 이끈 과정을 보여주세요.", sourceQuote: "크리에이티브한 아이디어 및 디자인 방향성 제안" },
    { title: "개발 협업 가이드 작성 경험", body: "개발자와 협업하기 위해 디자인 가이드를 작성하고 소통한 경험을 구체적으로 소개해보세요.", sourceQuote: "개발 협업을 위한 디자인 가이드 작성 및 커뮤니케이션" },
  ],
  cms6d6bgi00084l8qzftnxoru: [
    { title: "서비스 UI/UX 디자인 경험", body: "웹이나 모바일 서비스의 UI/UX를 설계한 경험을 구체적으로 보여주세요.", sourceQuote: "웹 또는 모바일 서비스 UI/UX 디자인 경험 3년 이상이신 분" },
    { title: "마케팅 디자인 제작 경험", body: "광고 배너, 상세페이지, 홍보물 등 마케팅 디자인을 제작한 사례를 보여주세요.", sourceQuote: "광고 배너, 상품 상세페이지, 홍보물 등 마케팅 디자인 제작 경험이 있으신 분" },
    { title: "문제 정의·실행 주도 경험", body: "스스로 문제를 찾아 정의하고 끝까지 실행해본 오너십 경험을 소개해보세요.", sourceQuote: "스스로 문제를 정의하고 실행까지 주도해본 경험 (오너십)" },
  ],
  cmremq6jo0000122d0g2wosby: [
    { title: "웹/앱 UIUX 설계 경험", body: "웹이나 앱 서비스의 UIUX를 직접 설계한 경험을 구체적으로 보여주세요.", sourceQuote: "최소 2년 이상 웹/앱 기반 서비스의 UIUX를 설계 경험이 있는 분" },
    { title: "논리적 문제 정의·해결 경험", body: "문제를 명확히 정의하고 논리적 근거로 해결 방향을 제시한 과정을 보여주세요.", sourceQuote: "문제를 명확히 정의하고, 논리적인 근거를 바탕으로 해결 방향을 제시할 수 있는 분" },
    { title: "데이터 기반 반복 개선 경험", body: "사용자 피드백과 데이터를 근거로 제품을 반복적으로 개선한 사례를 소개해보세요.", sourceQuote: "사용자 피드백 및 데이터를 기반으로 제품을 반복 개선해 본 분" },
  ],
  cmrlhcmvz001wvkz6lc8fpkd3: [
    { title: "복잡한 내부 프로세스 UX 개선 경험", body: "복잡한 내부 업무 프로세스를 이해하고 운영 효율을 높인 UX 개선 사례를 보여주세요.", sourceQuote: "상담, CTI, 정책 등 복잡한 내부 모듈의 업무 프로세스를 이해하고 운영 효율을 높이는 UX 개선 방향을 도출" },
    { title: "정보구조·화면구조 설계 경험", body: "복잡한 정보를 구조화하고 화면 구조를 정의한 과정을 구체적으로 보여주세요.", sourceQuote: "정보 구조를 설계하고 화면 구조를 정의" },
    { title: "B2B·내부 운영 서비스 디자인 경험", body: "B2B SaaS나 내부 운영 서비스를 디자인해본 경험을 소개해보세요.", sourceQuote: "B2B SaaS 또는 내부 운영 서비스 디자인 경험" },
  ],
  cmrlhanlm000cvkz6o4tjbz9d: [
    { title: "복잡한 B2B 제품 UX 디자인 경험", body: "복잡한 데이터 기반 소프트웨어나 B2B 제품의 UX를 디자인한 경험을 보여주세요.", sourceQuote: "복잡한 데이터 기반 소프트웨어 또는 B2B 제품 UX 디자인 경험" },
    { title: "정보 구조·인터랙션 설계 역량", body: "사용자 플로우와 정보 구조, 인터랙션을 설계한 경험을 구체적으로 소개해보세요.", sourceQuote: "사용자 플로우, 정보 구조, 인터랙션 설계 역량" },
    { title: "제품 UX 방향성 정의 경험", body: "제품 전반의 UX 방향성과 일관성을 스스로 정의해본 경험이 있다면 보여주세요.", sourceQuote: "제품 전반의 UX 방향성과 일관성을 정의" },
  ],
  cmreiftt90000evsxvjovb0yi: [
    { title: "엔지니어 워크플로우 기반 UX 설계", body: "특정 전문 직군의 워크플로우를 이해하고 그에 맞는 사용자 경험을 설계한 경험을 보여주세요.", sourceQuote: "반도체/디스플레이 엔지니어의 워크플로우 이해 및 사용자 경험 설계" },
    { title: "와이어프레임·인터랙션 스펙 작성", body: "와이어프레임과 프로토타입, 인터랙션 스펙을 직접 작성한 산출물을 보여주세요.", sourceQuote: "와이어프레임, 프로토타입 및 인터랙션 스펙 작성" },
    { title: "엔지니어와 협업한 기능 개발 경험", body: "엔지니어와 긴밀히 협업하며 기능을 기획하고 구현까지 참여한 경험을 소개해보세요.", sourceQuote: "엔지니어와 긴밀하게 협업하며 기능 기획 및 구현 과정 참여" },
  ],
  cms6d6bpx000e4l8qcwh7tyqq: [
    { title: "글로벌 이커머스 상세페이지 디렉팅", body: "아마존, Shopee 등 글로벌 채널의 상세페이지 디자인을 총괄하고 디렉팅한 경험을 보여주세요.", sourceQuote: "글로벌 B2C 마켓 상세페이지 디자인 총괄 및 디렉팅 (자사몰, Amazon, Shopee 등)" },
    { title: "디자인 팀 리딩·코칭 경험", body: "2명 이상의 디자인 팀을 이끌고 코칭한 경험을 구체적으로 보여주세요.", sourceQuote: "팀 관리 경험: 최소 2명 이상의 디자인 팀 리딩 및 코칭 경험이 있으신 분" },
    { title: "시장별 프로모션 키비주얼 기획", body: "지역별 시장 트렌드를 반영해 프로모션 키비주얼을 기획하고 리드한 경험을 소개해보세요.", sourceQuote: "지역별 시장 트렌드 기반 프로모션 키비주얼 기획 및 디자인 파트 리드" },
  ],
  cmsddimql00071hhjd6pnu0sf: [
    { title: "서비스 정책 수립과 화면 설계 경험", body: "서비스 정책을 수립하고 요구사항을 분석해 화면을 설계해본 경험을 구체적인 사례로 보여주세요.", sourceQuote: "서비스 정책 수립 및 화면 설계" },
    { title: "기획 논리를 설명하는 역량", body: "왜 그런 설계를 했는지 논리적으로 표현하고 설명할 수 있는 능력을 포트폴리오에서 보여주세요.", sourceQuote: "기획 논리 표현 및 설명 가능" },
    { title: "협업 도구 활용 경험", body: "Figma, Notion 같은 협업 도구를 사용해 디자인·개발 팀원과 소통한 경험을 어필하세요.", sourceQuote: "협업도구(figma, notion 등) 사용 경험" },
  ],
  cms6d6bkl000b4l8qsnfikpcp: [
    { title: "End-to-End UX 기획·디자인 경험", body: "신규 서비스의 UX 기획부터 UI 디자인까지 전체 과정을 주도적으로 이끈 경험을 보여주세요.", sourceQuote: "신규 서비스 및 기능의 UX 기획부터 UI 디자인까지 End-to-End 수행" },
    { title: "디자인 시스템 구축·운영 경험", body: "디자인 시스템을 직접 만들거나 운영해본 경험과 그 과정에서의 의사결정을 구체적으로 설명해주세요.", sourceQuote: "디자인 시스템 구축 또는 운영 경험" },
    { title: "데이터 기반 의사결정 경험", body: "데이터를 근거로 UX를 개선하거나 디자인 방향을 결정한 사례를 수치와 함께 제시해주세요.", sourceQuote: "데이터 기반 의사결정 경험" },
  ],
  cmrlgubse0001gq5jk2gh39l5: [
    { title: "글로벌 프로덕트 출시·운영 경험", body: "해외 시장을 대상으로 프로덕트를 직접 디자인하고 출시·운영해본 경험을 구체적으로 보여주세요.", sourceQuote: "글로벌 프로덕트/서비스를 디자인·출시·운영한 직접 경험" },
    { title: "영어 협업 커뮤니케이션 역량", body: "비즈니스, 개발, 정책 등 다양한 조직과 영어로 협업한 경험이 있다면 어필해주세요.", sourceQuote: "다양한 조직(비즈니스/개발/정책)과 협업할 수 있는 영어 커뮤니케이션 역량" },
    { title: "복잡한 비즈니스 로직 단순화 경험", body: "복잡한 정책이나 로직을 직관적인 UX로 풀어낸 사례를 보여주세요.", sourceQuote: "복잡한 비즈니스 로직을 직관적인 UX로 단순화하는 능력" },
  ],
  cmrf3cu590018izj45r4r4x38: [
    { title: "제약 속에서 만든 비주얼 완성도", body: "여러 제약 조건 안에서도 탁월한 비주얼 결과물을 만들어낸 경험을 포트폴리오로 보여주세요.", sourceQuote: "프로젝트가 가진 많은 제약 조건 속에서도 탁월한 비주얼을 만들어낼 수 있는 역량이 필요해요" },
    { title: "Hi-fi 프로토타입 제작 능력", body: "아이디어를 빠르게 Hi-fi 프로토타입으로 구현한 경험이 있다면 구체적으로 보여주세요.", sourceQuote: "떠오른 아이디어를 Hi-fi 프로토타입으로 만들 수 있는 분이 필요해요" },
    { title: "이해관계자 설득 경험", body: "좋은 결과물을 위해 여러 이해관계자를 설득해본 과정을 사례로 설명해주세요.", sourceQuote: "좋은 결과물을 만들어내기 위해 다양한 이해관계자를 설득해 본 경험이 필요해요" },
  ],
  cmrf3c53p000eizj4ptvb18h8: [
    { title: "정성·정량 근거로 문제 정의한 경험", body: "표면적인 증상이 아니라 정성·정량 데이터로 근본 원인을 찾아 문제를 정의한 경험을 보여주세요.", sourceQuote: "표면적인 문제가 아니라, 사용자의 정성/정량 근거로 근본적인 문제를 정의할 수 있어야 해요" },
    { title: "가설 기반 화면 제안 경험", body: "명확한 가설을 세우고 그 가설에 맞는 화면을 제안해본 과정을 구체적으로 설명해주세요.", sourceQuote: "명확한 가설이 담긴 화면을 제안하고, 설계 의도에 부합하는 솔루션을 도출할 수 있어야 해요" },
    { title: "제품 개발 전 과정 주도 경험", body: "VOC 수집부터 UX 설계, UI 디자인, 프로토타입까지 전 과정을 스스로 이끈 경험을 보여주세요.", sourceQuote: "VOC수집부터 UX 설계, UI 디자인, 프로토타입 제작까지 제품 개발의 전 과정을 주도적으로 이끌 수 있어야 해요" },
  ],
  cmrf3c01n0008izj4sbfq6ev6: [
    { title: "글로벌 유저 리서치 인사이트 발굴 경험", body: "글로벌 사용자를 대상으로 리서치를 통해 인사이트를 발굴하고 검증한 경험을 보여주세요.", sourceQuote: "디지털 프로덕트에서 글로벌 유저를 대상으로 리서치를 통해 인사이트를 발굴하고, 검증해본 경험이 있는 분" },
    { title: "원어민 수준 영어 협업 역량", body: "다른 문화권 동료·이해관계자와 영어로 협업하고 설득한 경험을 구체적으로 어필해주세요.", sourceQuote: "원어민 수준의 영어 커뮤니케이션 역량을 바탕으로, 글로벌 국가의 문화와 맥락을 이해하며 협업하고 설득할 수 있는 분" },
    { title: "다양한 리서치 방법론 활용 경험", body: "사용성 테스트, 심층 인터뷰, 설문조사 등 상황에 맞는 방법론을 선택해 리서치를 수행한 경험을 보여주세요.", sourceQuote: "사용성 테스트, 심층 인터뷰, 집단 심층 인터뷰, 설문조사 등 상황에 맞는 리서치 방법론을 활용해요" },
  ],
  cmrf3buli0002izj4s3v6aj97: [
    { title: "근본 문제를 정의한 경험", body: "표면적 증상이 아니라 정성·정량 근거로 근본 문제를 정의한 사례를 과제·포트폴리오로 보여주세요.", sourceQuote: "표면적인 문제가 아니라, 사용자의 정성/정량 근거로 근본적인 문제를 정의할 수 있어야 해요" },
    { title: "제품 개발 전 과정 주도 경험", body: "VOC 수집부터 UX 설계, UI 디자인, 프로토타입 제작까지 전 과정을 직접 이끈 경험을 보여주세요.", sourceQuote: "VOC수집부터 UX 설계, UI 디자인, 프로토타입 제작까지 제품 개발의 전 과정을 주도적으로 이끌 수 있어야 해요" },
    { title: "픽셀 단위 UI 구현 디테일", body: "조형적 완성도가 높은 App·Web UI를 픽셀 단위까지 다듬어낸 결과물을 보여주세요.", sourceQuote: "사용성을 지키면서 조형적 완성도가 높은 App·Web UI를, 픽셀 단위의 디테일까지 완벽하게 구현해낼 수 있어야 해요" },
  ],
  cmrf3chme000tizj4svtri1sf: [
    { title: "금융상품 간 연결성 조사 경험", body: "라이프사이클에 따라 달라지는 금융상품 경험과 상품 간 연결성을 조사해본 경험을 보여주세요.", sourceQuote: "한 사람의 라이프사이클에 따라 달라지는 다양한 금융상품 경험과 금융상품 간의 연결성을 조사해요" },
    { title: "통합적 관점의 인사이트 제공 경험", body: "개별 상품이 아니라 전체 서비스를 아우르는 통합적 관점에서 인사이트를 도출한 경험을 어필해주세요.", sourceQuote: "은행 전반의 통합적인 관점으로 고객과 소통할 수 있도록 인사이트를 제공해요" },
    { title: "페인포인트 기반 신규 가치 발굴 경험", body: "기존 서비스의 페인포인트에서 새로운 가치를 만들어낸 리서치 경험을 구체적으로 보여주세요.", sourceQuote: "기존 은행을 이용하며 지속적으로 느낀 페인포인트나 니즈를 바탕으로 새로운 가치를 줄 수 있는 엣지 포인트를 발굴해요" },
  ],
  cmrf3c7lm000hizj45lq6tq2s: [
    { title: "1인 디자이너로 화면 설계 주도 경험", body: "작은 팀에서 혼자 전체 화면을 설계하고 책임진 경험이 있다면 구체적으로 보여주세요.", sourceQuote: "제품 단위 조직인 스쿼드(Squad)에 1인 디자이너로서 고객과 토스뱅크가 만나는 모든 화면을 주도적으로 설계해요" },
    { title: "독립적 의사결정 경험", body: "승인 절차 없이 스스로 판단하고 결정해본 경험, 그 과정에서의 책임감을 보여주세요.", sourceQuote: "별도 승인이나 보고는 필요 없어요. Product Designer가 사용자 경험에 대해 최고의 책임과 권한을 가져요" },
    { title: "소규모 팀 협업 경험", body: "최소 인원으로 구성된 작은 조직에서 빠르게 의사결정하며 일해본 경험을 어필해주세요.", sourceQuote: "스쿼드는 제품을 만들기 위한 최소 인원으로 구성되어 있어요" },
  ],
  cmrf3c2jz000bizj4a0gpbwls: [
    { title: "사용자 중심 UX 설계 경험", body: "사용자 중심으로 UX를 설계해본 경험을 구체적인 사례로 보여주세요.", sourceQuote: "사용자 중심의 UX를 설계할 수 있는 분을 찾고 있어요" },
    { title: "다양한 케이스 고려한 꼼꼼함", body: "여러 예외 케이스까지 고려해 꼼꼼하게 디자인한 경험을 보여주세요.", sourceQuote: "다양한 케이스를 고려해 디자인할 수 있는 꼼꼼한 분을 찾고 있어요" },
    { title: "주도적으로 반복 업무 수행한 경험", body: "반복적인 업무도 스스로 동기를 부여해 주도적으로 해낸 경험을 어필해주세요.", sourceQuote: "반복적인 업무일지라도 Self-Motivation을 통해 주도적으로 업무를 수행하실 수 있는 분이면 좋겠어요" },
  ],
  cmsdbtvy70007hf128ga9fa9v: [
    { title: "1인 디자이너로 최종 책임진 경험", body: "사용자 경험에 대한 최종 책임과 권한을 갖고 의사결정해본 경험을 보여주세요.", sourceQuote: "팀의 1인 디자이너로 사용자 경험에 대한 최종 책임과 권한을 가져요" },
    { title: "비즈니스·정책 영역까지 고민한 경험", body: "디자인뿐 아니라 비즈니스와 정책, 운영까지 함께 고민하며 제품을 끝까지 책임진 경험을 보여주세요.", sourceQuote: "비즈니스와 정책, 운영처럼 사용자 경험에 영향을 주는 모든 영역을 자신의 일처럼 고민하며 제품이 고객에게 닿는 순간까지 책임지고 함께해요" },
    { title: "작은 팀에서의 협업 경험", body: "프로덕트 오너, 개발자, 데이터 분석가 등과 함께 작은 팀에서 빠르게 일해본 경험을 어필해주세요.", sourceQuote: "프로덕트 오너, 개발자, 데이터 분석가와 함께하는 6~8명의 작은 팀에서 무엇이 사용자에게 가장 좋은지 스스로 판단하고" },
  ],
  cmrf3crn00015izj4f0nc2qnf: [
    { title: "디자인 툴 활용 능력", body: "Photoshop, Illustrator, Figma 등 디자인 툴을 능숙하게 다뤄본 작업물을 보여주세요.", sourceQuote: "Photoshop, Illustrator, Figma 등 디자인 툴을 능숙하게 사용할 수 있는 분을 찾아요" },
    { title: "모션 그래픽 제작 경험", body: "After Effects를 활용한 기본적인 모션 작업 경험이 있다면 함께 보여주세요.", sourceQuote: "After Effects 등을 활용한 기본적인 모션 작업이 가능하다면 좋아요" },
    { title: "광고 크리에이티브 제작 경험", body: "광고 성과를 높이기 위한 디지털 크리에이티브를 제작·개선해본 경험을 보여주세요.", sourceQuote: "광고 성과 향상을 위한 디지털 크리에이티브를 제작하고 개선하는 업무를 보조해요" },
  ],
  cmrf3cp5r0012izj4ji1x03k8: [
    { title: "제품 텍스트 진단·개선 경험", body: "원칙에 기반해 제품 텍스트를 지속적으로 진단하고 개선한 경험을 보여주세요.", sourceQuote: "Writing Principles에 기반해 토스증권 제품 전반의 텍스트를 지속적으로 진단·개선하며, 사용자 경험을 한 단계 끌어올려요" },
    { title: "전문 용어를 쉬운 언어로 재구성한 경험", body: "복잡한 전문 용어나 자료를 사용자 중심의 쉬운 언어로 재구성해본 경험을 구체적으로 보여주세요.", sourceQuote: "복잡한 금융 용어와 투자 전문 자료를 토스증권만의 보이스&톤에 맞춰 쉽고 명확한 사용자 중심 언어로 재구성해요" },
    { title: "근거 기반으로 동료 설득한 경험", body: "느낌이 아니라 데이터·사용자 근거로 좋은 문장의 이유를 제시하고 동료를 설득한 경험을 보여주세요.", sourceQuote: "느낌 기반이 아닌 사용자에 의한 정확한 근거를 기반으로 좋은 문장에 대해 논리적인 이유를 제시하여 협업하는 동료들을 설득하는 능력이 필요해요" },
  ],
  cmrf3ck4c000wizj4x9g152uy: [
    { title: "도메인 이해 기반 제품 개선 경험", body: "산업 도메인과 사용자에 대한 이해를 바탕으로 제품 개선을 이끈 경험을 보여주세요.", sourceQuote: "증권업과 사용자에 대한 이해를 바탕으로, 토스증권의 다양한 제품의 개선을 이끌어요" },
    { title: "제품 방향성 제안 경험", body: "사용자를 직접 만나 인사이트를 얻고 제품의 방향성을 제안해본 경험을 보여주세요.", sourceQuote: "증권 서비스를 사용하는 다양한 사용자를 만나보고, 제품의 방향성을 제안하거나 개선 지점을 발굴해요" },
    { title: "다양한 리서치 방법론 설계 경험", body: "사용자 테스트, 심층 인터뷰, 설문조사 등 상황에 맞는 방법론을 설계하고 수행한 경험을 보여주세요.", sourceQuote: "사용자 테스트, 심층 인터뷰, 집단 심층 인터뷰, 설문조사 등 제품의 적절한 리서치 방법론을 통해 사용자 경험을 조사해요" },
  ],
  cmrf3cf4z000qizj4znv96hvh: [
    { title: "인터뷰 프로세스 운영 보조 경험", body: "일정 조율부터 사례비 지급, 문의 응대까지 리서치 프로세스 전반을 운영해본 경험을 보여주세요.", sourceQuote: "인터뷰 일정 조율, 시작 전 사전 안내, 사례비 지급, 기타 문의 사항 안내 등 사용자 인터뷰 프로세스 전반 운영을 보조해요" },
    { title: "고객 응대 커뮤니케이션 경험", body: "채팅, 유선, 대면 등으로 고객을 응대해본 경험을 구체적으로 어필해주세요.", sourceQuote: "채팅/유선/대면으로 고객을 응대한 경험이 있는 분을 원해요" },
    { title: "다양한 사람과 협업한 대외활동 경험", body: "동아리, 프로젝트, 인턴 등에서 조직 안팎의 다양한 사람과 협업한 경험을 보여주세요.", sourceQuote: "대외활동(동아리, 프로젝트, 인턴 등)을 통해 조직 내부, 외부의 다양한 사람들과 함께 협업해 본 경험이 있으신 분이 필요해요" },
  ],
  cmrf3ca5g000kizj4xhouk3xw: [
    { title: "1인 디자이너로 화면 설계·의사결정 경험", body: "고객이 만나는 화면을 혼자 설계하고 의사결정까지 책임진 경험을 보여주세요.", sourceQuote: "제품의 1인 디자이너로서 고객과 만나는 모든 화면을 주도적으로 설계하고 의사결정해요" },
    { title: "최종 책임과 권한을 가진 경험", body: "승인 절차 없이 스스로 사용자 경험에 대한 책임과 권한을 가지고 일한 경험을 보여주세요.", sourceQuote: "별도 승인이나 보고는 필요 없어요. Product Designer가 사용자 경험에 대해 최고의 책임과 권한을 가져요" },
    { title: "소규모 조직에서의 협업 경험", body: "6~8명 규모의 작은 조직에서 빠르게 협업하고 의사결정한 경험을 어필해주세요.", sourceQuote: "각 사일로에는 제품을 만들기 위한 최소 인원 6~8명으로 구성되어 있어요" },
  ],
  cmrf3bxg90005izj4lfllf4bm: [
    { title: "프레젠테이션 문서 템플릿화 경험", body: "발표 자료를 정돈하고 재사용 가능한 템플릿으로 만든 경험을 보여주세요.", sourceQuote: "토스페이먼츠 Business Tribe의 프레젠테이션 문서를 정돈하고 템플릿화해요" },
    { title: "디자인 툴 활용 능력", body: "포토샵, 피그마, 파워포인트, 구글 슬라이드 등 다양한 툴을 다뤄본 결과물을 보여주세요.", sourceQuote: "포토샵, 피그마 등의 다양한 툴을 사용하실 수 있는 분이 필요해요" },
    { title: "전달력을 높이는 텍스트 재구성 경험", body: "제안서의 전달력을 높이기 위해 텍스트를 재구성하고 배치한 경험을 구체적으로 보여주세요.", sourceQuote: "제안서를 아름답게 정돈할 뿐만 아니라, 전달력을 높이기 위해 텍스트를 재구성하여 배치할 수 있는 분이라면 좋아요" },
  ],
  cmsdbtc8a0002hf12alur56zi: [
    { title: "제약 속에서 만든 비주얼 완성도", body: "여러 제약 조건 안에서도 탁월한 비주얼 결과물을 만들어낸 경험을 포트폴리오로 보여주세요.", sourceQuote: "프로젝트가 가진 많은 제약 조건 속에서도 탁월한 비주얼을 만들어낼 수 있는 역량이 필요해요" },
    { title: "결과보다 사고 과정을 보여주는 포트폴리오", body: "결과물 나열보다 어떤 사고 흐름을 거쳐 최종 결과물에 이르렀는지 과정을 자세히 담아주세요.", sourceQuote: "결과물 위주의 구성보다, 어떤 사고 흐름을 거쳐 최종 결과물에 이르렀는지 과정이 자세히 담아 주세요" },
    { title: "이해관계자 설득 경험", body: "좋은 결과물을 위해 여러 이해관계자를 설득해본 과정을 사례로 설명해주세요.", sourceQuote: "좋은 결과물을 만들어내기 위해 다양한 이해관계자를 설득해 본 경험이 필요해요" },
  ],
  cmrf3cmop000zizj4gqv7r5o0: [
    { title: "오프라인 현장 리서치 경험", body: "오프라인 매장 등 현장에서 문제를 발견하고 사용자 목소리를 팀에 전달한 경험을 보여주세요.", sourceQuote: "오프라인 매장 환경에서 제품의 문제를 발견하고, 사장님과 손님의 목소리를 팀에 전달해요" },
    { title: "하드웨어·소프트웨어 리서치 경험", body: "하드웨어와 소프트웨어가 결합된 제품을 대상으로 리서치를 주도해본 경험을 보여주세요.", sourceQuote: "테이블오더, POS, 결제 단말기 등 하드웨어 및 소프트웨어 제품을 다루며 리서치를 주도해요" },
    { title: "제품 방향성 제안 경험", body: "사용자의 목소리를 근거로 제품이 나아갈 방향을 제안하고 개선 지점을 발굴한 경험을 보여주세요.", sourceQuote: "사용자의 목소리를 바탕으로 제품이 어떻게 바뀌어야 할지 방향성을 제안하고, 개선 지점을 발굴해요" },
  ],
  cmrf3ccn5000nizj4tot5hcd9: [
    { title: "다중 사용자군 문제 해결 경험", body: "서로 다른 사용자 그룹 각각에 맞는 제품 문제를 책임지고 해결한 경험을 보여주세요.", sourceQuote: "사장님, 일반 고객, 단말기 판매 대리점 이렇게 세 그룹의 사용자가 있어요. 각 유저가 경험하는 제품에 대해 최고의 책임과 권한을 가지고 문제를 해결해요" },
    { title: "가치 전달 전 과정 관여 경험", body: "UX, UI뿐 아니라 마케팅·브랜딩까지 고객에게 가치를 전달하는 전 과정에 관여해본 경험을 보여주세요.", sourceQuote: "UX, UI는 물론, 마케팅/브랜딩 등 고객에게 가치를 전달하는 모든 과정에 관여해요" },
    { title: "업계 고정관념을 깬 새로운 UX", body: "익숙한 제품 카테고리의 고정관념을 깨고 새로운 UX를 제안해본 경험을 보여주세요.", sourceQuote: "결제 단말기, 포스기하면 떠오르는 익숙한 고정관념을 깨고, 업계에서 볼 수 없었던 새로운 UX를 만들어가요" },
  ],
  cmrf58hfb0002ig1varhd5obs: [
    { title: "브랜딩·BX 실무 경험", body: "온·오프라인 브랜딩과 마케팅 디자인, BX 관련 업무를 직접 수행한 경험을 구체적으로 보여주세요.", sourceQuote: "온·오프라인의 브랜딩, 마케팅 디자인 및 BX 관련 업무를 직접 수행해 본 경험이 있으신 분" },
    { title: "IP를 다양한 포맷으로 풀어낸 크리에이티브", body: "리테일/MD 트렌드를 반영해 하나의 IP를 여러 디자인 포맷으로 확장해본 작업물을 보여주세요.", sourceQuote: "리테일/MD 트렌드에 민감하며, IP를 다양한 디자인 포맷으로 풀어낼 수 있는 크리에이티브 역량을 보유하신 분" },
    { title: "온·오프라인 비주얼 제작 툴 숙련도", body: "온·오프라인에서 실제 결과물로 이어지는 디자인 툴 활용 능력을 포트폴리오로 증명해주세요.", sourceQuote: "온·오프라인 영역에서 비주얼 결과물을 도출할 수 있는 디자인 툴 숙련도를 보유하신 분" },
  ],
  cmrkfitkc000c6jwj6wrko862: [
    { title: "신규 기능 개선 영역 발굴 경험", body: "결재/근태 같은 기존 기능에서 개선 영역을 찾고 사용 시나리오를 정의해본 경험을 보여주세요.", sourceQuote: "결재/근태 모듈의 신규 기능(AI 포함) 개선 영역을 발굴하고 사용 시나리오를 정의하며" },
    { title: "사용성 테스트 기반 개선 과정", body: "사용성 테스트와 설문으로 결과를 정리하고 개선안에 반영한 과정을 구체적으로 보여주세요.", sourceQuote: "사용성 테스트와 설문을 통해 결과를 정리합니다" },
    { title: "아이디어를 논리적으로 문서화하는 역량", body: "새로운 기능 아이디어를 논리적으로 정리하고 문서화한 경험을 보여주세요.", sourceQuote: "새로운 기술에 대한 아이디어를 논리적으로 문서화할 수 있는 역량" },
  ],
  cmreqzl3v0002oex94w1hewtm: [
    { title: "생성형 AI 비주얼 제작 경험", body: "Midjourney, Stable Diffusion 등 생성형 AI 툴로 직접 만든 비주얼 작업물을 포트폴리오에 담아주세요.", sourceQuote: "생성형 AI를 활용하여 직접 제작한 비주얼 작업물이 포함된 포트폴리오 제출 필수" },
    { title: "AI 결과물 품질 검수·리터칭 경험", body: "AI로 생성한 이미지의 상업적 활용 가능 여부를 검토하고 포토샵으로 정밀하게 다듬어본 경험을 보여주세요.", sourceQuote: "AI 생성 결과물의 상업적 활용 가능 여부 검토 및 품질 검수, 포토샵을 활용한 정밀 리터칭" },
    { title: "브랜드 아이덴티티를 반영한 비주얼 감각", body: "브랜드 가이드에 맞춰 시각적으로 조화로운 결과물을 만든 경험을 구체적으로 보여주세요.", sourceQuote: "브랜드 아이덴티티를 이해하고 이를 시각적으로 조화롭게 구현할 수 있는 미적 감각" },
  ],
  cmrlhau7r000gvkz6lz03093g: [
    { title: "데이터·가설 기반 문제 구조화 경험", body: "리서치와 데이터, 가설을 바탕으로 문제를 구조화하고 디자인 솔루션으로 풀어낸 과정을 보여주세요.", sourceQuote: "리서치·데이터·가설을 기반으로 문제를 구조화해 디자인 솔루션으로 풀어내며" },
    { title: "프로덕트 디자인으로 이끈 비즈니스 성장", body: "디자인 개선이 실제 비즈니스 지표 성장으로 이어진 사례를 구체적인 수치와 함께 보여주세요.", sourceQuote: "프로덕트 디자인으로 비즈니스 성장을 이끈 경험" },
    { title: "사용자 플로우·정보구조 설계 경험", body: "복잡한 사용자 플로우와 정보 구조, 인터랙션을 설계한 경험을 보여주세요.", sourceQuote: "사용자 플로우, 정보 구조, 인터랙션 디자인 경험" },
  ],
  cmsdjmxjl00029jyydaeu1y00: [
    { title: "멀티플랫폼 디자인 토큰·컴포넌트 설계", body: "iOS·Android·Web 전반에서 일관되게 동작하는 디자인 토큰과 컴포넌트를 설계한 경험을 보여주세요.", sourceQuote: "디자인 토큰과 컴포넌트를 체계적으로 설계하고, iOS · Android · Web 전반에서 일관되게 동작하도록 다듬어요" },
    { title: "코드 구현에 기여한 경험", body: "HTML/CSS, React, TypeScript 등으로 컴포넌트 구현이나 프로토타입 제작에 직접 참여한 경험을 보여주세요.", sourceQuote: "HTML/CSS, React, TypeScript 등 프론트엔드 기술을 이해하고, 직접 컴포넌트 구현이나 프로토타입 제작에 기여해본 경험이 있는 분" },
    { title: "디자인과 구현 사이 간극을 줄인 경험", body: "컴포넌트가 실제 제품에서 어떻게 동작하는지 이해하고 디자인-구현 간극을 좁힌 사례를 보여주세요.", sourceQuote: "컴포넌트가 실제 제품에서 어떻게 동작하고 구현되는지 이해하고, 디자인과 구현 사이의 간극을 줄이고 싶은 분" },
  ],
  cms7ufvhj00048bja2yg0gbpm: [
    { title: "브랜딩 컨셉을 구체화한 그래픽 작업", body: "매력적인 그래픽디자인으로 브랜딩 컨셉을 구체화한 작업물을 포트폴리오에 담아주세요.", sourceQuote: "매력적인 그래픽디자인으로 브랜딩 컨셉을 구체화하는 것에 자신 있으신 분" },
    { title: "타이포그래피·편집디자인 역량", body: "단단한 타이포그래피와 편집디자인 스킬을 보여줄 수 있는 작업물을 준비해주세요.", sourceQuote: "단단한 타이포그래피와 편집디자인 스킬을 가지고 계신 분" },
    { title: "인쇄·제작 프로세스 이해도", body: "인쇄 및 제작 프로세스를 이해하고 실제로 반영해본 경험을 보여주세요.", sourceQuote: "인쇄 및 제작 프로세스를 이해하는 분" },
  ],
  cmret0u1v000242w705h3e366: [
    { title: "논리와 근거로 문제 인식을 바꾼 경험", body: "복잡한 UX 문제를 스스로 정의하고, 논리와 근거로 팀의 문제 인식을 바꿔본 과정을 보여주세요.", sourceQuote: "복잡한 UX 문제를 스스로 정의하고 논리와 근거로 팀의 문제 인식을 바꿔본 경험이 있는 분" },
    { title: "재사용 가능한 패턴 설계 경험", body: "디자인 시스템에 기여할 수 있는 재사용 가능한 패턴을 정의해본 경험을 보여주세요.", sourceQuote: "디자인 시스템 활용에 능숙하고 재사용 가능한 패턴을 정의해 시스템에 기여해온 분" },
    { title: "8년 이상 모바일/웹 서비스 디자인 경력", body: "장기간 모바일/웹 서비스를 디자인하며 도메인 전체를 조망해본 경험을 정리해주세요.", sourceQuote: "8년 이상의 Mobile/Web 서비스 디자인 경험이 있는 분" },
  ],
  cmret0rjw000142w7gugex7vh: [
    { title: "모호한 문제를 정의하고 해결한 경험", body: "명확하지 않은 문제 상황을 스스로 정의하고 끝까지 해결해본 과정을 보여주세요.", sourceQuote: "모호한 문제를 스스로 정의하고 해결해본 경험이 있는 분" },
    { title: "복잡한 문제를 단순화한 경험", body: "복잡한 유저 상태와 맥락을 단순하고 자연스러운 인터랙션으로 풀어낸 사례를 보여주세요.", sourceQuote: "복잡한 문제를 단순하고 자연스러운 경험으로 풀어내는 분" },
    { title: "End-to-end 프로덕트 경험 설계", body: "화면 하나가 아니라 전체 프로덕트 경험을 엔드투엔드로 설계해본 사례를 보여주세요.", sourceQuote: "하나의 기능보다 End-to-end Product Experience에 관심이 있는 분" },
  ],
  cmrdl11wp00005xp5ph1li11f: [
    { title: "기획 의도를 시각화로 제안한 경험", body: "기획자의 의도를 이해하고 더 효과적인 시각화 방식을 능동적으로 제안해본 경험을 보여주세요.", sourceQuote: "기획자의 의도를 깊이 이해하고, 더 효과적인 시각화 방식을 능동적으로 제안할 수 있는 분" },
    { title: "복잡한 정보를 명확하게 풀어낸 경험", body: "복잡한 정보나 데이터를 쉽고 명확한 디자인 작업물로 풀어낸 사례를 보여주세요.", sourceQuote: "복잡한 정보나 데이터를 쉽고 명확하게 디자인 작업물로 풀어낸 경험이 있으신 분" },
    { title: "다수 콘텐츠 동시 관리 능력", body: "여러 콘텐츠를 동시에 진행하면서도 일정과 완성도를 함께 관리한 경험을 보여주세요.", sourceQuote: "여러 콘텐츠를 동시에 진행하면서도 일정을 체계적으로 관리하며 완성도를 유지할 수 있는 분" },
  ],
  cmrd7oft30004udb55oz1hueg: [
    { title: "리서치 운영 프로세스 개선 경험", body: "프로세스의 비효율을 찾아내고 실험을 통해 개선해본 경험을 구체적으로 보여주세요.", sourceQuote: "프로세스의 비효율을 찾아내고, 실험하며 개선해본 경험이 있는 분" },
    { title: "인터뷰 운영·현장 대응 경험", body: "인터뷰 일정 조율부터 현장에서 발생하는 다양한 상황을 주도적으로 대처해본 경험을 보여주세요.", sourceQuote: "인터뷰 일정 조율 및 인터뷰 중 발생하는 다양한 상황을 직접 대처하며 주도적으로 문제를 해결해요" },
    { title: "리서치 인사이트 도출 과정", body: "데스크 리서치와 인터뷰 노트테이킹을 통해 인사이트를 도출해본 과정을 보여주세요.", sourceQuote: "UX 리서치 인사이트 도출에 필요한 데스크 리서치, 인터뷰 녹취 및 노트테이킹을 수행해요" },
  ],
  cmrd7ofsk0003udb5fgnl2k96: [
    { title: "설계 원칙을 문서화해 확산시킨 경험", body: "설계 의도와 원칙을 문서화해 팀 전체에 확산시킨 경험을 구체적으로 보여주세요.", sourceQuote: "팀의 디자인 품질 기준점 역할을 하며 설계 의도와 원칙을 문서화해 팀 전체에 확산시킨 경험이 있는 분" },
    { title: "타 직군을 설득한 협업 구조 설계", body: "PM·개발·DA 등 다양한 직군이 신뢰하고 찾아올 만큼 협업 구조를 설계하고 설득해본 경험을 보여주세요.", sourceQuote: "PM·개발·DA 등 다양한 직군이 먼저 찾아올 만큼 상대의 언어로 설득하고 협업 구조를 설계해온 분" },
    { title: "지도 기반 서비스 UX 리드 경험", body: "지도 기반 서비스나 로컬 O2O 플랫폼에서 시니어 PD/UX 리드로 일한 경험이 있다면 구체적으로 보여주세요.", sourceQuote: "지도 기반 서비스, 로컬 O2O 플랫폼 등에서 시니어 PD/UX 리드 경험이 있는 분" },
  ],
  cmrd7ofry0002udb53uktdn3z: [
    { title: "Chat·Notification·CRM 제품 경험", body: "Chat, Feed, Notification, CRM 등 Engagement 관련 제품을 다뤄본 경험이 있다면 구체적으로 보여주세요.", sourceQuote: "Chat / Feed / Notification / CRM 제품 경험이 있는 분" },
    { title: "빠른 실행 속에서 유지한 완성도", body: "빠르게 움직이는 환경에서도 디테일과 완성도를 놓치지 않은 사례를 보여주세요.", sourceQuote: "빠르게 움직이는 환경에서도 높은 완성도를 유지할 수 있는 분" },
    { title: "PM·엔지니어와 제품 전략 논의 경험", body: "PM, 엔지니어, 데이터 파트너와 함께 제품 전략과 방향성을 고민해본 경험을 보여주세요.", sourceQuote: "PM, Engineer, Data 파트너와 함께 제품 전략과 방향성을 고민해요" },
  ],
  cmrd7ofr90001udb5xxesn1ns: [
    { title: "Figma 기반 디자인 시스템 구축 경험", body: "Figma의 다양한 기능을 활용해 실제 제품에 쓰이는 에셋으로 디자인 시스템을 구축·관리한 경험을 보여주세요.", sourceQuote: "Figma의 다양한 기능을 활용해 실제 사용 가능한 에셋으로 SEED를 구축하고 관리해요" },
    { title: "멀티 플랫폼 디자인 시스템 운영 경험", body: "디자인 토큰이나 여러 플랫폼을 아우르는 디자인 시스템을 운영해본 경험을 보여주세요.", sourceQuote: "디자인 토큰이나 멀티 플랫폼 디자인 시스템을 운영해본 경험이 있는 분" },
    { title: "기술 부채 개선·마이그레이션 경험", body: "디자인 시스템의 기술 부채를 개선하거나 대규모 마이그레이션을 이끌어본 경험을 구체적으로 보여주세요.", sourceQuote: "디자인 시스템의 기술 부채를 개선하거나 대규모 마이그레이션을 이끌어본 경험이 있는 분" },
  ],
  cmrlgulos000dgq5j1uwcqjco: [
    { title: "모바일 UI/UX 설계·운영 경험", body: "iOS/Android 앱의 UI/UX를 설계하고 운영해본 경험을 구체적으로 보여주세요.", sourceQuote: "모바일(iOS/Android) UI/UX 설계 및 운영 경험자" },
    { title: "사용자 흐름 기반 화면 설계 경험", body: "사용자 흐름을 분석해 화면을 설계한 과정을 보여주세요.", sourceQuote: "사용자 흐름 기반 UX 설계 및 화면 설계 경험자" },
    { title: "디자인 시스템 구축 역량", body: "Figma와 AI 디자인 도구를 활용해 디자인 시스템을 구축한 경험을 보여주세요.", sourceQuote: "디자인 시스템 구축 및 Figma·AI 디자인 도구 활용 역량" },
  ],
  cmrlhbyo5001cvkz6xmdk9fqj: [
    { title: "실제 출시한 제품 디자인 경험", body: "실제 고객에게 전달된 소프트웨어 제품을 처음부터 디자인하고 출시까지 이끈 경험을 보여주세요.", sourceQuote: "실제 고객에게 전달된 소프트웨어 제품을 디자인·출시한 경험" },
    { title: "인터페이스를 논리적으로 구조화한 사례", body: "인터페이스를 문제 해결 도구로 바라보고 논리적으로 구조화한 사례를 보여주세요.", sourceQuote: "인터페이스를 문제 해결 도구로 바라보고 논리적으로 구조화하는 능력" },
    { title: "글로벌 시장별 인터페이스 설계 경험", body: "국가별 사용자 차이를 이해하고 인터페이스에 반영해본 경험이 있다면 보여주세요.", sourceQuote: "글로벌(한/미/일) 고객 대상 인터페이스 차이를 이해하고 설계하는 능력" },
  ],
  cmrt6jgf2000e14dqajabn5aw: [
    { title: "비즈니스 목표 기반 UX 전략 수립", body: "비즈니스 목표와 사용자 요구를 함께 분석해 UX 전략을 수립한 경험을 보여주세요.", sourceQuote: "비즈니스 목표와 사용자 요구를 분석하여 문제를 정의하고 UX 전략을 수립할 수 있는 분" },
    { title: "IA·User Flow 설계 경험", body: "Information Architecture, User Flow, Wireframe 등 UX 설계 산출물을 구체적으로 보여주세요.", sourceQuote: "Information Architecture(IA), User Flow, Wireframe 등 UX 설계 경험을 보유하신 분" },
    { title: "설계 근거를 문서화한 커뮤니케이션", body: "설계 방향과 의사결정 근거를 문서화해 클라이언트와 소통한 경험을 보여주세요.", sourceQuote: "설계 방향과 의사결정 근거 문서화, 클라이언트 및 유관 직군과의 커뮤니케이션" },
  ],
  cmrf23kdi000eb2fnfwjc2cye: [
    { title: "UX/UI 프로젝트 PL 경험", body: "PC, 모바일 앱 콘텐츠의 UI/UX 디자인을 프로젝트 리더(PL)로 이끈 경험을 보여주세요.", sourceQuote: "UX/UI Design PL업무 (PC, Mobile.app 컨텐츠 및 UI/UX디자인)" },
    { title: "국내외 UX 사례 분석 역량", body: "국내외 UX 사례를 분석하고 프로젝트에 적용해본 경험을 보여주세요.", sourceQuote: "국내외 UX사례분석" },
    { title: "프로토타입 툴 활용 능력", body: "XD, 피그마, 스케치 등 프로토타입 툴로 작업한 결과물을 보여주세요.", sourceQuote: "프로토타입툴(XD, 피그마, 스케치 등) 사용가능자" },
  ],
  cmrf23hsw000bb2fnj39e52bx: [
    { title: "PC·모바일 UI/UX 디자인 실무", body: "PC와 모바일 앱 콘텐츠의 UI/UX 디자인 실무 경험을 보여주세요.", sourceQuote: "UX/UI Design 업무 (PC, Mobile.app 컨텐츠 및 UI/UX디자인)" },
    { title: "감각적인 표현력과 컨텐츠 이해도", body: "콘텐츠에 대한 이해를 바탕으로 감각적인 디자인 표현력을 보여줄 수 있는 작업물을 준비해주세요.", sourceQuote: "감각적인 디자인능력과 컨텐츠 이해도 바탕 표현능력이 높은 자" },
    { title: "트렌드 반영한 UI/UX 이해도", body: "최신 트렌드와 사용성을 반영한 UI/UX 이해도를 보여주는 사례를 준비해주세요.", sourceQuote: "트렌드와 사용성이 강화된 UI/UX에 대한 이해도가 높은 자" },
  ],
  cmreqzib80001oex97pax8oio: [
    { title: "IR·투자 유치 자료 디자인 경험", body: "IR 자료나 투자 유치 자료, 사업 제안서를 디자인해본 경험이 있다면 구체적으로 보여주세요.", sourceQuote: "IR 자료 디자인 및 투자 유치 자료, 사업 제안서 디자인" },
    { title: "경영진 발표 자료 기획·디자인", body: "브랜드 아이덴티티를 반영해 경영진 발표 자료와 프레젠테이션을 기획·디자인한 경험을 보여주세요.", sourceQuote: "브랜드 아이덴티티 기반의 시각 디자인 전반 (경영진 발표 자료 및 프레젠테이션 기획·디자인)" },
    { title: "전사 채널 톤앤매너 관리 경험", body: "웹, 문서, 영상 등 여러 채널의 시각적 톤앤매너를 일관되게 관리한 경험을 보여주세요.", sourceQuote: "전사 커뮤니케이션 채널(웹, 문서, 영상 등)의 시각적 톤앤매너 관리" },
  ],
  cmrt6jh2o000n14dq2t1bj447: [
    { title: "문제 정의부터 구현까지 전과정 수행", body: "사용자 문제 정의부터 플로우·화면 설계, 필요시 웹 구현까지 직접 담당해본 경험을 보여주세요.", sourceQuote: "사용자 문제 정의부터 플로우·화면 설계, 필요시 웹 구현까지 담당" },
    { title: "전체 플로우·정보구조 설계 능력", body: "전체 서비스 플로우와 정보구조(IA)를 설계한 경험을 구체적으로 보여주세요.", sourceQuote: "전체 플로우·정보구조(IA) 설계 가능" },
    { title: "개발자와의 스펙 커뮤니케이션 능력", body: "개발자가 이해할 수 있는 언어로 스펙을 전달해본 경험을 보여주세요.", sourceQuote: "개발자 언어로 스펙 전달 가능" },
  ],
  cmrf4ci5e000ebdlxix9dl81w: [
    { title: "정량·정성 리서치 설계·수행 경험", body: "정량, 정성 리서치를 직접 설계하고 수행한 경험을 구체적으로 보여주세요.", sourceQuote: "정량/정성 리서치 설계 및 수행" },
    { title: "사용성 테스트·휴리스틱 평가 경험", body: "사용성 테스트(UT)나 휴리스틱 평가를 진행해본 경험을 보여주세요.", sourceQuote: "사용성 테스트(UT) 및 휴리스틱 평가" },
    { title: "UX 인사이트 도출 경험", body: "리서치를 통해 UX 문제를 발견하고 인사이트를 도출한 과정을 보여주세요.", sourceQuote: "UX 문제 발견 및 인사이트 도출" },
  ],
  cmrf4cfo1000bbdlxz6zanwcz: [
    { title: "디자인 방향성 수립·전략 컨설팅 경험", body: "프로젝트의 디자인 방향성을 수립하고 전략 컨설팅에 참여한 경험을 보여주세요.", sourceQuote: "디자인 방향성 수립 및 전략컨설팅" },
    { title: "아트웍 기반 디자인 가이드 제작", body: "높은 퀄리티의 아트웍으로 디자인 가이드와 주요 화면을 만든 작업물을 보여주세요.", sourceQuote: "높은 퀄리티의 아트웍기반 디자인 가이드 및 주요화면 디자인" },
    { title: "자신만의 디자인 관점", body: "디자인에 대한 본인만의 신념과 관점을 포트폴리오로 설명해주세요.", sourceQuote: "디자인에 대한 신념과 자신만의 관점을 가진 분" },
  ],
  cmrf3szqa00023vxz33jzwfdl: [
    { title: "사용자 조사부터 서비스 설계까지 주도", body: "사용자 조사와 서비스 설계를 처음부터 끝까지 직접 계획하고 실행해본 경험을 보여주세요.", sourceQuote: "사용자 조사 및 서비스 설계를 '처음부터 끝까지 직접' 계획하고 실행해보신 분" },
    { title: "현황분석 기반 인사이트 도출", body: "현황을 분석해 인사이트를 도출한 과정을 구체적으로 보여주세요.", sourceQuote: "현황분석 및 인사이트 도출" },
    { title: "화면설계서·보고서 작성 역량", body: "퀄리티 있는 화면설계서와 보고서를 작성한 결과물을 보여주세요.", sourceQuote: "퀄리티 있는 화면설계서 및 보고서 작성이 가능한 분" },
  ],
  cmrf58p8h000big1v55ddg5tv: [
    { title: "리워드 광고·커머스 UI/UX 설계 경험", body: "리워드 광고나 커머스 서비스의 UI/UX를 설계한 경험을 구체적으로 보여주세요.", sourceQuote: "리워드 광고 및 커머스 관련 UI/UX 설계" },
    { title: "AI 활용 프로토타입 제작 경험", body: "AI를 활용해 디자인 프로토타입을 제작하고 생산성을 높인 사례를 보여주세요.", sourceQuote: "AI를 활용한 디자인 프로토타입 제작 및 생산성 향상" },
    { title: "디자인 시스템 기반 UI 확장 경험", body: "디자인 시스템을 기반으로 UI를 설계하고 확장해본 경험을 보여주세요.", sourceQuote: "디자인 시스템 기반 UI설계 및 확장" },
  ],
  cmrf58mqy0008ig1vbiqltuop: [
    { title: "광고 크리에이티브·그래픽 디자인 경험", body: "배너, 인터랙션, 모션 등 광고 크리에이티브를 직접 제작한 작업물을 보여주세요.", sourceQuote: "광고 크리에이티브 및 그래픽 디자인 (배너, 인터랙션, 모션 등)" },
    { title: "브랜드 요소를 UI에 녹인 비주얼 설계", body: "브랜드/그래픽 요소를 서비스 UI에 자연스럽게 녹여낸 비주얼 설계 사례를 보여주세요.", sourceQuote: "브랜드/그래픽 요소를 서비스 UI에 자연스럽게 녹여내는 비주얼 설계" },
    { title: "빠른 실험과 반복 개선 경험", body: "빠르게 실험하고 반복하며 디자인을 개선해본 경험을 보여주세요.", sourceQuote: "빠른 실험 및 반복을 통한 디자인 개선" },
  ],
  cmrlhcdgj001ovkz6gmss2uzb: [
    { title: "HTML·Figma 기반 상세페이지 제작", body: "HTML과 Figma로 상품 상세페이지를 직접 제작해본 경험을 보여주세요.", sourceQuote: "5개 PB 브랜드의 상품상세페이지를 HTML과 Figma로 제작합니다" },
    { title: "AI 이미지 편집 툴 활용 경험", body: "Figma와 AI 이미지 편집 툴로 상품 썸네일을 제작·최적화한 경험을 보여주세요.", sourceQuote: "상품 썸네일을 제작·최적화하고, Figma와 AI 이미지 편집 툴로 이미지를 편집하며" },
    { title: "다수 작업 꼼꼼한 관리 능력", body: "여러 작업을 동시에 진행하면서도 꼼꼼하게 관리한 경험을 보여주세요.", sourceQuote: "여러 작업을 꼼꼼하게 관리하는 능력" },
  ],
  cmrlhcr2r0020vkz6t00pr541: [
    { title: "비주얼 리소스 제작 경험", body: "아이콘, 일러스트, 애니메이션 등 비주얼 리소스를 직접 제작한 작업물을 보여주세요.", sourceQuote: "UI 디자인, 기능 기획 참여, 비주얼 리소스 제작(아이콘, 일러스트, 애니메이션), 디자인 시스템 유지" },
    { title: "SVG·Lottie 리소스 제작 경험", body: "SVG나 Lottie로 인터랙션/애니메이션 리소스를 제작해본 경험을 보여주세요.", sourceQuote: "SVG, Lottie 리소스 제작 경험" },
    { title: "네이티브 디자인 가이드라인 이해도", body: "iOS HIG나 Android Material 등 네이티브 가이드라인을 반영해 디자인한 경험을 보여주세요.", sourceQuote: "iOS HIG/Android Material 등 네이티브 디자인 가이드라인 이해" },
  ],
  cmreruxdk0000pdkbitgp50hf: [
    { title: "B2B 세일즈 자료 제작 경험", body: "제품소개서, IR/피치덱, 브로슈어 등 B2B 세일즈 자료를 제작한 경험을 보여주세요.", sourceQuote: "제품소개서, 제안서, IR/피치덱, 브로슈어, 원페이지 세일즈 자료를 제작" },
    { title: "복잡한 기술을 시각화한 경험", body: "복잡한 기술이나 기능을 쉽게 이해되도록 시각화한 사례를 보여주세요.", sourceQuote: "복잡한 기술 및 기능을 쉽게 시각화할 수 있는 능력" },
    { title: "하드웨어 기기 UI/UX 디자인 경험", body: "장비나 키오스크 등 하드웨어의 UI/UX를 기획하고 디자인한 경험을 보여주세요.", sourceQuote: "AI 피부 분석 장비, 3D 피부 진단 기기, 키오스크 UI/UX 기획 및 인터페이스를 디자인" },
  ],
  cmrlhcho1001svkz6gcc8bs2u: [
    { title: "AI 콘텐츠 소비 경험 설계", body: "채팅, 게임, 웹소설/웹툰 등 AI 콘텐츠 소비 경험을 설계한 사례를 보여주세요.", sourceQuote: "AI 컨텐츠 소비 경험(채팅, 게임, 웹소설/웹툰 등)을 설계하고" },
    { title: "서비스 구조·사용자 여정 정의 경험", body: "PM과 함께 서비스 구조와 사용자 여정을 정의하고 와이어프레임을 설계한 경험을 보여주세요.", sourceQuote: "PM과 함께 서비스 구조와 사용자 여정을 정의하며 와이어프레임을 설계합니다" },
    { title: "배포 후 성과 분석 기반 개선", body: "배포 후 성과 지표를 분석해 지속적으로 개선한 경험을 보여주세요.", sourceQuote: "배포 후 성과 지표를 분석해 지속 개선합니다" },
  ],
  cmrlhd20z0028vkz6zvwy8p2h: [
    { title: "라이브 게임 UI 리소스 관리 경험", body: "서비스 중인 라이브 게임에 맞춰 UI 리소스와 아이콘을 관리·제작한 경험을 보여주세요.", sourceQuote: "서비스 중인 라이브 게임에 최적화된 UX/UI 리소스 관리 및 아이콘을 제작합니다" },
    { title: "Unity 기반 UI 툴 활용 경험", body: "Unity3D, UGUI, NGUI 등으로 게임 UI를 작업해본 경험을 보여주세요.", sourceQuote: "Unity3D, UGUI, NGUI 사용 경험 또는 새로운 툴에 대한 거부감 없음" },
    { title: "UI 아트컨셉 이해와 레퍼런스 활용", body: "UI 아트컨셉을 이해하고 레퍼런스를 적절히 활용해 작업한 사례를 보여주세요.", sourceQuote: "UI 아트컨셉에 대한 이해도, 레퍼런스 활용 능력" },
  ],
  cmrlhcxdc0024vkz6kg0y1b8o: [
    { title: "게임 프로모션·이벤트 디자인 경험", body: "게임 프로모션이나 이벤트 페이지를 디자인해본 경험을 보여주세요.", sourceQuote: "게임 프로모션/이벤트 디자인과 웹/플랫폼 서비스의 UI/UX 설계 및 디자인을 담당합니다" },
    { title: "AI 툴 활용 콘텐츠 제작 경험", body: "AI 툴을 활용해 콘텐츠 디자인을 제작한 경험을 보여주세요.", sourceQuote: "AI 툴을 활용해 콘텐츠 디자인을 제작합니다" },
    { title: "웹 표준 퍼블리싱 역량", body: "HTML, CSS 등 웹 표준 퍼블리싱이 가능한 결과물을 보여주세요.", sourceQuote: "웹 표준 퍼블리싱(HTML, CSS) 가능자" },
  ],
  cmrf2nt38000fo259485z7kcw: [
    { title: "데이터 기반 사용자 여정 분석", body: "사용자 행동 데이터와 고객 피드백을 기반으로 사용자 여정을 분석하고 UX 문제를 정의·해결한 사례를 보여주세요.", sourceQuote: "서비스 목표, 사용자 행동 데이터, 운영 전략 및 고객 피드백을 기반으로 사용자 여정을 분석하고 UX 문제를 정의·해결" },
    { title: "데이터·인사이트 기반 문제 해결 경험", body: "데이터와 사용자 인사이트를 기반으로 문제를 정의하고 해결한 경험을 구체적으로 보여주세요.", sourceQuote: "데이터와 사용자 인사이트를 기반으로 문제를 정의하고 해결한 경험이 있으신 분" },
    { title: "7년 이상 프로덕트 디자인 경력", body: "다년간의 프로덕트 디자인 경력에서 쌓은 역량을 정리해서 보여주세요.", sourceQuote: "7년 이상의 프로덕트 디자인 경력 또는 이에 준하는 역량을 보유하신 분" },
  ],
  cmrehptzp0001qjgc5ve64bfq: [
    { title: "프로덕트 전략·로드맵 설계 참여", body: "비즈니스 목표 달성을 위한 프로덕트 방향성을 주도적으로 고민해본 경험을 보여주세요.", sourceQuote: "프로덕트 전략 및 로드맵 설계 - 비즈니스 목표를 달성하기 위한 프로덕트의 방향성을 주도적으로 고민" },
    { title: "전환을 만드는 비주얼 콘텐츠 제작", body: "상세페이지, 랜딩페이지, 인앱 배너 등 전환을 만드는 핵심 에셋을 리딩한 작업물을 보여주세요.", sourceQuote: "비주얼 콘텐츠 기획 및 제작 - 상세페이지·랜딩페이지·인앱 배너 등 전환을 만드는 핵심 에셋 리딩" },
    { title: "브랜드 아이덴티티 시각화 경험", body: "브랜드 아이덴티티를 시각화하고 전략을 수립해본 경험을 보여주세요.", sourceQuote: "브랜드 아이덴티티 시각화 및 전략 수립" },
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
