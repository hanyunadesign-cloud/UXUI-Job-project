// 공고별 "이렇게 어필하세요" 콘텐츠. 일부러 별도 파일(이 파일엔 "use client" 없음)로 뒀다 —
// AppealPointsCard.tsx(클라이언트 컴포넌트)와 jobs/[id]/page.tsx(서버 컴포넌트) 양쪽에서
// 이 데이터를 가져다 써야 하는데, "use client" 파일의 일반 데이터 export를 서버 컴포넌트에서
// import하면 Next.js가 실제 값 대신 클라이언트 레퍼런스로 취급해서 값이 깨진다(모든 job.id가
// truthy로 보이는 버그로 실제 발견됨) — 그래서 데이터는 순수 모듈로 분리한다.
// "이렇게 어필하세요" — 스테이지별 rubric(내부 판단 기준, 화면엔 안 보임)을 참고해 AI가
// 고를 법한 포인트를 "공고 원문 근거 → 어필 지시" 형태로만 보여준다. 아직 실제 Gemini
// 파이프라인에 연결하기 전이라, 검증한 내용을 그대로 하드코딩해서 job.id로 조회한다.
// page.tsx가 이 맵을 직접 import해서 쓴다 — job.id가 여기 있는지로 "이 공고에 기업 정보/
// 어필 포인트 UI를 보여줄지"를 판단해서, 공고 id 목록을 페이지 쪽에 따로 유지하지 않는다.
//
// 토스 디자인 시스템 문서(그라디언트/이너섀도우 금지, 1px 헤어라인 보더로만 표면을 구분,
// grey-50 fill로 콘텐츠 위계 구분)를 적용해 이전의 글래스모피즘·불규칙 그라디언트 배경을 걷어냈다.
//
// sourceQuote: 포인트가 근거로 삼은 공고 원문 문장(해당 job.description에 정확히 일치해야
// 함) — 클릭 시 이 문장을 "공고 내용" 쪽에서 찾아 스크롤 + 밑줄 표시하는 데 쓴다. 화면에
// 원문 인용을 직접 보여주진 않고(이전 피드백대로) 클릭했을 때만 원문 위치를 가리키는 용도.
export type AppealPoint = { title: string; body: string; sourceQuote: string };

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
    { title: "제약 속에서도 완성도 높은 비주얼", body: "여러 제약 조건 속에서도 탁월한 비주얼 결과물을 만들어낸 작업을, 포트폴리오 가장 앞쪽에 배치해보세요.", sourceQuote: "프로젝트가 가진 많은 제약 조건 속에서도 탁월한 비주얼을 만들어낼 수 있는 역량이 필요해요." },
    { title: "브랜딩·웹·그래픽 전 영역 작업 경험", body: "브랜딩, 웹 인터랙션, 그래픽처럼 여러 영역을 넘나들며 작업해본 경험을 모두 모아서 자세히 보여주세요.", sourceQuote: "본인의 비주얼 강점을 발휘할 수 있는 프로젝트라면 브랜딩, 웹 인터렉션 디자인, 그래픽 디자인 등 업무 범위의 제약 없이 일해요." },
    { title: "Hi-fi 프로토타입 제작 역량", body: "떠오른 아이디어를 실제 작동하는 Hi-fi 프로토타입으로 직접 구현해본 경험을 자세히 소개해보세요.", sourceQuote: "떠오른 아이디어를 Hi-fi 프로토타입으로 만들 수 있는 분이 필요해요." },
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
    { title: "직접 설계·출시하고 개선한 역량", body: "서비스를 직접 설계하고 출시한 뒤 고객 반응으로 개선해 성과 낸 과정을, 구체적인 수치와 함께 보여주세요.", sourceQuote: "서비스나 기능의 디자인을 직접 설계·출시하고, 고객 반응을 바탕으로 개선해 성과를 낸 경험이 있는 분" },
    { title: "데이터 기반 전략 설계 경험", body: "정성·정량 데이터를 근거로 문제를 발견하고 전략을 세워본 경험을, 의사결정 과정과 함께 담아보세요.", sourceQuote: "프로덕트 전략 및 로드맵 설계 (정성·정량 데이터 기반 문제발견/가설수립)" },
    { title: "개인 프로젝트·창업 운영 경험", body: "개인 프로젝트나 창업으로 서비스를 직접 운영해본 경험이 있다면 그 운영 과정까지 구체적으로 포함해주세요.", sourceQuote: "개인 프로젝트나 창업으로 본인의 서비스를 직접 운영해 보신 분" },
  ],
  cmrdl1fpj000e5xp5m5vsfd0r: [
    { title: "데이터 기반 소재 개선 경험", body: "유저 구매 경험을 높이기 위해 데이터를 근거로 광고 소재를 개선해본 과정을 구체적으로 보여주세요.", sourceQuote: "유저 구매 경험 증대를 위한 데이터 기반의 디자인 소재 개선 작업 진행" },
    { title: "다양한 제작 툴 활용 역량", body: "피그마부터 프리미어, 에프터이펙트까지 여러 툴을 넘나들며 결과물을 만든 경험을 포트폴리오에 담아주세요.", sourceQuote: "피그마, 프리미어, 에프터이펙트 등 제작 툴을 자유롭게 다룰 수 있는 분" },
    { title: "마케터와의 협업 경험", body: "퍼포먼스·콘텐츠 마케터와 유연하게 소통하며 광고 소재를 만들어낸 협업 사례를 보여주세요.", sourceQuote: "퍼포먼스 마케터와 콘텐츠 마케터와의 유연한 커뮤니케이션이 가능하신 분" },
  ],
  cmrdl1d69000d5xp54byubjb5: [
    { title: "데이터 기반 UX 설계 경험", body: "사용자 행동 패턴과 지표 분석을 근거로 UX를 설계한 과정을 구체적인 수치와 함께 보여주세요.", sourceQuote: "사용자의 행동패턴 및 다양한 지표 분석을 통한 데이터에 기반한 근거가 필요합니다." },
    { title: "디자인 파트 리드 경험", body: "팀 내에서 디자인 방향을 이끌며 아웃풋 수준을 끌어올린 경험이 있다면 구체적으로 어필하세요.", sourceQuote: "더 높은 수준의 디자인 아웃풋을 만들어내기 위해 팀 내에서 디자인 파트를 리드합니다." },
    { title: "0에서 1까지 출시 경험", body: "기획부터 출시, 출시 후 개선까지 하나의 서비스를 끝까지 책임져본 경험을 보여주세요.", sourceQuote: "하나의 서비스를 기획에서 부터 출시, 출시 후 개선하는 과정까지 경험해보신 분" },
  ],
  cmrlhc7rw001kvkz6r6zr8myi: [
    { title: "상품상세페이지 제작 경험", body: "썸네일과 상품상세페이지를 직접 제작해본 경험과 결과물을 포트폴리오에 담아주세요.", sourceQuote: "사내외 플랫폼용 썸네일과 상품상세페이지를 제작하고" },
    { title: "패션 브랜드 웹 디자인 관심", body: "패션 브랜드의 웹 디자인에 관심이 있거나 관련 작업 경험이 있다면 강조해주세요.", sourceQuote: "패션 브랜드 웹 디자인에 대한 관심 또는 경험" },
    { title: "AI 크리에이티브 툴 활용 경험", body: "Midjourney, ChatGPT, Runway 등 AI 툴을 실무에 활용해본 경험이 있다면 구체적으로 보여주세요.", sourceQuote: "AI 툴(Midjourney, ChatGPT, Runway) 활용 경험" },
  ],
  cmreqzfn70000oex9k9kcsmht: [
    { title: "글로벌 광고소재 제작 경험", body: "국내뿐 아니라 해외向 디지털 광고 소재를 제작해본 경험이 있다면 구체적으로 보여주세요.", sourceQuote: "국내 및 글로벌 디지털 광고소재 제작" },
    { title: "온라인 콘텐츠 디자인 실무 경험", body: "온라인 콘텐츠 디자인 실무 경험(인턴 포함)을 포트폴리오로 증명해주세요.", sourceQuote: "컨텐츠 및 온라인 관련 디자인 실무 경험을 보유하신 분" },
    { title: "SNS 트렌드 감각", body: "인스타그램·틱톡·X 등 SNS 트렌드를 빠르게 캐치해 반영한 작업물을 보여주세요.", sourceQuote: "SNS(IG/틱톡/X) 트렌드에 민감하고 빠르게 읽을 수 있는 분" },
  ],
  cmsjzn4wu000hx7fc61hwr9jv: [
    { title: "전환율 최적화 경험", body: "사용자 행동 데이터를 근거로 UX를 개선해 전환율(CVR)을 높인 경험을 수치와 함께 보여주세요.", sourceQuote: "사용자 행동 데이터를 기반으로 한 UX 개선 및 전환율(CVR) 최적화" },
    { title: "디자인·퍼블리싱 독립 수행 경험", body: "기획, 디자인, 퍼블리싱까지 혼자 처음부터 끝까지 진행해본 경험을 강조해주세요.", sourceQuote: "디자인부터 퍼블리싱까지 독립적으로 수행 가능한 분" },
    { title: "카페24 쇼핑몰 운영 경험", body: "카페24 기반 쇼핑몰을 직접 구축하거나 운영해본 경험이 있다면 구체적으로 적어주세요.", sourceQuote: "카페24 기반 쇼핑몰 운영 또는 구축 경험이 있는 분" },
  ],
  cmrng9dwn0003qjj2s1fvctv4: [
    { title: "상세페이지 제작 경험", body: "메시지를 효과적으로 전달하는 상세페이지를 직접 디자인해본 사례를 보여주세요.", sourceQuote: "메시지를 효과적으로 전달하는 상세페이지 디자인" },
    { title: "팀 프로젝트 본인 역할 명시", body: "팀 프로젝트로 작업한 포트폴리오라면 본인이 맡은 역할을 명확히 구분해서 적어주세요.", sourceQuote: "팀 프로젝트는 본인 역할 명시" },
    { title: "이커머스 도메인 관심", body: "뷰티·패션·이커머스 업계 경험이나 관심을 구체적인 작업물로 보여주세요.", sourceQuote: "뷰티/패션/이커머스 업계 경험" },
  ],
  cmrf2oh4g0012o259lzpnt4hq: [
    { title: "구매 전환 이끈 상세페이지 경험", body: "제품 상세페이지를 기획해 실제 구매 전환으로 이어지게 만든 경험을 수치와 함께 보여주세요.", sourceQuote: "제품 상세페이지를 기획하여 구매 전환을 이끄는 콘텐츠 디자인" },
    { title: "데이터 기반 디자인 개선 경험", body: "정량·정성 데이터를 근거로 디자인 방향을 정하고 빠르게 개선한 사례를 구체적으로 적어주세요.", sourceQuote: "정량·정성적 데이터를 기반으로 디자인 방향을 설정하고, 문제를 빠르게 개선" },
    { title: "패키지 디자인 구현 경험", body: "용기, 인쇄 등 패키지 제작 과정을 이해하고 디자인을 구현해본 경험이 있다면 어필해주세요.", sourceQuote: "패키지 제작 과정(용기, 인쇄 등)에 대한 이해를 바탕으로 디자인을 구현해본 경험이 있는 분" },
  ],
  cmrf2oek6000zo259o3bi6wep: [
    { title: "문제 정의부터 문서화까지의 과정", body: "데이터 기반으로 문제를 정의하고 정보 구조 설계, 프로토타이핑까지 논리적으로 문서화한 과정을 보여주세요.", sourceQuote: "데이터를 기반으로 한 문제 정의부터 정보 구조 설계, Prototyping, 디자인 결과물까지 명확한 논리로 설명하고 문서화" },
    { title: "A/B 테스트 기반 개선 경험", body: "A/B 테스트로 가설을 검증하고 서비스를 개선한 구체적인 사례를 수치와 함께 보여주세요.", sourceQuote: "A/B 테스트를 통한 지속적인 검증 및 개선" },
    { title: "사용성 테스트 진행 경험", body: "사용성 테스트나 포커스 그룹 인터뷰를 직접 진행해본 경험이 있다면 구체적으로 적어주세요.", sourceQuote: "사용성 테스트, 포커스 그룹 인터뷰 경험이 있으신 분" },
  ],
  cmrf2obxw000wo259yb16vfhe: [
    { title: "디자인 프로세스 리드 경험", body: "디자인 프로세스와 문화를 이끌며 타 직군과 의견을 조율해본 경험을 구체적으로 보여주세요.", sourceQuote: "전반적인 디자인 프로세스와 문화를 이끌면서 타 직군과 균형 있게 의견을 조율" },
    { title: "주니어 성장 서포트 경험", body: "주니어 디자이너의 성장을 돕거나 팀을 리딩해본 경험이 있다면 구체적인 사례로 보여주세요.", sourceQuote: "주니어 프로덕트 디자이너들의 성장을 서포트" },
    { title: "높은 오너십과 리더십", body: "제품에 대한 오너십을 가지고 책임감 있게 업무를 이끈 경험을 보여주세요.", sourceQuote: "제품에 대한 매우 높은 수준의 오너십, 리더십, 책임감을 가지고 업무 하신 분" },
  ],
  cmrt6jgwk000k14dq9vqrypag: [
    { title: "0→1 제품 디자인 경험", body: "초기 스타트업이나 0에서 1을 만든 프로덕트 디자인 경험이 있다면 구체적으로 어필하세요.", sourceQuote: "초기 스타트업 또는 0→1 제품 디자인 경험" },
    { title: "Figma 컴포넌트 설계 역량", body: "Figma의 컴포넌트, 오토레이아웃을 활용해 효율적으로 작업한 경험을 보여주세요.", sourceQuote: "Figma 숙련(컴포넌트, 오토레이아웃 포함)" },
    { title: "개발자 협업 경험", body: "개발자와 직접 협업하며 제품을 만든 경험을 구체적인 사례로 보여주세요.", sourceQuote: "개발자 협업 경험 필수" },
  ],
  cms6d6bbs00054l8qhfyq2ubw: [
    { title: "디자인 결정 근거 설명 경험", body: "결과물뿐 아니라 왜 그런 결정을 내렸는지 근거를 논리적으로 설명하고 설득한 과정을 보여주세요.", sourceQuote: "결과물뿐 아니라 왜 그런 결정을 했는지 근거를 설명하고 설득할 수 있는 분" },
    { title: "사용자 문제 정의 습관", body: "화면을 그리기 전에 사용자가 어떤 상황에서 무엇을 못 하고 있는지부터 정의한 사례를 보여주세요.", sourceQuote: "화면을 그리기 전에 \"이 사용자가 어떤 상황에서 무엇을 못 하고 있는가\"를 먼저 묻는 분" },
    { title: "디자인 시스템 운영 경험", body: "기존 디자인 시스템을 운영하거나 확장해본 경험을 구체적으로 적어주세요.", sourceQuote: "디자인 시스템을 운영하거나 확장해 보신 분" },
  ],
  cmrf4cd6b0008bdlx4hd1s9z2: [
    { title: "사용자 행동 리서치 경험", body: "User Behavior Research와 테스트를 직접 수행해본 경험을 구체적인 사례로 보여주세요.", sourceQuote: "User Behavior Research & Test" },
    { title: "GA 기반 데이터 분석 경험", body: "GA 등 데이터 분석 툴로 사용자 데이터를 분석해본 경험을 보여주세요.", sourceQuote: "GA & User Data Analysis" },
    { title: "이용 맥락 조사·분석 역량", body: "서비스 내·외부 환경 변화와 이용 맥락, 행태를 조사·분석해본 경험을 구체적으로 적어주세요.", sourceQuote: "서비스 내/외부 환경 변화, 이용 맥락과 행태를 조사하고 데이터 분석을 통해 적합한 전략을 도출합니다." },
  ],
  cmrf4caom0005bdlxc77o1xwt: [
    { title: "화면구조·플로우 설계 경험", body: "사용 맥락과 서비스 환경 조사를 바탕으로 화면구조와 플로우를 설계해본 경험을 보여주세요.", sourceQuote: "사용 맥락, 서비스 환경조사를 통해 화면구조, 플로우, 디자인 전략, 컨셉 디자인, 구현 가이드라인을 셋업합니다." },
    { title: "컨셉 모델링·프로토타이핑 경험", body: "컨셉 모델링부터 프로토타이핑까지 직접 진행해본 작업물을 보여주세요.", sourceQuote: "Concept Modeling / Prototyping" },
    { title: "UI·BX 디자인 실무 역량", body: "UI/GUI 디자인부터 비주얼 인터랙션, BX 디자인까지 넘나든 작업 경험을 보여주세요.", sourceQuote: "UI / GUI Design / Visual Interaction / BX Design" },
  ],
  cmrf4c7uz0002bdlxfsnbk6bf: [
    { title: "리서치부터 프로토타이핑까지의 경험", body: "리서치와 테스트, 모델링과 프로토타이핑을 아우르는 전체 과정을 직접 진행해본 경험을 보여주세요.", sourceQuote: "다양한 방법의 리서치와 테스트, 모델링과 프로토타이핑, 디자인씽킹 워크샵, 설계, 넥스트 리포팅을 진행합니다." },
    { title: "서비스 디자인 실무 경험", body: "UX/UI뿐 아니라 서비스 디자인 관점에서 문제를 풀어본 경험을 구체적으로 적어주세요.", sourceQuote: "UX/UI/Service Design" },
    { title: "고객경험 문제 해결 사례", body: "고객 문제를 스스로 찾아 더 나은 경험으로 풀어낸 사례를 보여주세요.", sourceQuote: "문제를 찾는 호기심, 보다 나은 고객경험을 위한 해결 방법 만들기가 즐거우신 분을 찾습니다." },
  ],
  cmrf2o0m7000oo2594nyq5xzk: [
    { title: "콘텐츠·커머스 통합 경험", body: "콘텐츠와 커머스 영역을 모두 경험하며 디자인해본 사례가 있다면 구체적으로 보여주세요.", sourceQuote: "콘텐츠와 커머스 영역을 모두 경험해본 분" },
    { title: "기획 의도 시각화 역량", body: "기획 의도를 정확히 해석해 완성도 높은 결과물로 만들어낸 작업물을 보여주세요.", sourceQuote: "기획 의도를 시각적으로 해석하여 완성도 높은 디자인 결과물을 제작할 수 있는 분" },
    { title: "대형 프로모션 디자인 경험", body: "빅프로모션이나 브랜드 캠페인 디자인에 참여해본 경험이 있다면 구체적으로 적어주세요.", sourceQuote: "대형 프로모션 또는 브랜드 캠페인 디자인 경험이 있는 분" },
  ],
  cmrf2ny2y000lo259w19qhtuu: [
    { title: "브랜드 전 과정 주도 경험", body: "브랜드 전략 수립부터 네이밍, BI 개발, 디자인 시스템 구축까지 전 과정을 주도한 경험을 보여주세요.", sourceQuote: "브랜드 기획과 전략 수립부터 네이밍, BI 개발, 디자인 시스템 구축까지 전 과정을 주도한 경험이 있는 분" },
    { title: "온·오프라인 브랜드 적용 경험", body: "온·오프라인 브랜드 디자인을 실제 서비스나 공간에 적용해본 경험을 구체적으로 보여주세요.", sourceQuote: "온·오프라인 브랜드 디자인을 실제 서비스 또는 공간에 적용한 경험이 있는 분" },
    { title: "오프라인 공간 브랜딩 경험", body: "팝업 스토어나 매장 등 오프라인 공간 브랜딩을 인테리어로 구현해본 경험이 있다면 어필해주세요.", sourceQuote: "오프라인 공간 브랜딩을 기획하고 인테리어로 구현해 본 분" },
  ],
  cmrf2nvkl000io2595nup7khs: [
    { title: "리서치 오퍼레이션 수행 경험", body: "참가자 리크루팅, 스케줄링, 참가비 지급 등 리서치 오퍼레이션을 직접 수행한 경험을 보여주세요.", sourceQuote: "직접 유저 리서치 오퍼레이션(참가자 리크루팅·스케줄링·참가비 지급, 리서치 패널 관리 등)을 수행한 경험이 있는 분" },
    { title: "리서치 레포지토리 운영 경험", body: "리서치 자료를 체계적으로 문서화하고 레포지토리로 관리해본 경험을 구체적으로 적어주세요.", sourceQuote: "리서치 자료나 지식을 체계적으로 문서화하고 관리(Research repository 운영 등)해 본 경험이 있는 분" },
    { title: "이해관계자 협업 경험", body: "여러 이해관계자와 긴밀히 협업하며 리서치 프로세스와 리크루팅을 진행한 경험을 보여주세요.", sourceQuote: "이해관계자와 긴밀히 협업하여 리서치 프로세스 및 리크루팅을 진행해 본 경험이 있는 분" },
  ],
  cmsddhbxw000210b8bvvvi4re: [
    { title: "병원 방문 리서치 경험", body: "병원 방문 인터뷰나 VOC 분석을 바탕으로 UX 개선안을 도출한 경험을 구체적으로 보여주세요.", sourceQuote: "사용자 리서치(병원 방문 인터뷰, VOC 분석) 기반 UX 개선안 도출" },
    { title: "치과용 SW 화면 설계 경험", body: "치과용 SW처럼 전문 도메인의 UX/UI를 설계해본 경험이 있다면 구체적으로 적어주세요.", sourceQuote: "치과용 SW UX/UI 설계 및 화면 디자인" },
    { title: "디자인 시스템 구축·운영 경험", body: "디자인 시스템을 구축하고 운영하며 개발 조직과 협업한 경험을 보여주세요.", sourceQuote: "디자인 시스템 구축·운영 및 개발 조직과의 협업" },
  ],
  cmrlhayt9000kvkz6lgpwmvsw: [
    { title: "디자인 시스템 구축 경험", body: "디자인 시스템이나 업무 프로세스를 처음부터 구축해본 경험을 구체적으로 보여주세요.", sourceQuote: "디자인 시스템/업무 프로세스를 처음부터 구축한 경험" },
    { title: "정성·정량 UX 데이터 분석 경험", body: "정성·정량 데이터를 함께 분석해 제품 개선에 반영한 경험을 보여주세요.", sourceQuote: "정성/정량 UX 데이터 분석" },
    { title: "데이터 기반 문제 해결 역량", body: "데이터를 근거로 문제를 해결한 구체적인 사례를 수치와 함께 보여주세요.", sourceQuote: "데이터 기반 문제 해결 역량" },
  ],
  cmremdncr000013jij17dmo6n: [
    { title: "다국가 로컬라이제이션 설계 경험", body: "다국가·다언어 환경에 맞춰 현지화(로컬라이제이션)를 설계해본 경험을 구체적으로 보여주세요.", sourceQuote: "글로벌 펀딩·스토어 서비스의 UX/UI를 설계·개선하고, 다국가·다언어 환경에 맞는 현지화(로컬라이제이션)를 설계해요." },
    { title: "프로토타입 A/B 테스트 검증 경험", body: "프로토타입과 A/B 테스트로 사용성을 검증하고 개선 방향을 찾은 경험을 보여주세요.", sourceQuote: "프로토타입, A/B Test를 통해 사용성을 검증하고 개선 방향을 찾아요." },
    { title: "정성·정량 데이터 기반 문제 정의", body: "정성·정량 데이터를 근거로 서비스 문제를 정의하고 해결안을 도출한 과정을 보여주세요.", sourceQuote: "정성/정량 데이터를 기반으로 서비스 문제를 정의하고, 실질적인 해결 방안을 도출해요." },
  ],
  cmrt6rtzp0002cchcesfnyx71: [
    { title: "서비스 전 여정 UX 분석 경험", body: "서비스 진입부터 종료까지 전체 여정을 사용자 관점에서 분석·평가하고 개선을 주도한 경험을 보여주세요.", sourceQuote: "서비스 진입부터 종료까지의 모든 UI/UX를 사용자 관점에서 분석·평가하고, 이를 바탕으로 기획·개선 주도" },
    { title: "B2B 사용자군 UX 설계 경험", body: "라이더나 운영자 같은 B2B 사용자군을 위한 UX를 설계해본 경험이 있다면 구체적으로 적어주세요.", sourceQuote: "대규모 서비스(배달·커머스·물류 등)에서 운영자·라이더·고객 등 B2B 사용자군을 위한 UX 설계 경험이 있는 분" },
    { title: "A/B 테스트 인사이트 도출 경험", body: "데이터 분석과 A/B 테스트로 인사이트를 도출해 개선에 반영한 경험을 수치와 함께 보여주세요.", sourceQuote: "데이터 분석, A/B 테스트를 통한 인사이트 도출 경험이 있는 분" },
  ],
  cmrt6jffv000514dqca5kd68d: [
    { title: "발간자료 편집·디자인 경험", body: "자료나 서식을 편집하고 그래픽으로 완성도 있게 디자인해본 경험을 보여주세요.", sourceQuote: "리서치센터 발간자료 제작 및 편집(자료/서식 편집 및 그래픽 디자인)" },
    { title: "Adobe 툴 활용 능력", body: "Photoshop, Illustrator를 능숙하게 다뤄 작업한 결과물을 포트폴리오로 보여주세요.", sourceQuote: "Adobe Photoshop/Illustrator 프로그램 활용 능통자" },
    { title: "MS Office 활용 능력", body: "MS Office를 능숙하게 활용해 자료를 제작·정리한 경험이 있다면 함께 적어주세요.", sourceQuote: "MS Office 활용 능통자" },
  ],
  cmrf23fb40008b2fnet8v3s8a: [
    { title: "UX 프로젝트 리드 경험", body: "리서치부터 전략, UI 설계, 출시 관리까지 UX 프로젝트를 처음부터 끝까지 리드해본 경험을 보여주세요.", sourceQuote: "UX 프로젝트 리드 경험 (사용자/시장 리서치, UX 전략, UI 설계, 시각화, 출시 관리 등)" },
    { title: "5년 이상 관련 업무 경험", body: "5년 이상의 관련 업무 경험 또는 이에 준하는 역량을 구체적인 프로젝트로 증명해주세요.", sourceQuote: "5년 이상의 관련 업무 경험이 있는 분 (혹은 이에 준하는 업무 경험이 있는 분)" },
    { title: "UX 컨설턴트 성장 의지", body: "UX 컨설턴트로 성장하고 싶은 방향성과 이유를 자기소개서에 구체적으로 담아주세요.", sourceQuote: "UX 컨설턴트로 성장하고 싶은 분" },
  ],
  cmrkfipk200076jwj8z3ighc9: [
    { title: "User Flow·프로토타입 시각화 경험", body: "User Flow, Wireframe, Prototype을 Mock-up으로 시각화해 디자인 시스템에 녹여낸 경험을 보여주세요.", sourceQuote: "User Flow, Wireframe, Prototype 등을 Mock-up으로 시각화하고, 디자인 시스템과 스타일 가이드를 활용해 매력적인 사용자 인터페이스를 만듭니다." },
    { title: "핵심 문제 기반 UX 제안 경험", body: "기획 의도와 핵심 문제를 파악해 그에 맞는 UX/UI를 제안한 사례를 구체적으로 보여주세요.", sourceQuote: "기획 의도와 핵심 문제를 이해하고 이에 맞는 UX/UI를 제안할 수 있는 분" },
    { title: "사용자 연구 기반 포트폴리오", body: "사용자 연구 과정을 담은 포트폴리오로 리서치 역량을 함께 보여주세요.", sourceQuote: "사용자 연구를 보여주는 포트폴리오 보유자" },
  ],
  cmsdbvp050002la1fu0ubqnmn: [
    { title: "글로벌 서비스 UX/UI 설계 경험", body: "글로벌 서비스의 방향성과 사용자 경험을 바탕으로 UX/UI를 설계하고 개선한 경험을 보여주세요.", sourceQuote: "포카마켓 글로벌 서비스의 방향성과 사용자 경험을 바탕으로 UX/UI를 설계하고 개선합니다." },
    { title: "디자인 시스템 구축·운영 경험", body: "디자인 시스템을 구축·운영하며 서비스 전반의 일관성을 관리해본 경험을 구체적으로 적어주세요.", sourceQuote: "디자인 시스템을 구축·운영하며, 서비스 전반의 일관성과 완성도를 관리합니다." },
    { title: "글로벌·팬덤 도메인 이해", body: "글로벌 서비스나 엔터테인먼트·팬덤 비즈니스에 대한 이해와 공감을 구체적인 경험으로 보여주세요.", sourceQuote: "엔터테인먼트 산업 및 팬덤 비즈니스에 대한 이해와 공감을 가진 분" },
  ],
  cmrehpra20000qjgc11g92x1x: [
    { title: "0 to 1 제품 기획·디자인 경험", body: "작은 프로덕트라도 스스로 기획부터 디자인까지 0에서 1로 만들어본 경험을 보여주세요.", sourceQuote: "작은 프로덕트더라도 0 to 1까지 스스로 기획하고 디자인한 경험이 있는 분" },
    { title: "UX Writing 경험", body: "사용성을 높이기 위해 UX 라이팅을 직접 작성해본 경험이 있다면 구체적으로 보여주세요.", sourceQuote: "사용성을 높이기 위한 UX Writing" },
    { title: "사용자 니즈 기반 프로토타입 제작", body: "사용자 니즈를 바탕으로 UX를 설계하고 프로토타입을 만들어본 과정을 보여주세요.", sourceQuote: "사용자 니즈 기반의 UX 설계 및 프로토타입 제작" },
  ],
  cmrlhb3u4000ovkz68mj7rgog: [
    { title: "제품 전체 생애주기 담당 경험", body: "아이디어부터 출시, 개선까지 제품 전체 생애주기를 책임진 경험을 구체적으로 보여주세요.", sourceQuote: "아이디어부터 출시, 개선까지 전체 제품 생애주기를 담당하며, B2B/B2C 두 사용자 그룹 간 커뮤니케이션 문제를 해결합니다." },
    { title: "다국어·다문화 UX 설계 경험", body: "다국어·다문화 맥락을 고려해 AI 기반 서비스의 UX를 설계해본 경험을 보여주세요.", sourceQuote: "AI 기반 고객 서비스 영역의 UX를 정의하고, 한국어/일본어/영어 등 다국어·다문화 맥락을 고려해 디자인합니다." },
    { title: "글로벌 수준 UI 구현 역량", body: "글로벌 서비스 수준의 완성도 높은 UI를 구현한 결과물을 포트폴리오에 담아주세요.", sourceQuote: "글로벌 수준의 완성도 높은 UI 구현 능력" },
  ],
  cmrf58rt0000eig1v4ida4v5f: [
    { title: "인터랙션 기반 사용성 문제 해결", body: "인터랙션 디자인으로 실제 사용성 문제를 해결한 구체적인 사례를 보여주세요.", sourceQuote: "카카오 서비스 전반의 사용성 문제를 인터랙션 디자인을 통해 해결" },
    { title: "재사용 가능한 인터랙티브 컴포넌트 설계", body: "여러 서비스에 적용 가능한 인터랙티브 컴포넌트를 설계·제작해본 경험을 보여주세요.", sourceQuote: "카카오톡을 중심으로 다양한 서비스에 적용 가능한 인터랙티브 컴포넌트 설계 및 제작" },
    { title: "인터랙션 디자인 툴 활용 역량", body: "Figma, Lottie, After Effects 등으로 인터랙션을 직접 구현해본 작업물을 보여주세요.", sourceQuote: "Interaction Design을 위한 툴 사용이 능숙하신 분 (Figma, Photoshop, Illustrator, Lottie, After Effects)" },
  ],
  cmrf58zc0000nig1v9lf3pit2: [
    { title: "모바일 웹 커머스 화면 설계 경험", body: "모바일 웹 커머스 화면을 직접 설계하고 사용자 경험을 개선해본 경험을 보여주세요.", sourceQuote: "모바일 웹 커머스 화면을 설계하고 사용자 경험을 개선해요." },
    { title: "디자인 QA 진행 경험", body: "의도한 UX/UI대로 구현됐는지 디자인 QA를 진행해본 경험을 구체적으로 적어주세요.", sourceQuote: "신규 기능과 개선 사항이 의도한 사용자 경험(UX/UI)으로 구현될 수 있도록 디자인 QA를 진행해요." },
    { title: "구조적인 화면 설계 역량", body: "모바일 웹 환경을 이해하고 사용자 중심의 구조적인 화면을 설계한 사례를 보여주세요.", sourceQuote: "모바일 웹 환경에 대한 이해를 바탕으로 사용자 중심의 구조적인 화면을 설계할 수 있으신 분" },
  ],
  cmrf58wuv000kig1vqupng45j: [
    { title: "PDP·배너 제작 경험", body: "Photoshop, Figma 등으로 상품 상세페이지와 메인 배너를 직접 제작해본 경험을 보여주세요.", sourceQuote: "Photoshop, Figma 등 디자인 툴을 활용해 지그재그 쇼핑몰의 상품 상세페이지(PDP)와 메인 비주얼 배너를 제작해요." },
    { title: "생성형 AI 툴 실무 활용 경험", body: "생성형 AI 디자인 툴로 반복 작업을 효율화해본 경험을 구체적으로 보여주세요.", sourceQuote: "생성형 AI 디자인 툴을 적극 활용해 반복적인 제작 업무를 효율화하고, 다양한 디자인 결과물을 빠르게 제작해요." },
    { title: "커머스·웹 디자인 포트폴리오", body: "커머스·웹 디자인 실무 경험이나 완성도 높은 포트폴리오를 함께 보여주세요.", sourceQuote: "커머스/웹 디자인 관련 실무 경험이 있거나, 관련 분야에서 완성도 높은 포트폴리오를 보유하신 분" },
  ],
  cmrf2o9gq000to259epe818s3: [
    { title: "제품 전체 오너십 경험", body: "제품 UX/UI의 A to Z를 오너십을 가지고 주도해본 경험을 구체적으로 보여주세요.", sourceQuote: "포스티 프로덕트 디자인에 대한 완전한 오너십을 발휘하며 UX/UI의 A to Z를 주도하고, 서비스 전체의 디자인 퀄리티를 책임져요." },
    { title: "복잡한 커머스 도메인 주도 경험", body: "탐색, 추천, 결제 등 복잡한 커머스 도메인을 깊이 이해하고 전 과정을 주도한 경험을 보여주세요.", sourceQuote: "탐색, 추천, 결제 등 복잡한 커머스 도메인의 특성과 비즈니스 구조를 깊이 이해하고 전 과정을 주도적으로 이끌 수 있는 분" },
    { title: "디자인 결정 설득 경험", body: "디자인의 가치를 논리적으로 설명하고 다양한 직군을 설득한 경험을 구체적으로 적어주세요.", sourceQuote: "디자인의 가치를 설득력 있게 전달하실 수 있는 분" },
  ],
  cmrf58uaw000hig1vz3ghg0zj: [
    { title: "IP 기반 상품 기획·디자인 경험", body: "아티스트나 작품 등 IP 특성을 살려 실제 상품으로 기획·디자인해본 경험을 보여주세요.", sourceQuote: "아티스트 및 공연/드라마 등 IP 특성을 살린 상품 기획 및 디자인" },
    { title: "외부 파트너 관리 경험", body: "외부 에이전시나 프리랜서를 발굴하고 작업물을 관리해본 경험이 있다면 구체적으로 적어주세요.", sourceQuote: "외부 파트너(에이전시/프리랜서) 발굴 및 디자인 작업물 관리" },
    { title: "브랜딩·그래픽 디자인 실무 경력", body: "3년 이상의 브랜딩·그래픽 디자인 실무 경력을 상품 디자인 사례로 보여주세요.", sourceQuote: "3년 이상의 브랜딩/그래픽 디자인 관련 실무 경험 및 상품 디자인 경력을 갖춘 분" },
  ],
  cmret0ose000042w7tz74eesh: [
    { title: "지표 기반 서비스 고도화 경험", body: "주요 지표를 분석해 개선 아이디어를 발굴하고 실험으로 검증한 경험을 수치와 함께 보여주세요.", sourceQuote: "담당 서비스의 주요 지표를 분석하여 개선 아이디어를 발굴하고, 실험과 검증 과정을 통해 서비스를 고도화합니다." },
    { title: "복잡한 정책 구조화 UI 설계 경험", body: "복잡한 기술·정책을 이해하고 구조화된 UI로 풀어낸 설계 경험을 구체적으로 보여주세요.", sourceQuote: "복잡한 기술 및 정책에 대한 이해를 바탕으로 한 구조화된 UI와 일관된 UX 설계 경험" },
    { title: "광고 소재 가이드라인 수립 경험", body: "실제 집행되는 광고 소재의 가이드라인을 수립하고 관리해본 경험이 있다면 적어주세요.", sourceQuote: "실제 집행되는 광고 소재들의 가이드라인을 수립하고 유지 및 보수 업무를 담당합니다." },
  ],
  cms7ju1d00001126ino8f4tt5: [
    { title: "디자인 시스템 에셋 관리 경험", body: "아이콘, 컴포넌트, 라이브러리 등 디자인 시스템 에셋을 제작·정리해본 경험을 보여주세요.", sourceQuote: "디자인 시스템 에셋 관리 (아이콘·컴포넌트·라이브러리 제작 및 정리)" },
    { title: "Figma 컴포넌트·라이브러리 활용 능력", body: "Figma의 컴포넌트, 오토레이아웃, 라이브러리를 자유롭게 다룬 작업물을 보여주세요.", sourceQuote: "Figma 디자인 툴 활용 능력이 뛰어난 분(컴포넌트·오토레이아웃·라이브러리 자유롭게 활용)" },
    { title: "정교한 그래픽 작업 역량", body: "높은 조형 감각으로 정교하게 완성한 그래픽 작업물을 포트폴리오에 담아주세요.", sourceQuote: "높은 조형 감각과 정교한 그래픽 작업이 가능한 분" },
  ],
  cmrf2nqii000co259ojnpursx: [
    { title: "주요 사용자 접점 프로덕트 디자인 경험", body: "홈, 검색, 상품 상세, 주문, 회원 등 핵심 접점을 다뤄본 경험을 구체적 사례로 보여주세요.", sourceQuote: "컬리몰 주요 사용자 접점(홈, 검색, 상품 상세, 주문, 회원 등)에 대한 프로덕트 디자인" },
    { title: "프로토타입 기반 빠른 검증 경험", body: "아이디어를 구체화해 Prototype으로 빠르게 검증한 과정을 보여주세요.", sourceQuote: "창의적인 관점에서 아이디어를 구체화시키고, Prototype으로 빠르게 검증 가능하신 분" },
    { title: "데이터·리서치 기반 개선 경험", body: "데이터와 리서치를 근거로 서비스를 지속적으로 개선한 경험을 강조하세요.", sourceQuote: "데이터와 리서치를 기반으로 지속적인 서비스 개선 경험이 있으신 분" },
  ],
  cmrf2nj350007o259xj20kqmm: [
    { title: "전사 UX Writing 품질 관리 경험", body: "여러 서비스 영역의 라이팅 퀄리티를 개선한 경험을 구체적으로 보여주세요.", sourceQuote: "컬리, 컬리페이, 배송/물류 등 컬리 전반 서비스의 Writing 퀄리티 개선" },
    { title: "생성형 AI 실무 활용 경험", body: "생성형 AI를 실무에 어떻게 적극 활용했는지 사례로 보여주세요.", sourceQuote: "ChatGPT, Claude, Gemini 등 생성형 AI를 실무에 적극적으로 활용해 본 경험이 있으신 분" },
    { title: "지표 기반 라이팅 성과 분석 경험", body: "CTR, CVR 같은 지표로 라이팅 성과를 분석하고 개선한 경험을 수치와 함께 보여주세요.", sourceQuote: "CTR, CVR 등 주요 지표를 기반으로 Writing 성과를 분석하고 개선해 본 경험이 있으신 분" },
  ],
  cmremdpw5000113jijdvv6xwz: [
    { title: "디자인 시스템 활용 경험", body: "디자인 시스템을 실제로 활용해 작업한 경험을 구체적으로 보여주세요.", sourceQuote: "디자인 시스템을 활용한 작업 경험이 있으신 분" },
    { title: "논리적 디자인 설득 경험", body: "본인의 디자인 결정을 논리적으로 설명하고 설득한 과정을 보여주세요.", sourceQuote: "본인의 디자인을 논리적으로 표현하실 수 있는 분" },
    { title: "데이터 기반 디자인 개선 경험", body: "데이터를 근거로 디자인을 개선한 구체적인 사례를 보여주세요.", sourceQuote: "데이터를 기반으로 디자인을 개선한 경험이 있으신 분" },
  ],
  cmremq93i0001122dft76yfgy: [
    { title: "B2B SaaS 디자인 전 과정 리드 경험", body: "리서치부터 UI 구현까지 B2B SaaS 서비스를 엔드투엔드로 리드한 경험을 보여주세요.", sourceQuote: "사용자 리서치부터 서비스 UI/UX 최종 구현까지 B2B SaaS 서비스 디자인 전 과정 리드" },
    { title: "정량·정성 데이터 기반 개선 제안", body: "정량·정성 데이터를 근거로 UX 개선안을 제안한 과정을 구체적으로 보여주세요.", sourceQuote: "정량·정성 데이터를 기반으로 사용자 경험 개선안을 제안한 경험이 있는 분" },
    { title: "복잡한 정보의 화면 설계 경험", body: "복잡한 정보나 데이터를 이해하기 쉬운 화면으로 정리한 경험을 보여주세요.", sourceQuote: "복잡한 정보를 사용자가 이해하기 쉬운 화면으로 정리해본 경험이 있으신 분" },
  ],
  cms7ug7zw000n8bjaqhr9ygqx: [
    { title: "디자인팀 리드 및 멘토링 경험", body: "여러 디자이너를 이끌며 기획부터 개발까지 전 과정을 책임진 경험을 보여주세요.", sourceQuote: "2~5명의 다른 디자이너 분들을 이끌며 Design Thinking을 바탕으로 Ideation부터 최종 개발 단계까지, 프로덕트 제작의 전 과정을 책임집니다" },
    { title: "As-is 문제 발굴 및 개선 제시", body: "기존 프로덕트의 문제를 발굴하고 우선순위를 정해 개선 방향을 제시한 경험을 보여주세요.", sourceQuote: "As-is 프로덕트, 서비스의 문제점을 발굴하고 분석하여 개선 방향을 우선 순위로 제시" },
    { title: "정성·정량 데이터 기반 방향성 제시", body: "정성·정량 데이터를 근거로 디자인 방향성을 제시한 경험을 구체적으로 보여주세요.", sourceQuote: "비즈니스 요구 사항을 이해하고, 정성적, 정량적 데이터를 근거로 활용하여 디자인의 방향성을 제시할 수 있습니다" },
  ],
  cmruyqf5v000b29o433dqwya8: [
    { title: "프로모션·캠페인 페이지 제작 경험", body: "프로모션이나 캠페인 페이지를 기획부터 제작까지 담당한 경험을 보여주세요.", sourceQuote: "쿠팡 내 프로모션, 캠페인 페이지 등 주요 디자인 기획/제작" },
    { title: "상품 상세 페이지 디자인 경험", body: "커머스 상품 상세 페이지를 디자인한 경험을 구체적으로 보여주세요.", sourceQuote: "로켓프레시 및 로켓배송 상품 상세 페이지 디자인" },
    { title: "디자인 프로젝트 리드 경험", body: "디자인 프로젝트 전체 프로세스를 리드하며 팀의 결과물 퀄리티를 높인 경험을 보여주세요.", sourceQuote: "디자인 프로젝트의 전체 프로세스를 리드하며, 팀 내 크리에이티브 퀄리티 향상" },
  ],
  cmrd7oi9c0009udb5dlvbk46o: [
    { title: "실무형 디자인 리더십 경험", body: "디자인 문제를 실무형 리더로서 직접 해결한 사려 깊은 프로세스와 결과물을 보여주세요.", sourceQuote: "리더가 디자인 문제를 해결할 때 사려 깊은 프로세스, 세련된 디자인, 고객 중심 관점을 보여주는 숙련된 디자이너가 되기를 기대합니다" },
    { title: "인사이트-UI 엔드투엔드 경험", body: "인사이트 추출부터 UI 디자인까지 전체 프로세스를 주도한 경험을 보여주세요.", sourceQuote: "인사이트 추출, 사용자 여정 생성, 와이어프레임부터 UI 디자인까지 디자인 프로세스를 엔드 투 엔드로 주도하는 능력 있으신 분" },
    { title: "A/B 테스트 기반 최적화 경험", body: "지표를 기반으로 A/B 테스트를 수행해 제품을 최적화한 경험을 수치와 함께 보여주세요.", sourceQuote: "지표 기반 반복 개선 및 A/B 테스트 수행을 통한 제품 최적화" },
  ],
  cmrd7oi8u0008udb5uinwst7r: [
    { title: "전사 전략 과제 리드 경험", body: "우선순위 높은 전사 프로젝트를 주도해 비즈니스 성장을 견인한 경험을 보여주세요.", sourceQuote: "우선순위 높은 전사 프로젝트를 주도하고, 프로덕트 디자인의 성숙도와 비즈니스 성장을 견인하여" },
    { title: "리더급 이해관계자와의 협업 경험", body: "여러 조직의 리더급 이해관계자와 협업해 릴리즈 전략을 정의한 경험을 보여주세요.", sourceQuote: "여러 조직에 걸친 리더급 이해관계자(UX, 프로덕트, 엔지니어링, 마케팅, 운영, 풀필먼트 등)와 긴밀히 협업하여 신규 상품 카테고리의 릴리즈 전략을 정의합니다" },
    { title: "데이터 기반 디자인 의사결정 경험", body: "데이터와 정량 연구를 활용해 디자인 의사결정의 근거를 제공한 경험을 보여주세요.", sourceQuote: "데이터와 정량적 연구 방법론을 활용하여 프로덕트 디자인 프로세스/주기 전반에 걸친 의사결정의 근거를 제공한 경험을 보유한 분" },
  ],
  cmrd7oi8b0007udb57orq7s2p: [
    { title: "브랜드 시스템 정립 및 에셋 구축 경험", body: "브랜드 시스템을 정립하고 에셋·가이드를 구축한 경험을 보여주세요.", sourceQuote: "쿠팡 기업 및 코어 이커머스에 관련된 다양한 비즈니스와 브랜드들의 브랜드 시스템 정립 및 에셋 구축, 브랜드 자산을 관리하기 위한 가이드을 제작" },
    { title: "리브랜딩·신규 브랜딩 구축 경험", body: "여러 브랜드 요소를 제작해 새 브랜드를 구축하거나 리브랜딩한 경험을 보여주세요.", sourceQuote: "로고, 타이포그래피, 사진, 아이콘, 일러스트레이션 등 여러 브랜드 요소를 제작하며 새로운 브랜딩를 구축하거나 리브랜딩한 경험" },
    { title: "AI 툴 활용 디자인 프로세스 구축", body: "AI 툴을 활용해 디자인 프로세스를 구축하고 결과물을 만들어낸 경험을 보여주세요.", sourceQuote: "다양한 AI 툴을 활용하여 디자인 프로세스를 구축하고 결과물을 도출할 수 있는 능력" },
  ],
  cmrd7oi7t0006udb5ea7kth8n: [
    { title: "AI 활용 디자인 워크플로우 설계", body: "모호한 비즈니스 목표를 AI 기반 디자인 워크플로우 로드맵으로 구체화한 경험을 보여주세요.", sourceQuote: "Translate ambiguous business goals into a concrete multi-year roadmap for AI-assisted design workflows." },
    { title: "생성형 AI 인터랙션 설계 경험", body: "LLM 인터페이스나 생성형 UI 등 새로운 AI 인터랙션 패턴을 설계한 경험을 보여주세요.", sourceQuote: "Define new interaction paradigms for AI (LLM interfaces, generative UI, and predictive workflows)." },
    { title: "코드 기반 프로토타이핑 능력", body: "코드를 활용해 툴을 만들거나 API와 상호작용한 경험을 구체적으로 보여주세요.", sourceQuote: "Ability to write code (React, Python, or CSS/HTML) to build tools or interact with APIs." },
  ],
  cmrd7oi7b0005udb5llfnmlzq: [
    { title: "핀테크 서비스 엔드투엔드 경험", body: "아이데이션부터 UI 디자인, 개발 협업까지 전 과정을 엔드투엔드로 책임진 경험을 보여주세요.", sourceQuote: "아이데이션과 설계, UI 디자인, 개발 조직과의 협업까지 전 과정의 end to end 업무를 수행하며, 프로덕트 제작의 전 과정을 책임집니다" },
    { title: "다양한 고객군 고려한 설계 경험", body: "서로 다른 고객군의 특성을 함께 고려해 효과적인 디자인을 제안한 경험을 보여주세요.", sourceQuote: "구매 고객 뿐만 아니라 판매자까지 다양한 고객의 특성을 고려하고 비즈니스 요구사항을 이해하여 가장 효과적인 디자인을 제안합니다" },
    { title: "데이터 기반 설득력 있는 전략 제시", body: "정성·정량 데이터를 기반으로 체계적인 전략을 제시하고 팀을 설득한 경험을 보여주세요.", sourceQuote: "정성적, 정량적 데이터를 기반으로 체계적으로 사고하며 설득력있는 전략을 제시합니다" },
  ],
  cmsdbwoqm0007la1fi8sha6mn: [
    { title: "콘텐츠 아트웍 제작 경험", body: "배너, 포스터 등 콘텐츠 노출 영역의 아트웍을 제작한 경험을 구체적으로 보여주세요.", sourceQuote: "TVING 서비스 내 콘텐츠 노출 영역 전반의 배너, 포스터 등 아트웍 전반 제작" },
    { title: "비주얼 가이드라인 구축 경험", body: "콘텐츠나 스포츠 아트웍의 비주얼 가이드라인을 구축하고 적용한 경험을 보여주세요.", sourceQuote: "콘텐츠 / 스포츠 아트웍의 비주얼 가이드라인 구축 및 적용" },
    { title: "주니어 디자이너 아트 디렉션 경험", body: "주니어 디자이너의 작업을 검수하고 아트 디렉션한 경험을 보여주세요.", sourceQuote: "주니어 디자이너 작업 검수 및 아트 디렉션" },
  ],
  cmrehpwgj0002qjgco9zyjzsz: [
    { title: "웹·앱 프로덕트 UI/UX 설계 경험", body: "메신저, 영상통화, 후원 등 다양한 기능을 가진 웹·앱 프로덕트의 UI/UX를 설계한 경험을 보여주세요.", sourceQuote: "SNS 인플루언서와 사용자 간 메신저, 영상통화, 후원 서비스 등 웹·앱 기반 프로덕트의 UI/UX 설계 및 디자인에 참여 (LIKEY)" },
    { title: "디자인 의도 전달 및 협업 능력", body: "개발자, PM 등 다양한 직군에게 디자인 의도를 명확히 전달하며 협업을 이끈 경험을 보여주세요.", sourceQuote: "개발자, PM 등 다양한 직군과 적극적으로 소통하며 디자인 의도를 명확하게 전달하고 협업을 이끌어감" },
    { title: "기획부터 출시까지 참여 경험", body: "서비스나 기능을 기획 단계부터 출시까지 주도적으로 참여한 경험을 보여주세요.", sourceQuote: "하나의 서비스 또는 기능을 기획부터 출시까지 경험해본 분" },
  ],
  cmrehq5qx0005qjgckf4m1sm1: [
    { title: "가설 수립·검증 통한 제품 개선", body: "데이터를 기반으로 문제를 정의하고 가설을 세워 검증한 제품 개선 경험을 보여주세요.", sourceQuote: "정량/정성 데이터를 기반으로 문제를 정의하고 가설 수립과 검증을 통해 제품을 개선합니다." },
    { title: "구조적 사고 정리 능력", body: "문제 정의부터 스펙까지 구조적으로 정리한 사고 과정을 보여주세요.", sourceQuote: "뛰어난 추상화 능력으로 Problem → Concept → Spec 흐름을 구조적으로 정리할 수 있는 분" },
    { title: "디자인부터 개발까지 전담한 경험", body: "디자인에서 멈추지 않고 AI를 활용해 직접 화면을 구현·배포까지 해본 경험을 보여주세요.", sourceQuote: "디자인에서 멈추지 않고, AI를 활용해 직접 만들어보는 것을 즐기시는 분" },
  ],
  cmrernd030000a37pmoxemnvj: [
    { title: "PDP·프로모션 에셋 제작 경험", body: "상세페이지와 프로모션 에셋을 기획부터 제작까지 담당한 경험을 보여주세요.", sourceQuote: "PDP(상세페이지) 및 온라인 프로모션 에셋 기획·디자인·개발" },
    { title: "채널별 콘텐츠 운영 경험", body: "자사몰 및 여러 채널의 콘텐츠를 제작하고 운영 대응한 경험을 보여주세요.", sourceQuote: "자사몰/채널별(올리브영, 카카오 등) 콘텐츠 제작 및 운영 대응" },
    { title: "제품 촬영 현장 지원 경험", body: "제품 촬영 현장에서 소품, 모델 어레인지 등을 지원한 경험을 보여주세요.", sourceQuote: "촬영 업무 지원: 제품 촬영 시 소품, 모델 어레인지 및 현장 감리 지원" },
  ],
  cmreixcex0000apbfttveasbh: [
    { title: "데이터 기반 서비스 개선 경험", body: "데이터 수집과 분석으로 사용자 경험 중심의 서비스 개선을 이끈 경험을 보여주세요.", sourceQuote: "데이터 수집 및 분석을 통해 사용자 경험 중심으로 서비스를 개선한 경험이 있는 분" },
    { title: "브랜드 가이드 제작 및 유지 경험", body: "서비스만의 디자인 가이드를 제작하고 지속적으로 관리한 경험을 보여주세요.", sourceQuote: "패스오더 디자인 가이드를 제작하여 패스오더만의 브랜드, 서비스 경험을 전달하기 위해 디자인을 관리하고 유지해요" },
    { title: "초기 기획부터 운영까지 참여 경험", body: "프로젝트 초기 기획부터 운영, 개선까지 전 과정에 참여한 경험을 보여주세요.", sourceQuote: "프로젝트의 초기 기획부터 참여하여 구축, 운영, 개선, 모니터링까지 경험해보신 분" },
  ],
  cmsjzd86b0007mmwnu4sbgfg7: [
    { title: "이벤트·기획전 페이지 디자인 경험", body: "온라인 이벤트나 기획전 페이지를 디자인한 경험을 구체적으로 보여주세요.", sourceQuote: "온라인 이벤트, 기획전, 프로모션 페이지 디자인" },
    { title: "마케팅팀과의 협업 경험", body: "마케팅·영업 담당자와 긴밀히 협업해 결과물을 만들어낸 경험을 보여주세요.", sourceQuote: "마케팅 및 영업 담당자와 긴밀하게 협업하며, 플랫폼의 브랜드 경쟁력과 사용자 경험을 함께 만들어갈 분을 기다립니다" },
    { title: "브랜드 가이드 기반 디자인 운영", body: "브랜드 가이드에 맞춰 디자인을 운영하고 유지관리한 경험을 보여주세요.", sourceQuote: "브랜드 가이드에 맞는 디자인 운영 및 유지관리" },
  ],
  cmrlhbeeg000wvkz68a8tmc7i: [
    { title: "복잡한 정보 구조 설계 경험", body: "복잡한 정보 구조와 과업을 논리적으로 정리해 설계한 경험을 보여주세요.", sourceQuote: "복잡한 정보 구조와 과업을 논리적으로 구조화할 수 있는 분" },
    { title: "모바일 UI 패턴 적용 경험", body: "모바일 앱의 범용적인 UI 패턴을 실제로 적용한 경험을 보여주세요.", sourceQuote: "모바일 앱의 범용적인 UI 패턴을 숙지하고 적용할 수 있는 분" },
    { title: "정성·정량 리서치 기반 문제 이해", body: "리서치와 고객 피드백을 바탕으로 본질적인 문제를 파악한 경험을 보여주세요.", sourceQuote: "정성/정량 리서치와 고객 피드백을 바탕으로 진짜 문제를 이해해 감동을 주는 디자인을 만듭니다" },
  ],
  cmrlhb8ps000svkz6ywiryljc: [
    { title: "복잡한 도메인의 제품 모델링 경험", body: "복잡한 도메인의 규칙과 관계를 제품 모델로 번역한 경험을 보여주세요.", sourceQuote: "복잡한 도메인의 규칙과 관계를 제품 모델로 번역할 수 있는 분" },
    { title: "AI 결과물 비판적 검토 능력", body: "AI가 제시한 결과물을 비판적으로 검토하고 방향을 제시한 경험을 보여주세요.", sourceQuote: "AI 결과물을 비판적으로 검토하고 방향을 제시할 수 있는 분" },
    { title: "여러 맥락 제품 통합 설계 경험", body: "서로 다른 맥락의 제품을 하나로 통합 설계한 경험을 보여주세요.", sourceQuote: "여러 맥락의 제품을 통합 설계해본 경험" },
  ],
  cmremv8l8000014i3g9w92bil: [
    { title: "다양한 플랫폼 UX 리서치 경험", body: "모바일, PC, 차량 등 다양한 플랫폼에서 리서치부터 화면 설계까지 수행한 경험을 보여주세요.", sourceQuote: "Mobile, PC, Car 등의 사용자 경험을 위한 리서치, 화면 설계, 사용자 평가, 기획, 전략 업무를 담당하게 됩니다." },
    { title: "사용자 평가 기반 전략 수립 능력", body: "사용자 평가를 기반으로 기획하고 전략을 수립한 경험을 보여주세요.", sourceQuote: "사용자 평가, 기획, 전략 업무" },
    { title: "폭넓은 분야 UX 전문성", body: "다양한 제품·서비스 영역에서 쌓은 UX 전문성을 구체적 사례로 보여주세요.", sourceQuote: "해당 분야의 경험이나 전문성을 반드시 필요로 합니다" },
  ],
  cmrng9dyo0005qjj2a2dwfdee: [
    { title: "커머스 UX 구조 설계 경험", body: "커머스 서비스의 UX 구조와 정보구조를 설계한 경험을 구체적으로 보여주세요.", sourceQuote: "웹/모바일 커머스 서비스의 UX 구조 설계, 사용자 흐름(User Flow) 및 정보구조(IA) 기획" },
    { title: "IA·Wireframe 산출물 작성 경험", body: "IA, User Flow, Wireframe 등 UX 산출물을 작성한 경험을 보여주세요.", sourceQuote: "IA, User Flow, Wireframe, 기능 정의서(PRD) 작성" },
    { title: "주요 기능 화면 설계 경험", body: "상품 탐색부터 구매까지 주요 영역의 UX와 인터랙션을 설계한 경험을 보여주세요.", sourceQuote: "상품 탐색, 상세, 구매, 마이페이지 등 주요 영역 UX 설계, 사용자 편의성을 고려한 기능 및 인터랙션 정의" },
  ],
  cmrkfijsd00026jwjh85taiqz: [
    { title: "앱 UI·비주얼 에셋 제작 경험", body: "앱 전반의 UI와 비주얼 에셋을 제작하고 디자인 템플릿을 개발한 경험을 보여주세요.", sourceQuote: "더현대 HI 앱의 전반적인 UI 디자인, 비주얼 에셋 제작 및 플랫폼 일관성을 위한 디자인 템플릿을 개발합니다" },
    { title: "프로모션 페이지 비주얼 기획 경험", body: "프로모션/콘텐츠 페이지를 비주얼 기획부터 레이아웃까지 제작한 경험을 보여주세요.", sourceQuote: "프로모션/콘텐츠 페이지의 비주얼 기획부터 레이아웃 디자인까지 브랜드에 맞는 비주얼을 제작하고" },
    { title: "디자인 가이드라인 수립 경험", body: "디자인 가이드라인을 수립해 결과물 품질을 관리하고 개선한 경험을 보여주세요.", sourceQuote: "디자인 가이드라인을 수립해 플랫폼 전반의 결과물 품질을 관리하고 지속적으로 개선합니다" },
  ],
  cmrf6f5xu0008po75zf96nx2j: [
    { title: "UX 방향성 수립 경험", body: "시장·고객 행태 분석을 바탕으로 UX 방향성과 사용 시나리오를 정의한 경험을 보여주세요.", sourceQuote: "UX 방향성 수립: 모빌리티 시장 및 트렌드 분석, 비즈니스 이해와 고객 행태 분석을 통한 유저 정의, 해결할 문제 및 사용 시나리오 정의" },
    { title: "Workflow·Wireframe 설계 경험", body: "Workflow와 Wireframe을 설계해 신규 서비스를 런칭한 경험을 보여주세요.", sourceQuote: "Workflow 정의 및 Wireframe 설계, 신규 서비스 런칭 및 데이터 기반 UX 고도화" },
    { title: "정량/정성 리서치 설계 경험", body: "사용자 행태 분석을 위한 정량·정성 리서치를 직접 설계하고 수행한 경험을 보여주세요.", sourceQuote: "사용자 행태 및 서비스 분석을 위한 정량/정성 리서치 설계 및 수행 경험을 보유하신 분" },
  ],
  cmrf6f3dz0005po757194uwvt: [
    { title: "데이터 시각화 대시보드 기획 경험", body: "서비스 지표를 시각화하는 대시보드나 리포트 템플릿을 기획한 경험을 보여주세요.", sourceQuote: "서비스 지표 시각화 대시보드 및 자동 리포트 템플릿 기획, 교통 취약도·접근성 분석 기능 설계" },
    { title: "관제 시스템 기획 경험", body: "매칭·스케줄링·모니터링 같은 핵심 운영 기능을 기획한 경험을 보여주세요.", sourceQuote: "수요-공급 매칭, 운행 스케줄링, 차량 모니터링 등 플랫폼 핵심 운영 기능 기획 및 관리" },
    { title: "와이어프레임·UI 설계 경험", body: "프로토타이핑 툴로 와이어프레임과 UI를 설계한 경험을 구체적으로 보여주세요.", sourceQuote: "Figma, Adobe XD 등 프로토타이핑 툴을 활용한 와이어프레임 및 UI 설계 경험을 보유하신 분" },
  ],
  cmrf6f0jt0002po75d9unpido: [
    { title: "디자인 시스템 구축·운영 경험", body: "디자인 가이드라인과 UI 컴포넌트를 설계·문서화한 경험을 보여주세요.", sourceQuote: "디자인 시스템 구축 및 운영: 모빌리티 서비스의 디자인 가이드라인, UI 컴포넌트, 패턴 설계 및 문서화" },
    { title: "개발 협업 프로세스 체계화 경험", body: "개발 파트와의 협업 프로세스를 체계화해 디자인 시스템을 지속적으로 개선한 경험을 보여주세요.", sourceQuote: "개발 파트와의 협업 프로세스 체계화를 통한 디자인 시스템의 일관된 운영 및 지속적 개선 수행" },
    { title: "사용성 검증 기반 개선 경험", body: "정성·정량 데이터로 사용성을 검증하고 개선 방안을 제시한 경험을 보여주세요.", sourceQuote: "정성적/정량적 데이터 수집 및 분석을 통한 사용성 검증 및 개선 방안 제시" },
  ],
  cmrlhbqvl0018vkz6riruil5u: [
    { title: "광고 소재·SNS 콘텐츠 제작 경험", body: "광고 소재나 SNS 콘텐츠 등 서비스 소개 콘텐츠를 디자인한 경험을 보여주세요.", sourceQuote: "광고 소재, 서비스 소개서, SNS 콘텐츠 등 챌린저스 소개 콘텐츠 디자인" },
    { title: "지표 기반 콘텐츠 실험 경험", body: "클릭률, 전환율 같은 지표를 기준으로 콘텐츠를 실험하고 성공 방식을 찾은 경험을 보여주세요.", sourceQuote: "클릭률/전환율 등 목표 지표 기반으로 새로운 콘텐츠를 실험하고 성공 방식을 찾습니다" },
    { title: "브랜드 가이드라인 관리 경험", body: "브랜드 가이드라인을 정립하고 디자인 에셋을 관리한 경험을 보여주세요.", sourceQuote: "브랜드 가이드라인 정립 및 디자인 에셋 관리" },
  ],
  cmrlhbnln0014vkz65bv316i6: [
    { title: "정량·정성 리서치 기반 우선순위화", body: "정량·정성 리서치로 문제를 분석하고 우선순위를 정해 A/B테스트로 검증한 경험을 보여주세요.", sourceQuote: "정량 데이터와 정성 유저 리서치로 문제를 분석·우선순위화하며, A/B테스트로 가설을 검증합니다" },
    { title: "프로덕트 설계 전 과정 참여 경험", body: "UX/UI 설계부터 프로토타이핑까지 프로덕트 설계 전 과정에 참여한 경험을 보여주세요.", sourceQuote: "UX/UI, 프로토타이핑 등 프로덕트 설계 전 과정" },
    { title: "디자인 시스템 관리·개선 경험", body: "통일된 프로덕트 경험을 위해 디자인 시스템을 관리하고 개선한 경험을 보여주세요.", sourceQuote: "통일된 프로덕트 경험을 위한 디자인 시스템 관리/개선" },
  ],
  cmskq0o820004612ctoqnkfd1: [
    { title: "AI 작업 플로우 엔드투엔드 설계 경험", body: "의도 파악부터 작업 완료까지, 핸드오프·진행 상황 추적·에러 복구까지 포함한 전체 흐름을 설계해본 경험을 보여주세요.", sourceQuote: "Design complete user flows for AI-assisted tasks - from intent capture through to task completion, including handoff, progress tracking, and error recovery." },
    { title: "다양한 AI 상태 UX 설계 경험", body: "로딩·진행·대기·완료·실패·복구 등 AI가 거치는 다양한 상태를 사용자에게 어떻게 보여줄지 설계해본 경험을 보여주세요.", sourceQuote: "Map and design the full range of AI states a user encounters - loading, thinking, acting, waiting, completing, stalling, failing, and recovering." },
    { title: "AI 신뢰·제어 경험 설계 역량", body: "사용자가 AI를 신뢰하고 통제할 수 있다고 느끼게 만드는 피드백·투명성 설계 사례를 보여주세요.", sourceQuote: "Clear thinking about user trust, control, feedback, and transparency in AI-driven product experiences." },
  ],
  cmsnbgyge00021142gf732i23: [
    { title: "가설-검증 반복 개선 경험", body: "문제 정의부터 가설 수립, 데이터 기반 실험, 검증까지 반복하며 서비스를 개선한 과정을 보여주세요.", sourceQuote: "고객의 문제 정의 가설 수립 솔루션 도출 데이터 기반 실험 및 개선 가설 검증 지속적인 반복을 통해 사용자의 문제를 해결하고 서비스를 개선해요." },
    { title: "조형적으로 안정적인 UI 구성 경험", body: "조형적으로 안정적이고 직관적인 화면을 만든 프로젝트를 개선 전후(as-is/to-be) 비교로 보여주세요.", sourceQuote: "조형적 완성도가 뛰어난 App 및 Web UI를 구성할 수 있는 분이 필요해요." },
    { title: "as-is/to-be 개선 포트폴리오", body: "제품 개선 프로젝트라면 개선 전후 화면을 비교할 수 있는 이미지를 포함해서 변화를 명확히 보여주세요.", sourceQuote: "제품 개선 프로젝트의 경우, 개선 전의 화면(as-is)과 개선 후의 화면(to-be)을 잘 확인할 수 있는 이미지가 있으면 더욱 좋아요." },
  ],
  cmsnbhydk00071142cz15ndk0: [
    { title: "복잡한 정책을 화면 구조로 구체화", body: "복잡한 정책과 운영 조건을 사용자 플로우와 화면 구조로 구체화한 경험을 보여주세요.", sourceQuote: "복잡한 정책과 운영 조건을 사용자 플로우와 화면 구조로 구체화합니다." },
    { title: "Figma 디자인 시스템 구축 경험", body: "Figma로 화면과 프로토타입을 설계하고 디자인 시스템을 구축·운영한 경험을 구체적으로 보여주세요.", sourceQuote: "Figma 기반 디자인 시스템 구축·운영 경험이 있는 분 : Figma를 기반으로 화면과 프로토타입을 설계하고, 디자인 시스템을 구축하거나 운영해 보신 분" },
    { title: "프로덕트 설계·출시 경험", body: "기획부터 출시까지 제품 전체를 책임지고 설계해본 경험을 보여주세요.", sourceQuote: "모바일 앱과 웹 기반 프로덕트를 설계하고 실제 서비스 출시까지 연결해 보신 분" },
  ],
  cmsnbio4f000c1142at32083f: [
    { title: "복약 경험 개선 UX·UI 설계", body: "사용자의 복약 경험을 더 편리하고 즐겁게 만든 모바일 앱 UX·UI 설계 사례를 보여주세요.", sourceQuote: "사용자의 복약 경험을 더 편리하고 즐겁게 만드는 모바일 앱 UX·UI를 설계해요" },
    { title: "AI 도구 활용 프로토타입 경험", body: "Figma와 AI 도구를 활용해 빠르게 프로토타입을 만들고 검증한 경험을 보여주세요.", sourceQuote: "Figma로 디자인을 구체화하고 프로토타입을 만들며, AI를 비롯한 새로운 도구를 적극 활용해 다양한 가능성을 빠르게 탐색해요" },
    { title: "표면 너머 원인을 찾는 문제 정의력", body: "사용자의 말과 행동, 피드백을 바탕으로 표면적 현상 너머의 원인을 파악하고 문제를 정의한 경험을 보여주세요.", sourceQuote: "사용자의 말과 행동, 피드백과 제품 데이터 등을 바탕으로 표면적인 현상 너머의 원인을 파악하고, 해결해야 할 사용자 문제를 명확히 정의할 수 있어요" },
  ],
  cmsnbjfl3000h114270uvw3ox: [
    { title: "UX부터 UI까지 전체 프로세스 수행", body: "프로젝트의 UX 설계부터 UI 디자인까지 전반적인 디자인 프로세스를 수행한 경험을 보여주세요.", sourceQuote: "프로젝트의 UX 설계부터 UI 디자인까지 전반적인 디자인 프로세스 수행" },
    { title: "디자인 시스템 구축·운영 경험", body: "디자인 시스템과 UI 가이드를 구축하고 운영한 경험을 구체적으로 보여주세요.", sourceQuote: "디자인 시스템 및 UI Guide 구축·운영" },
    { title: "디자인 의도를 논리적으로 설명하는 역량", body: "본인의 디자인 의도와 근거를 논리적으로 설명한 경험을 포트폴리오에 담아주세요.", sourceQuote: "자신의 디자인 의도와 근거를 논리적으로 설명할 수 있는 분" },
  ],
  cmsnbkhcj000m1142w4nlcxcx: [
    { title: "B2B SaaS UI/UX 전략 수립 경험", body: "B2B SaaS 프로덕트의 UI/UX 전략을 수립하고 실행한 경험을 보여주세요.", sourceQuote: "B2B SaaS 프로덕트의 UI/UX 전략 수립 및 실행 (라이브 커머스 위젯, 브랜드사용 대시보드 등)" },
    { title: "글로벌 고객사향 디자인 시스템 운영", body: "여러 글로벌 고객사에 유연하게 적용되는 디자인 시스템을 구축·운영한 경험을 보여주세요.", sourceQuote: "Shoplive의 글로벌 고객사를 위해 유연하게 적용되는 디자인 시스템 구축 및 운영" },
    { title: "프로덕트 리드 및 성과 검증 경험", body: "하나의 프로덕트나 기능을 처음부터 끝까지 리드하고 출시 후 성과로 검증한 경험을 보여주세요.", sourceQuote: "하나의 프로덕트/기능을 처음부터 끝까지 리드하고, 출시 후 성과로 검증하며 개선한 경험" },
  ],
  cmsnbky10000r1142d0nwpp9w: [
    { title: "쇼핑 여정 UX 구조 개선 경험", body: "상품 탐색부터 구매 결정까지 이어지는 쇼핑 여정 전반의 UX 구조를 개선한 경험을 보여주세요.", sourceQuote: "상품 탐색부터 비교, 구매 결정까지 이어지는 쇼핑 여정 전반의 UX 구조 개선" },
    { title: "크로스플랫폼 화면 설계 경험", body: "모바일웹·APP(iOS/AOS) 크로스플랫폼 화면을 설계하고 인터랙션을 정의한 경험을 보여주세요.", sourceQuote: "모바일웹·APP(iOS/AOS) 크로스플랫폼 화면 설계 및 인터랙션 정의" },
    { title: "디자인 시스템 컴포넌트 운영 경험", body: "디자인 시스템을 구축하고 UI 컴포넌트를 설계·운영한 경험을 구체적으로 보여주세요.", sourceQuote: "디자인 시스템 구축 및 UI 컴포넌트 설계·운영" },
  ],
  cmsm5q0ui0004n9n1rg7zyl0r: [
    { title: "디자인 시스템 구축·운영 경험", body: "UI 컴포넌트와 디자인 시스템을 구축하고 운영한 경험을 구체적으로 보여주세요.", sourceQuote: "Build and maintain UI components and design systems." },
    { title: "픽셀 퍼펙트 협업 경험", body: "제품·엔지니어링과 긴밀히 협업해 완성도 높은 화면을 구현한 경험을 보여주세요.", sourceQuote: "Work closely with product and engineering to deliver pixel-perfect experiences." },
    { title: "비주얼 디자인 포트폴리오", body: "타이포그래피·레이아웃 등 비주얼 디자인 역량이 잘 드러나는 포트폴리오를 준비해주세요.", sourceQuote: "Strong portfolio demonstrating UI design work." },
  ],
  cmsqf7uvy00046n1lenb9sc0x: [
    { title: "AI 인터랙션 프로토타이핑 경험", body: "스트리밍 응답, 멀티스텝 플로우 등 새로운 HCI 인터랙션 모델을 프로토타입으로 만든 경험을 보여주세요.", sourceQuote: "Create functional prototypes of new HCI interaction models, including streaming responses, multi-step task flows, real-time feedback loops, and system state visibility." },
    { title: "프론트엔드 개발 역량", body: "React·TypeScript 등으로 실제 코드까지 구현한 경험을 강조해주세요.", sourceQuote: "Strong frontend engineering skills in React, TypeScript, or equivalent." },
    { title: "디자인-엔지니어링 경계를 넘나든 경험", body: "명확한 핸드오프 없이 디자인과 개발의 경계에서 일한 경험을 보여주세요.", sourceQuote: "Comfort working at the boundary of design and engineering without clear handoffs." },
  ],
  cmsupj0fu0003y9300i1i62ez: [
    { title: "엔드투엔드 디자인 프로세스 주도 경험", body: "인사이트 도출부터 와이어프레임, UI 디자인까지 전체 프로세스를 주도한 경험을 보여주세요.", sourceQuote: "인사이트 추출, 사용자 여정 생성, 와이어프레임부터 UI 디자인까지 디자인 프로세스를 엔드 투 엔드로 주도하는 능력 있으신 분" },
    { title: "데이터 기반 UX 전략 수립 경험", body: "데이터에 기반해 문제를 정의하고 UX 전략을 수립한 사례를 구체적으로 보여주세요.", sourceQuote: "데이터에 기반한 문제 정의 및 UX 전략 수립" },
    { title: "지표 기반 A/B 테스트 개선 경험", body: "지표를 기반으로 반복 개선하고 A/B 테스트를 수행해 제품을 최적화한 경험을 보여주세요.", sourceQuote: "지표 기반 반복 개선 및 A/B 테스트 수행을 통한 제품 최적화" },
  ],

  // 토스뱅크 - UX Researcher
  cmsybnlyc0002rmpikhvbsceb: [
    {
      title: "직접 설계하고 진행한 실무 리서치 경험",
      body: "포트폴리오에는 직접 설계하고 진행했던 실무 프로젝트를 담아주세요. 연구 프로젝트나 사이드 프로젝트보다는 실제 제품에 적용된 사례가 좋아요.",
      sourceQuote:
        "포트폴리오에는 사용자 경험 개선을 위해 직접 리서치를 설계하고 진행했던 실무 프로젝트를 구체적으로 담아주세요. 연구 프로젝트나 사이드 프로젝트는 지원 사례로 적합하지 않아요.",
    },
    {
      title: "문제 정의부터 결과 도출까지의 과정",
      body: "문제 정의, 가설 설정, 리서치 설계와 검증, 결과 도출까지 이어지는 흐름을 구체적으로 설명해주세요. 그 과정에서 배운 점까지 함께 담으면 좋아요.",
      sourceQuote:
        "프로젝트의 문제 정의 - 가설 설정 - 리서치 설계 및 검증 - 결과 도출 과정을 중심으로, 어떻게 목표를 설정하고 어떤 방식으로 리서치를 진행했는지",
    },
    {
      title: "상황에 맞는 리서치 방법론 활용력",
      body: "UT, 심층 인터뷰, FGI, 설문조사 등 상황에 맞는 방법론을 골라 활용한 경험을 보여주세요. 리서치 결과를 팀에 효과적으로 공유해 방향성을 제시했던 사례면 더 좋아요.",
      sourceQuote:
        "상황에 맞는 최적의 리서치 방법론을 사용할 수 있어야 하고, 리서치 결과를 팀에 효과적으로 공유하여 제품의 방향성을 제시할 수 있는 분이 필요해요.",
    },
  ],
  // 토스증권 - UX Researcher
  cmsybo8nn0007rmpicft1hwas: [
    {
      title: "직접 설계하고 진행한 실무 리서치 경험",
      body: "포트폴리오에는 직접 리서치를 설계하고 진행했던 실무 프로젝트를 담아주세요. 연구 프로젝트나 사이드 프로젝트는 지원 사례로 적합하지 않다는 점도 참고해주세요.",
      sourceQuote:
        "포트폴리오에는 사용자 경험 개선을 위해 직접 리서치를 설계하고 진행했던 실무 프로젝트를 구체적으로 담아주세요. 연구 프로젝트나 사이드 프로젝트는 지원 사례로 적합하지 않아요.",
    },
    {
      title: "문제 정의부터 결과 도출까지의 과정",
      body: "문제 정의, 가설 설정, 리서치 설계와 검증, 결과 도출까지 어떤 방식으로 진행했는지 상세히 설명해주세요. 그 과정에서 배운 점도 함께 담아주세요.",
      sourceQuote:
        "프로젝트의 문제 정의 - 가설 설정 - 리서치 설계 및 검증 - 결과 도출 과정을 중심으로, 어떻게 목표를 설정하고 어떤 방식으로 리서치를 진행했는지",
    },
    {
      title: "투자자 맥락을 반영한 설득력 있는 리서치",
      body: "증권업과 투자자에 대한 이해를 바탕으로 UX 의사결정의 근거를 도출하고 팀을 설득했던 경험을 보여주세요. 금융 맥락을 다각적으로 고려한 사례라면 더 좋아요.",
      sourceQuote:
        "새로운 UX 의사결정의 근간을 도출하고 설득할 수 있는 커뮤니케이션 역량이 필요해요.",
    },
  ],
  // 토스 - Design Staff (Product Designer)
  cmsybp8kk000crmpibbwb1838: [
    {
      title: "조직 차원의 문제를 구조화한 경험",
      body: "하나의 제품이 아니라 조직의 방향성과 아젠다를 이해하고, 사용자·비즈니스·조직 관점에서 문제를 구조화해본 경험을 보여주세요.",
      sourceQuote:
        "조직의 방향성과 아젠다를 이해하고, 사용자·비즈니스·조직 관점에서 해결해야 할 문제를 구조화할 수 있어야 해요.",
    },
    {
      title: "개선 전후를 비교한 as-is to-be 구성",
      body: "제품 개선 프로젝트라면 개선 전 화면(as-is)과 개선 후 화면(to-be)을 함께 보여주는 이미지를 준비해주세요. 변화가 한눈에 드러나면 좋아요.",
      sourceQuote:
        "제품 개선 프로젝트의 경우, 개선 전의 화면(as-is)과 개선 후의 화면(to-be)을 잘 확인할 수 있는 이미지가 있으면 더욱 좋아요.",
    },
    {
      title: "디테일까지 완성도 높인 UI 구현력",
      body: "사용성을 놓치지 않으면서도 완성도 높은 App·Web UI를 설계하고 디테일까지 구현해낸 사례를 보여주세요.",
      sourceQuote:
        "사용성을 고려하면서도 높은 완성도의 App·Web UI를 설계하고, 디테일까지 구현해낼 수 있어야 해요.",
    },
  ],
  // 토스증권 - Product Designer
  cmsybq1cq000hrmpi77tm4eaz: [
    {
      title: "데이터 기반으로 발견한 사용자 문제",
      body: "내가 원하는 방향이 아니라 정량·정성 데이터로 파악한 사용자 문제를 개선한 경험을 담아주세요. 그 근거로 직접 설계하고 출시까지 이어간 과정이면 더 좋아요.",
      sourceQuote:
        "내가 원하는 것이 아닌, 사용자가 원하는 것을 정량적·정성적 데이터 기반으로 파악해 개선한 경험이 있는 분이 필요해요.",
    },
    {
      title: "개선 전후를 비교한 as-is to-be 구성",
      body: "제품 개선 프로젝트라면 개선 전 화면(as-is)과 개선 후 화면(to-be)을 함께 보여주는 이미지를 준비해주세요. 변화가 한눈에 드러나면 좋아요.",
      sourceQuote:
        "제품 개선 프로젝트의 경우, 개선 전의 화면(as-is)과 개선 후의 화면(to-be)을 잘 확인할 수 있는 이미지가 있으면 더욱 좋아요.",
    },
    {
      title: "복잡한 정책을 구조화한 UI 설계력",
      body: "복잡한 정보, 기술, 정책을 빠르게 이해하고 구조화된 UI와 일관된 UX로 풀어낸 경험을 보여주세요.",
      sourceQuote:
        "복잡한 정보, 기술, 정책을 빠르게 이해하고 이를 구조화된 UI와 일관성 있는 UX로 설계한 경험이 있으면 좋아요.",
    },
  ],
  // 토스증권 - Product Designer (Japan)
  cmsybrpdy000krmpir12fi6lm: [
    {
      title: "일본 시장에서 사용자 경험을 만든 경험",
      body: "일본 시장에서 서비스를 만들어보거나 일본 사용자 경험을 개선해본 경험을 우선 보여주세요. 현지 시장에 대한 이해가 드러나면 좋아요.",
      sourceQuote:
        "일본 시장에서 서비스를 만들어봤거나, 일본 사용자 경험을 개선해본 경험이 있는 분이 필요해요.",
    },
    {
      title: "현지 리서치를 디자인에 반영한 과정",
      body: "일본 사용자 리서치를 통해 어떤 유저가 어떤 맥락에서 반응하는지 파악하고, 그 인사이트를 디자인에 어떻게 반영했는지 구체적으로 보여주세요.",
      sourceQuote:
        "일본 현지 사용자 리서치를 통해 어떤 유저가, 어떤 맥락에서 반응하는지 파악하고 디자인에 반영해요.",
    },
    {
      title: "가설을 담아 논리적으로 제안한 화면",
      body: "가설이 담긴 화면을 제안하고 그 근거를 논리적으로 커뮤니케이션했던 경험을 담아주세요. 구성원을 설득해 실제로 반영까지 이어졌다면 더 좋아요.",
      sourceQuote:
        "가설이 담긴 화면을 제안하고 논리적으로 커뮤니케이션 할 수 있는 역량이 필요해요.",
    },
  ],
  // 토스증권 - Product Designer (WM Membership)
  cmsybs589000prmpixbasvp1m: [
    {
      title: "전환과 결제 플로우를 설계한 경험",
      body: "구독이나 커머스처럼 전환과 결제 과정이 포함된 서비스를 설계해본 경험을 보여주세요. 가입까지 이어지는 플로우 설계 사례면 좋아요.",
      sourceQuote:
        "구독/커머스 등 전환과 결제 플로우가 포함된 서비스를 설계해본 경험이 있으면 좋아요.",
    },
    {
      title: "프리미엄 고객을 위한 경험 설계",
      body: "프리미엄이나 VIP 등 고가치 고객을 대상으로 한 서비스 경험을 설계해본 사례가 있다면 포함해주세요.",
      sourceQuote:
        "프리미엄/VIP 등 고가치 고객 대상 서비스의 경험을 설계해본 경험이 있으면 좋아요.",
    },
    {
      title: "행동 데이터로 UI를 개선한 성과",
      body: "사용자 행동 데이터를 근거로 UI를 개선하고, 그 성과를 측정해본 경험을 구체적인 수치와 함께 보여주세요.",
      sourceQuote:
        "사용자 행동 데이터를 기반으로 UI를 개선하고 성과를 측정해본 경험이 있으면 좋아요.",
    },
  ],
  // 토스플레이스 - Visual Designer (Design System)
  cmsybsjmd000srmpi17whogab: [
    { title: "화면 패턴을 시스템으로 체계화하는 역량", body: "반복되는 화면 패턴을 발견해 컴포넌트나 가이드 같은 시스템으로 직접 설계해본 경험을 자세히 보여주세요.", sourceQuote: "화면 속 패턴을 발견해 컴포넌트나 가이드 등 시스템 형태로 설계할 수 있는 분이 필요해요." },
    { title: "하드웨어 제품 디자인 시스템 구축", body: "포스나 키오스크 같은 하드웨어 제품의 비주얼과 사용성 기준을 세워본 경험을, 구체적으로 정리해보세요.", sourceQuote: "포스(POS), 결제단말기(Front), 키오스크 등 토스플레이스 제품들의 비주얼 완성도와 사용성의 기준을 세우는 역할이에요." },
    { title: "멀티디바이스 화면 설계 경험", body: "포스나 키오스크, 자동차 인포테인먼트처럼 모바일·데스크탑 외의 화면을 설계해본 경험이 있다면 포함해주세요.", sourceQuote: "포스(POS), 자동차 인포테인먼트, 키오스크 등 모바일과 데스크탑 외 다양한 화면 설계 경험이 있다면 더 좋아요." },
  ],
  // 토스증권 - Product Designer (Chart)
  cmsybtsnp000xrmpiv118amzl: [
    {
      title: "데이터 시각화나 대시보드 설계 경험",
      body: "데이터 시각화나 대시보드처럼 도구형 서비스의 UI를 설계해본 경험이 있다면 포트폴리오에 포함해주세요.",
      sourceQuote:
        "데이터 시각화 또는 대시보드 등 도구형 서비스의 UI를 설계해본 경험이 있으면 좋아요.",
    },
    {
      title: "트레이딩뷰 기반 차트를 다룬 경험",
      body: "트레이딩뷰 기반의 차트 서비스를 직접 설계하거나 고도화해본 경험이 있다면 구체적으로 보여주세요.",
      sourceQuote:
        "트레이딩뷰 기반의 차트 서비스를 설계하거나 고도화해본 경험이 있으면 좋아요.",
    },
    {
      title: "정보 위계로 가독성을 높인 설계력",
      body: "가격, 지표, 거래량 같은 정보의 시각적 위계를 어떻게 설계해 가독성을 높였는지 보여주세요. 복잡한 데이터를 명확하게 정리한 사례면 좋아요.",
      sourceQuote:
        "가격, 지표, 거래량 등 차트 위 정보의 시각적 위계를 설계하고 가독성을 높여요.",
    },
  ],
  // 토스증권 - Visual Designer
  cmsybuxlu0012rmpizikt4xom: [
    {
      title: "하나의 프로젝트로 보여주는 작업 과정",
      body: "여러 작업물을 나열하기보다 프로젝트 하나를 시작부터 테스트, 결과까지 흐름대로 보여주세요. 사고 과정이 드러나면 좋아요.",
      sourceQuote:
        "많은 양의 작업물보다 하나의 프로젝트를 시작부터 테스트 과정, 결과까지 보여주시면 좋아요.",
    },
    {
      title: "2D·3D를 넘나드는 비주얼 제작력",
      body: "다양한 포맷의 디지털 시각 자산을 자유롭게 다룰 수 있다는 걸 보여주세요. 모션까지 고려한 작업이 있다면 함께 담아주세요.",
      sourceQuote:
        "2D, 3D 등 다양한 포맷의 디지털 시각 자산을 자유롭게 제작할 수 있는 툴 활용 능력이 필요해요.",
    },
    {
      title: "모바일·웹에 최적화된 UI 감각",
      body: "단순히 완성도 높은 그래픽이 아니라 모바일과 웹 환경에 맞춰 최적화한 비주얼임을 보여주세요. 프로토타입 영상이 있으면 더 좋아요.",
      sourceQuote:
        "모바일 및 웹 환경에 최적화된 비주얼을 제작할 수 있는 UI 감각이 필요해요.",
    },
  ],
  // 스노우 - [SNOW] AI 크리에이티브 콘텐츠 디자인 체험형 인턴
  cmsybvbtg0017rmpien9x1kdc: [
    {
      title: "생성형 AI 툴로 만든 콘텐츠 실험",
      body: "Midjourney나 Stable Diffusion 같은 생성형 AI 툴로 콘텐츠를 만든 경험을 구체적으로 보여주세요. 어떤 프롬프트와 실험을 거쳤는지 담으면 좋아요.",
      sourceQuote:
        "생성형 AI 기술 활용 디자인 경험 (Midjourney, Stable Diffusion 등)",
    },
    {
      title: "신규 모델을 직접 테스트해본 기록",
      body: "최신 트렌드나 경쟁사 기능, 새로 나온 모델을 스스로 테스트하고 품질을 비교해본 경험이 있다면 어필해보세요.",
      sourceQuote:
        "최신 트렌드 및 경쟁사 기능 리서치, 신규 모델 테스트와 품질 비교 지원",
    },
    {
      title: "바이브 코딩 툴을 다뤄본 경험",
      body: "Cursor나 Claude Code 같은 바이브 코딩 툴을 써본 적이 있다면 꼭 언급해주세요. ComfyUI 사용 경험도 우대돼요.",
      sourceQuote:
        "바이브 코딩 툴 경험 (Cursor, Claude Code 등)",
    },
  ],
  // 미소 - Platform Designer
  cmsybvn4i001crmpim5cngyrg: [
    {
      title: "0에서 1을 주도적으로 설계한 경험",
      body: "특정 서비스 팀에 속하지 않은 영역의 UX를 스스로 발견해 리서치부터 설계, 검증까지 끝까지 주도해본 과정을 담아주세요.",
      sourceQuote:
        "특정 서비스 팀에 할당되지 않은 영역의 UX를 책임지고, 리서치부터 설계·검증까지 처음부터 끝까지 주도",
    },
    {
      title: "여러 팀의 의사결정을 조율한 이야기",
      body: "개별 팀의 범위를 넘어 조직 전체 관점에서 디자인 의사결정을 조율하거나 기준을 세워본 경험을 구체적으로 보여주세요.",
      sourceQuote:
        "개별 팀의 범위를 넘어 조직 전체 관점에서 디자인 의사결정을 조율해본 분",
    },
    {
      title: "디자인 토큰과 시스템을 다룬 깊이",
      body: "Figma Variables나 Design Tokens 같은 시스템 수준의 도구를 깊이 다뤄본 경험을 구체적인 사례와 함께 보여주세요.",
      sourceQuote:
        "Figma Variables, Design Tokens 등 시스템 수준의 디자인 도구를 깊이 다뤄본 분",
    },
  ],
  // 카카오뱅크 - 인터널 서비스 UI/UX 디자인 어시스턴트 (체험형 인턴)
  cmsybw7tj001hrmpim6w3jdfw: [
    {
      title: "공통 컴포넌트를 제작하고 관리한 경험",
      body: "Figma로 재사용 가능한 컴포넌트를 만들어본 경험을 구체적으로 보여주세요. 디자인 시스템을 운영해본 경험이면 더 좋아요.",
      sourceQuote:
        "Figma로 공통 컴포넌트 제작/관리",
    },
    {
      title: "개선 전후를 비교한 UI/UX 사례",
      body: "기존 화면의 문제를 찾아 개선한 UI/UX 사례를 포트폴리오에 꼭 담아주세요. 개선 전과 후를 비교해서 보여주면 좋아요.",
      sourceQuote:
        "포트폴리오: 필수 제출, UI/UX 개선 사례 기술 필수",
    },
    {
      title: "꼼꼼함이 드러나는 작업 태도",
      body: "세부 스펙까지 놓치지 않고 정확하게 처리했던 구체적인 에피소드를 담아 꼼꼼함을 보여주세요.",
      sourceQuote:
        "꼼꼼하고 정확한 업무 처리가 가능한 분",
    },
  ],
  // 카카오뱅크 - AI 프로덕트 디자이너
  cmsybwgrk001mrmpikicf4ixu: [
    {
      title: "복잡한 금융 서비스를 단순화한 과정",
      body: "어렵고 복잡한 정보를 사용자 관점에서 체계적으로 구조화하고 명료하게 풀어낸 사례를 보여주세요.",
      sourceQuote:
        "복잡한 금융 서비스를 체계적으로 구조화하고, 사용자 관점에서 단순하고 명료하게 풀어낼 수 있는 분",
    },
    {
      title: "AI 서비스를 구축하고 출시한 경험",
      body: "AI 기술을 접목한 서비스를 실제로 구축하고 출시까지 해본 경험이 있다면 구체적으로 강조해주세요.",
      sourceQuote:
        "AI 기술을 접목한 서비스 구축 및 출시 경험이 있는 분",
    },
    {
      title: "데이터로 문제를 발견한 사례",
      body: "정량적·정성적 데이터를 근거로 문제를 찾아내고 서비스를 고도화한 과정을 구체적인 수치와 함께 보여주세요.",
      sourceQuote:
        "정량적·정성적 데이터를 기반으로 문제를 발견하고 서비스를 고도화해 본 경험이 있는 분",
    },
  ],
  // 토스플레이스 - Product Designer
  cmsyc5m21000e84daq9wkvhar: [
    {
      title: "데이터로 고객 니즈를 검증한 과정",
      body: "내가 원하는 것이 아니라 고객이 필요로 하는 것을 정량적·정성적 데이터로 구체적으로 파악한 사례를 보여주세요.",
      sourceQuote:
        "내가 원하는 것이 아닌, 고객이 필요한 것을 정량적 혹은 정성적 데이터를 기반으로 구체적으로 파악한 경험이 있는 분이 필요해요.",
    },
    {
      title: "as-is to-be로 보여주는 개선 흐름",
      body: "제품 개선 프로젝트라면 개선 전 화면과 개선 후 화면을 나란히 보여주는 이미지를 꼭 포함해주세요.",
      sourceQuote:
        "개선 전의 화면(as-is)과 개선 후의 화면(to-be)을 잘 확인할 수 있는 이미지가 있으면 더욱 좋아요.",
    },
    {
      title: "논리적으로 동료를 설득한 협업 경험",
      body: "궁극의 고객 경험을 위해 논리적인 커뮤니케이션으로 구성원을 설득하고 협업했던 경험을 담아주세요.",
      sourceQuote:
        "궁극의 고객 경험을 달성하기 위해 논리적인 커뮤니케이션으로 구성원을 설득하고 협업한 경험이 필요해요.",
    },
  ],
  // 강남언니 - 프로덕트 디자이너 (B2B 파트너센터)
  cmsyc60oa0002znek9s59idz2: [
    {
      title: "B2B 웹 제품에서 문제를 푼 경험",
      body: "B2B 웹 제품에서 고객의 문제를 해결한 프로젝트를 최소 1개 포함하고, 본인 기여도를 구체적으로 적어주세요.",
      sourceQuote:
        "웹 기반의 B2B 제품에서 고객의 문제를 해결한 프로젝트를 최소 1개 이상 포함하여 구성해 주세요.",
    },
    {
      title: "복잡한 정보 구조를 정리한 UI 설계",
      body: "복잡한 정보 구조와 기술적 제약 속에서도 명확하고 일관된 UI를 설계했던 사례를 보여주세요.",
      sourceQuote:
        "복잡한 정보 구조와 기술적 제약 속에서도 명확하고 일관된 UI를 설계할 수 있는 분",
    },
    {
      title: "비즈니스 상황을 고려한 경험 설계",
      body: "기업 고객의 문제를 정성적·정량적으로 파악하고 비즈니스 상황까지 고려해 설계한 과정을 구체적으로 담아주세요.",
      sourceQuote:
        "기업 고객이 겪는 문제를 정성적·정량적으로 파악하고, 비즈니스 상황을 고려해 경험을 설계할 수 있는 분",
    },
  ],
  // 토스뱅크 - Product Designer
  cmsyc6k5m000j84da73p5bzij: [
    {
      title: "사용자 데이터로 개선을 이끈 과정",
      body: "내가 원하는 게 아니라 사용자가 원하는 것을 정량적·정성적 데이터 기반으로 개선한 경험을 구체적으로 보여주세요.",
      sourceQuote:
        "사용자가 원하는 것을 정량적 · 정성적 데이터 기반으로 개선한 경험이 있는 분이 필요해요.",
    },
    {
      title: "정보 위계를 고려한 조형적 완성도",
      body: "사용자가 알아야 할 정보의 위계를 고려해 조형적으로 완성도 높은 App/Web UI를 구성한 사례를 담아주세요.",
      sourceQuote:
        "사용자가 알아야 하는 정보의 위계를 고려해 조형적 완성도가 높은 App / Web UI를 구성할 수 있는 분이 필요해요.",
    },
    {
      title: "as-is to-be로 보여주는 개선 흐름",
      body: "제품 개선 프로젝트라면 개선 전 화면과 개선 후 화면을 나란히 보여주는 이미지를 꼭 포함해주세요.",
      sourceQuote:
        "개선 전의 화면(as-is)과 개선 후의 화면(to-be)을 잘 확인할 수 있는 이미지가 있으면 더욱 좋아요.",
    },
  ],
  // 강남언니 - 프로덕트 디자이너 인턴 (체험형)
  cmsyc6ofo0007znekbinr999t: [
    {
      title: "디스커버리부터 딜리버리까지 참여한 과정",
      body: "문제 발견부터 검증, 화면 완성까지 전 과정에 참여했던 프로젝트를 포트폴리오에 담아보세요. 인턴도 스쿼드의 일원으로 이 과정을 함께한다는 점을 기억해주세요.",
      sourceQuote:
        "인턴도 팀의 구성원으로서 Discovery에 함께 참여하고, 담당 영역의 Delivery를 함께 만들어가며 제품의 완성도를 높여요.",
    },
    {
      title: "피그마로 만든 사용자 테스트 프로토타입",
      body: "사용자 테스트를 위해 직접 프로토타입을 설계하고 검증했던 사례를 보여주세요. Figma 활용 능력과 함께 테스트 결과를 반영해 개선한 과정을 담으면 좋아요.",
      sourceQuote:
        "사용자 테스트(UT)를 위한 프로토타입을 설계하고 제작해요.",
    },
    {
      title: "다국어 사용자를 고려한 디자인 경험",
      body: "여러 언어권 사용자를 위해 현지화나 다국어 환경을 고민했던 경험이 있다면 꼭 담아주세요. 글로벌 앱과 웹을 함께 만드는 스쿼드 특성과 잘 맞아요.",
      sourceQuote:
        "글로벌 사용자 또는 다국어 서비스를 고려한 디자인 경험이 있으신 분",
    },
  ],
  // 강남언니 - 프로덕트 디자인 리드
  cmsyc79ke000cznekszjvmxmz: [
    {
      title: "디자인 조직을 리딩한 경험",
      body: "팀을 이끌며 디자인 원칙과 방향성을 제시했던 경험을 구체적으로 보여주세요. 조직 빌딩이나 프로세스 설계 경험이 있다면 함께 담아주세요.",
      sourceQuote:
        "2년 이상의 디자인 조직 리딩 경험이 있는 분",
    },
    {
      title: "데이터 기반 UX 전략 수립 사례",
      body: "정성/정량 데이터를 근거로 UX 전략을 세우고 실행했던 사례를 포트폴리오에 담아주세요. 근거와 의사결정 과정을 명확히 보여주면 좋아요.",
      sourceQuote:
        "정성/정량적 데이터를 근거로 UX 전략 수립",
    },
    {
      title: "디자이너를 코칭하고 성장시킨 이야기",
      body: "동료 디자이너를 코칭하거나 티칭했던 경험을 구체적인 사례로 정리해보세요. 팀원의 성장을 이끌었던 과정을 보여주면 좋아요.",
      sourceQuote:
        "디자이너 코칭, 티칭 경험이 있으신 분",
    },
  ],
  // 토스증권 - Product Designer (Trading)
  cmsyc7dtg000o84dadkaofbvl: [
    {
      title: "사용자 실수를 막는 방어적 디자인",
      body: "실수를 방지하는 인터랙션이나 안전장치를 설계했던 경험을 보여주세요. 매매처럼 실수가 치명적인 도메인일수록 이런 판단이 중요해요.",
      sourceQuote:
        "사용자 실수를 방지하는 방어적 디자인 경험이 있으면 더 좋아요.",
    },
    {
      title: "데이터로 검증하고 출시까지 이어간 과정",
      body: "정량/정성 데이터를 바탕으로 문제를 파악하고, 직접 설계해 실제 출시까지 이어간 경험을 담아주세요. 사용자가 원하는 것을 근거로 증명하는 과정이 중요해요.",
      sourceQuote:
        "사용자가 원하는 것을 정량적·정성적 데이터 기반으로 파악해 개선한 경험이 있는 분이 필요해요.",
    },
    {
      title: "개선 전후 화면으로 보여주는 과정",
      body: "as-is와 to-be 화면을 비교해 어떤 문제를 어떻게 해결했는지 명확히 보여주세요. 개선 전후 변화가 잘 드러나는 이미지가 있으면 더 좋아요.",
      sourceQuote:
        "개선 전의 화면(as-is)과 개선 후의 화면(to-be)을 잘 확인할 수 있는 이미지가 있으면 더욱 좋아요.",
    },
  ],
  // 토스증권 - Product Designer (AI Contents)
  cmsyc800x000t84dafftioi81: [
    {
      title: "데이터와 텍스트를 함께 다룬 레이아웃",
      body: "차트, 수치, 텍스트가 섞인 콘텐츠를 명확하게 구조화했던 경험을 보여주세요. 데이터 시각화나 인포그래픽 작업 경험이 있다면 강조해주세요.",
      sourceQuote:
        "텍스트, 차트, 수치 데이터가 혼합된 콘텐츠의 레이아웃과 비주얼 시스템을 디자인해요.",
    },
    {
      title: "AI 콘텐츠의 신뢰도를 높인 표현 방식",
      body: "AI가 만든 정보를 사용자가 신뢰할 수 있도록 시각적으로 표현했던 경험을 담아주세요. 어떤 인터랙션과 표현으로 신뢰도를 높였는지 구체적으로 보여주면 좋아요.",
      sourceQuote:
        "AI 콘텐츠의 신뢰도를 높이기 위한 시각적 표현 방식과 인터랙션 패턴을 정의해요.",
    },
    {
      title: "AI 서비스 UI를 설계한 경험",
      body: "챗봇이나 LLM 기반 서비스의 화면을 직접 설계해본 경험이 있다면 꼭 담아주세요. AI 특유의 불확실성을 다룬 판단 과정을 보여주면 더 좋아요.",
      sourceQuote:
        "AI/LLM 기반 서비스의 UI를 설계해본 경험이 있으면 좋아요.",
    },
  ],
  // 강남언니 - 플랫폼 디자이너
  cmsyc82jo000hznekw352sr44: [
    {
      title: "디자인 시스템 컴포넌트를 설계한 경험",
      body: "직접 컴포넌트를 설계하고 제품에 적용해본 경험을 구체적으로 보여주세요. Figma에서 어떻게 구조화하고 운영했는지 함께 담으면 좋아요.",
      sourceQuote:
        "디자인 시스템 컴포넌트를 직접 설계하고 제품에 적용해본 경험이 있는 분 (유관 경력 5년 이상)",
    },
    {
      title: "접근성을 고려한 UI 설계 사례",
      body: "색상 대비나 키보드 내비게이션 등 접근성을 고려해 설계했던 사례를 담아주세요. 구체적인 기준과 적용 과정을 보여주면 좋아요.",
      sourceQuote:
        "접근성(색상 대비, 키보드 내비게이션 등)을 고려한 UI 설계 경험이 있는 분",
    },
    {
      title: "협업 프로세스를 설계하고 확산한 경험",
      body: "디자인과 개발 사이 협업 방식을 직접 설계하고 팀에 적용해본 경험을 보여주세요. 어떻게 확산시켰는지 과정을 구체적으로 담으면 좋아요.",
      sourceQuote:
        "디자인과 개발 사이의 협업 프로세스를 설계하고, 실제 팀에 적용하고 확산시켜본 경험이 있는 분",
    },
  ],
  // 토스플레이스 - UX Researcher
  cmsyc8gn9000y84dad9rdyy3m: [
    {
      title: "문제 정의부터 결과까지 이어진 리서치",
      body: "문제 정의, 가설 설정, 리서치 설계, 검증, 결과 도출까지 전 과정을 구체적으로 보여주세요. 그 과정에서 무엇을 배웠는지도 함께 담으면 좋아요.",
      sourceQuote:
        "프로젝트의 문제 정의 - 가설 설정 - 리서치 설계 및 검증 - 결과 도출 과정을 중심으로",
    },
    {
      title: "실무 프로젝트에서 진행한 리서치",
      body: "사이드 프로젝트가 아닌 실제 실무에서 진행했던 리서치 사례를 담아주세요. 실무 프로젝트 경험이 필수 조건이라는 점을 기억해주세요.",
      sourceQuote:
        "실무 프로젝트에서 UX 리서치를 진행한 경험은 필수예요.",
    },
    {
      title: "현장 관찰로 문제의 본질을 찾은 과정",
      body: "책상에서는 보이지 않는 사용자 행동을 직접 관찰해 문제를 발견했던 경험을 보여주세요. 오프라인 현장의 맥락을 얼마나 깊이 이해했는지 드러내면 좋아요.",
      sourceQuote:
        "책상 위에서만 보기 어려운 사용자 행동을 직접 관찰하고, 문제의 본질을 찾아내려는 분이면 더 좋아요.",
    },
  ],
  // 강남언니 - [병원 운영 솔루션] 프로덕트 디자이너 (B2B SaaS)
  cmsyc8rjd000mznekc3r3e9x7: [
    {
      title: "왜 이 결정을 했는지 증명하는 과정",
      body: "문제-가설-근거-결론을 일관된 구조로 설명했던 프로젝트를 보여주세요. 트레이드오프를 어떻게 판단했는지도 명확히 담으면 좋아요.",
      sourceQuote:
        "문제–가설–근거–결론을 일관된 구조로 연결해요.",
    },
    {
      title: "복잡한 운영을 구조화해 화면으로 만든 과정",
      body: "복잡한 현실 운영이나 정책을 핵심 단위로 쪼개고 예외까지 고려해 화면으로 풀어낸 경험을 보여주세요. 확장과 유지보수를 고려한 설계였다면 더 좋아요.",
      sourceQuote:
        "현실 운영을 이해 한 뒤 핵심 단위로 정의하고, 흐름, 예외를 구조화해 화면으로 전달해요.",
    },
    {
      title: "팀의 설계 기준을 세운 경험",
      body: "디자인 기준이나 패턴을 만들어 팀에 전파했던 경험을 구체적으로 담아주세요. 리뷰나 멘토링을 통해 팀의 설계 수준을 끌어올린 과정도 좋아요.",
      sourceQuote:
        "디자인 챕터 원칙(논리력, 구조력, 전달력)을 바탕으로 제품 품질 기준을 세우고 팀에 전파해요.",
    },
  ],
  // 미소 - AI Product Designer
  cmsyc8z1q001384datrnti66m: [
    {
      title: "복잡한 AI 플로우를 단순화한 경험",
      body: "복잡한 AI나 에이전트 작동 방식을 사용자 관점에서 단순한 흐름으로 풀어낸 경험을 보여주세요. 어떤 기준으로 무엇을 덜어냈는지 과정을 구체적으로 담으면 좋아요.",
      sourceQuote:
        "복잡한 시스템 플로우를 사용자 관점에서 단순하게 풀어낸 경험이 있는 분",
    },
    {
      title: "코드로 직접 검증한 프로토타이핑",
      body: "코드 기반 프로토타이핑 툴을 활용해 직접 아이디어를 구현하고 검증했던 경험을 보여주세요. AI 엔지니어와 코드 수준에서 소통했던 경험이 있다면 더 좋아요.",
      sourceQuote:
        "코드 기반 프로토타이핑 툴을 활용해 직접 구현해본 분",
    },
    {
      title: "데이터로 검증하고 반복 개선한 사례",
      body: "출시 후 사용자 반응과 데이터를 바탕으로 문제를 분석하고 개선했던 사례를 담아주세요. 빠른 실행과 반복 개선 방식이 익숙하다는 점을 보여주면 좋아요.",
      sourceQuote:
        "데이터를 기반으로 문제를 분석하고 솔루션을 검증해본 분",
    },
  ],
  // 네이버웹툰 - Cuts 그로스 디자인 (Growth Design) (체험형 인턴)
  cmsztvyq90002wejgb65gu1cw: [
    {
      title: "키비주얼로 의도를 시각화한 경험",
      body: "기획 의도를 직관적이고 인상적인 키비주얼로 풀어낸 작업물을 포트폴리오에 담아주세요. 유저 시선을 끄는 그래픽 완성도를 함께 보여주면 좋아요.",
      sourceQuote:
        "기획 핵심 의도를 직관적이고 인상적인 키비주얼로 시각화할 수 있는 분",
    },
    {
      title: "이미지 합성·리터칭 완성도",
      body: "합성, 리터칭, 이미지 워싱 등으로 이미지를 자연스럽고 정교하게 처리한 사례를 구체적으로 보여주세요.",
      sourceQuote:
        "이미지 합성, 리터칭, 이미지 워싱 등 이미지를 자연스럽고 정교하게 처리할 수 있는 그래픽 스킬",
    },
    {
      title: "브랜드 톤을 지킨 그래픽 작업",
      body: "브랜드의 톤앤매너를 유지하면서도 눈길을 끄는 그래픽을 만든 경험을 정리해주세요. Photoshop·Figma 활용 능력을 함께 드러내면 좋아요.",
      sourceQuote:
        "브랜드의 톤앤매너를 유지하면서, 유저의 시선을 끌 수 있는 정교한 그래픽을 완성할 수 있는 분",
    },
  ],
  // 카카오뱅크 - AI Native 서비스 기획자 (채용연계형 인턴)
  cmt5s5e210002135d0l5y6eq9: [
    {
      title: "사용자 시선으로 문제를 재해석한 경험",
      body: "공급자 관점이 아니라 철저히 사용자 시선으로 상품이나 서비스를 다시 설계해본 경험을 구체적으로 보여주세요.",
      sourceQuote:
        "공급자가 아닌 철저히 사용자의 시선으로 재해석한 상품들까지",
    },
    {
      title: "가설 검증 기반 문제 해결 경험",
      body: "가설을 세우고 데이터를 직접 추출·분석해 문제를 해결한 경험을 정리해주세요. UX·정책 설계 관점까지 함께 보여주면 좋아요.",
      sourceQuote:
        "가설 설정부터 데이터 추출/분석을 바탕으로 문제를 해결하고 정리하는 분",
    },
    {
      title: "AI 트렌드에 대한 관심과 적용 경험",
      body: "AI 기반의 새로운 서비스 아이디어나 트렌드에 관심을 갖고 직접 적용해본 경험이 있다면 구체적으로 보여주세요.",
      sourceQuote:
        "AI 기반의 새로운 서비스 아이디어와 트렌드에 관심이 있는 분",
    },
  ],
  // Bjak - Product Designer (UX), HCI
  cmt4phr9q0004lqcmmekfyjau: [
    {
      title: "AI 인터랙션 패턴 설계 경험",
      body: "프롬프트·확인·정정·핸드오프·복구까지 AI와 사람이 상호작용하는 전체 흐름을 설계해본 경험을 보여주세요.",
      sourceQuote:
        "Create interaction patterns for human-AI workflows, including prompting, review, confirmation, correction, handoff, and recovery.",
    },
    {
      title: "복잡한 AI 동작을 명확하게 푼 경험",
      body: "AI가 무엇을 하는지, 무엇을 확신하지 못하는지를 사용자에게 명확히 보여주는 화면을 설계한 경험을 구체적으로 보여주세요.",
      sourceQuote:
        "Design interfaces that help users understand what the AI is doing, what it knows, what it is unsure about, and what will happen next.",
    },
    {
      title: "빠른 반복으로 검증한 프로토타이핑",
      body: "Figma로 빠르게 반복하며 아이디어를 검증한 프로세스를 포트폴리오에 담아주세요.",
      sourceQuote:
        "Proficiency in Figma and fast iteration workflows.",
    },
  ],
  // 엔라이즈 - Product Designer (위피 재팬 스쿼드)
  cmtfvtpy40002roxjsyij55jp: [
    {
      title: "현지 맥락에 맞춘 경험 재설계",
      body: "번역을 넘어 다른 문화권 사용자의 행동과 기대에 맞게 경험을 다시 설계해본 사례를 보여주세요.",
      sourceQuote:
        "일본 유저는 호감 표현 방식과 개인정보 공개 기준, 대화를 이어가는 과정에서 한국 사용자와 다른 기대와 행동을 보입니다.",
    },
    {
      title: "AI를 디자인 과정에 접목한 경험",
      body: "AI를 탐색·제작·검증 과정에 직접 활용해 본인뿐 아니라 팀의 결과물까지 개선해본 경험을 구체적으로 보여주세요.",
      sourceQuote:
        "AI를 디자인 과정(탐색, 제작, 검증)에 직접 접목하여 자신의 작업뿐 아니라 함께 일하는 사람들의 결과물까지 실질적으로 개선해 본 분",
    },
    {
      title: "A/B 테스트로 검증한 경험 설계",
      body: "다양한 해결안을 프로토타입으로 만들고 A/B 테스트·행동 데이터로 효과를 검증해본 과정을 보여주세요.",
      sourceQuote:
        "다양한 해결안을 빠르게 탐색하고 작동하는 프로토타입으로 구체화하며, 유저 반응과 A/B 테스트, 행동 데이터를 통해 어떤 경험이 실제로 효과가 있었는지 확인합니다.",
    },
  ],
  // 채널톡 - Product Designer, Senior
  cmtfvuh5g0007roxjaq9e39f2: [
    {
      title: "제품 문제를 직접 구조화한 경험",
      body: "하나의 제품 도메인에서 고객과 비즈니스 문제를 직접 구조화하고 PM·엔지니어와 전략을 세운 경험을 보여주세요.",
      sourceQuote:
        "하나의 제품 도메인에서 고객과 비즈니스의 문제를 직접 구조화하고, PM·엔지니어와 전략을 만들고, 여러 릴리즈에 걸쳐 결과를 증명합니다.",
    },
    {
      title: "복잡한 B2B 업무를 쉽게 푼 경험",
      body: "모호한 비즈니스 목표를 제품 문제로 재구성하고, 복잡한 B2B 업무를 누구나 이해할 수 있는 경험으로 만든 사례를 보여주세요.",
      sourceQuote:
        "모호한 비즈니스 목표와 고객 신호를 풀 만한 제품 문제로 재구성하고, 복잡한 B2B 업무를 누구나 이해 가능한 경험으로 만듭니다.",
    },
    {
      title: "성과 지표로 설명하는 릴리즈 경험",
      body: "릴리즈 결과를 제품·비즈니스 성과 지표로 설명하고, 이를 바탕으로 다음 개선 방향을 정한 경험을 보여주세요.",
      sourceQuote:
        "릴리즈 결과를 제품과 비즈니스 성과 지표로 설명할 수 있고 이를 바탕으로 다음 iteration을 정합니다.",
    },
  ],
  // 채널톡 - Product Designer, Staff
  cmtfvv40c000croxj3uq31w5v: [
    {
      title: "회사급 문제를 원칙으로 풀어낸 경험",
      body: "여러 팀과 플랫폼을 가로지르는 큰 문제를 원칙·패턴·가이드로 정리해 전파한 경험을 보여주세요.",
      sourceQuote:
        "모호하고 정답이 없는 대규모 문제를 각 팀이 바로 쓸 수 있는 원칙·패턴·예시·결정으로 바꾸고, 디자인 시스템이 제품을 지원하는 컨벤션과 패턴을 가이드할 수 있습니다.",
    },
    {
      title: "글로벌 제품 언어를 설계한 경험",
      body: "여러 국가에서 하나의 제품처럼 느껴지도록 정보 구조와 품질 기준을 설계한 경험을 보여주세요.",
      sourceQuote:
        "한·일·미에서 한 제품처럼 느껴지는 글로벌 product language와 quality bar가 그 대상입니다.",
    },
    {
      title: "핵심 프로젝트를 직접 완성한 경험",
      body: "가장 어려운 사용자 경험과 UI를 끝까지 높은 수준으로 직접 완성한 프로젝트를 보여주세요.",
      sourceQuote:
        "동시에 핵심 프로젝트에서는 직접 손을 움직여 가장 어려운 사용자 경험과 UI를 끝까지 높은 수준으로 만듭니다.",
    },
  ],
  // 한화생명 - [한화생명]PLUS WM전략팀 'UX·UI 디자이너' 경력채용
  cmtfwcltv0002tl2k3lo4w5xz: [
    {
      title: "웹을 모바일 기준으로 재설계한 경험",
      body: "웹 중심으로 설계된 정보구조(IA)와 플로우를 모바일 기준으로 전면 재설계한 경험을 구체적으로 보여주세요.",
      sourceQuote:
        "웹 프로토타입의 정보구조(IA) 및 플로우를 모바일 기준으로 전면 재설계",
    },
    {
      title: "데이터 중심 화면 시각화 경험",
      body: "차트·리포트 등 데이터·수치 중심 화면을 시각화한 프로젝트를 포트폴리오에 담아주세요.",
      sourceQuote:
        "데이터·수치 중심 화면(차트, 리포트)의 시각화 경험",
    },
    {
      title: "Figma 디자인시스템 구축·운영 경험",
      body: "Figma로 컴포넌트·토큰·타이포·컬러 시스템을 구축하고 운영해본 경험을 구체적으로 보여주세요.",
      sourceQuote:
        "Figma 기반 컴포넌트·토큰·타이포·컬러 시스템 구축 및 운영",
    },
  ],
  // 캐치테이블 - Product Designer (Service Growth)
  cmu3k6e8t00024ii84gl6i4nf: [
    {
      title: "실험 기반 그로스 의사결정 경험",
      body: "가설 단위로 시안을 나누고 Amplitude 등으로 퍼널·전환율을 확인해 성과가 검증된 안만 확정해본 경험을 보여주세요.",
      sourceQuote:
        "가설 단위로 안을 나누고 Amplitude로 퍼널·전환율·재예약률을 확인해 성과가 검증된 안만 확정합니다.",
    },
    {
      title: "혼자 완결한 프로덕트 디자인 경험",
      body: "디자이너가 본인 한 명뿐인 팀에서 문제 정의부터 출시·검증까지 스스로 이끌어본 경험을 구체적으로 보여주세요.",
      sourceQuote:
        "3년 이상 프로덕트 디자인 경험이 있고, 디자이너가 본인 한 명인 팀·파트에서 문제 정의부터 출시·검증까지 스스로 이끌어본 분",
    },
    {
      title: "AI 도구로 업무 흐름을 바꾼 경험",
      body: "생성형 AI나 바이브 디자인 등으로 실제 작업 방식을 바꿔본 경험을 포트폴리오에 담아주세요.",
      sourceQuote:
        "AI로 자신의 작업 흐름을 실제로 바꿔본 분 (Figma 플러그인·MCP 자동화, 화면·코드까지 만들어본 경험 포함)",
    },
  ],
  // 캐치테이블 - Platform Designer
  cmu3kc04u0002j6sxjlswfjn0: [
    {
      title: "AI 디자인 파이프라인 구축 경험",
      body: "AI가 브랜드·디자인 시스템 기준으로 시안과 화면 코드를 만들도록 하는 자동화 파이프라인을 설계해본 경험을 보여주세요.",
      sourceQuote:
        "시안·화면을 만드는 바이브 디자인 파이프라인 설계 및 고도화",
    },
    {
      title: "디자인 시스템 토큰·컴포넌트 운영 경험",
      body: "디자인 시스템을 사용하는 데 그치지 않고 토큰·컴포넌트·패턴을 직접 정의하거나 개선·운영해본 경험을 구체적으로 보여주세요.",
      sourceQuote:
        "디자인 시스템을 사용하는 데 그치지 않고, 컴포넌트·토큰·패턴을 직접 정의하거나 개선·운영해 본 분",
    },
    {
      title: "반복 작업을 도구로 만든 경험",
      body: "반복되는 디자인 작업을 도구·규칙·템플릿으로 만들어 개선해본 경험을 규모에 상관없이 보여주세요.",
      sourceQuote:
        "반복 작업을 도구·규칙·템플릿으로 만들어 개선해 본 경험이 있는 분 (규모 무관)",
    },
  ],
  // 와디즈 - 프로덕트 디자이너 (인턴)
  cmu3ld2px00026bu282vn38q6: [
    {
      title: "정성·정량 데이터로 문제 정의한 경험",
      body: "정성·정량 데이터를 바탕으로 사용자 여정의 핵심 문제를 정의하고 PO와 함께 UX를 설계해본 경험을 보여주세요.",
      sourceQuote:
        "정성/정량 데이터 기반 서포터 여정 및 핵심 지면의 문제 정의",
    },
    {
      title: "프로토타입으로 검증한 실험 경험",
      body: "사용자 시나리오를 설계하고 프로토타입을 만들어 사용성을 점검·개선해본 과정을 구체적으로 보여주세요.",
      sourceQuote:
        "사용자 시나리오 설계 및 프로토타이핑 제작을 통한 사용성 점검·개선 방향 도출",
    },
    {
      title: "두 사용자 관점을 아우른 경험",
      body: "서로 다른 두 사용자 그룹(예: 공급자·수요자)의 관점을 모두 고려해 통합 경험을 설계해본 경험을 보여주세요.",
      sourceQuote:
        "서포터와 메이커, 두 사용자의 관점을 모두 아우르는 통합 경험을 설계할 수 있습니다.",
    },
  ],
  // 당근 - B2B Content Designer (계약직) - 광고
  cmu3ldqsx00076bu2b87yp33e: [
    {
      title: "기획 의도를 시각화로 풀어낸 경험",
      body: "기획자의 의도를 깊이 이해하고 더 효과적인 시각화 방식을 능동적으로 제안해본 경험을 보여주세요.",
      sourceQuote:
        "기획자의 의도를 깊이 이해하고, 더 효과적인 시각화 방식을 능동적으로 제안할 수 있는 분",
    },
    {
      title: "복잡한 정보를 명확하게 시각화한 경험",
      body: "인사이트 리포트나 데이터처럼 복잡한 정보를 인포그래픽 등으로 쉽고 명확하게 풀어낸 사례를 보여주세요.",
      sourceQuote:
        "복잡한 정보나 데이터를 쉽고 명확하게 디자인 작업물로 풀어낸 경험이 있으신 분",
    },
    {
      title: "다양한 채널의 온드미디어 제작 경험",
      body: "뉴스레터, 링크드인, CRM 등 여러 채널에 맞춰 디자인 아웃풋을 제작해본 경험을 정리해주세요.",
      sourceQuote:
        "뉴스레터, 링크드인, CRM 등 온드미디어 디자인 아웃풋을 제작해요",
    },
  ],
  // 웨이브 - [product] UX/UI 디자이너
  cmu3ngnss0002h2fpwnhipy68: [
    {
      title: "다양한 화면을 아우른 디자인 시스템 경험",
      body: "iOS/Android/Web/TV 등 여러 플랫폼을 아우르는 디자인 시스템을 구축·개선해본 경험을 보여주세요.",
      sourceQuote:
        "Wavve 서비스 UI/UX 디자인 (iOS/Android/Web/TV)",
    },
    {
      title: "주요 기능 프로젝트 리딩 경험",
      body: "여러 팀과 커뮤니케이션하며 주요 기능 프로젝트를 리딩해본 경험을 구체적으로 보여주세요.",
      sourceQuote:
        "주요 기능 프로젝트 디자인 및 커뮤니케이션 리딩",
    },
    {
      title: "본인 기여도 명확한 프로젝트 경험",
      body: "포트폴리오에는 본인의 기여도가 절반 이상인 프로젝트를 중심으로 담아주세요.",
      sourceQuote:
        "포트폴리오 제출 가능한 분 (본인의 기여도가 50% 이상인 프로젝트 위주로 구성)",
    },
  ],
  // 화이트스캔 - UI/UX 프로덕트 디자이너 채용
  cmu3ngxpa0007h2fp32g4kf04: [
    {
      title: "대시보드 UI 설계 경험",
      body: "대시보드 디자인과 사용자 인터페이스 설계 경험을 구체적으로 보여주세요.",
      sourceQuote:
        "대시보드 디자인 및 사용자 인터페이스 설계",
    },
    {
      title: "UX 리서치 기반 개선 경험",
      body: "사용자 경험 개선을 위해 리서치하고 분석한 과정을 보여주세요.",
      sourceQuote:
        "사용자 경험(UX) 개선을 위한 리서치 및 분석",
    },
    {
      title: "데이터 시각화 대시보드 경험",
      body: "복잡한 데이터를 대시보드로 시각화해본 경험이 있다면 우대사항으로 강조해주세요.",
      sourceQuote:
        "데이터 시각화 및 대시보드 디자인 경험",
    },
  ],
  // 아이브코리아 - 개발실 서비스 UI/UX 디자이너
  cmu3nhd7p000ch2fp9ge5ofta: [
    {
      title: "Figma·Sketch 병행 활용 역량",
      body: "Figma와 Sketch를 함께 다뤄본 경험이 있다면 구체적으로 보여주세요.",
      sourceQuote:
        "Figma, Notion, Sketch, Photoshop 사용 역량",
    },
    {
      title: "빠른 적응력을 보여주는 포트폴리오",
      body: "새로운 환경이나 도구에 빠르게 적응해 성과를 낸 경험을 정리해주세요.",
      sourceQuote:
        "꼼꼼함, 적응성, 협동심, 계획성, 성실성",
    },
    {
      title: "기여도 명확한 포트폴리오 구성",
      body: "이력서와 포트폴리오를 함께 제출할 때, 각 프로젝트에서의 역할을 명확히 밝혀주세요.",
      sourceQuote:
        "잡코리아 이력서 포트폴리오 첨부",
    },
  ],
  // 마이베네핏 - UX/UI 디자이너 모집
  cmu3nhv75000hh2fpfqsam42q: [
    {
      title: "Unity 기반 UX 설계 경험",
      body: "Unity 환경에서 UX를 설계해본 경험이 있다면 구체적인 사례로 보여주세요.",
      sourceQuote:
        "Unity, Adobe XD, Figma, Illustrator 활용",
    },
    {
      title: "탄력근무 환경에서의 자기관리 능력",
      body: "탄력근무제처럼 자율적인 환경에서 스스로 일정을 관리하며 성과를 낸 경험을 보여주세요.",
      sourceQuote:
        "탄력근무제 오전 08~10시 출근 및 8시간 근무",
    },
    {
      title: "문서화·발표 역량을 갖춘 디자이너",
      body: "디자인 결과물을 문서나 발표로 명확하게 전달해본 경험을 함께 보여주세요.",
      sourceQuote:
        "프리젠테이션 능력 우수자 문서작성 우수자",
    },
  ],
  // 토스증권 - Design System Assistant
  cmu3ni81a000mh2fpasxxx3wq: [
    {
      title: "디자인 시스템 컴포넌트 활용 역량",
      body: "기존 디자인 시스템의 컴포넌트를 이해하고 활용해 화면을 빠르고 정확하게 제작해본 경험을 보여주세요.",
      sourceQuote:
        "Figma의 컴포넌트를 이해하고, 이를 활용해 화면을 빠르고 정확하게 제작할 수 있는 분을 찾아요.",
    },
    {
      title: "꼼꼼함과 일관성을 갖춘 작업 태도",
      body: "기존 화면의 디자인 요소와 텍스트를 빠짐없이 옮기고, 반복 작업에서도 일관성을 유지한 경험을 보여주세요.",
      sourceQuote:
        "기존 화면의 디자인 요소와 텍스트를 빠짐없이 옮길 수 있는 꼼꼼함이 필요해요.",
    },
    {
      title: "Figma 원본으로 검증 가능한 포트폴리오",
      body: "Figma 컴포넌트를 활용해 직접 제작한 화면을 원본 링크로 공유할 수 있게 포트폴리오를 준비해주세요.",
      sourceQuote:
        "Figma 컴포넌트를 활용해 직접 제작한 화면이 3개 이상 포함된 Figma 원본 링크를 필수로 제출해 주세요.",
    },
  ],
  // 현대자동차 - [ICT] UI Designer
  cmu3niszi000rh2fpv7xdmsd7: [
    {
      title: "멀티 플랫폼 UI 사용성 정립 경험",
      body: "Android/iOS/Web/PC 등 여러 플랫폼에서 UI 사용성을 정립하고 방향성을 마련한 경험을 보여주세요.",
      sourceQuote:
        "Android, iOS, Web, PC 환경의 UI 사용성 정립 및 방향성 마련",
    },
    {
      title: "접근성을 고려한 프로토타이핑 경험",
      body: "다양한 사용자와 디바이스, 접근성을 고려해 프로토타입을 만들어본 경험을 보여주세요.",
      sourceQuote:
        "사용자·디바이스·접근성을 고려한 프로토타이핑",
    },
    {
      title: "인하우스 서비스 런칭·운영 경험",
      body: "인하우스에서 서비스를 직접 런칭하고 운영까지 경험해본 사례를 보여주세요.",
      sourceQuote:
        "인하우스 서비스 런칭 및 운영 경험",
    },
  ],
  // 멜 - Product Design Assistant (단기 계약직)
  cmu3nj39b000wh2fp7ita0l2a: [
    {
      title: "레퍼런스 기반 빠른 UI 제작 역량",
      body: "기존 화면과 레퍼런스를 바탕으로 빠르고 정확하게 UI를 제작해본 경험을 보여주세요.",
      sourceQuote:
        "기존 제품 화면과 다양한 레퍼런스를 바탕으로 필요한 UI 제작",
    },
    {
      title: "Figma Component·Auto Layout 활용 경험",
      body: "Figma의 Component와 Auto Layout을 능숙하게 활용해본 경험을 구체적으로 보여주세요.",
      sourceQuote:
        "Figma Component 및 Auto Layout 활용 경험",
    },
    {
      title: "Design QA 협업 경험",
      body: "Product Manager와 협업하며 디자인 수정과 Design QA를 진행해본 경험을 보여주세요.",
      sourceQuote:
        "Product Manager와 협업하여 디자인 수정 및 Design QA 진행",
    },
  ],
  // 케이존 - 프로덕트 디자이너 (1~5년차)
  cmu3njtcs0011h2fpr20lu4pd: [
    {
      title: "AI 판단 과정을 신뢰 가능한 경험으로 설계",
      body: "AI Agent의 판단과 실행 과정을 사용자가 이해하고 신뢰할 수 있게 설계한 경험을 보여주세요.",
      sourceQuote:
        "AI Agent의 판단과 실행 과정을 사용자가 이해하고 신뢰할 수 있는 경험으로 설계",
    },
    {
      title: "이탈 최소화 User Flow 설계 경험",
      body: "이탈을 최소화하는 User Flow와 정보 구조(IA)를 설계하고 사용성 테스트로 검증한 경험을 보여주세요.",
      sourceQuote:
        "이탈을 최소화하는 User Flow와 정보 구조(IA) 설계",
    },
    {
      title: "퍼널·전환율 데이터 기반 개선 경험",
      body: "퍼널과 전환율, 리텐션 지표를 확인하고 A/B 테스트로 개선 효과를 검증해본 경험을 보여주세요.",
      sourceQuote:
        "퍼널·전환율(CVR)·리텐션 지표 확인 및 A/B 테스트를 통한 개선 효과 검증",
    },
  ],
  // 네이버웹툰 - UI/UX 프로덕트 디자이너 (UI/UX Product Designer) (경력)
  cmu3o45q20002dbfb51g23r11: [
    {
      title: "비즈니스 요구사항 기반 UI/UX 문제 정의",
      body: "사용자 경험과 비즈니스 요구사항을 함께 이해하고 UI/UX 문제를 정의해 해결안을 설계해본 경험을 보여주세요.",
      sourceQuote:
        "사용자 경험과 비즈니스 요구사항을 이해하고 이를 바탕으로 UI/UX 문제를 정의하고 해결안을 설계할 수 있는 분",
    },
    {
      title: "Figma 디자인 시스템 제작 경험",
      body: "Figma로 디자인 시스템을 제작하고 활용해본 경험을 구체적으로 보여주세요.",
      sourceQuote:
        "Figma를 활용한 UI/UX 설계 및 디자인 시스템 제작 및 활용 역량을 갖추신 분",
    },
    {
      title: "인터랙션 검증 프로토타이핑 경험",
      body: "사용자 플로우와 인터랙션을 검증하기 위해 프로토타입을 만들어본 경험을 보여주세요.",
      sourceQuote:
        "인터랙션 및 사용자 플로우 검증을 위한 프로토타이핑 경험이 있으신 분",
    },
  ],
  // 스노우 - UI/프로모션 디자이너 (계약직)
  cmu3o4osq0007dbfba7xpquzb: [
    {
      title: "카메라 앱 UI 개선 경험",
      body: "카메라·이미지 서비스의 UI를 개선하고 운영해본 경험을 구체적으로 보여주세요.",
      sourceQuote:
        "SNOW, B612, wikit web 서비스의 UI 디자인 서포트",
    },
    {
      title: "Figma 오토레이아웃·컴포넌트 정리 역량",
      body: "Figma의 오토 레이아웃과 컴포넌트를 활용해 UI 가이드와 스펙 작업을 정리해본 경험을 보여주세요.",
      sourceQuote:
        "오토 레이아웃, 컴포넌트 정리 등 Figma 기반의 UI 가이드 및 스펙 작업을 원활하게 수행할 수 있는 분",
    },
    {
      title: "AI 도구 활용 그래픽 제작 경험",
      body: "AI 기술을 활용해 모델 생성이나 그래픽 작업을 지원해본 경험이 있다면 구체적으로 보여주세요.",
      sourceQuote:
        "AI 기술을 활용한 모델 생성 및 그래픽 디자인 작업 지원",
    },
  ],
  // 당근 - Product Designer - 부동산
  cmtyp96cw0002rygkuzzlwaf1: [
    {
      title: "복합 접점 탐색 경험 설계",
      body: "단지·매물·지도·피드처럼 여러 접점이 얽힌 탐색 경험을 하나의 흐름으로 설계해본 사례를 보여주세요.",
      sourceQuote:
        "당근 부동산의 단지·매물·지도·피드 등 주요 접점의 사용자 경험을 설계해요.",
    },
    {
      title: "의사결정 흐름 분석한 기회 발굴",
      body: "사용자가 어떤 맥락에서 어떻게 결정을 내리는지 분석해 새로운 제품 기회를 찾아낸 과정을 보여주세요.",
      sourceQuote:
        "사용자의 탐색 맥락과 의사결정 흐름을 분석해 제품 기회를 발굴해요.",
    },
    {
      title: "데이터 기반 가설 검증 경험",
      body: "실제 행동 데이터와 리서치로 가설을 세우고 실험해 검증까지 이어간 과정을 수치와 함께 보여주세요.",
      sourceQuote:
        "실제 행동 데이터와 사용자 리서치를 바탕으로 가설을 세우고 실험해요.",
    },
  ],
  // 당근 - Product Designer (인턴) - 로컬 잡스 (Trust & Safety)
  cmu1k4hqv0002u9h2eohsnk5z: [
    {
      title: "신뢰 접점을 디자인한 경험",
      body: "신원 인증, 신뢰 배지, 신고·검수 플로우처럼 유저가 신뢰를 직접 느끼는 접점을 디자인해본 경험을 구체적으로 보여주세요.",
      sourceQuote:
        "신원 인증, 신뢰 배지, 약속잡기, 신고·검수 플로우, 안전 안내와 사기 예방 경고 등 유저가 신뢰를 직접 느끼는 경험의 접점을 디자인해요",
    },
    {
      title: "유저 문제를 재정의한 과정",
      body: "정성적인 유저 보이스와 정량 데이터를 함께 보고, 개별 이슈를 넘어 유저 전체 경험 관점에서 문제를 다시 정의한 과정을 담아주세요.",
      sourceQuote:
        "유저 보이스와 정량 데이터를 통해 신뢰·안전 관련 사용자 문제를 발견하고, 개별 보이스에 대한 대응을 넘어 유저 전체 경험의 관점에서 문제를 다시 정의해요",
    },
    {
      title: "신뢰와 성장의 균형 잡은 제안",
      body: "위험은 명확히 알리면서도 서비스의 따뜻한 경험은 해치지 않은, 신뢰·안전·성장을 함께 고려한 디자인 결정 과정을 풀어서 쓰세요.",
      sourceQuote:
        "위험은 분명하게 알리면서도 서비스의 따뜻한 경험을 해치지 않도록, 신뢰와 안전 그리고 서비스의 성장까지 함께 고려한 균형 잡힌 디자인 안을 주도적으로 제안해요",
    },
  ],
  // 쿠팡 - Staff Visual Designer (Coupang Eats)
  cmtrk1vxm0003hn7wodibc2qz: [
    {
      title: "전사 비주얼 시스템 구축 경험",
      body: "제품·브랜드·비즈니스 전반을 아우르는 비주얼 디자인 원칙과 가이드라인을 직접 구축해본 경험을 보여주세요.",
      sourceQuote:
        "비주얼 디자인 원칙, 에셋, 가이드라인을 구축해 제품, 브랜드, 비즈니스 전반에서 일관된 비주얼 디자인 시스템을 만듭니다.",
    },
    {
      title: "복잡한 프로젝트 리드 경험",
      body: "여러 직군과 협업하며 프로젝트를 운영하고 디자인 방향성을 주도적으로 이끈 경험을 구체적으로 보여주세요.",
      sourceQuote:
        "Product Designer, Product Manager, Engineer, Marketing, Business Strategy 등 다양한 이해관계자와 협업하며 복잡한 프로젝트를 운영 관리하고, 디자인 방향성과 의사결정을 리드합니다.",
    },
    {
      title: "디자이너 성장 지원한 경험",
      body: "디자인 리뷰나 멘토링으로 다른 디자이너의 성장을 도운 경험이 있다면 구체적인 사례로 풀어주세요.",
      sourceQuote:
        "디자인 리뷰, 멘토링, 프로젝트 리딩 등을 통해 다른 디자이너의 성장을 지원합니다.",
    },
  ],
  // 쿠팡 - Senior Product Designer (Rocket Growth)
  cmtvud5d70003kt5ynpkil5yb: [
    {
      title: "전략부터 출시까지 전 과정 주도",
      body: "전략 수립부터 리서치, 설계, 테스트까지 프로덕트 디자인 전 과정을 직접 담당해본 경험을 보여주세요.",
      sourceQuote:
        "전략부터 리서치, 설계, 테스트, 디자인까지 프로덕트 디자인의 전 과정을 담당",
    },
    {
      title: "판매자 관점 대변한 리서치",
      body: "정성·정량 데이터로 판매자(B2B 유저)의 니즈를 파악하고 대변한 경험을 구체적으로 담아주세요.",
      sourceQuote:
        "다양한 정성적/정량적 데이터를 바탕으로 판매자의 입장에서 그들의 니즈를 대변",
    },
    {
      title: "유관부서 리뷰 리딩 경험",
      body: "빠른 실행을 위해 일정을 조율하고 유관부서 리뷰를 직접 리드해본 경험을 보여주세요.",
      sourceQuote:
        "빠른 업무 진행을 위한 계획과 조율, 그리고 의사결정을 위한 유관부서의 리뷰를 리딩",
    },
  ],
  // Bjak - UX Designer, AI App
  cmt668oz90004z5mdl5lk89pk: [
    {
      title: "AI 판단을 화면에 노출한 경험",
      body: "AI가 뭘 하고 있는지, 어떤 결정을 내렸는지, 사용자가 뭘 확인·조정해야 하는지를 화면에 어떻게 드러낼지 설계해본 경험을 보여주세요.",
      sourceQuote:
        "Design how the app surfaces what the AI is doing, what decisions it has made, and what the user needs to confirm or adjust.",
    },
    {
      title: "신뢰 이탈 지점을 찾은 리서치",
      body: "사용자가 어디서 신뢰를 잃고 불확실함을 느끼는지 사용성 리서치로 짚어낸 경험을 구체적으로 보여주세요.",
      sourceQuote:
        "Conduct usability research to understand where users lose trust, feel uncertain, or disengage.",
    },
    {
      title: "비결정적 시스템 UX 설계 역량",
      body: "결과를 예측하기 어려운 비동기·비결정적 시스템을 사용자가 이해할 수 있게 설계해본 사례를 담아주세요.",
      sourceQuote:
        "Ability to design for systems that are asynchronous, non-deterministic, and context-dependent.",
    },
  ],
  // Bjak - Interaction Designer, HCI
  cmt7lok4i0004uwsv5fsru02z: [
    {
      title: "멀티스텝 AI 플로우 설계 경험",
      body: "사용자가 작업을 시작·모니터링·일시정지·수정·완료하는 전체 흐름을 세밀하게 설계해본 경험을 보여주세요.",
      sourceQuote:
        "Design detailed interaction models for AI-driven flows, including how users initiate, monitor, pause, correct, and complete multi-step tasks.",
    },
    {
      title: "휴먼인더루프 컨트롤 설계",
      body: "사용자가 AI 결정을 검토하고 필요할 때 개입할 수 있으면서도 일일이 관리하지 않아도 되는 통제 장치를 설계한 경험을 담아주세요.",
      sourceQuote:
        "Design human-in-the-loop controls - how users review AI decisions, override actions, and stay informed without micromanaging.",
    },
    {
      title: "개입 시점 판단한 인터랙션 감각",
      body: "언제 사용자를 안내하고, 언제 확인을 구하고, 언제 그대로 둘지 판단한 기준을 구체적인 사례로 보여주세요.",
      sourceQuote:
        "Strong judgment on when users should be guided, interrupted, asked for confirmation, or left alone.",
    },
  ],
  // Bjak - Visual Designer
  cmt914i3x000699pul9mnftp7: [
    {
      title: "AI 신뢰 신호를 시각화한 경험",
      body: "AI가 생성한 콘텐츠와 시스템 상태, 신뢰도를 사용자가 한눈에 구분할 수 있게 시각 패턴으로 풀어낸 경험을 보여주세요.",
      sourceQuote:
        "Create visual patterns that help users parse AI-generated content, distinguish system states, and understand confidence and reliability signals.",
    },
    {
      title: "가변 콘텐츠 정보 위계 설계",
      body: "내용이 계속 바뀌고 불확실한 AI 인터페이스에서 정보 밀도와 위계를 어떻게 잡았는지 구체적으로 보여주세요.",
      sourceQuote:
        "Design for information density and hierarchy in AI interfaces where content is dynamic, variable, and often uncertain.",
    },
    {
      title: "다양한 상태의 비주얼 기준 정의",
      body: "에러·빈 화면·로딩·작업 상태 등 다양한 상태의 비주얼 기준을 세워본 경험을 담아주세요.",
      sourceQuote:
        "Define visual standards for error states, empty states, loading states, task states, and AI-generated output.",
    },
  ],
  // Bjak - Lead Graphic Designer
  cmtbvzy720004iv2bagh8eo4s: [
    {
      title: "웹·모바일 비주얼 랭귀지 설계",
      body: "웹과 모바일 전반의 비주얼 랭귀지와 디자인 시스템, UI 컴포넌트를 설계해본 경험을 보여주세요.",
      sourceQuote:
        "Design the visual language, design system, and UI components for A1's product across web and mobile.",
    },
    {
      title: "비주얼로 AI 신뢰도 전달한 감각",
      body: "색상·형태 같은 비주얼 요소로 AI의 동작과 신뢰도를 어떻게 전달했는지 사례로 풀어주세요.",
      sourceQuote:
        "Awareness of how visual cues communicate AI system behavior, trust, and confidence.",
    },
    {
      title: "불확실한 요구사항 속 작업 경험",
      body: "제품 요구사항이 계속 바뀌는 모호한 환경에서 작업을 진행해본 경험을 구체적으로 써주세요.",
      sourceQuote:
        "Comfort designing under ambiguity, with evolving product requirements.",
    },
  ],
  // Bjak - Senior Graphic Designer
  cmtbw06g90008iv2b25l0meaj: [
    {
      title: "속도·일관성 위한 시스템 운영",
      body: "작업 속도와 일관성, 명료함을 함께 지원하는 디자인 시스템을 만들고 운영해본 경험을 보여주세요.",
      sourceQuote:
        "Build and maintain a design system that supports speed, consistency, and clarity.",
    },
    {
      title: "가독성·대비 고려한 접근성 감각",
      body: "접근성 기준을 이해하고 가독성과 대비를 고려해 디자인한 경험을 구체적으로 담아주세요.",
      sourceQuote:
        "Understanding of accessibility standards and how to design for legibility and contrast.",
    },
    {
      title: "개발 정확도 높인 디자인 스펙",
      body: "엔지니어가 정확히 구현할 수 있도록 비주얼 에셋과 디자인 스펙을 꼼꼼히 남긴 경험을 보여주세요.",
      sourceQuote:
        "Contribute visual assets and design specs that engineers can implement accurately.",
    },
  ],

  // 바카티오 - [인턴] Product Designer (UI/UX)
  cmu5fuqsv000211h8uhsm8mh2: [
    {
      title: "제품 전반을 아우른 UI 설계 경험",
      body: "화면 하나가 아니라 Web/App 제품 전반의 UI를 설계하고 구현해본 경험을 보여주세요. 특정 화면보다 전체 흐름을 다뤄본 이야기가 좋아요.",
      sourceQuote: "제품 전반(Web/App)의 UI 설계 및 구현",
    },
    {
      title: "데이터로 문제를 찾아 해결한 과정",
      body: "감이 아니라 데이터를 기반으로 문제를 도출하고 개선까지 이어간 과정을 구체적으로 써주세요.",
      sourceQuote: "Product 개선을 위해 데이터를 기반으로 문제 도출 및 해결",
    },
    {
      title: "구조적인 UI 디자인 감각",
      body: "개발 구조를 이해하고 그에 맞춰 UI를 설계해본 경험이 있다면, 왜 그런 구조를 선택했는지까지 설명해주세요.",
      sourceQuote: "개발에 대한 이해를 바탕으로 구조적인 UI 디자인이 가능한 분",
    },
  ],

  // 바카티오 - Product Designer (UI/UX)
  cmu5fuv2w000711h8clxizn7u: [
    {
      title: "제품 전반을 아우른 UI 설계 경험",
      body: "화면 하나가 아니라 Web/App 제품 전반의 UI를 설계하고 구현해본 경험을 보여주세요. 특정 화면보다 전체 흐름을 다뤄본 이야기가 좋아요.",
      sourceQuote: "제품 전반(Web/App)의 UI 설계 및 구현",
    },
    {
      title: "데이터로 문제를 찾아 해결한 과정",
      body: "감이 아니라 데이터를 기반으로 문제를 도출하고 개선까지 이어간 과정을 구체적으로 써주세요.",
      sourceQuote: "Product 개선을 위해 데이터를 기반으로 문제 도출 및 해결",
    },
    {
      title: "구조적인 UI 디자인 감각",
      body: "개발 구조를 이해하고 그에 맞춰 UI를 설계해본 경험이 있다면, 왜 그런 구조를 선택했는지까지 설명해주세요.",
      sourceQuote: "개발에 대한 이해를 바탕으로 구조적인 UI 디자인이 가능한 분",
    },
  ],

  // 카카오뱅크 - 인터널 서비스 UI/UX 기획 어시스턴트 (체험형 인턴)
  cmu5fv01d000c11h8wcgiy2lt: [
    {
      title: "Web UI 설계·프로토타이핑 경험",
      body: "UX를 바탕으로 Web UI를 설계하고 프로토타입까지 만들어본 과정을 보여주세요. 화면이 완성되기까지의 판단 근거가 중요해요.",
      sourceQuote: "UX에 기반한 Web UI 설계 및 프로토타이핑 경험이 있는 분",
    },
    {
      title: "AI 도구로 업무를 효율화한 경험",
      body: "AI 도구를 실제 업무 프로세스 개선에 써본 경험이 있다면, 어떤 프로세스를 어떻게 바꿨는지 구체적으로 써주세요.",
      sourceQuote: "AI 도구를 활용해 업무 프로세스를 개선하거나 효율화한 경험이 있는 분",
    },
    {
      title: "어드민 화면 기획·운영 경험",
      body: "Back-office 성격의 어드민 화면을 기획하거나 운영/관리해본 경험이 있다면 함께 적어주세요.",
      sourceQuote: "어드민(Back-office) 기획, 화면 설계 또는 운영/관리 경험이 있는 분",
    },
  ],

  // CJ ENM - Mnet Plus K-pop UX Researcher
  cmu5fv64a000h11h86wsivm9p: [
    {
      title: "리서치 질문을 설계한 과정",
      body: "비즈니스 목표에서 출발해 어떤 리서치 질문을 세우고 사용자 행동을 분석했는지 흐름으로 보여주세요.",
      sourceQuote: "비즈니스 목표 달성을 위한 리서치 질문 정의 및 사용자 행동 분석",
    },
    {
      title: "As-is 사업 모델의 문제 발굴 사례",
      body: "기존 사업 모델을 뜯어보고 문제점을 찾아낸 구체적인 사례를 들어주세요. 어떤 근거로 문제라고 판단했는지가 중요해요.",
      sourceQuote: "As-is 사업 모델 및 문제점 발굴",
    },
    {
      title: "5년 이상 리서치·전략 기획 경력",
      body: "UX/CX 리서치, 마켓 리서치, 비즈니스·서비스 전략 기획 중 본인이 가장 깊게 해본 영역을 중심으로 경력을 정리해주세요.",
      sourceQuote: "관련 업무 경력 5년 이상 (UX/CX 리서치, 마켓 리서치, 비즈니스/서비스 전략 기획, 소비자 분석 등)",
    },
  ],

  // 메가존 - [MZD] [제조AX] UI/UX 기획·컨설턴트
  cmu5fvb34000m11h88b0s7qfh: [
    {
      title: "화면 정의서·와이어프레임 작성 경험",
      body: "직접 화면 정의서, 스토리보드, 와이어프레임을 작성해본 프로젝트를 구체적으로 보여주세요.",
      sourceQuote: "화면 정의서, 스토리보드, 와이어프레임을 직접 작성해 오신 분",
    },
    {
      title: "복잡한 정보를 정리한 화면 설계",
      body: "다루는 정보가 많고 판단 근거가 복잡한 화면을 어떻게 정리했는지, 그 과정에서의 기준을 설명해주세요.",
      sourceQuote: "다루는 정보가 많고 판단 근거가 복잡한 화면을 정리해 보신 분",
    },
    {
      title: "AI·데이터 프로젝트와 협업한 경험",
      body: "AI·데이터 프로젝트의 구조를 이해하고 엔지니어와 같은 언어로 소통해본 경험이 있다면 함께 적어주세요.",
      sourceQuote: "AI·데이터 프로젝트의 구조를 이해하고 엔지니어와 같은 언어로 대화하실 수 있는 분",
    },
  ],

  // 하나카드 - UX 설계 전문계약직 수시채용
  cmu5ncn000002vs4767qt2bch: [
    {
      title: "디지털 채널 UX 전략 기획 경험",
      body: "신규 서비스나 프로모션을 기획하고 화면구조·경험까지 설계해본 디지털 채널 UX 전략 사례를 보여주세요.",
      sourceQuote: "디지털 채널별 UX 전략 기획 및 관리 (신규 서비스·프로모션 기획, 화면구조 및 경험 설계)",
    },
    {
      title: "경쟁사 UX 분석·진단 경험",
      body: "동종·이종 업계 서비스를 분석해 디지털 채널의 경쟁력을 진단하고 개선한 과정을 구체적으로 써주세요.",
      sourceQuote: "동종·이종 업계 서비스 및 UX 분석, 디지털 채널 경쟁력 진단 및 개선",
    },
    {
      title: "금융 플랫폼 기획·운영 경력",
      body: "금융 플랫폼 서비스를 실제로 기획하거나 운영해본 경험이 있다면 어떤 역할을 맡았는지 정리해주세요.",
      sourceQuote: "금융 플랫폼 서비스 기획·운영 실무 경험자",
    },
  ],
  // 티오더
  cmucoueju0002rt3zwd8y4ep9: [
    { title: "AI 도구로 워크플로우 개선한 경험", body: "AI 도구를 활용해 디자인 워크플로우 자체를 설계하고 개선해본 경험을, 구체적인 사례와 함께 보여주세요.", sourceQuote: "AI 툴을 활용해 디자인 워크플로우를 직접 설계하고 개선한 경험이 있으신 분" },
    { title: "멀티 디바이스 프로덕트 설계 경험", body: "태블릿과 앱처럼 서로 다른 기기 환경의 프로덕트를 설계해본 경험을, 화면 단위로 정리해 보여주세요.", sourceQuote: "오더 태블릿, 마스터 태블릿, 사장님앱, 광고 상품 등 티오더 주요 프로덕트 설계 및 개선" },
    { title: "F&B·B2B2C 도메인 이해", body: "F&B나 B2B2C처럼 여러 이해관계자가 복잡하게 얽힌 도메인을 다뤄본 경험이 있다면 꼭 포함해주세요.", sourceQuote: "F&B, B2B2C 등 유사 도메인에서의 디자인 경험으로 문제에 대한 이해와 도메인 기반의 판단력을 갖추신 분" },
  ],
  // OVERDARE
  cmucoueot0005rt3zccfbtwvd: [
    {
      title: "저사양 모바일 환경 UI 구현 경험",
      body: "저사양 기기와 제한된 네트워크 환경에서도 쾌적하게 동작하는 UI를 구현해본 경험을 보여주세요.",
      sourceQuote: "저사양 모바일 기기를 고려한 UI 구현 경험",
    },
    {
      title: "언리얼 UMG 기반 UI 직접 제작 경험",
      body: "언리얼 엔진 UMG로 앱/게임 UI를 직접 제작하고 애니메이션·머티리얼까지 다뤄본 경험을 보여주세요.",
      sourceQuote: "언리얼 엔진(UMG)을 활용한 앱/게임 UI 직접 제작",
    },
    {
      title: "재사용 가능한 UI 컴포넌트 설계 경험",
      body: "반복 제작 패턴을 재사용 가능한 UI 컴포넌트로 체계화해본 경험을 구체적으로 보여주세요.",
      sourceQuote: "UI 컴포넌트화 및 재사용 가능한 구조 설계에 대한 이해",
    },
  ],
  // OmniCraft Labs
  cmucouetu0008rt3zzzngnmiq: [
    {
      title: "플레이 흐름 기반 UI/UX 설계 경험",
      body: "게임의 플레이 흐름을 고려해 유저가 직관적으로 이해할 수 있는 UI/UX를 설계한 경험을 보여주세요.",
      sourceQuote:
        "게임의 플레이 흐름을 고려하며 유저가 직관적으로 이해할 수 있는 UI/UX를 설계할 수 있는 분",
    },
    {
      title: "사용성 테스트 기반 UX 개선 경험",
      body: "플레이 과정에서 발생하는 불편 요소를 분석하고 지속적으로 UX를 개선해본 경험을 보여주세요.",
      sourceQuote: "플레이 과정에서 발생하는 불편 요소를 분석하고, 지속적으로 UX를 개선할 수 있는 분",
    },
    {
      title: "다직군 협업으로 UI 구현 방향 제시한 경험",
      body: "기획·프로그래밍·아트와 협업해 실제 게임에 적용 가능한 UI 구현 방향을 제시해본 경험을 보여주세요.",
      sourceQuote:
        "기획, 프로그래밍, 아트와 협업하여 실제 게임에 적용 가능한 UI를 설계하고 구현 방향을 제시할 수 있는 분",
    },
  ],
  // Loonshot Games(Project Camp)
  cmucouezi000brt3z8p6008fg: [
    {
      title: "모바일 RPG UX 흐름 설계 경험",
      body: "모바일 RPG의 핵심 UX 흐름과 전반적인 UI 구조를 설계해본 경험을 구체적으로 보여주세요.",
      sourceQuote: "모바일 RPG의 핵심 UX 흐름과 전반적인 UI 구조 설계",
    },
    {
      title: "게임 플레이 기반 정보 구조 설계 경험",
      body: "게임 플레이 경험을 바탕으로 정보 구조와 화면 흐름을 설계해본 경험을 보여주세요.",
      sourceQuote: "게임 플레이 경험을 바탕으로 정보 구조와 화면 흐름을 설계할 수 있는 분",
    },
    {
      title: "세계관에 맞는 GUI 컨셉 제안 경험",
      body: "게임 세계관과 비주얼 톤에 어울리는 GUI 컨셉과 연출 방향을 직접 제안해본 경험을 보여주세요.",
      sourceQuote: "판타지 세계관과 2.5D 비주얼에 어울리는 GUI 컨셉 및 연출 방향 제안",
    },
  ],
  // 크래프톤(PUBG STUDIOS)
  cmucouf3v000ert3zbq3guij7: [
    {
      title: "게임 컨셉 맞춤 UI 시안 제안 경험",
      body: "게임의 콘셉트와 분위기에 맞는 UI 디자인 시안을 직접 제안하고 시각화해본 경험을 보여주세요.",
      sourceQuote: "게임의 콘셉트와 분위기에 맞는 UI 디자인 시안을 제안하고 시각화할 수 있으신 분",
    },
    {
      title: "GUI 요소 드로잉 제작 역량",
      body: "아이콘, 버튼, 배지 등 GUI 요소를 직접 드로잉해 제작할 수 있는 역량을 포트폴리오로 보여주세요.",
      sourceQuote: "아이콘, 버튼, 배지 등 GUI 요소를 직접 제작할 수 있는 드로잉 역량을 갖추신 분",
    },
    {
      title: "라이브 서비스 마케팅 에셋 제작 경험",
      body: "라이브 서비스 중인 게임에서 배너·마케팅 에셋을 제작해본 경험이 있다면 구체적으로 보여주세요.",
      sourceQuote: "라이브 서비스를 하시면서 배너 및 마케팅 에셋 제작 경험이 있으신 분",
    },
  ],
  // 크래프톤(Publishing Platform Div.)
  cmucouf8t000hrt3zdb5hdgz2: [
    {
      title: "디자인 시스템 구축·운영 경험",
      body: "UI/UX 디자인 경력과 함께 디자인 시스템을 직접 구축하고 운영해본 경험을 보여주세요.",
      sourceQuote: "3년 이상의 UI/UX 디자인 경력과 디자인 시스템을 직접 구축하고 운영한 경험",
    },
    {
      title: "데이터 기반 UX 최적화 경험",
      body: "사용자 행동 데이터와 리서치 결과를 근거로 디자인 방향성을 수립하고 UX를 최적화해본 경험을 보여주세요.",
      sourceQuote: "사용자 행동 데이터, 리서치 결과를 바탕으로 디자인 방향성 수립 및 사용자 경험 최적화",
    },
    {
      title: "반응형 플랫폼 사용자 중심 설계 경험",
      body: "웹/모바일 환경에 대한 이해를 바탕으로 반응형 플랫폼에 맞는 사용자 중심 설계를 해본 경험을 보여주세요.",
      sourceQuote:
        "웹/모바일 환경에 대한 깊은 이해를 바탕으로 반응형 플랫폼에 적합한 사용자 중심 설계 경험",
    },
  ],
  // CTK
  cmucoufdl000krt3zyb9947fm: [
    {
      title: "주요 퍼널 데이터 기반 UX 개선 경험",
      body: "회원가입·문의·결제 같은 핵심 퍼널을 데이터 근거로 개선해본 경험을 구체적으로 보여주세요.",
      sourceQuote: "회원가입·문의·결제 등 주요 퍼널의 데이터 기반 UX 개선 경험",
    },
    {
      title: "디자인 시스템 구축·운영 경험",
      body: "Figma 기반 디자인 시스템을 직접 구축하고 운영해본 경험을 보여주세요.",
      sourceQuote: "Design System 구축 및 운영 경험자",
    },
    {
      title: "뷰티·이커머스 플랫폼 디자인 경험",
      body: "뷰티, 이커머스, SaaS 플랫폼에서 디자인해본 경험이 있다면 구체적인 성과와 함께 보여주세요.",
      sourceQuote: "뷰티, 이커머스, SaaS 플랫폼 디자인 경험자",
    },
  ],
  // 바이오리서치에이아이
  cmucoufim000nrt3z7w2zkwor: [
    {
      title: "분석형 화면 데이터 시각화 설계 경험",
      body: "차트·통계·테이블이 많은 분석형 화면에서 사용자가 정보를 빠르게 찾도록 설계해본 경험을 보여주세요.",
      sourceQuote:
        "차트, 통계, 필터, 테이블이 많은 분석형 화면을 다루며, 사용자가 필요한 정보를 빠르게 찾도록 설계합니다.",
    },
    {
      title: "프로덕트·브랜드 디자인을 함께 경험",
      body: "화면 설계뿐 아니라 브랜드 디자인까지 함께 다뤄본 경험을 포트폴리오로 보여주세요.",
      sourceQuote: "프로덕트 설계와 브랜드 디자인을 모두 경험한 분",
    },
    {
      title: "AI 도구로 화면을 직접 구현·배포한 경험",
      body: "AI 도구로 화면이나 업무 도구를 직접 만들어 배포까지 해본 경험이 있다면 구체적으로 보여주세요.",
      sourceQuote:
        "AI 도구(Claude Code, Codex, Cursor 등)로 화면이나 업무 도구를 직접 만들어 배포해 본 경험이 있는 분",
    },
  ],
  // 폴리큐브
  cmucoufnm000qrt3zbe9b1oy4: [
    {
      title: "다양한 서비스 UI/UX 동시 운영 경험",
      body: "성격이 다른 여러 서비스의 UI/UX를 동시에 다뤄본 경험을 포트폴리오로 보여주세요.",
      sourceQuote: "강남철학관, 쿼카팜, 애드넥트 UI/UX",
    },
    {
      title: "AI 제작툴 활용 경험",
      body: "AI 기반 디자인 제작툴을 실무에 능숙하게 활용해본 경험이 있다면 구체적으로 어필하세요.",
      sourceQuote: "AI 제작툴 사용 능숙자",
    },
  ],
  // 알라딘
  cmucoufry000trt3z7m7bhhtd: [
    {
      title: "디자인부터 퍼블리싱까지 1인 완결 경험",
      body: "이벤트·프로모션 페이지를 디자인부터 HTML/CSS/JS 퍼블리싱까지 혼자 완결해본 경험을 보여주세요.",
      sourceQuote: "이벤트, 프로모션 페이지 디자인 및 웹 퍼블리싱 (HTML/CSS/JS 1인 완결형 수행)",
    },
    {
      title: "동적 인터랙션 직접 구현 경험",
      body: "JavaScript(또는 jQuery)로 팝업·슬라이드 같은 동적 인터랙션을 직접 구현해본 경험을 보여주세요.",
      sourceQuote:
        "JavaScript(또는 jQuery)를 활용해 동적 인터랙션(팝업, 슬라이드, 이벤트 제어 등)을 직접 구현할 수 있으신 분",
    },
    {
      title: "모바일 앱 디자인 프로젝트 다수 수행 경험",
      body: "모바일 앱 디자인 프로젝트를 3건 이상 수행해본 경험을 구체적인 결과와 함께 보여주세요.",
      sourceQuote: "모바일 앱 디자인 프로젝트를 3건 이상 수행하신 분",
    },
  ],
  // 올리브영(CJ올리브영 신입 글로벌 UI/UX디자인)
  cmucp5rff0002c3qf8ee78vty: [
    {
      title: "글로벌 온라인몰 UI/UX 디자인 경험",
      body: "해외 이용자를 대상으로 한 온라인몰이나 서비스의 UI/UX를 설계해본 경험을 보여주세요.",
      sourceQuote: "올리브영 US·글로벌몰 UI/UX 디자인",
    },
    {
      title: "사용자 흐름·프로토타입 설계 경험",
      body: "사용자 관점에서 문제를 정의하고 흐름과 프로토타입을 설계해본 경험을 구체적으로 보여주세요.",
      sourceQuote: "사용자 관점 문제 정의 및 사용자 흐름·프로토타입 설계",
    },
    {
      title: "디자인 시스템 구축·운영 경험",
      body: "여러 국가/채널에 적용되는 디자인 시스템이나 UI 라이브러리를 구축·운영해본 경험을 보여주세요.",
      sourceQuote: "글로벌 디자인 시스템 및 UI 라이브러리 구축·운영",
    },
  ],
  // pxd - Product Design Intern
  cmucxz9fa0001vfw5n45ha7a0: [
    { title: "디자인 시스템 기반 UI 구현 경험", body: "구축된 디자인 시스템과 컴포넌트를 활용해 Web/App 화면을 직접 디자인해본 경험을 보여주세요.", sourceQuote: "구축된 디자인 시스템과 컴포넌트를 활용한 Web/App UI 화면 디자인" },
    { title: "기획 의도 이해 기반 UI 구현 경험", body: "기획 의도와 사용자 경험을 이해하고 직관적인 UI로 구현해본 경험을 구체적으로 보여주세요.", sourceQuote: "기획 의도와 사용자 경험을 이해하여 직관적이고 완성도 높은 UI 구현" },
    { title: "생성형 AI 활용 디자인 경험", body: "생성형 AI나 다양한 디자인 도구를 활용해 아이디어를 탐색하고 시안을 제작해본 경험을 보여주세요.", sourceQuote: "생성형 AI 및 다양한 디자인 도구를 활용한 아이디어 탐색 및 시안 제작" },
  ],
  // KREAM - 콘텐츠 디자인 체험형 인턴
  cmucy7ef60002iid0gcg4zy8k: [
    { title: "카드뉴스·배너 디자인 경험", body: "카드 뉴스, 이벤트 배너 등 콘텐츠 디자인 작업물을 구체적으로 보여주세요.", sourceQuote: "카드 뉴스, 이벤트 배너 등 디자인 경험이 있으신 분" },
    { title: "UI·영상·3D 그래픽 제작 역량", body: "디자인 시뮬레이션을 위한 UI, 영상, 3D 그래픽까지 제작해본 경험이 있다면 함께 보여주세요.", sourceQuote: "디자인 시뮬레이션을 위한 UI, 영상, 3D 그래픽 제작이 가능한 분" },
    { title: "레퍼런스 기반 아이디어 제안 경험", body: "레퍼런스를 스스로 수집·분석해서 자신만의 아이디어로 발전시켜본 경험을 보여주세요.", sourceQuote: "필요한 레퍼런스를 수집/분석하고, 자신만의 아이디어를 제시할 수 있는 분" },
  ],
  // 토스플레이스 - Brand Design Assistant
  cmudndeck0001lcs3gy4fr5r7: [
    { title: "편집 디자인 실무 경험", body: "제안서나 행사 자료 같은 편집 디자인 작업물을 구체적으로 보여주세요.", sourceQuote: "제안서 편집 디자인, 내부 행사 그래픽 제작과 관련된 사내 요청 업무를 지원해요." },
    { title: "제품 지면 그래픽 제작 경험", body: "하드웨어나 단말기 등 실물 제품에 들어가는 그래픽을 제작해본 경험이 있다면 보여주세요.", sourceQuote: "포스와 프론트 제품 내 지면에 필요한 그래픽을 제작해요." },
    { title: "AI 도구로 그래픽 제작한 경험", body: "AI 툴로 그래픽을 생성하고 실제 작업에 적용해본 경험이 있다면 구체적으로 어필하세요.", sourceQuote: "AI 툴을 활용해 그래픽을 생성하고, 디자인 작업에 적용해 본 경험이 있다면 더 좋아요." },
  ],
  // 스플랩(Umoh) - UI/UX & Contents Designer
  cmujwiaa80002d71kbjezoi4i: [
    { title: "데이터 기반 우선순위 판단 경험", body: "GA, Hotjar 등 사용자 데이터로 우선순위를 판단하고 개선해본 경험이 있다면 구체적으로 보여주세요.", sourceQuote: "GA, Hotjar, 인터콤 등 사용자 데이터에 기반한 우선순위 파악 및 개선 능력" },
    { title: "고객 소통과 VOC 수집 경험", body: "전화, 문자, 채널톡 등으로 고객과 직접 소통하며 VOC를 모아본 경험을 보여주세요.", sourceQuote: "고객과의 전화, 문자, 채널톡 등을 통한 적극적 소통 및 VOC 수집" },
    { title: "프로젝트를 끝까지 리드한 경험", body: "기획부터 종결까지 프로젝트 단위로 오너십을 가지고 팀을 이끌어본 경험을 보여주세요.", sourceQuote: "프로젝트/태스크 단위 오너십을 가지고 팀 리딩 및 프로젝트 종결" },
  ],
  // 카카오스타일(PIYONNA) - 글로벌 뷰티 프로덕트 디자이너
  cmujwiaep0005d71k2xdor80q: [
    { title: "문제 발견부터 해결 제안까지의 과정", body: "사용자 관점에서 문제를 발견하고 사용성과 비즈니스 목표를 함께 고려해 해결 방안을 제안해본 과정을 보여주세요.", sourceQuote: "사용자 관점에서 문제를 발견하고, 사용성과 비즈니스 목표를 함께 고려하여 적절한 디자인 해결 방안을 제안할 수 있는 역량" },
    { title: "디자인 시스템 구축·운영 경험", body: "모바일 웹 환경에 맞는 디자인 시스템이나 가이드를 만들고 운영해본 경험을 보여주세요.", sourceQuote: "모바일 웹 환경에 적합한 디자인 시스템 및 가이드 구축·운영·고도화" },
    { title: "데이터 기반 사용성 개선 경험", body: "사용자 행동 데이터나 피드백을 바탕으로 실제 사용성을 개선해본 경험이 있다면 함께 보여주세요.", sourceQuote: "사용자 행동 데이터·피드백을 바탕으로 한 사용성 개선 경험" },
  ],
  // 코인원 - Product Designer
  cmujwiaj30008d71k2utsz3kw: [
    { title: "확장 가능한 디자인 시스템 설계 경험", body: "Component, Pattern, Design Token을 정의하고 발전시켜본 경험을 구체적으로 보여주세요.", sourceQuote: "Component, Pattern, Design Token 정의 및 발전을 통한 확장 가능한 인터페이스 설계" },
    { title: "UX와 UI의 균형을 맞춘 설계 경험", body: "사용자와 비즈니스 요구 사이의 균형을 고려해 UX와 UI를 함께 설계해본 경험을 보여주세요.", sourceQuote: "사용자와 비즈니스의 균형을 고려하여 UX와 UI를 함께 설계할 능력" },
    { title: "AI를 활용한 디자인 프로세스 경험", body: "디자인 프로세스 전반에 AI 도구를 실제로 활용해본 경험이 있다면 보여주세요.", sourceQuote: "디자인 프로세스 전반에 AI 활용" },
  ],
  // 브이앤지 - 시스템/서비스 및 사내 디자이너
  cmujwianh000bd71kdi7ybw4h: [
    { title: "시스템 기반 UI/UX 설계 경험", body: "복잡한 시스템을 이해하고 분석해 사용자 친화적인 UI/UX로 풀어본 경험을 보여주세요.", sourceQuote: "시스템 이해 및 분석을 바탕으로 한 사용자 친화적 UI/UX 디자인 능력" },
    { title: "5년 이상의 웹 디자인 실무 경력", body: "웹 페이지 디자인 실무를 5년 이상 해온 경험과 대표 결과물을 보여주세요.", sourceQuote: "웹 페이지 디자인 경력 최소 5년 이상" },
    { title: "사내·고객 대상 커뮤니케이션 경험", body: "디자인 산출물을 두고 사내 팀이나 고객과 직접 소통하고 조율해본 경험을 보여주세요.", sourceQuote: "디자인 산출물에 대해 사내팀 및 고객과의 커뮤니케이션 역량 보유" },
  ],
  // 에이치엔서브 - 하나은행 본점 UI/UX디자이너
  cmum9ocxg0002xo52ppiqybgw: [
    { title: "UI·UX 기획 경험", body: "모바일이나 디지털 화면의 UI·UX를 직접 기획해본 경험을 구체적으로 보여주세요.", sourceQuote: "UI·UX 기획" },
    { title: "유관업무 실무 경험", body: "인턴이나 아르바이트를 포함해 유관 업무를 1년 이상 해본 경험이 있다면 구체적으로 보여주세요.", sourceQuote: "유관업무 경험자(인턴·알바 포함) 또는 유관업무 경력 1년 이상" },
    { title: "장기 근무·즉시 출근 가능 여부", body: "장기근무가 가능하고 즉시 출근할 수 있다는 점을 이력서에서 분명히 밝혀주세요.", sourceQuote: "즉시 출근 가능자, 장기근무 가능자" },
  ],
  // 한국벤자민무어페인트 - 디자인팀 채용
  cmum9od320005xo525o4kw79j: [
    { title: "전단지·정보 디자인 실무 경험", body: "전단지나 정보 디자인처럼 정보 전달 중심의 그래픽 작업물을 구체적으로 보여주세요.", sourceQuote: "전단지 디자인" },
    { title: "POP·브랜드 디자인 작업 경험", body: "매장 POP나 브랜드 관련 디자인 작업물이 있다면 함께 보여주세요.", sourceQuote: "POP·브랜드 디자인" },
    { title: "신입도 지원 가능한 디자인 직무", body: "신입·경력 모두 지원 가능하니, 학교나 개인 프로젝트에서의 디자인 작업물도 자신 있게 보여주세요.", sourceQuote: "신입·경력 모두 가능" },
  ],
  // 토스뱅크 - Visual Designer (Brand Communications Team)
  cmunpi0vz000113xnmwn1qu1g: [
    { title: "완성도 높은 비주얼 판단·제작 역량", body: "완성도 높은 비주얼이 무엇인지 판단하고 직접 만들어본 작업물을 보여주세요.", sourceQuote: "완성도 높은 비주얼이 무엇인지 판단하고 직접 만들어낼 수 있는 역량" },
    { title: "시각적 결과물로 설득한 경험", body: "시각적 결과물로 이해관계자를 설득해본 경험을 구체적으로 보여주세요.", sourceQuote: "시각적 결과물로 이해관계자를 설득할 수 있는 역량" },
    { title: "AI로 결과물 퀄리티를 높인 경험", body: "AI를 활용해 작업 결과물의 퀄리티를 끌어올려본 경험이 있다면 보여주세요.", sourceQuote: "AI를 사용해서 결과물의 퀄리티를 올려본 경험" },
  ],
  // 현대오토에버 - UX & UI Designer (생성형 AI 서비스 운영 _UI 디자인)
  cmunpi0ze000313xngejggxl7: [
    { title: "생성형 AI 서비스 UI 디자인 경험", body: "생성형 AI 기반 서비스의 UI를 기획하거나 디자인해본 경험이 있다면 구체적으로 보여주세요.", sourceQuote: "생성형 AI 서비스 운영 _UI 디자인" },
    { title: "본인 역량에 맞는 전형 선택 전략", body: "코딩테스트와 과제테스트 중 본인 강점이 더 잘 드러나는 전형을 선택해 지원 전략을 세워보세요.", sourceQuote: "코딩테스트 또는 과제테스트 중 본인 역량에 맞는 전형을 선택해 지원합니다." },
    { title: "신입 공채 지원 전 명확한 포지션 선택", body: "테스트 전형 간 교차 선택이 안 되니, 지원 전 원하는 포지션과 전형을 명확히 정해두세요.", sourceQuote: "서로 다른 테스트 전형 간 포지션 교차 선택은 불가합니다." },
  ],
  // 토스뱅크 - Product Designer (신입, 2년 이하)
  cmunprcot0001c2bsbmglhjjb: [
    { title: "데이터 기반 문제 개선 경험", body: "사용자가 원하는 것을 정량·정성 데이터로 확인하고 개선해본 경험을 구체적으로 보여주세요.", sourceQuote: "내가 원하는 것이 아닌, 사용자가 원하는 것을 정량·정성 데이터 기반으로 개선한 경험이 있는 분이 필요해요." },
    { title: "직접 설계하고 배포한 경험", body: "사용자에게 집착해 만든 제품을 직접 설계하고 배포하거나 피드백 받은 경험을 보여주세요.", sourceQuote: "이를 근거로 사용자에게 집착해 만든 제품을 직접 설계하고 배포하거나 피드백 받은 경험이 필요해요." },
    { title: "As-is·To-be로 정리한 개선 과정", body: "개선 전(as-is)과 개선 후(to-be) 화면을 비교할 수 있는 포트폴리오로 보여주세요.", sourceQuote: "개선 전의 화면(as-is)과 개선 후의 화면(to-be)을 잘 확인할 수 있는 이미지가 있으면 더욱 좋아요." },
  ],
  // 토스플레이스 - Design Assistant
  cmunprcqr0003c2bszkviqcwo: [
    { title: "광고·배너 그래픽 제작 경험", body: "광고나 배너 그래픽을 제작해본 작업물을 구체적으로 보여주세요.", sourceQuote: "광고/배너 그래픽 제작 경험이 있는 분을 찾고 있어요." },
    { title: "다양한 매체 대응 그래픽 경험", body: "다양한 사이즈와 매체에 맞춰 그래픽을 대응해본 경험을 보여주세요.", sourceQuote: "다양한 사이즈와 매체에 맞는 그래픽 대응이 가능한 분이면 좋아요." },
    { title: "AI 이미지 생성 툴 활용 경험", body: "AI 이미지 생성 툴로 그래픽 작업을 해본 경험이 있다면 함께 보여주세요.", sourceQuote: "AI 이미지 생성 툴을 활용해 그래픽 작업을 해본 경험이 있다면 더 좋아요." },
  ],
  // 토스 - Global UX Research Assistant
  cmunprcsf0005c2bsysgc5m7d: [
    { title: "영어로 진행한 사용자 인터뷰 경험", body: "영어로 사용자 인터뷰나 사용성 테스트를 진행해본 경험을 구체적으로 보여주세요.", sourceQuote: "You'll lead interviews and usability tests with users in English-speaking markets, from facilitating sessions to documenting the findings." },
    { title: "다른 문화권에 대한 호기심", body: "다른 나라 사람과 대화하며 새로운 걸 배웠던 경험을 구체적으로 들려주세요.", sourceQuote: "You're curious about customers and motivated to uncover problems and improve the product." },
    { title: "낯선 업무에 스스로 답을 찾는 태도", body: "낯선 업무도 스스로 방법을 찾아 끝까지 해결해본 경험을 보여주세요.", sourceQuote: "You're comfortable with unfamiliar work and can find a way forward and see it through." },
  ],
  // 토스 - Global UX Research Program Manager
  cmunprcu20007c2bs9xfdjp4d: [
    { title: "리서치 프로세스 개선 경험", body: "비효율적인 리서치 프로세스를 찾아 직접 개선해본 경험을 구체적으로 보여주세요.", sourceQuote: "효율적인 리서치 실행을 위해 글로벌 리서치 프로세스를 최적화하고, 비효율적인 영역을 찾아 개선하는 업무를 담당해요." },
    { title: "리서치 운영 관리 경험", body: "리서치 툴 개선, 교육, 리크루팅 운영 등 리서치 운영을 관리해본 경험을 보여주세요.", sourceQuote: "리서치에 대한 기본 이해가 있는 오퍼레이션 담당자로서, 리서치 운영을 관리한 경험이 필요해요. (예. 리서치 툴 개선, 교육, 프로세스 최적화, 리크루팅 운영 등)" },
    { title: "글로벌 커뮤니케이션 영어 역량", body: "해외 파트너사와 이메일로 소통하거나 글로벌 고객과 인터뷰 일정을 조율해본 경험을 보여주세요.", sourceQuote: "해외 파트너사와 이메일로 소통하고, 글로벌 고객과 인터뷰 일정을 잡을 때 필요한 영어 역량이 필요해요." },
  ],
  // 토스플레이스 - User Interview Assistant
  cmunprcvn0009c2bsoqfv0l0a: [
    { title: "다양한 고객 응대 경험", body: "다양한 연령대와 특성의 고객과 유선이나 대면으로 소통해본 경험을 구체적으로 보여주세요.", sourceQuote: "다양한 연령대와 특성을 지닌 고객들과 유선 및 대면 소통 경험이 있는 분을 원해요." },
    { title: "꼼꼼한 자료 정리 경험", body: "정해진 규칙에 맞춰 자료를 꼼꼼히 정리해본 경험이 있다면 보여주세요.", sourceQuote: "정해진 규칙에 맞춰 자료를 꼼꼼히 정리해본 경험이 있다면 좋아요." },
    { title: "능동적인 협업 경험", body: "스스로 나서서 능동적으로 협업해본 경험을 구체적으로 보여주세요.", sourceQuote: "능동적으로 협업해 본 경험이 있으신 분이 필요해요." },
  ],
  // 토스 - Visual Design Assistant
  cmunprcxc000bc2bsjuqn8d22: [
    { title: "브랜딩 콘텐츠 제작 경험", body: "인스타그램 이미지·영상, 배너, 썸네일 등 브랜딩 콘텐츠 작업물을 보여주세요.", sourceQuote: "브랜딩/마케팅에 필요한 다양한 콘텐츠(인스타그램 이미지·영상, 배너, 썸네일 등)를 디자인해요." },
    { title: "행사·굿즈 디자인 지원 경험", body: "포스터나 굿즈 등 오프라인 행사에 필요한 디자인을 지원해본 경험을 보여주세요.", sourceQuote: "대외 행사 전반에 필요한 디자인 관련 업무를 서포트해요. (포스터, 굿즈 제작 등)" },
    { title: "AI 활용 디자인 효율화 경험", body: "AI 툴로 다양한 아웃풋을 만들거나 작업을 효율화해본 경험이 있다면 보여주세요.", sourceQuote: "AI 툴로 다양한 아웃풋을 만들거나 디자인 작업을 효율화해 본 적이 있다면 더 좋아요." },
  ],
  // 토스뱅크 - Visual Design Assistant
  cmunprcyx000dc2bs7czs9aqu: [
    { title: "2D·3D·애니메이션 그래픽 제작 경험", body: "2D, 3D, 애니메이션 등 다양한 형태의 그래픽 제작 작업물을 보여주세요.", sourceQuote: "토스뱅크 서비스에 활용될 2D, 3D, 애니메이션 등의 그래픽 제작을 지원해요." },
    { title: "3D 프로그램 활용 경험", body: "C4D, Octane, Redshift 등 3D 프로그램을 활용해 작업한 경험을 보여주세요.", sourceQuote: "3D 프로그램 (C4D, Octane, Redshift 등) 활용 능력이 필요해요." },
    { title: "AI 툴 활용 경험", body: "Gemini, ChatGPT, Midjourney 등 AI 툴을 활용해본 경험이 있다면 보여주세요.", sourceQuote: "AI 툴 (Gemini, Chat GPT, Midjourney 등) 활용 능력이 있다면 더욱 좋아요." },
  ],
  // 토스인슈어런스 - Product Designer
  cmunprd0m000fc2bsukoxfqb4: [
    { title: "1인 디자이너로 제품 전체를 설계한 경험", body: "고객과 만나는 모든 화면을 혼자 설계하고 의사결정해본 경험을 구체적으로 보여주세요.", sourceQuote: "제품의 1인 디자이너로서 고객과 만나는 모든 화면을 주도적으로 설계하고 의사결정해요." },
    { title: "독립적인 의사결정 경험", body: "별도 승인 없이 스스로 판단하고 책임져본 경험을 보여주세요.", sourceQuote: "별도 승인이나 보고는 필요 없어요. Product Designer가 사용자 경험에 대해 최고의 책임과 권한을 가져요." },
    { title: "소규모 팀에서의 주도적 협업 경험", body: "4~6명 정도의 소규모 팀에서 스타트업처럼 주도적으로 일해본 경험을 보여주세요.", sourceQuote: "각 사일로는 제품을 만들기 위한 최소 인원 4~6명으로 구성되어 있어요. 독립적으로 의사결정하기 때문에 마치 작은 스타트업에 합류한 느낌일 거예요." },
  ],
  // 유아이볼 - [재택근무] UI/UX 콘텐츠 에디터
  cmunqf0bx0002y3145kb8bxui: [
    { title: "UI/UX 콘텐츠 기획·편집 경험", body: "UI/UX 관련 콘텐츠를 직접 기획하고 편집해본 경험을 구체적으로 보여주세요.", sourceQuote: "재택근무 UI/UX 콘텐츠 에디터" },
    { title: "Figma·Notion 활용 능력", body: "Figma나 Notion으로 콘텐츠나 디자인 자료를 정리해본 경험을 보여주세요.", sourceQuote: "Figma, Notion, Photoshop 활용 능력" },
    { title: "희망 고용형태를 명확히 밝히는 전략", body: "계약직·인턴도 정규직 전환이 가능하니, 본인이 원하는 고용형태를 지원서에 분명히 밝혀보세요.", sourceQuote: "계약직·인턴은 정규직 전환이 가능해요." },
  ],
  // 제네시스네스트 - [인턴] UX/UI/모바일/웹 디자이너(전환형)
  cmunrpcrs00023qerkzm5c9q8: [
    { title: "UI/GUI 디자인 실무 경험", body: "Web, APP UI/GUI 디자인 작업물을 구체적으로 보여주세요.", sourceQuote: "Web, APP UI/GUI 디자인" },
    { title: "그래픽·키비주얼 제작 경험", body: "서비스에 어울리는 그래픽 에셋이나 키 비주얼을 제작해본 경험을 보여주세요.", sourceQuote: "서비스의 UI/UX에 어울리는 Graphic Asset, 키 비주얼 제작" },
    { title: "결과물을 논리적으로 설명하는 능력", body: "본인의 디자인 결과물을 왜 그렇게 만들었는지 논리적으로 설명해보세요.", sourceQuote: "자신의 디자인 결과물에 대해 논리적으로 설명할 수 있는 분" },
  ],
  // 포스타입 - [신입/경력] 프로덕트 디자이너(UX/UI)
  cmunrpcwe00053qers7ylqsrw: [
    { title: "문제 정의부터 해결까지의 과정", body: "서비스 성장과 사용자 만족에 기여하는 문제를 정의하고 해결책을 도출한 과정을 보여주세요.", sourceQuote: "서비스의 성장과 사용자 만족에 기여하는 문제를 정의하고 최적의 해결책을 도출" },
    { title: "디자인 시스템 고도화 경험", body: "일관성 있고 효율적인 디자인을 위해 디자인 시스템을 만들거나 발전시켜본 경험을 보여주세요.", sourceQuote: "일관성 있고 효율적인 디자인을 위해 디자인 시스템을 함께 만들고 발전" },
    { title: "AI 디자인 도구 활용 능력", body: "Figma나 AI 디자인 도구를 실무에 능숙하게 활용해본 경험을 보여주세요.", sourceQuote: "Figma 및 AI 디자인 도구에 대한 높은 숙련도" },
  ],
  // 미스터픽 - 프로덕트 디자이너
  cmunrpd1300083qerejgas8d0: [
    { title: "데이터 기반 가설 검증 경험", body: "전환율, 리텐션 등 핵심 지표를 분석해 가설을 세우고 검증해본 경험을 보여주세요.", sourceQuote: "전환율, 리텐션 등 핵심 지표 분석과 퍼널 데이터를 기반으로 문제 정의 및 가설 수립·검증" },
    { title: "AI 툴 실무 적용 경험", body: "Claude, Gemini 등 AI 툴을 실무에 도입해 업무 효율을 높인 경험을 구체적으로 보여주세요.", sourceQuote: "Claude, Gemini, Magnific 등 AI 툴을 실무에 적극 도입해 업무 효율을 높인 경험" },
    { title: "디자인 시스템·핸드오프 운영 경험", body: "Figma 기반 디자인 시스템을 관리하고 개발 핸드오프를 진행해본 경험을 보여주세요.", sourceQuote: "Figma 기반 디자인 시스템 관리, 개발 핸드오프" },
  ],
  // 스터닝 - [라우드소싱] 프로덕트 디자이너(3년 이하)
  cmunrpd5j000b3qerhuuioxm7: [
    { title: "데이터 기반 문제 발굴 경험", body: "고객이나 CS 피드백을 통해 반복되는 문제를 찾아낸 경험을 보여주세요.", sourceQuote: "고객, 디자이너, CS 피드백을 통한 반복 문제 발굴" },
    { title: "A/B 테스트로 가설 검증한 경험", body: "빠르게 가설을 세우고 A/B 테스트로 검증해본 경험을 구체적으로 보여주세요.", sourceQuote: "빠르게 실행 가능한 UX 가설 설계 및 A/B 테스트를 통한 검증" },
    { title: "제품 런칭·개선 완주 경험", body: "사이드 프로젝트나 인턴 경험을 포함해 서비스 런칭이나 개선을 끝까지 완료해본 경험을 보여주세요.", sourceQuote: "신규 서비스 런칭 또는 제품 개선 프로젝트 완료 경험(사이드 프로젝트, 인턴 경험 포함)" },
  ],
  // 널리소프트 - [쌤157] UI/UX 디자이너 (신입)
  cmunrpda5000e3qer344z2w59: [
    { title: "복잡한 정보를 단순화한 경험", body: "복잡한 정보를 누구나 이해할 수 있게 단순화해본 경험을 보여주세요.", sourceQuote: "복잡한 세금 정보를 극단적으로 단순화하여 누구나 이해할 수 있게 디자인" },
    { title: "사용자 경험 문제 발견 능력", body: "사용자 입장에서 불편한 지점을 스스로 발견해본 경험을 보여주세요.", sourceQuote: "사용자 경험 문제를 발견할 수 있는 능력" },
    { title: "전략적 사고 기반 디자인 능력", body: "심미성뿐 아니라 비즈니스 전략까지 고려해 디자인했던 경험을 보여주세요.", sourceQuote: "심미성뿐 아니라 전략적 사고에 기반한 고객 중심 디자인 구현 능력" },
  ],
  // 팀에버플 - Product / UX.UI Designer
  cmunrpdee000h3qer38vtxsc5: [
    { title: "제품 전체 주기를 다룬 디자인 경험", body: "리서치부터 구현, 지속 개선까지 제품 전체 주기에 걸쳐 참여해본 경험을 보여주세요.", sourceQuote: "리서치·분석부터 구현·지속 개선까지 제품 전체 주기에 걸친 디자인" },
    { title: "디자인 시스템 구축·관리 경험", body: "Figma 기반 디자인 시스템을 직접 구축하고 관리해본 경험을 보여주세요.", sourceQuote: "Figma 기반 디자인 시스템 구축·관리" },
    { title: "디자인 결정의 근거를 제시하는 능력", body: "디자인 결정을 내릴 때 타당한 근거를 제시했던 경험을 구체적으로 보여주세요.", sourceQuote: "디자인 결정에 대한 타당한 근거 제시 능력" },
  ],
  // 클라썸 - [Edtech] Product Builder
  cmunrpdp0000k3qero0icwg2i: [
    { title: "데이터 기반 가설 검증 경험", body: "유저 데이터를 분석해 가설을 세우고 검증하며 제품을 성장시켜본 경험을 보여주세요.", sourceQuote: "유저 데이터를 상시 모니터링하고 분석하여, 가설 수립과 검증을 통해 제품을 성장" },
    { title: "다각적 사용자 관점 설계 경험", body: "서로 다른 유형의 사용자 관점을 함께 반영해 핵심 플로우를 설계해본 경험을 보여주세요.", sourceQuote: "관리자·학생 등 다각적인 사용자 관점을 반영한 제품의 핵심 플로우를 설계" },
    { title: "AI 툴 활용 개발 협업 경험", body: "Claude, v0 등 AI 툴을 활용해 개발자와 협업해본 경험이 있다면 보여주세요.", sourceQuote: "Claude, v0 등 AI 툴을 적극적으로 활용한 경험" },
  ],
  // 벳칭 - Product Designer - 주니어(매니저)
  cmunrpdtg000n3qer02o0sapm: [
    { title: "문제 정의부터 핸드오프까지의 경험", body: "화면 설계를 문제 정의부터 개발 핸드오프까지 끝까지 책임져본 경험을 보여주세요.", sourceQuote: "화면을 문제 정의부터 핸드오프까지 담당" },
    { title: "숨은 문제를 파악해 해결한 경험", body: "고객 요청 이면의 숨겨진 문제를 찾아 해결해본 경험을 보여주세요.", sourceQuote: "고객 요청에서 숨겨진 문제를 파악해 해결" },
    { title: "디자인 시스템 관리 경험", body: "디자인 시스템을 직접 관리해본 경험이 있다면 구체적으로 보여주세요.", sourceQuote: "디자인 시스템 관리 경험" },
  ],
  // 똑똑한개발자 - UX/UI 디자이너 (Product Builder로 성장)
  cmunrpdxy000q3qeraxf2w3n1: [
    { title: "클라이언트 협업 기반 화면 설계 경험", body: "클라이언트와 협업해 기획을 구체화하고 화면을 디자인해본 경험을 보여주세요.", sourceQuote: "클라이언트와 협업해 기획을 구체화하고 화면 디자인" },
    { title: "AI 툴로 구현까지 확장한 경험", body: "AI 기반 툴로 디자인을 넘어 직접 구현까지 해본 경험이 있다면 보여주세요.", sourceQuote: "AI 기반 툴을 활용해 디자인 영역을 넘어 구현 영역까지 확장" },
    { title: "디자인 방향성을 설득한 경험", body: "클라이언트나 팀을 상대로 디자인 방향성을 설득해본 경험을 구체적으로 보여주세요.", sourceQuote: "클라이언트 커뮤니케이션 및 디자인 방향성에 대한 설득" },
  ],
  // 링크알파 - Product Designer
  cmunrpe2a000t3qerbav87uul: [
    { title: "제품 UX/UI를 엔드투엔드로 책임진 경험", body: "제품의 UX/UI를 처음부터 끝까지 책임지고 설계해본 경험을 보여주세요.", sourceQuote: "핵심 제품 UX/UI를 처음부터 끝까지 책임" },
    { title: "고객 세션을 디자인 결정으로 전환한 경험", body: "고객과의 세션에서 관찰한 내용을 실제 디자인 결정으로 옮겨본 경험을 보여주세요.", sourceQuote: "글로벌 고객과의 직접 세션을 통해 워크플로우를 관찰하고 이를 디자인 의사결정으로 전환" },
    { title: "0에서 1을 만든 프로토타이핑 경험", body: "새로운 기능을 0에서부터 시각화하고 반복적으로 검증해본 경험을 보여주세요.", sourceQuote: "0-to-1 기능 시각화, 반복적인 프로토타이핑, 가설 검증" },
  ],
  // 엑스에이아이 - AI Tutor - Design Specialist
  cmunrpe5o000v3qerajiyf6p8: [
    { title: "디자인 품질을 판단하는 안목", body: "시각적 위계, 타이포그래피, 컬러 등 디자인 기본기를 얼마나 정확히 판단할 수 있는지 보여주세요.", sourceQuote: "Sharp eye for fundamentals: visual hierarchy, typography, spacing, color, composition, consistency, clarity." },
    { title: "완성도 높은 포트폴리오", body: "본인의 취향과 완성도를 보여줄 수 있는 대표작을 준비해주세요.", sourceQuote: "A portfolio showing strong taste and finished, high-quality work." },
    { title: "디자인 비평을 글로 정리하는 능력", body: "좋은 디자인과 부족한 디자인의 차이를 논리적으로 글로 설명해본 경험을 보여주세요.", sourceQuote: "Write precise, well-reasoned annotations and critiques advising upon the difference between mediocre, good, and excellent design." },
  ],
  // 위클레이 - 프로덕트 디자이너
  cmunrpeae000y3qere3c33qh3: [
    { title: "React·Figma 등 프론트엔드 툴 활용 능력", body: "React, Figma, JavaScript, HTML/CSS 등 필요 스킬을 실제로 다뤄본 경험을 보여주세요.", sourceQuote: "React, Figma, JavaScript, HTML/CSS" },
    { title: "성장지향적 태도", body: "새로운 걸 배우고 스스로 성장하려 했던 구체적인 경험을 보여주세요.", sourceQuote: "성장지향성, 계획성, 성실성, 창의성, 협동심" },
    { title: "영어 커뮤니케이션 능력", body: "영어로 협업하거나 소통해본 경험이 있다면 보여주세요.", sourceQuote: "영어가능자" },
  ],
  // 석세스모드 - [핀테크 스타트업] UI/UX 디자이너 채용
  cmunrpekt00113qer0zes0o1a: [
    { title: "부가세 환급 핀테크 서비스 이해", body: "외국인 관광객 대상 부가세 환급처럼 특정 도메인에 특화된 핀테크 서비스에 관심 있는 이유를 보여주세요.", sourceQuote: "외국인 관광객을 위한 부가세 환급 서비스 Success mode를 운영하는 핀테크 스타트업입니다." },
    { title: "1년 이상의 UI/UX 실무 경력", body: "관련 실무 경력 1년 이상을 증명할 수 있는 대표 결과물을 보여주세요.", sourceQuote: "경력 1년 이상, 대졸 이상(졸업예정자 가능)" },
    { title: "수습 기간을 감안한 지원 의지", body: "6개월 수습 조건을 확인하고 장기 근무 의사를 분명히 밝혀주세요.", sourceQuote: "정규직(수습 6개월)" },
  ],
  // 쿠팡페이 - [쿠팡페이] Staff UI/UX Designer (신사업)
  cmunzcj2q0002pq3jhy8cu13m: [
    { title: "제품 전략을 주도한 리더십 경험", body: "전략 수립부터 실행까지 주요 제품 경험 전반을 직접 주도해본 경험을 구체적으로 보여주세요.", sourceQuote: "전략 수립부터 실행까지 주요 제품 경험 전반을 주도하는 핵심 리더" },
    { title: "디자인 시스템 표준을 정립한 경험", body: "플랫폼 전반의 디자인 시스템을 개선하거나 표준을 세워본 경험을 보여주세요.", sourceQuote: "플랫폼 전반의 디자인 시스템 개선 및 표준 정립 주도" },
    { title: "데이터 기반 A/B 테스트 반복 개선 경험", body: "지표를 기반으로 A/B 테스트를 수행하며 제품을 반복적으로 개선해본 경험을 보여주세요.", sourceQuote: "지표 기반 반복 개선 및 A/B 테스트 수행" },
  ],
  // 뷰티셀렉션 - [바이오던스] 웹 디자인 인턴
  cmuqmphrf0002532dvdn9p1hz: [
    { title: "이커머스 채널 웹 콘텐츠 제작 경험", body: "자사몰이나 올리브영 같은 이커머스 채널의 상세페이지·배너를 만들어본 경험을 보여주세요.", sourceQuote: "자사몰, 올리브영 등 주요 이커머스 채널의 상세페이지, 프로모션 랜딩 페이지, 배너 등 웹 콘텐츠 디자인 제작 지원" },
    { title: "생성형 AI로 이미지·영상 제작한 경험", body: "생성형 AI를 활용해 이미지나 영상을 만들어본 경험이 있다면 구체적으로 보여주세요.", sourceQuote: "생성형 AI를 활용해 이미지·영상을 만들어본 경험이 있으신 분" },
    { title: "영어로 리서치·소통한 경험", body: "영어로 자료를 조사하거나 소통해본 경험을 보여주세요.", sourceQuote: "영어로 자료를 리서치하고 원활하게 소통하실 수 있는 분" },
  ],
  // 텔유어월드 - UX/UI 서비스 기획·디자이너
  cmuqmphwq0005532dznygrupu: [
    { title: "서비스 전체 구조를 고민한 기획 경험", body: "화면 디자인을 넘어 서비스 구조 전체를 고민하고 설계해본 경험을 보여주세요.", sourceQuote: "화면 디자인을 넘어 서비스 전체 구조를 고민하는 역량" },
    { title: "생성형 AI 실무 활용 경험", body: "ChatGPT, Claude 등 생성형 AI를 실무에 활용해본 경험을 구체적으로 보여주세요.", sourceQuote: "ChatGPT, Claude 등 생성형 AI의 실무 활용 역량" },
    { title: "개발팀과 협업해 서비스 출시한 경험", body: "개발팀과 직접 협업하며 서비스를 출시까지 이끈 경험을 보여주세요.", sourceQuote: "개발팀과 협업해 서비스 출시한 경험" },
  ],
  // PTKOREA - 2027년 상반기 대기업 Mobile E-commerce App 운영 디자인 보조
  cmuqmpi5e0008532dgmfch43k: [
    { title: "다국어 콘텐츠 베리에이션 작업 경험", body: "같은 콘텐츠를 여러 사이즈나 언어로 변형 작업해본 경험을 보여주세요.", sourceQuote: "콘텐츠 제작 및 사이즈·다국어 베리에이션 작업 지원" },
    { title: "Figma·Photoshop 실무 활용 능력", body: "Photoshop과 Figma로 실제 작업해본 결과물을 보여주세요.", sourceQuote: "Photoshop, Figma 활용이 가능하신 분" },
    { title: "꼼꼼한 산출물 관리 태도", body: "성실하고 꼼꼼하게 산출물을 관리했던 경험을 구체적으로 보여주세요.", sourceQuote: "성실하고 꼼꼼한 업무 태도와 원활한 커뮤니케이션 역량을 보유하신 분" },
  ],
  // 네이버 - 헬스케어 UX 디자인 (경력)
  cmuqmpi98000a532doou0g3li: [
    { title: "정보구조·User Flow 설계 경험", body: "정보구조와 사용자 흐름을 체계적으로 설계하고 예외상황까지 담은 화면설계서를 작성해본 경험을 보여주세요.", sourceQuote: "정보구조(IA)·User Flow 설계에 능숙하고, 인터랙션·정책·예외상황을 누락 없이 담은 화면설계서 작성 능력" },
    { title: "데이터·리서치 기반 설계 결정 경험", body: "데이터나 사용자 리서치를 근거로 설계 결정을 내리고 설명해본 경험을 보여주세요.", sourceQuote: "데이터·사용자 리서치·UX 원칙 기반 설계 결정 설명 역량" },
    { title: "헬스케어 도메인 디자인 경험", body: "헬스케어, 의료, 또는 전문가용 B2B 도구 디자인 경험이 있다면 구체적으로 보여주세요.", sourceQuote: "헬스케어·의료·전문가용 B2B 도구(EMR) 디자인 경험" },
  ],
  // 바나플에프엔비 - [banapresso] UX/UI 디자이너 (Product Design)
  cmuqmpied000d532dtf19fjip: [
    { title: "3년 이상의 UX/UI 디자인 실무 경력", body: "UX/UI 디자인 실무 경력 3년 이상을 증명할 수 있는 대표 결과물을 보여주세요.", sourceQuote: "UX/UI 디자인 실무 경력 3년 이상인 분" },
    { title: "Figma 실무 활용 능력", body: "Figma로 실제 서비스 화면을 설계해본 작업물을 보여주세요.", sourceQuote: "Figma 등 UX/UI 디자인 툴을 능숙하게 활용할 수 있는 분" },
    { title: "수습 기간을 감안한 지원 의지", body: "3개월 수습 조건을 확인하고 장기 근무 의사를 분명히 밝혀주세요.", sourceQuote: "정규직(수습 3개월)" },
  ],
  // Roblox - [Summer 2027] Product Design Intern
  cmuqmpiss000g532d0l0vp119: [
    { title: "프로토타입 제작과 경쟁 분석 경험", body: "기능을 디자인하고 프로토타입을 만들며 경쟁 서비스를 분석해본 경험을 보여주세요.", sourceQuote: "Passionate about designing features, creating prototypes, conducting competitive analysis, user research, and solving business problems through design." },
    { title: "사람의 행동과 동기에 대한 호기심", body: "사람들의 행동과 니즈를 관찰하고 디자인에 반영해본 경험을 보여주세요.", sourceQuote: "Curious about people's behaviors, needs, and motivations, recognizing this as essential to the design process." },
    { title: "시니어 디자이너 피드백으로 성장한 경험", body: "선배 디자이너의 피드백을 받아 결과물을 다듬어본 경험을 보여주세요.", sourceQuote: "actively leverage feedback from senior designers to refine your craft" },
  ],
  // 무신사 - Content Designer (글로벌 커머스)
  cmuqmpiw7000i532de53xgdx0: [
    { title: "세일즈 캠페인 크리에이티브 제작 경험", body: "세일즈 캠페인이나 에디토리얼 디자인을 직접 제작해본 경험을 보여주세요.", sourceQuote: "세일즈 캠페인 및 에디토리얼 디자인 제작" },
    { title: "모션그래픽 작업 경험", body: "2D 또는 3D 기반 모션그래픽 작업물을 보여주세요.", sourceQuote: "2D, 3D 기반 모션그래픽 디자인 작업 가능" },
    { title: "디자인 시스템 고도화 경험", body: "Figma 기반 디자인 시스템이나 모듈을 고도화해본 경험을 보여주세요.", sourceQuote: "Figma 기반 디자인 시스템·모듈 고도화" },
  ],
  // 무신사 - Product Designer (Commerce)
  cmuqmpixv000k532djm98qdvp: [
    { title: "복잡한 구매 여정을 설계한 경험", body: "장바구니부터 주문, 클레임까지 복잡한 구매 여정을 설계하거나 개선해본 경험을 보여주세요.", sourceQuote: "무신사·29CM의 구매 여정 전반(장바구니, 주문서, 주문 완료, 클레임, 세일 프라이싱)의 UX 설계 및 개선" },
    { title: "데이터 기반 A/B 테스트 전환율 개선 경험", body: "데이터 분석과 A/B 테스트로 전환율을 개선해본 경험을 구체적으로 보여주세요.", sourceQuote: "정성적·정량적 데이터 분석 및 A/B 테스트를 통한 전환율 개선" },
    { title: "정책 제약 속에서 일관된 경험을 설계한 능력", body: "복잡한 정책이나 시스템 제약 속에서도 일관된 사용자 경험을 만들어본 경험을 보여주세요.", sourceQuote: "정책·시스템 제약 상황에서도 일관된 경험 설계 능력" },
  ],
  // 더스윙 - [자전거 구독 서비스] Product Designer
  cmuryj4080002oiiscnpsbo28: [
    { title: "복잡한 정책을 구조화하는 역량", body: "결제·배송·쿠폰 같은 복잡한 정책을 명확한 화면 구조로 바꿔본 프로젝트를, 정책 변경 전후 화면과 함께 보여주세요.", sourceQuote: "복잡한 정책을 정리하고 효율적인 구조화를 통해 고객 앱/웹 및 백오피스를 설계" },
    { title: "핵심 여정 설계 경험", body: "탐색부터 주문·결제까지 복잡한 플로우를 단순하게 정리해본 경험을, 변경 전후 화면 비교로 보여주세요.", sourceQuote: "Swap의 자전거/오토바이 지면의 핵심 여정을 설계하고 사용자 경험을 개선" },
    { title: "구독·O2O 주문·결제·배송 설계 경험", body: "구독이나 O2O 서비스의 주문·결제·배송 흐름을 설계해본 경험이 있다면 담당 범위와 함께 포함해주세요.", sourceQuote: "커머스/구독/O2O 분야에서 주문·결제·배송 설계를 경험해보신 분" },
  ],
  // 에이펙스모빌리티 - Product Designer
  cmuryj4460005oiismo5wujha: [
    { title: "사용자 흐름·정보구조 설계 역량", body: "호출부터 탑승, 운행까지 사용자 흐름과 정보 구조를 설계해본 경험을, 전체 플로우 다이어그램과 함께 보여주세요.", sourceQuote: "사용자 흐름, 정보 구조, 인터랙션과 콘텐츠를 설계" },
    { title: "프로토타입 가설 검증 경험", body: "가설을 세우고 프로토타입을 만들어 검증하며 다듬어 나간 디자인 과정을, 테스트 결과와 함께 보여주세요.", sourceQuote: "AI를 활용해 가설 검증에 필요한 프로토타입을 만들고 고객·운영자 대상 사용성 테스트 수행" },
    { title: "상태 변화 많은 서비스 설계 경험", body: "지도나 예약처럼 상태 변화가 잦은 서비스를 설계해본 경험이 있다면 상태별 화면과 함께 포함해주세요.", sourceQuote: "모빌리티·지도·예약 등 상태 변화가 많은 서비스 또는 고객용 제품과 연결된 운영 도구 설계 경험" },
  ],
  // 신세계 - UI/UX 디자이너(계약직)
  cmuryj48k0008oiisszogguln: [
    { title: "디지털 콘텐츠 디자인 역량", body: "프로모션이나 이벤트 배너 같은 디지털 콘텐츠를 직접 디자인한 작업물을, 실제 캠페인 사례로 보여주세요.", sourceQuote: "디지털 콘텐츠 디자인 경험" },
    { title: "앱 프로모션 콘텐츠 제작 경험", body: "앱 내 프로모션이나 이벤트 콘텐츠를 직접 디자인해본 작업물을 실제 캠페인 성과와 함께 포함해주세요.", sourceQuote: "신세계백화점 APP 내 프로모션·이벤트·배너 콘텐츠 디자인" },
    { title: "이커머스·유통업계 실무 경험", body: "이커머스나 유통업계에서 디자인 실무를 직접 해본 경험이 있다면 담당했던 영역까지 구체적으로 소개해주세요.", sourceQuote: "이커머스 및 유통업계 디자인 실무 경험" },
  ],
  // T.P.C - 프로덕트 디자이너
  cmuryj4c4000boiisyjrbqwji: [
    { title: "엔드투엔드 설계 역량", body: "문제 발견부터 서비스 설계, UI 디자인까지 책임진 프로젝트를, 문제 정의 과정과 함께 보여주세요.", sourceQuote: "사용자 관점에서 문제를 발견하고, 서비스 설계부터 UI/UX 디자인까지 엔드 투 엔드로 실행" },
    { title: "디자인 시스템 기획·운영 경험", body: "서비스 일관성을 위해 디자인 시스템을 기획하고 운영해본 경험을, 구축한 컴포넌트와 함께 담아보세요.", sourceQuote: "서비스의 일관성과 완성도를 높이기 위한 디자인 시스템 기획 및 운영에 참여" },
    { title: "기획부터 출시까지 경험", body: "하나의 서비스나 기능을 기획 단계부터 출시까지 경험했다면 당시 담당했던 역할을 구체적으로 포함해주세요.", sourceQuote: "하나의 서비스 또는 기능을 기획부터 출시까지 경험해본 분" },
  ],
  // 피플인사이드 - GUI 디자이너
  cmuryj4eu000doiisew11l9z5: [
    { title: "유연한 문제 해결 역량", body: "막막하고 복잡한 문제도 유연하게 풀어내 실행까지 이어간 과정을, 겪었던 시행착오와 함께 보여주세요.", sourceQuote: "문제 해결을 위한 유연한 사고와 실행 능력" },
    { title: "국내외 서비스 GUI 디자인 경험", body: "국내외 서비스의 GUI와 비주얼 컨셉을 직접 작업한 결과물을, 완성도 높은 화면과 함께 담아보세요.", sourceQuote: "국내외 서비스에 대한 UX, UI, GUI 디자인" },
    { title: "창업 경험", body: "분야와 무관하게 창업해본 경험이 있다면 그 과정에서 직접 배우고 느낀 점을 구체적으로 소개해주세요.", sourceQuote: "창업 경험 (분야 무관)" },
  ],
  // 아타드 - UX/UI 디자이너
  cmuryj4ij000goiis2tgj6zha: [
    { title: "AI 툴 기반 디자인 개발 역량", body: "Claude나 Figma Make 같은 AI 도구로 디자인을 개발해본 과정을, 실제 산출물과 함께 보여주세요.", sourceQuote: "LLM 기반 AI툴(Claude, Figma make 등) 디자인 개발 경험" },
    { title: "디자인 시스템 구축 경험", body: "유저플로우 설계부터 컴포넌트 관리까지 디자인 시스템을 구축해본 경험을, 운영 사례와 함께 담아보세요.", sourceQuote: "디자인 시스템 구축(유저플로우 설계, 컴포넌트·디자인 시스템 관리)" },
    { title: "어드민 콘솔 설계 경험", body: "어드민 콘솔을 직접 설계하거나 운영해본 경험이 있다면 그때 맡았던 범위까지 자세하게 모두 포함해주세요.", sourceQuote: "어드민 콘솔 경험" },
  ],
  // 뉴로클 - UX/UI 디자이너 인턴
  cmuryj4m4000joiisvtjyr8hf: [
    { title: "구조부터 고민하는 설계 태도", body: "화면을 그리기 전에 왜 이런 구조여야 하는지 먼저 고민했던 과정을, 학교 과제여도 좋으니 보여주세요.", sourceQuote: "화면을 그리기 전에" },
    { title: "요구사항 분석·화면설계 경험", body: "PM과 함께 요구사항을 분석하고 화면 구조를 설계해본 경험을, 그렇게 설계한 근거와 함께 보여주세요.", sourceQuote: "PM과 함께 신규 제품의 요구사항을 분석하고, 사용자 흐름과 화면 구조 설계에 참여" },
    { title: "생성형 AI 활용 경험", body: "생성형 AI나 코딩 에이전트로 디자인 생산성을 높여본 경험을, 구체적인 활용 방식과 함께 포함해주세요.", sourceQuote: "생성형 AI, 코딩 에이전트 등 AI를 활용하여 디자인 퀄리티나 생산성을 높인 경험이 있으신 분" },
  ],
  // 트리플콤마 - Product Designer (Junior)
  cmuryj4po000moiisi9f2crpf: [
    { title: "문제 분석 기반 디자인 역량", body: "사용자 관점에서 문제를 찾아 UI/UX로 풀어낸 프로젝트를, 데이터 근거와 함께 정리해서 보여주세요.", sourceQuote: "사용자 관점에서 UI/UX를 설계하고 문제를 해결할 수 있는 역량" },
    { title: "프로덕트 고도화 경험", body: "기존 서비스를 고도화하거나 신규 기능을 디자인해본 사례를, 개선 전후 화면 비교와 함께 담아보세요.", sourceQuote: "사용자 경험 개선을 위한 기존 프로덕트 디자인 고도화 및 신규 기능 디자인 참여" },
    { title: "모바일 앱 디자인시스템 운영 경험", body: "모바일 앱 디자인 시스템을 운영해본 경험이 있다면 직접 관리했던 컴포넌트까지 구체적으로 포함해주세요.", sourceQuote: "모바일 앱 서비스 디자인 경험 또는 디자인 시스템 운영 경험이 있으신 분" },
  ],
  // 스키프 - Product Designer
  cmuryj4t9000poiis93f1in1d: [
    { title: "계획적이고 꼼꼼한 업무 태도", body: "목표를 세우고 끝까지 꼼꼼하게 실행해 좋은 성과로 연결한 경험을, 구체적인 수치와 함께 보여주세요.", sourceQuote: "핵심역량: 계획성, 성실성, 성취지향성, 꼼꼼함, 스트레스관리" },
    { title: "Figma 기반 실무 능력", body: "Figma로 실제 제품을 처음부터 설계해본 완성도 있는 작업물을, 화면 단위로 꼼꼼하게 정리해 담아보세요.", sourceQuote: "스킬: Figma" },
    { title: "경력·전공 무관 지원 가능", body: "경력과 전공에 상관없이 디자인 역량이 잘 드러나는 포트폴리오만 지금부터 미리 꼼꼼하게 준비해두세요.", sourceQuote: "경력무관, 학력무관" },
  ],
  // 제로더 - [제로더 UI/UX] 앱 디자이너
  cmuryj4wu000soiish2lhnask: [
    { title: "디자인 의도 설명·설득 역량", body: "본인의 디자인 의도를 논리적으로 설명하고 상대를 설득해본 경험을, 실제 사례들과 함께 자세히 보여주세요.", sourceQuote: "자신의 디자인 의도를 논리적으로 설명하고 설득할 수 있는 분" },
    { title: "화면설계서 작성 경험", body: "기획 의도를 와이어프레임과 기능 명세서로 명확히 정리해본 경험을, 실제 작성한 문서와 함께 담아보세요.", sourceQuote: "기획 의도를 개발자가 이해할 수 있도록 구체적인 와이어프레임 및 기능 명세서 작성" },
    { title: "기획부터 디자인까지 A to Z 경험", body: "기획부터 디자인까지 혼자서 A to Z로 진행해본 경험이 있다면 그 과정 전체를 자세히 포함해주세요.", sourceQuote: "기획부터 디자인까지 A to Z로 프로젝트를 수행해 본 경험이 있는 분" },
  ],
  // 케이티마켓 - UI/UX 디자이너
  cmuryj517000voiis07cvs28n: [
    { title: "꼼꼼하고 성취지향적인 업무 태도", body: "목표를 세우고 끝까지 꼼꼼하게 실행해 좋은 성과를 낸 경험을, 구체적인 수치나 결과와 함께 보여주세요.", sourceQuote: "핵심역량: 성실성, 성취지향성, 꼼꼼함, 스트레스관리, 계획성" },
    { title: "Figma 기반 실무 능력", body: "Figma로 실제 서비스 화면을 설계해본 완성도 있는 작업물을, 화면 단위로 꼼꼼하게 정리해 담아보세요.", sourceQuote: "스킬: Figma" },
    { title: "경력·전공 무관 지원 가능", body: "경력과 전공에 상관없이 디자인 역량이 잘 드러나는 포트폴리오만 미리미리 꼼꼼히 챙겨서 준비해보세요.", sourceQuote: "경력무관, 학력무관" },
  ],
  // 차즘 - Growth Designer
  cmuryj54w000yoiisquw0uwl5: [
    { title: "디자인 근거를 설명하는 역량", body: "여러 디자인 방향 중 무엇을 왜 선택했는지 설명해본 경험을, 그때 비교했던 과정과 함께 보여주세요.", sourceQuote: "여러 디자인 방향 중 무엇을 선택했고 왜 그렇게 판단했는지 설명할 수 있는 분" },
    { title: "광고 소재·이벤트 페이지 디자인", body: "광고 소재나 이벤트 페이지처럼 시선을 끄는 작업물을, 완성도 높은 이미지로 포트폴리오에 담아보세요.", sourceQuote: "광고 소재 제작, 이벤트 페이지·옥외 광고 등 고객에게 보여지는 다양한 시각적 요소 기획·디자인" },
    { title: "캠페인 기획 협업 경험", body: "마케터와 함께 캠페인을 기획 단계부터 설계해본 경험이 있다면 그 협업 과정까지 구체적으로 포함해주세요.", sourceQuote: "마케터와 페어로 캠페인을 기획 단계부터 함께 설계해본 경험이 있는 분" },
  ],
  // 대학내일ES - 디자이너(콘텐츠크리에이티브3팀 인턴 체험형)
  cmuryj58k0011oiisj5vb1dne: [
    { title: "AI 툴 활용 디자인 역량", body: "ChatGPT나 미드저니 같은 AI 툴을 디자인 작업에 활용해본 사례를, 적용 과정과 함께 보여주세요.", sourceQuote: "ChatGPT, 미드저니 등 AI 툴을 디자인 작업에 활용할 수 있으신 분" },
    { title: "SNS 콘텐츠 디자인 경험", body: "직접 만든 브랜드 SNS나 홍보 콘텐츠 작업물을, 완성도 높은 이미지로 포트폴리오에 정리해 담아보세요.", sourceQuote: "브랜드 SNS 콘텐츠 디자인" },
    { title: "콘텐츠 제작 경험", body: "SNS 콘텐츠나 인쇄 디자인을 직접 제작해본 경험이 있다면 그 제작 과정과 함께 자세히 포함해주세요.", sourceQuote: "SNS 콘텐츠 또는 디지털/인쇄 디자인을 직접 제작해본 경험이 있으신 분" },
  ],
  // ====== 2026-10-04 대량 배치 원문 재수집 (65건, 트리프 1건은 원문 삭제로 archivedAt 처리) ======
  // 올리브영 - 웹디자이너_색조(계약직)
  cmuser6r300019g2jro62q12m: [
    { title: "디지털 콘텐츠 기획·제작 역량", body: "상세페이지, 프로모션 페이지, 광고 소재 등을 직접 기획하고 제작해본 사례를 모아 비교하기 쉽게 보여주세요.", sourceQuote: "상세페이지, 프로모션 페이지, 광고 소재 등 디지털 콘텐츠 기획 및 제작 경험" },
    { title: "글로벌 EC 캠페인 소재 제작 경험", body: "캠페인 방향에 맞춰 국내외 EC 채널용 상세페이지와 광고 소재를 기획하고 제작한 과정을 정리해보세요.", sourceQuote: "캠페인 방향성을 반영한 상세페이지 및 광고 소재 기획·제작 (국내 및 글로벌EC 포함)" },
    { title: "색조 브랜드 웹디자인 경험", body: "뷰티, 특히 색조 브랜드를 다뤄본 웹디자인 작업이 있다면 브랜드 톤과 무드를 살린 방식과 함께 소개해주세요.", sourceQuote: "뷰티 브랜드(특히 색조 브랜드) 관련 웹디자인 경험 보유" },
  ],
  // 올리브영 - Product Designer (모바일 앱/웹)
  cmuser6vj00039g2jbswzz348: [
    { title: "데이터 기반 서비스 개선 능력", body: "정량·정성 데이터를 직접 모으고 분석해 서비스를 개선한 과정을 지표 변화와 함께 구체적으로 보여주세요.", sourceQuote: "정량적, 정성적 데이터 수집을 통한 서비스 개선 능력" },
    { title: "고객·관리자 양면 프로덕트 개선", body: "고객용 화면과 관리자용 화면 양쪽에서 문제를 찾아내 주도적으로 개선까지 이끈 프로젝트를 정리해보세요.", sourceQuote: "올리브영 온라인몰 고객 및 관리자가 이용하는 프로덕트의 문제를 정성, 정량적으로 수집하여 주도적으로 개선" },
    { title: "백오피스 디자인 경험", body: "관리자가 매일 쓰는 백오피스 화면을 설계해본 경험이 있다면 업무 흐름을 중심으로 자세히 소개해주세요.", sourceQuote: "백오피스(관리자 화면) 디자인 경험" },
  ],
  // 올리브영 - Global Product Designer
  cmuser6zj00059g2j5u0w0tkl: [
    { title: "탐색·검색 영역 디자인 경험", body: "고객이 상품을 탐색하고 검색하는 영역을 디자인해본 경험을 플로우와 화면 흐름 중심으로 정리해보세요.", sourceQuote: "고객의 탐색과 검색영역에 대한 디자인 경험" },
    { title: "글로벌 고객 문제 개선 경험", body: "글로벌 고객이 겪는 탐색·검색 문제를 데이터로 찾아내 직접 개선까지 이끌어본 과정을 사례로 보여주세요.", sourceQuote: "올리브영 글로벌몰/미국몰 고객이 이용하는 프로덕트의 문제를 정성, 정량적으로 수집하여 주도적으로 개선" },
    { title: "A/B 테스트 기반 개선 경험", body: "A/B 테스트로 가설을 세우고 검증하며 서비스를 개선해본 경험이 있다면 결과 지표와 함께 담아보세요.", sourceQuote: "A/B 테스트 기반 서비스 개선 경험" },
  ],
  // 올리브영 - Platform Designer (디자인시스템구축)
  cmuser74100079g2joj92dh3k: [
    { title: "Figma 토큰·개발 라이브러리 연계", body: "Figma Variables로 토큰을 설계하고 개발 라이브러리까지 연결해본 과정을 구체적으로 보여주세요.", sourceQuote: "Figma Variables 기반의 토큰 설계 및 개발 라이브러리 연계 경험" },
    { title: "디자인 토큰 체계 수립 경험", body: "디자인 토큰 체계를 세우고 코드화해 디자인과 개발 간 구현 오차를 줄여본 사례를 자세히 정리해보세요.", sourceQuote: "디자인 토큰 체계 수립 및 개발 코드화를 통한 디자인-개발 간 구현 정확도 및 효율성 향상" },
    { title: "복잡한 도메인 시스템 설계 경험", body: "이커머스나 백오피스처럼 복잡한 도메인에서 시스템을 설계해본 경험이 있다면 구조와 함께 소개해주세요.", sourceQuote: "이커머스나 백오피스 같은 복잡한 도메인의 시스템 설계 경험" },
  ],
  // 올리브영 - Marketing Designer
  cmuser7g300099g2j1oapzm63: [
    { title: "브랜드 가이드 기반 콘텐츠 확장력", body: "브랜드 가이드를 바탕으로 다양한 포맷의 디지털 콘텐츠로 응용하고 확장해본 작업을 모아서 보여주세요.", sourceQuote: "브랜드 가이드 기반 다양한 디지털 콘텐츠 응용·확장 능력" },
    { title: "채널별 프로모션 비주얼 개발", body: "국내외 고객과 채널별 특성을 반영해 시즌 프로모션 비주얼을 만들어본 사례들을 비교하며 정리해보세요.", sourceQuote: "국내/글로벌 고객 및 채널 특성을 고려한 프로모션 비주얼 개발" },
    { title: "디자인 시스템·UI 가이드 운영", body: "디자인 시스템이나 UI 가이드를 직접 만들고 운영해본 경험이 있다면 운영 방식과 함께 소개해주세요.", sourceQuote: "디자인 시스템 또는 UI 가이드 제작·운영 경험" },
  ],
  // 올리브영 - Product Designer (B2B/광고플랫폼)
  cmuser7ko000b9g2j30bi4kot: [
    { title: "AI 도구 병행 리서치·프로토타이핑", body: "Figma와 AI 도구를 자유롭게 넘나들며 리서치부터 디자인 시스템 운영까지 진행해본 과정을 보여주세요.", sourceQuote: "Figma와 AI 도구(Figma AI, Cursor, Claude 등)를 자유롭게 넘나들며 리서치·프로토타이핑·디자인 시스템 운영까지 효율적으로 해내는 분" },
    { title: "백오피스 문제 분석·개선 경험", body: "백오피스처럼 복잡한 화면의 문제를 데이터로 분석해 개선까지 이끌어본 사례를 구체적으로 정리해보세요.", sourceQuote: "광고플랫폼 백오피스의 문제점을 정성적/정량적으로 분석하고 개선" },
    { title: "B2B 어드민·디자인 시스템 구축", body: "B2B 어드민이나 대시보드를 설계하고 디자인 시스템까지 구축해본 경험이 있다면 구조와 함께 소개해주세요.", sourceQuote: "B2B 어드민·대시보드 설계 및 디자인 시스템 구축 경험이 있는 분" },
  ],
  // 카카오페이증권 - 프로덕트 디자이너(시니어)
  cmuser7u7000e9g2jggejuefc: [
    { title: "서비스 정책 기반 UX 설계 경험", body: "복잡한 서비스 정책을 깊이 이해하고 구조화된 일관된 UX로 풀어낸 경험을 설계 화면과 함께 보여주세요.", sourceQuote: "서비스 정책들을 이해하며, 구조화되고 일관된 UX를 설계한 경험이 있으신 분이 필요해요." },
    { title: "신규 서비스 설계·디자인 경험", body: "기존 서비스의 개선 제안과 신규 서비스의 설계를 함께 다뤄본 경험을 과정 중심으로 자세히 정리해보세요.", sourceQuote: "서비스 개선을 제안하고, 신규 서비스를 설계 및 디자인하는 업무를 담당해요." },
    { title: "금융 서비스 진입장벽 낮추기", body: "복잡한 투자 개념을 누구나 쉽게 풀어 전달한 화면이 있다면 그 디자인 의도와 결과를 함께 소개해주세요.", sourceQuote: "어렵고 복잡한 투자의 문턱을 낮추고, 생활 속 가장 가까운 금융투자 회사를 만듭니다." },
  ],
  // 비바이노베이션 - UI/UX 디자이너(UX 기획)
  cmuser805000h9g2j3adxnk8w: [
    { title: "데이터 기반 KPI 해석 역량", body: "GA 지표와 정량·정성 데이터로 사용자 행동을 해석해 UX 개선까지 연결한 사례를 구체적으로 보여주세요.", sourceQuote: "GA·지표 및 정량/정성 데이터를 근거로 KPI·사용자 행동을 해석하고, 기획·UX 개선으로 연결할 수 있는 분" },
    { title: "문제 정의부터 고도화까지 수행", body: "단순한 화면 개선을 넘어 문제 정의부터 프로덕트 고도화까지 끌고 간 전체 과정을 자세히 정리해보세요.", sourceQuote: "단순 UI 개선을 넘어, 서비스 문제 정의부터 프로덕트 고도화까지 수행" },
    { title: "복수 사용자군 대상 제품 디자인", body: "어드민처럼 여러 사용자군을 동시에 고려해 화면을 설계해본 경험이 있다면 구체적으로 함께 담아보세요.", sourceQuote: "B2B2C, 어드민 등 복수 사용자군을 대상으로 한 제품 디자인 경험" },
  ],
  // 더파운더즈 - 웹 콘텐츠 디자인 Sr.매니저
  cmuser86b000k9g2jomfeu307: [
    { title: "다국가 환경 일관성·임팩트 설계", body: "여러 국가나 플랫폼 환경에 맞춰 일관성과 임팩트를 함께 지켜낸 작업을, 적용 전후 비교로 보여주세요.", sourceQuote: "다양한 국가/플랫폼 환경 속에서 일관성과 임팩트를 동시에 만들어낼 수 있는 분" },
    { title: "다국가 온라인 UX 가이드 구축", body: "여러 국가와 채널 특성에 맞춘 온라인 디자인 가이드를 구축하거나 확장해본 경험을 자세히 정리해보세요.", sourceQuote: "다양한 국가 및 채널의 온라인 디자인 UX 가이드 구축 및 확장 (US/EU/AU 등)" },
    { title: "브랜드 리브랜딩 경험", body: "브랜드의 톤앤매너를 새로 세우거나 리브랜딩을 진행해본 경험이 있다면 과정과 결과를 자세히 담아보세요.", sourceQuote: "브랜드 톤앤매너를 구축하거나 리브랜딩 경험이 있으신 분" },
  ],
  // 세븐픽쳐스 - [동행클럽·동행] 프로덕트 디자이너(UI/UX)
  cmuser8bx000n9g2j8tjynxm9: [
    { title: "프로덕션 레벨 UI/UX 디자인 경험", body: "실제 운영 중인 모바일 앱이나 웹 프로덕트의 UI/UX를 디자인해본 경험을 구체적인 사례로 보여주세요.", sourceQuote: "프러덕션 레벨의 모바일 앱 또는 웹 프로덕트 디자인(UI/UX) 업무 경험이 있는 사람" },
    { title: "유저 행동 분석 기반 개선 실행", body: "유저 행동 데이터를 분석해 오프라인 경험과 연결되는 개선안을 직접 실행해본 사례를 자세히 정리해보세요.", sourceQuote: "제품 내 유저 행동에 대한 분석 및 좋은 오프라인 경험과 연계한 디자인 개선안 제안/실행" },
    { title: "가설·데이터 기반 지속 개선", body: "가설과 데이터를 기반으로 한 서비스를 꾸준히, 끝까지 포기 없이 개선해간 과정이 있다면 소개해주세요.", sourceQuote: "한 서비스를 처음부터 끝까지 가설과 데이터를 기반으로 지속적으로 개선해본 경험이 있는 사람" },
  ],
  // 트리거스 - 프로덕트 디자이너 3년 이상
  cmuser8hp000q9g2j6lg94oum: [
    { title: "리텐션·유저 인게이지먼트 이해", body: "리텐션과 유저 인게이지먼트를 깊이 고려해 설계한 경험이 있다면 지표 변화와 함께 구체적으로 보여주세요.", sourceQuote: "리텐션 및 유저 인게이지먼트에 대한 높은 이해도" },
    { title: "행동 유도·습관 형성 UX 설계", body: "사용자가 자연스럽게 반복 방문하고 행동하게 만드는 리워드나 플로우를 설계해본 경험을 구체적으로 담아보세요.", sourceQuote: "행동 유도 및 습관 형성 UX 설계: 사용자가 자연스럽게 반복 방문하고 행동하게 만드는 플로우, 리워드 시스템, 인터랙션을 설계" },
    { title: "디자인 시스템 구축·고도화", body: "디자인 시스템을 처음부터 끝까지 직접 구축하거나 고도화해본 경험이 있다면 운영 방식과 함께 소개해주세요.", sourceQuote: "디자인 시스템 구축 및 고도화" },
  ],
  // 베스펙스 - Product Designer
  cmuser8nx000t9g2jru5h5827: [
    { title: "코드 구현 디자인 시스템 운영", body: "코드로 그대로 구현되는 디자인 시스템을 직접 만들고 운영해본 경험을 구조와 규칙 중심으로 보여주세요.", sourceQuote: "코드로 구현되는 디자인 시스템을 직접 만들고 운영한 경험" },
    { title: "민감한 건강 데이터 표현 설계", body: "민감한 건강 수치 데이터를 오해 없이 읽히도록 표기 방식이나 차트를 설계해본 경험을 구체적으로 정리해보세요.", sourceQuote: "민감할 수 있는 건강 지표를 오해 없이 읽히게 만들기 — 호르몬 수치 표기, 레벨 체계, 차트 표현 방식 같은 결정을 직접 내립니다." },
    { title: "핵심 지표 개선 중심 디자인", body: "온보딩 완료율이나 구독 전환율, 기기 연동률 같은 핵심 지표를 직접 움직여본 디자인 작업을 수치로 증명해보세요.", sourceQuote: "온보딩 완료율, 구독 전환율, 기기-앱 연동 완료율 등 지표를 움직이는 것이 목표" },
  ],
  // 샐러드랩 - 이커머스 솔루션(SaaS) 프로덕트 디자이너(리뷰 스쿼드)
  cmuser8ue000w9g2jhlevpkvf: [
    { title: "복잡한 정책의 직관적 설계 역량", body: "복잡한 비즈니스 정책과 데이터 구조를 직관적인 화면 흐름으로 풀어낸 설계 사례를 자세히 보여주세요.", sourceQuote: "복잡한 비즈니스 정책과 데이터 구조를 직관적인 사용자 경험으로 풀어내는 설계 역량" },
    { title: "리뷰 전환율 최적화 위젯 설계", body: "리뷰 탐색이나 작성 흐름을 최적화해 전환율까지 끌어올린 위젯 설계 경험을 구체적으로 자세히 정리해보세요.", sourceQuote: "쇼핑몰 방문자의 리뷰 탐색·작성 경험을 최적화하여 리뷰 작성률과 구매 전환율을 높이는 위젯을 설계" },
    { title: "운영자 인사이트용 대시보드 설계", body: "운영자가 리뷰 데이터를 쌓고 인사이트를 뽑아낼 수 있는 관리자 대시보드를 설계해본 경험을 소개해주세요.", sourceQuote: "운영자가 리뷰 데이터를 쌓고 관리하며 인사이트를 도출할 수 있는 관리자 대시보드를 설계" },
  ],
  // 샐러드랩 - 이커머스 솔루션(SaaS) 프로덕트 디자이너(B2C 신사업)
  cmuser8yp000y9g2j0nwwyh92: [
    { title: "IA·사용자 흐름 논리적 설계", body: "정보 구조와 사용자 흐름, 인터랙션을 논리적으로 설계해본 작업을 구조도와 근거와 함께 정리해보세요.", sourceQuote: "정보 구조(IA), 사용자 흐름(User Flow), 인터랙션을 논리적으로 설계할 수 있는 분" },
    { title: "정책·예외 케이스까지 정의", body: "화면 설계뿐 아니라 정책과 예외 케이스까지 꼼꼼히 함께 정의해본 설계 경험을 구체적인 사례로 보여주세요.", sourceQuote: "Figma에서 화면 설계뿐 아니라 정책, 예외 케이스, 사용자 흐름까지 명확히 정의" },
    { title: "제로투원 프로덕트 경험", body: "제로에서 하나를 만들어가는 프로덕트 경험이 있다면 처음부터 끝까지의 전체 과정을 자세히 담아보세요.", sourceQuote: "지금부터 함께 시작해 만들어갈 Zero to One 프로덕트입니다." },
  ],
  // 네이션에이 - Product Designer
  cmuser96600119g2j2nz1wqa7: [
    { title: "핸드오프·디자인 QA 협업 경험", body: "엔지니어와 긴밀히 협업하며 핸드오프와 디자인 QA를 직접 진행해본 경험을 구체적인 과정과 함께 보여주세요.", sourceQuote: "엔지니어와 긴밀히 협업하며 핸드오프와 디자인 QA를 직접 진행해 본 경험" },
    { title: "예외 상태까지 정의한 화면 설계", body: "로딩이나 에러, 빈 화면 같은 다양한 예외 상태까지 꼼꼼히 정의해본 화면 설계 경험을 정리해보세요.", sourceQuote: "디자인 시스템 컴포넌트를 활용한 상세 화면 설계와 로딩·에러·빈 화면 등 각 상태 정의" },
    { title: "핵심 유저 플로우 전체 디자인", body: "온보딩부터 생성, 편집, 공유까지 이어지는 핵심 유저 플로우를 설계해본 경험이 있다면 소개해주세요.", sourceQuote: "온보딩·생성·편집·공유 등 핵심 유저 플로우의 와이어프레임, 인터랙션, 비주얼 디자인" },
  ],
  // 네이션에이 - Product Design Lead
  cmuser9aa00139g2jxywlaxrw: [
    { title: "엔드투엔드 프로덕트 디자인 역량", body: "리서치부터 와이어프레임, 인터랙션, 프로토타이핑까지 전체 과정을 혼자 책임져본 경험을 자세히 정리해보세요.", sourceQuote: "리서치·IA·와이어프레임·인터랙션·비주얼·프로토타이핑을 아우르는 엔드투엔드 프로덕트 디자인 역량" },
    { title: "팀원 성장 지원 리더십 경험", body: "팀원과의 1on1과 솔직한 피드백으로 개별 성장을 이끈 리더십 경험이 있다면 구체적인 사례로 보여주세요.", sourceQuote: "팀원 1on1과 피드백을 통한 개별 성장 지원 및 성과 관리" },
    { title: "에이전틱 디자인 시스템 설계", body: "AI 에이전트가 참조할 수 있도록 디자인 시스템의 구조와 명명 규칙을 설계해본 경험을 소개해주세요.", sourceQuote: "AI 에이전트가 디자인 시스템을 참조해 UI를 생성·검증할 수 있도록 구조·명명 규칙·문서 체계 설계" },
  ],
  // 엔세이피아엔지니어링서울 - [포켓트윈] Product Designer(UI·UX 디자이너)
  cmuser9ym00169g2j8kir50tz: [
    { title: "사용자 문제를 시각화하는 역량", body: "아바타 서비스에서 유저가 겪는 문제를 발견하고 시각적 해결안으로 풀어낸 과정을 포트폴리오에 담아보세요.", sourceQuote: "사용자 문제를 시각적으로 해결할 수 있는 역량을 가진 분" },
    { title: "아바타 서비스 메인 화면 개선 경험", body: "감성 아바타 서비스의 메인 화면을 유저 몰입도를 높이는 방향으로 개선해본 과정을 구체적으로 보여주세요.", sourceQuote: "아바타 서비스의 메인 및 주요 화면 UI/UX 디자인 개선" },
    { title: "유저 피드백 기반 개선 제안 경험", body: "유저 피드백에서 문제를 발견하고 UI·UX 개선안으로 풀어낸 과정을, 전후 비교 화면과 함께 소개해보세요.", sourceQuote: "유저 피드백을 기반으로 문제를 정의하고, 이를 해결하기 위한 UI·UX 개선안을 제시" },
  ],
  // 딥다이브 - [베리시] 웹 디자이너
  cmuseraei00199g2jgg0o1bo8: [
    { title: "상세페이지 디자인부터 운영까지 경험", body: "상품 상세페이지를 직접 디자인하고 카페24 자사몰에 등록·운영까지 해본 과정을, 화면과 함께 구체적으로 정리해보세요.", sourceQuote: "상품 상세페이지를 직접 디자인하고 카페24 기반 자사몰에서 운영·등록해본 경험이 있으신 분" },
    { title: "구매 정보 구조화 경험", body: "상품 특성과 구매 과정에서 꼭 필요한 정보를 화면 구조로 정리해 자사몰 화면을 개선해본 사례를 보여주세요.", sourceQuote: "상품 특성과 구매 과정에서 필요한 정보를 구조화해 자사몰 화면을 지속적으로 개선" },
    { title: "반복 요소의 컴포넌트화 경험", body: "반복되는 웹 디자인 요소를 Figma 컴포넌트나 라이브러리로 구조화해 작업 효율을 높여본 경험을 담아보세요.", sourceQuote: "Figma 컴포넌트·라이브러리 등으로 반복 디자인 요소를 구조화한 경험이 있으신 분" },
  ],
  // 바이잇 - [LUVUM] 콘텐츠 디자이너
  cmuserakx001c9g2jb5r2bvqr: [
    { title: "온라인 콘텐츠 제작 경험", body: "상세페이지나 SNS, 광고 등 다양한 채널의 콘텐츠를 직접 제작해본 결과물을 채널별로 정리해보세요.", sourceQuote: "상세페이지, SNS, 광고 등 온라인 콘텐츠 제작 경험이 있는 분" },
    { title: "브랜드 아이덴티티 반영 아트워크", body: "브랜드의 아이덴티티를 녹여 아트워크나 그래픽 에셋을 직접 개발해본 작업물을 사례와 함께 담아보세요.", sourceQuote: "브랜드 아이덴티티를 반영한 아트워크 및 그래픽 에셋 개발" },
    { title: "AI 툴 활용 콘텐츠 제작 경험", body: "Midjourney 같은 AI 툴로 이미지나 영상 콘텐츠를 제작해본 작업물을, 활용 과정과 함께 소개해보세요.", sourceQuote: "Midjourney, Nano Banana, Kling 등 AI 툴을 활용한 이미지·영상 콘텐츠 제작 경험이 있는 분" },
  ],
  // 피알앤디컴퍼니 - 프로덕트 디자이너 (헤이딜러)
  cmuseraqo001f9g2joxxrsis6: [
    { title: "직관적이고 심미성 높은 UI 역량", body: "복잡한 문제를 직관적이면서도 완성도 높은 UI로 풀어낸 작업물을, 디자인 결정 중심으로 구체적으로 보여주세요.", sourceQuote: "직관적이고 심미성 높은 UI로 풀어내시는 분" },
    { title: "복잡한 정보 구조 단순화 경험", body: "복잡한 정보와 구조를 누구나 쉽게 쓸 수 있는 흐름으로 단순화해본 과정을, 화면 변화와 함께 정리해보세요.", sourceQuote: "복잡한 정보와 구조를 단순하게 풀어내어, 누구나 쉽게 사용할 수 있는 직관적인 사용자 경험을 만듦" },
    { title: "AB 테스트 기반 가설 검증 경험", body: "가설을 세우고 AB 테스트로 검증해 제품을 개선해본 과정을, 구체적인 결과 데이터와 함께 소개해보세요.", sourceQuote: "AB 테스트를 통해 가설을 검증" },
  ],
  // 컬리 - 프로덕트 디자인 그룹장
  cmuserav8001h9g2jl3ks2lke: [
    { title: "디자인 조직 리드 경험", body: "10명 이상 규모의 디자인 조직을 이끌며 품질과 일정을 함께 관리해본 경험을 구체적으로 정리해보세요.", sourceQuote: "10명 이상 규모의 디자인 조직 리드 경험" },
    { title: "디자이너 성장 멘토링 설계 경험", body: "주니어나 미드 레벨 디자이너의 성장을 위한 멘토링 프로그램을 직접 설계하고 운영한 사례를 보여주세요.", sourceQuote: "주니어~미드 레벨 디자이너 성장을 위한 멘토링 프로그램 설계·운영" },
    { title: "디자인 가치의 비즈니스 언어 전환", body: "디자인의 가치를 비즈니스 언어로 바꿔 경영진이나 유관부서를 설득해본 경험을, 구체적인 사례로 담아보세요.", sourceQuote: "디자인의 가치를 비즈니스 언어로 전환 능력" },
  ],
  // 컬리 - 온라인 마케팅/프로모션 디자이너
  cmuseraz8001j9g2jhs0cf358: [
    { title: "대량 마케팅 리소스 제작 경험", body: "많은 양의 마케팅 리소스를 일정에 맞춰 안정된 퀄리티로 만들어본 경험을 결과물과 함께 정리해보세요.", sourceQuote: "대량의 마케팅 리소스를 일정에 맞춰 안정적인 퀄리티로 제작 경험" },
    { title: "반복 작업 모듈화로 효율 높인 경험", body: "반복되는 디자인 작업을 모듈화해 제작 효율을 높여본 과정을, 전후 비교 화면과 함께 자세히 보여주세요.", sourceQuote: "반복·패턴화된 디자인 작업 인지 및 모듈화를 통한 제작 효율 증대" },
    { title: "제한된 리소스 속 프로세스 개선", body: "빠듯한 리소스 안에서 일정과 퀄리티의 우선순위를 판단해 제작 프로세스를 개선한 경험을 소개해보세요.", sourceQuote: "제한된 리소스 환경에서 일정·퀄리티·효율의 우선순위를 명확히 판단하고 프로세스를 개선한 경험" },
  ],
  // 컬리 - 상세페이지 컨텐츠 디자이너
  cmuserb3j001l9g2j5kr3odse: [
    { title: "마케팅 리소스 제작 경험", body: "상세페이지나 프로모션 등 다양한 마케팅 리소스를 꾸준히 만들어본 경험을, 결과물과 함께 정리해보세요.", sourceQuote: "마케팅 리소스 제작 경험 풍부" },
    { title: "구매 전환 중심 상세페이지 기획", body: "구매 전환을 높이는 방향으로 상세페이지를 기획하고 제작해본 사례를, 전환 데이터와 함께 구체적으로 보여주세요.", sourceQuote: "구매 전환 중심의 상세페이지 기획 및 제작" },
    { title: "개발·퍼블리싱 협업 경험", body: "개발이나 퍼블리싱 담당자와 협업하며 결과물을 완성해본 과정을, 역할과 소통 방식 중심으로 소개해보세요.", sourceQuote: "개발 및 퍼블리싱 협업 경험" },
  ],
  // GIGR - 디자인 엔지니어(Design Engineer)
  cmuserb98001o9g2jlik2jcb3: [
    { title: "비주얼·인터랙션 디자인 역량", body: "타이포그래피부터 레이아웃, 동작까지 세심하게 다듬은 인터랙션 디자인 작업물을 과정과 함께 보여주세요.", sourceQuote: "타이포그래피, 위계, 레이아웃, 언어, 동작까지 신경 쓰는 뛰어난 비주얼·인터랙션 디자인 역량을 가진 분" },
    { title: "재사용 가능한 컴포넌트 설계 경험", body: "엔지니어와 함께 재사용 가능한 컴포넌트와 패턴을 만들어 팀의 공통 기반으로 삼아본 경험을 담아보세요.", sourceQuote: "프로덕트 엔지니어와 함께 재사용 가능한 컴포넌트, 디자인 패턴, 예시를 만들어 팀원들이 공통 기반 위에서 작업할 수 있게 합니다" },
    { title: "엣지 케이스까지 고려한 설계", body: "로딩이나 빈 화면, 오류 복구 같은 엣지 케이스까지 챙겨 설계해본 화면을, 사례와 함께 정리해보세요.", sourceQuote: "로딩, 빈 화면(empty state), 오류, 복구, 반응형, 접근성까지 전체 경험을 고려합니다" },
  ],
  // 딥오토 - [인턴] UI/UX 디자이너
  cmuserbdn001q9g2juzdujwp3: [
    { title: "Figma 기반 UI/UX 설계 역량", body: "Figma로 화면을 설계하고 다듬어본 프로젝트를, 작업 과정과 결과물 중심으로 구체적으로 보여주세요.", sourceQuote: "스킬: Figma, UI, UX" },
    { title: "UI와 UX를 함께 다룬 경험", body: "화면 디자인(UI)과 사용자 경험(UX)을 함께 고려해 작업해본 프로젝트를 구체적으로 소개해보세요.", sourceQuote: "모집분야: UI/UX" },
    { title: "디자인 전공 기반 결과물", body: "디자인 전공에서 쌓은 과제나 프로젝트 결과물을, 배운 점과 고민의 과정과 함께 포트폴리오로 정리해보세요.", sourceQuote: "우대전공: 디자인과, 디자인계열" },
  ],
  // 폴센트 - Product Designer(5년이상)
  cmuserbjf001t9g2jbiml5go1: [
    { title: "UX 리서치 기반 맥락 파악 역량", body: "인터뷰나 데이터, 행동 패턴을 분석해 사용자의 실제 맥락을 파악해본 리서치 과정을, 결과와 함께 정리해보세요.", sourceQuote: "인터뷰, 데이터, 행동 패턴으로 실제 맥락 파악, UX 리서치 활용" },
    { title: "제품 흐름 전체 설계 경험", body: "하나의 기능이 아니라 제품의 흐름과 구조 전체를 설계해본 프로젝트를, 구체적인 화면과 함께 보여주세요.", sourceQuote: "기능 단위 디자인이 아닌, 제품 흐름과 구조 전체를 설계해요" },
    { title: "AB 테스트로 가설 검증한 경험", body: "세운 가설을 AB 테스트와 데이터 분석으로 검증하고 개선까지 이어간 사례를, 과정 중심으로 담아보세요.", sourceQuote: "A/B 테스트, 피드백, 데이터 분석으로 가설 검증" },
  ],
  // 라이트뷰 - UI/UX/Web Designer
  cmuserbp2001w9g2jez24q4p5: [
    { title: "디테일한 디자인 QA 역량", body: "개발자와 소통하며 완성된 화면의 디테일까지 꼼꼼히 점검해본 QA 경험을, 사례와 함께 정리해 보여주세요.", sourceQuote: "개발자와 원활하게 소통하며 디테일한 디자인 QA를 수행할 수 있는 분" },
    { title: "HTML/CSS 퍼블리싱 경험", body: "HTML/CSS로 직접 퍼블리싱하거나 프론트엔드 개발자와 협업해본 작업물을, 구체적으로 함께 소개해보세요.", sourceQuote: "HTML/CSS 기반의 Web Publishing 및 프론트엔드 개발 협업" },
    { title: "디자인 시스템 구축·운영 경험", body: "공통 컴포넌트를 포함한 디자인 시스템을 직접 구축하고 운영해본 과정을, 구체적인 사례로 담아보세요.", sourceQuote: "디자인 시스템 및 공통 컴포넌트 구축·운영" },
  ],
  // 씨이랩 - Product Designer
  cmuserbuj001z9g2jcn5dpai7: [
    { title: "복잡한 정보의 구조화 역량", body: "복잡한 정보와 다양한 상태를 사용자가 쉽게 이해하도록 구조화해본 작업 과정을, 화면과 함께 보여주세요.", sourceQuote: "복잡한 정보와 다양한 상태를 사용자가 쉽게 이해할 수 있도록 구조화할 수 있는 역량" },
    { title: "데이터 중심 Enterprise UI 설계", body: "테이블이나 차트, 상태 정보 같은 데이터 중심의 Enterprise 화면을 설계해본 사례를 정리해보세요.", sourceQuote: "테이블, 차트, 상태 정보, 설정 화면 등 데이터 중심의 B2B·Enterprise UI 설계" },
    { title: "B2B SaaS·Admin 설계 경험", body: "B2B SaaS나 Admin처럼 복잡한 제품을 설계해본 경험을, 정보 구조와 화면 흐름과 함께 소개해보세요.", sourceQuote: "Web 기반 B2B SaaS, Enterprise Software, Admin 등 복잡한 제품을 설계해본 경험" },
  ],
  // 에이비일팔공 - Product Designer (AB180)
  cmuserc0400229g2j64flfzj2: [
    { title: "상태별 UI·엣지 케이스 정의 경험", body: "에러나 권한, 플랜별 제한 같은 상태별 UI와 엣지 케이스를 빠짐없이 정의해본 과정을 구체적으로 보여주세요.", sourceQuote: "상태별 UI와 엣지 케이스를 빠짐없이 정의해 개발팀과 협업해 보신 분" },
    { title: "셀프서브 가입·결제 플로우 설계", body: "사용자가 스스로 가입하고 결제, 업그레이드까지 이어지는 플로우를 설계해본 사례를, 화면과 함께 담아보세요.", sourceQuote: "사용자가 가치를 확인하고 유료로 전환할 수 있도록 셀프서브 가입·결제·업그레이드 플로우를 설계합니다" },
    { title: "데이터와 리서치 기반 디자인 결정", body: "퍼널 지표 같은 정량 데이터와 유저 인터뷰를 근거로 디자인 결정을 내려본 과정을, 구체적으로 정리해보세요.", sourceQuote: "퍼널 지표 같은 정량 데이터와 유저 인터뷰 같은 정성 리서치를 근거로 디자인 결정을 내려 보신 분" },
  ],
  // 액트노바 - 프로덕트 디자이너
  cmuserc5w00259g2jgghq5sr5: [
    { title: "디자인 의도를 논리적으로 설명하는 역량", body: "작은 요소 하나에도 담긴 디자인 의도를 논리적으로 풀어 설명해본 작업물을, 근거와 함께 정리해보세요.", sourceQuote: "작은 요소 하나에도 디자인 의도가 있고, 그걸 논리적으로 설명할 수 있으신 분" },
    { title: "프로토타입으로 설득한 경험", body: "디자인 의도를 설득해야 할 때 프로토타입을 만들어 팀원과 소통해본 과정을, 구체적인 사례로 보여주세요.", sourceQuote: "디자인 의도를 명확하게 설득할 필요가 있는 경우에는 프로토타이핑을 제작하여 팀원과 소통합니다" },
    { title: "사용자 조사·경쟁사 분석 경험", body: "사용자 조사와 경쟁사 제품 분석을 바탕으로 개선 방향을 제안해본 사례를, 구체적으로 함께 소개해보세요.", sourceQuote: "사용자 조사, 경쟁사 제품 분석을 통해 프로덕트의 개선 방향을 제안합니다" },
  ],
  // 부스터스 - [EQQUALBERRY] 글로벌 뷰티 브랜드 웹 디자이너
  cmusercbc00289g2jcplwfy1g: [
    { title: "웹·상세페이지 브랜드 디자인 경험", body: "웹과 상세페이지를 포함한 브랜드 디자인 전반을 다뤄본 경험을, 다양한 작업물과 함께 폭넓게 정리해보세요.", sourceQuote: "웹·상세 페이지 디자인 및 브랜드 디자인 전반에 대한 경험이 풍부하신 분" },
    { title: "글로벌 채널용 이미지 소재 제작", body: "Amazon이나 Shopee 같은 해외 채널에 맞춰 제품 소개와 프로모션 이미지를 만들어본 사례를 보여주세요.", sourceQuote: "Amazon, Shopee를 포함하여 전 세계 다양한 채널 내 제품 소개·브랜딩·프로모션 이미지 소재를 제작" },
    { title: "사진 촬영 기획 경험", body: "브랜드 콘텐츠를 위한 사진 촬영을 기획하고 디렉션해본 과정을, 구체적인 결과 사례와 함께 소개해보세요.", sourceQuote: "사진 촬영 기획 경험을 보유하신 분" },
  ],
  // 세모컴퍼니 - [휩드] BX Designer
  cmusercfc002a9g2j6ukvcfc9: [
    { title: "브랜드 경험 기획부터 실행 역량", body: "브랜드 경험을 기획 단계부터 실행까지 직접 이끌어본 과정을, 구체적인 결과물과 함께 자세히 보여주세요.", sourceQuote: "브랜드 경험 관점에서 기획부터 실행까지 진행해보거나 그런 역량을 가진 분" },
    { title: "촬영 기획 및 디렉션 경험", body: "무드와 톤, 스타일 가이드를 정하고 촬영을 기획·디렉션해본 경험을, 결과물과 함께 사례로 정리해보세요.", sourceQuote: "촬영 기획 및 결과물 디렉션 (무드, 톤, 스타일 가이드)" },
    { title: "브랜드 정체성 중심 디자인 태도", body: "유행보다 브랜드 고유의 정체성을 지켜가며 디자인해본 고민의 과정을, 구체적인 결과 사례로 소개해보세요.", sourceQuote: "트렌드에 민감하지만, 유행보다 브랜드 정체성을 우선하는 분" },
  ],
  // 넥스트증권 - UX Design Lead
  cmuserckq002d9g2j6xffbzok: [
    { title: "기능 단위 UX 플로우 설계 경험", body: "핵심 기능의 흐름을 처음부터 끝까지 설계해 본 프로젝트를, 화면 구조와 함께 구체적으로 보여주세요.", sourceQuote: "기능 단위 UX 플로우 설계 경험" },
    { title: "데이터 기반 가설 검증 경험", body: "사용자 데이터를 바탕으로 문제를 정의하고 가설을 세워 실험으로 검증해본 과정을 구체적으로 정리해보세요.", sourceQuote: "정성·정량 데이터를 기반으로 사용자 문제를 정의하고, 가설 수립·실험·검증을 통해 제품 개선을 리딩" },
    { title: "복잡한 금융 도메인 디자인 경험", body: "금융이나 투자처럼 정보량이 많고 맥락이 복잡한 도메인을 다뤄본 프로젝트를 사례 중심으로 포함해주세요.", sourceQuote: "금융, 투자, 트레이딩, 커머스 등 복잡한 도메인 경험" },
  ],
  // 에이블제이 - UI/UX 웹디자이너 경력자 채용
  cmusercqg002g9g2jwo2pykd8: [
    { title: "Figma 기반 화면 설계와 컴포넌트 관리", body: "Figma로 화면을 설계하고 프로토타입을 만들고 컴포넌트까지 관리해본 과정을 구체적으로 보여주세요.", sourceQuote: "Figma를 활용한 화면 설계, 프로토타이핑, 컴포넌트 관리가 가능하신 분" },
    { title: "AI 대화형 인터페이스 설계 경험", body: "챗봇이나 인터뷰 형식처럼 AI와 사용자가 자연스럽게 주고받는 대화형 화면을 설계해본 사례를 담아보세요.", sourceQuote: "AI와 사용자가 대화하는 다양한 형태의 UX(챗봇, 인터뷰스타일) 디자인" },
    { title: "AI 코칭·면접 서비스 UX 경험", body: "AI 코칭이나 면접처럼 사용자를 평가하고 피드백을 전달하는 서비스를 디자인해본 사례를 자세히 정리해보세요.", sourceQuote: "AI 코칭, AI 면접 서비스 UI/UX 경험" },
  ],
  // 팀리미티드 - 프로덕트 디자이너(PD)
  cmusercw7002j9g2jqyy9bgvq: [
    { title: "대량 데이터를 구조화하는 역량", body: "정보량이 많은 데이터와 콘텐츠를 명확한 위계와 구조로 정리해본 작업물을 포트폴리오에 자세히 담아보세요.", sourceQuote: "정보량이 많은 데이터와 콘텐츠를 위계와 구조로 정리" },
    { title: "퍼널 전환율 개선 경험", body: "여러 단계로 이어지는 핵심 퍼널을 설계하고 단계별 전환율을 끌어올린 과정을 수치와 함께 정리해보세요.", sourceQuote: "핵심 퍼널의 사용자 흐름과 인터랙션을 설계하고, 각 단계의 전환율을 개선" },
    { title: "참여형 리워드 콘텐츠 설계 경험", body: "복권이나 냉장고 뽑기처럼 사용자가 재미로 참여하는 리워드 콘텐츠를 설계해본 사례를 구체적으로 보여주세요.", sourceQuote: "영끌 복권, 냉장고 뽑기 같은 참여형 리워드 콘텐츠를 설계" },
  ],
  // 콘텐츠퍼스트 - Product Designer(7년 이상, Tappytoon)
  cmuserd2f002m9g2jgyy0v3mv: [
    { title: "문제의 본질을 함께 정의하는 역량", body: "요구사항을 그대로 옮기기보다 무엇을 왜 만들어야 하는지 PO와 함께 고민해 결정한 과정을 보여주세요.", sourceQuote: "\"무엇을 왜 만들어야 하는가\"를 PO·엔지니어와 함께 결정해본 분" },
    { title: "AI 에이전트 협업 워크플로우 경험", body: "리서치 정리부터 디자인 탐색, 프로토타이핑까지 AI 에이전트와 함께 처리해본 구체적인 작업 과정을 소개해보세요.", sourceQuote: "리서치 정리, 디자인 탐색, UI 설계, 프로토타이핑을 AI 에이전트와 함께 처리" },
    { title: "A/B 테스트 기반 검증 경험", body: "리서치로 경험 문제를 도출하고 A/B 테스트로 결과까지 검증해본 프로젝트를 수치와 함께 정리해보세요.", sourceQuote: "정성/정량 데이터와 사용자 리서치를 기반으로 경험 문제를 도출하고, A/B 테스트로 검증까지 연결" },
  ],
  // 파인더갭 - 프로덕트 디자이너(3년이상)
  cmuserd7x002p9g2j07cpgotj: [
    { title: "복잡한 구조의 백오피스 설계 경험", body: "백오피스나 대시보드처럼 정보가 많고 구조가 복잡한 화면을 직접 설계해본 사례를 구체적으로 보여주세요.", sourceQuote: "백오피스/어드민, 대시보드 등 복잡한 구조의 화면을 설계해 본 경험이 있으신 분" },
    { title: "권한별 화면 상태 정의 경험", body: "역할마다 보이는 정보와 권한이 달라지는 화면의 여러 상태를 직접 정의해본 과정을 자세히 정리해보세요.", sourceQuote: "역할별 권한과 노출 정보가 다른 화면의 상태 정의" },
    { title: "B2B SaaS 복잡한 도메인 경험", body: "ERP나 CRM처럼 업무 로직이 복잡한 B2B 서비스를 다뤄본 프로젝트를 사례 중심으로 포함해주세요.", sourceQuote: "B2B SaaS, ERP, WMS, CRM 등 복잡한 도메인의 프로덕트 디자인 경험이 있으신 분" },
  ],
  // 이지식스 - [TADA] UI/UX Designer
  cmuserddl002s9g2jl506kp7t: [
    { title: "모호한 요구사항을 정의하는 역량", body: "명확하지 않은 요구사항을 사용자 중심으로 다시 정의하고 논리적인 근거로 UX를 설계한 과정을 보여주세요.", sourceQuote: "사용자 중심 사고를 바탕으로 모호한 요구사항을 정의하고 논리적으로 UX를 설계할 수 있는 분" },
    { title: "디자인 시스템 구축·운영 경험", body: "여러 서비스에서 일관되게 쓰일 수 있는 디자인 시스템을 직접 구축하고 운영해본 과정을 정리해보세요.", sourceQuote: "Design System 구축 및 운영" },
    { title: "기획 초기 단계부터 참여한 설계 경험", body: "기획 초기 단계부터 참여해 아이디어를 화면으로 구체화해본 신규 기능 프로젝트를 자세히 소개해보세요.", sourceQuote: "신규 기능 및 서비스 기획 단계부터 참여한 UX 설계 및 UI 디자인" },
  ],
  // 렌트리 - 시니어 프로덕트 디자이너(Sr. Product Designer)
  cmuserdj4002v9g2j9v9zs2n1: [
    { title: "다중 사용자 구조 설계 경험", body: "성격이 전혀 다른 여러 사용자층을 동시에 고려해야 하는 제품을 설계해본 경험을 구체적으로 정리해보세요.", sourceQuote: "다양한 유저 사이드 혹은 다중 구조에서 프로덕트 디자인 경험이 있으신 분" },
    { title: "지표 중심 UX 구조 설계 경험", body: "전환이나 리텐션 같은 제품 지표를 기준으로 실제 출시 가능한 UX 구조를 설계한 과정을 보여주세요.", sourceQuote: "전환, 리텐션, 운영 효율 등 제품 지표 관점에서 실제 출시 가능한 수준의 UX/UI 구조 설계" },
    { title: "데이터 기반 설계 판단 설득 경험", body: "데이터와 리서치를 근거로 설계 판단의 이유를 설명하고 동료를 설득해본 과정을 구체적으로 담아보세요.", sourceQuote: "데이터, 리서치, 사용자 관찰을 근거로 설계 판단을 설명하고, 동료를 설득해본 경험이 있으신 분" },
  ],
  // 제로엑스플로우 - Product Designer(5년~)
  cmuserdoz002y9g2j0rtrs4jp: [
    { title: "다양한 학습 방식을 잇는 흐름 설계", body: "객관식, 주관식, 스피킹, 더빙처럼 서로 다른 학습 방식을 자연스러운 흐름으로 이어본 경험을 보여주세요.", sourceQuote: "객관식, 주관식, 스피킹, 더빙까지 다양한 학습 방식을 자연스럽게 이어지도록 만듦" },
    { title: "맞춤형 학습 피드백 기획 경험", body: "학습자의 수준과 맥락에 맞춰 문제와 피드백, 스피킹까지 다르게 제공하는 경험을 기획해본 사례를 정리해보세요.", sourceQuote: "학생의 수준과 맥락에 맞는 문제, 피드백, 스피킹을 기획" },
    { title: "데이터로 설계 논리를 설득하는 역량", body: "왜 이 디자인이 최선인지 데이터와 논리적인 근거로 팀원들을 설득해본 과정을 포트폴리오에 담아보세요.", sourceQuote: "'왜 이 디자인이 최선인지'를 데이터와 논리에 기반하여 팀원들을 설득할 수 있는 분" },
  ],
  // 두들린 - Senior Product Designer-7년 이상
  cmuserduz00319g2jqfme6yuf: [
    { title: "다각도로 균형 잡는 문제 해결 역량", body: "복잡한 문제를 사용자 경험, 기술 구현, 비즈니스 목표 사이에서 균형 있게 풀어낸 사례를 정리해보세요.", sourceQuote: "복잡한 문제를 사용자 중심의 디자인, 기술 구현, 비즈니스 목표에서 균형있게 해결" },
    { title: "복잡한 조건을 정리하는 설계 경험", body: "권한이나 승인 단계, 예외 상황처럼 복잡한 조건을 정리해 하나의 일관된 흐름으로 만든 과정을 보여주세요.", sourceQuote: "권한/역할, 승인 단계, 예외 상황처럼 복잡한 조건을 정리해 일관된 사용 경험으로 구현" },
    { title: "업무 프로세스형 SaaS 경험", body: "채용 관리처럼 정해진 절차를 그대로 따라가는 업무 프로세스형 SaaS를 디자인해본 경험을 소개해보세요.", sourceQuote: "ATS/HR Tech 또는 비슷한 업무 프로세스형 SaaS 경험" },
  ],
  // 알고케어 - 프로덕트 디자이너
  cmusere8s00349g2j5qsjueu5: [
    { title: "UX 리서치 주도 경험", body: "고객 인터뷰나 사용성 테스트 같은 UX 리서치를 처음부터 끝까지 주도해본 과정을 포트폴리오에 담아보세요.", sourceQuote: "고객 인터뷰, UT 등의 정성적/정량적 UX 리서치를 주도해본 경험이 있는 분" },
    { title: "앱과 기기를 잇는 경험 설계", body: "모바일 앱과 IoT 가전을 넘나드는 상호작용을 끊김 없는 하나의 흐름으로 설계해본 사례를 소개해보세요.", sourceQuote: "커머스, 모바일 앱, IoT 가전 상호작용에 대한 심리스한 고객 경험(UX)를 설계" },
    { title: "이해관계자 조율 의사결정 경험", body: "서로 다른 이해관계자의 요구사항을 조율하며 하나의 방향으로 의사결정해본 과정을 구체적으로 정리해보세요.", sourceQuote: "복잡한 문제 해결과정에서 여러 이해관계자와 비즈니스 요구사항을 조율하고 의사결정해 본 경험이 있는 분" },
  ],
  // 쿠팡 - Staff Product Design(Wow UX)
  cmuserejq00369g2jalp1drq9: [
    { title: "디자이너 팀을 이끈 리드 경험", body: "팀 단위 프로젝트에서 여러 디자이너들을 이끌며 완성까지 전부 책임져본 경험을 구체적으로 보여주세요.", sourceQuote: "팀 단위의 프로젝트를 통해 다른 디자이너들을 이끄신 경험을 보유하신 분" },
    { title: "기존 서비스 문제 진단과 우선순위 설계", body: "기존 서비스의 문제점을 직접 발굴하고 분석해 개선 방향에 우선순위를 매겨본 과정을 자세히 정리해보세요.", sourceQuote: "As-is 프로덕트, 서비스의 문제점을 발굴하고 분석하여 개선 방향을 우선 순위로 제시" },
    { title: "리서치 인사이트 기반 End-to-End 경험", body: "리서치에서 얻은 인사이트를 바탕으로 프로젝트를 처음부터 끝까지 직접 만들어본 과정을 자세히 소개해보세요.", sourceQuote: "UX 리서치에서 도출한 인사이트를 활용하여 프로젝트를 시작부터 끝까지 제작한 경험이 있는 분" },
  ],
  // 시프티 - [B2B SaaS] UX 엔지니어
  cmuserepf00399g2jxevrecql: [
    { title: "디자인부터 구현까지 잇는 역량", body: "HTML과 CSS로 직접 화면을 구현할 수 있는 역량을 보여줄 수 있는 작업물을 함께 준비해주세요.", sourceQuote: "HTML, CSS/SCSS 기반의 화면 UI 구현을 위한 개발 역량 보유" },
    { title: "페인 포인트 구조화 해결 경험", body: "고객의 페인 포인트를 직접 발견하고 그 문제를 구조화해 기술적으로 풀어낸 과정을 자세히 보여주세요.", sourceQuote: "고객의 페인 포인트를 직접 발견하고 문제를 구조화하여 기술적으로 해결" },
    { title: "재사용 가능한 컴포넌트 구축 경험", body: "여러 화면에서 재사용할 수 있는 UI 컴포넌트와 가이드를 직접 만들고 운영해본 과정을 정리해보세요.", sourceQuote: "재사용 가능한 UI 컴포넌트와 디자인 가이드 구축·운영" },
  ],
  // 스푼랩스 - [Vigloo Studio] Product Designer
  cmuserev3003c9g2juvzu9wku: [
    { title: "복잡한 흐름을 명확하게 푸는 역량", body: "제품 목표와 사용자 맥락을 바탕으로 복잡한 흐름을 명확한 UX로 풀어낸 사례를 구체적으로 보여주세요.", sourceQuote: "제품 목표와 사용자 맥락을 바탕으로 문제 구조화 및 복잡한 흐름을 명확한 UX로 풀어낼 수 있음" },
    { title: "생성·편집 캔버스 경험 설계", body: "콘텐츠를 만들고 편집하고 결과물까지 관리하는 캔버스형 작업 흐름을 직접 설계해본 사례를 소개해보세요.", sourceQuote: "Canvas를 중심으로 이미지·영상 생성과 편집, 결과물 관리 경험 설계 및 개선" },
    { title: "다국어·멀티 디바이스 정보구조 설계", body: "데스크톱과 모바일, 여러 언어 환경을 함께 고려한 정보 구조와 화면 상태를 설계해본 경험을 담아보세요.", sourceQuote: "데스크톱과 모바일, 다국어 환경을 고려한 정보 구조 및 주요 상태 설계" },
  ],
  // 번개장터 - Product Designer
  cmuserf10003f9g2j59g322me: [
    { title: "복잡한 정책 속 정보 우선순위 설계", body: "복잡한 상태와 정책 안에서 정보의 우선순위를 정하고 구조적인 화면으로 직접 풀어낸 사례를 보여주세요.", sourceQuote: "복잡한 상태와 정책 안에서 정보의 우선순위를 정의하고 구조적인 화면을 설계할 수 있으신 분" },
    { title: "하이파이 프로토타입 구체화 경험", body: "사용자 흐름과 정보 구조를 하이파이 프로토타입 수준까지 구체적으로 만들어본 과정을 자세히 정리해보세요.", sourceQuote: "사용자 흐름, 정보 구조, 인터랙션과 High-Fidelity Prototype을 구체화" },
    { title: "AI 도구 실험과 한계 분석 경험", body: "AI 도구를 실제 디자인 업무에 적용해보고 그 효과와 한계까지 스스로 분석해본 과정을 소개해보세요.", sourceQuote: "AI 도구나 에이전트를 실제 디자인 업무에 적용·실험해 보고, 그 과정의 효과와 한계를 설명할 수 있으신 분" },
  ],
  // 포디 - Product Designer (FODI)
  cmuserf6i003i9g2j86grr4fl: [
    { title: "데이터 기반 UX 개선 경험", body: "사용자 조사와 데이터를 근거로 기존 UX를 개선해본 과정을 before/after와 함께 보여주세요.", sourceQuote: "사용자 조사 및 데이터 기반 UX 개선 경험" },
    { title: "UX 흐름 분석과 개선안 도출 경험", body: "사용자 데이터를 바탕으로 기존 흐름의 문제를 분석하고 개선안을 도출해본 과정을 자세히 정리해보세요.", sourceQuote: "사용자 데이터를 기반으로 한 UX 흐름 분석 및 개선안 도출" },
    { title: "브랜드 일관성을 지키는 디자인 시스템", body: "브랜드 일관성을 지키면서 디자인 시스템을 정립하고 컴포넌트까지 관리해본 사례를 구체적으로 담아보세요.", sourceQuote: "브랜드 일관성을 고려한 디자인 시스템 정립 및 컴포넌트 관리" },
  ],
  // 에고이즘 - [feura] 마케팅 디자이너
  cmuserfp3003o9g2jqc8cmgg0: [
    { title: "AI 영상 플랫폼 활용 광고 제작 경험", body: "Runway나 Kling AI 같은 AI 영상 플랫폼으로 만든 콘텐츠를 실제 광고에 활용해본 사례를 담아보세요.", sourceQuote: "Runway·Kling AI·Pika 등 AI 영상 플랫폼으로 제작한 콘텐츠를 실제 광고에 활용해본 분" },
    { title: "반응 데이터로 소재를 개선한 경험", body: "광고 소재별 반응을 직접 확인하고 메시지와 디자인을 다시 개선해본 전체 과정을 구체적으로 정리해보세요.", sourceQuote: "마케터와 함께 광고 소재별 반응을 확인해 메시지와 디자인을 개선" },
    { title: "바이럴 영상 콘텐츠 기획 운영 경험", body: "릴스나 쇼츠 같은 영상 콘텐츠를 직접 기획하고 운영해 조회수와 유입을 끌어올린 사례를 구체적으로 보여주세요.", sourceQuote: "인스타그램 릴스·유튜브 쇼츠 등 영상 콘텐츠를 기획·운영하며 조회수, 공유, 고객 유입 등을 높여본 경험이 있으신 분" },
  ],
  // 데이터드리븐 - 비주얼 디자이너(신입~3년)
  cmuserfuz003r9g2jkfxnkadg: [
    { title: "목적에 맞춘 완성도 있는 그래픽 디자인", body: "Adobe와 Figma로 목적과 대상에 맞는 완성도 있는 그래픽을 제안해본 과정을 다양한 결과물로 보여주세요.", sourceQuote: "완성도 높은 그래픽 디자인과 목적에 맞는 디자인 제안 가능" },
    { title: "제안서·발표자료 디자인 경험", body: "영업과 마케팅에 쓰이는 제안서, 브로슈어, 발표자료처럼 정보 전달이 중요한 자료를 디자인해본 경험을 정리해보세요.", sourceQuote: "영업·마케팅에 쓰이는 제안서, 브로슈어, 발표자료를 디자인" },
    { title: "브랜드 아이덴티티 적용 경험", body: "하나의 브랜드 아이덴티티를 온라인과 오프라인 여러 매체에 걸쳐 일관되게 적용해본 사례를 구체적으로 소개해보세요.", sourceQuote: "브랜드 아이덴티티 개발 및 온·오프라인 전반에 일관되게 적용" },
  ],
  // 윗유 - 디자이너(1년 이상)
  cmuserg0p003u9g2jfxd60ckm: [
    { title: "브랜드 가이드 기반 디자인 적용력", body: "정해진 브랜드 가이드를 깊이 이해하고 여러 매체에 일관성 있게 적용해본 사례를 구체적으로 담아보세요.", sourceQuote: "브랜드 가이드를 이해하고 일관성 있게 디자인에 적용하실 수 있는 분" },
    { title: "웹·인쇄물 디자인 제작 경험", body: "웹페이지부터 인쇄물까지 여러 형태를 넘나들며 완성해본 결과물을 작업 과정과 함께 구체적으로 정리해보세요.", sourceQuote: "웹·지류 디자인 제작 지원" },
    { title: "제작물 검수 및 발주 경험", body: "완성된 디자인이 인쇄나 제작 단계에서 틀어지지 않도록 꼼꼼히 직접 검수해본 경험이 있다면 구체적으로 소개해보세요.", sourceQuote: "제작물 검수 및 발주 지원" },
  ],
  // 슈퍼센트 - [XP Hero] UI/UX 디자이너(3년 이상)
  cmuserg4y003w9g2jsr8lhk4h: [
    { title: "플로우 정의부터 컴포넌트 설계까지", body: "기능 플로우를 정의하는 단계부터 세부 컴포넌트로 구체화하기까지 전체 과정을 담은 프로젝트를 보여주세요.", sourceQuote: "기능 플로우 정의부터 컴포넌트 구성까지 독립적 혹은 팀 프로젝트 경험을 보유하신 분" },
    { title: "주요 탭 구조 설계 경험", body: "홈, 랭킹, 상점처럼 여러 탭으로 나뉜 앱의 정보 구조를 설계해본 프로젝트를 탭별 화면과 함께 정리해보세요.", sourceQuote: "홈/랭킹/추천/상점/프로필/게임서랍 등 주요 탭 구성" },
    { title: "마스코트·아이콘 일러스트 작업", body: "마스코트나 아이콘처럼 캐릭터성이 담긴 일러스트를 직접 그리고 작업해본 사례를 구체적으로 보여주세요.", sourceQuote: "마스코트, 아이콘, 일러스트레이션이 작업 가능하신 분" },
  ],
  // 콕스웨이브 - [AX krewa] 디자이너 (B2B)
  cmusergc3003z9g2j10bc271w: [
    { title: "복잡한 정보 구조를 다룬 경험", body: "대시보드나 어드민처럼 정보가 많고 복잡한 화면의 구조를 정리해본 프로젝트를 화면 구성과 함께 구체적으로 보여주세요.", sourceQuote: "대시보드, 어드민, 데이터 집약적 화면 등 복잡한 정보 구조를 다뤄 본 경험" },
    { title: "문제 정의 단계부터 참여한 경험", body: "무엇을 만들지 정하는 문제 정의 단계부터 개발팀과 함께 고민해본 프로젝트를 과정 중심으로 정리해보세요.", sourceQuote: "문제 정의 단계부터 참여해서 무엇을 만들지 함께 정하고" },
    { title: "브랜드 아이덴티티 구축 경험", body: "로고와 컬러, 타이포그래피 같은 브랜드 요소를 처음부터 정의해본 경험이 있다면 구체적으로 소개해보세요.", sourceQuote: "로고, 컬러, 타이포그래피, 그래픽 시스템, 톤 앤 매너를 정의해요" },
  ],
  // 스토어링크 - 웹디자이너(4년 이상)
  cmusergi200429g2jmen8n64n: [
    { title: "생성형 AI 활용 이미지 제작", body: "생성형 AI로 이미지를 만들고 원하는 결과가 나오도록 프롬프트를 다뤄본 경험을 결과물과 함께 보여주세요.", sourceQuote: "생성형 이미지 AI 및 프롬프팅 활용이 가능하신 분" },
    { title: "광고 소재 베리에이션 제작 경험", body: "하나의 광고 소재를 매체별 사이즈와 포맷에 맞게 꼼꼼하게 변형해본 작업을 전후 비교 화면과 함께 정리해보세요.", sourceQuote: "광고 운영을 위한 소재 베리에이션 및 리사이징" },
    { title: "퍼포먼스 광고 콘텐츠 이해도", body: "클릭과 전환을 끌어내기 위해 직접 고민하며 만든 광고 콘텐츠가 있다면 그 의도와 함께 구체적으로 설명해보세요.", sourceQuote: "퍼포먼스 광고 및 디지털 광고 콘텐츠에 대한 이해도가 있으신 분" },
  ],
  // 굿먼데이 - 웹/콘텐츠 디자이너
  cmusergo100459g2jrdnu6j5v: [
    { title: "전략 기반 디자인 역량", body: "막연한 느낌이 아니라 논리적인 전략을 먼저 세우고 그에 맞춰 디자인해본 과정을 구체적인 사례로 보여주세요.", sourceQuote: "논리적인 전략 기반의 디자인 역량" },
    { title: "커머스 상세페이지 디자인 경험", body: "제품 상세페이지나 아마존 A+ 콘텐츠처럼 구매를 유도하는 디자인을 만들어본 경험을 구체적으로 정리해보세요.", sourceQuote: "미국 아마존 A+ 컨텐츠 디자인" },
    { title: "촬영 기획 및 디렉팅 경험", body: "브랜드 전략과 톤앤매너에 맞춰 촬영을 기획하고 현장을 직접 디렉팅해본 경험이 있다면 구체적으로 소개해보세요.", sourceQuote: "브랜드 전략과 톤앤매너에 맞춘 촬영 기획과 디렉팅" },
  ],
  // 톤28 - 온라인 BX 디자이너 시니어
  cmusergzo00489g2jn2jpwnic: [
    { title: "비주얼 스토리텔링 역량", body: "제품 촬영과 이미지로 브랜드만의 이야기를 전달해본 프로젝트를 톤앤매너와 함께 구체적으로 보여주세요.", sourceQuote: "브랜딩, 제품 촬영, 비주얼 스토리텔링 역량을 갖추신 분" },
    { title: "자사몰·SNS 비주얼 브랜딩 경험", body: "자사몰과 SNS 등 여러 채널에 걸쳐 비주얼을 일관되게 운영해본 경험을 사례와 함께 구체적으로 정리해보세요.", sourceQuote: "D2C 자사몰 및 외부채널, SNS 비주얼 브랜딩, 캠페인 이미지 제작" },
    { title: "뷰티 브랜드 온라인 브랜딩 경험", body: "뷰티 브랜드의 온라인 채널을 처음부터 끝까지 직접 브랜딩해본 경험이 있다면 구체적인 사례로 소개해보세요.", sourceQuote: "뷰티 브랜드 온라인 브랜딩 경험을 보유하신 분" },
  ],
  // 큐피스트 - 브랜드 디자이너(BX Designer, 글램)
  cmuserh53004b9g2jy84pbcym: [
    { title: "매력적인 GUI 제작 역량", body: "그래픽에 대한 높은 이해를 바탕으로 매력적인 GUI를 만들어본 작업을 화면과 함께 구체적으로 보여주세요.", sourceQuote: "그래픽 이해도가 높고 매력적인 GUI를 제작할 수 있는 역량" },
    { title: "가설 기반 반복 개선 경험", body: "가설을 세우고 배포한 뒤 결과를 검증하며 프로덕트를 반복적으로 개선해본 과정을 구체적으로 정리해보세요.", sourceQuote: "가설-개발 및 배포-검증 및 학습" },
    { title: "데이터 기반 사고 경험", body: "감이 아니라 숫자와 데이터를 근거로 디자인 결정을 내려본 경험이 있다면 구체적인 사례로 소개해보세요.", sourceQuote: "숫자 및 데이터를 기반으로 사고" },
  ],
  // 테라퓨젠바이오 - [미디어커머스] 브랜드 디자이너
  cmuserhas004e9g2jz5s12q28: [
    { title: "생성형 AI 활용 디자인 역량", body: "생성형 AI를 적극적으로 활용해 구매를 유도하는 디자인을 만들어본 경험을 실제 결과물과 함께 보여주세요.", sourceQuote: "생성형 AI 활용으로 팔리는 디자인을 표현할 수 있는 분" },
    { title: "제품 패키지 디자인 경험", body: "제품 패키지를 기획 단계부터 디자인까지 직접 맡아본 경험을, 실제 결과물과 함께 구체적으로 정리해보세요.", sourceQuote: "제품 패키지 기획 및 디자인" },
    { title: "화장품·건기식 디자인 경험", body: "화장품이나 건강기능식품 분야의 디자인 업무를 직접 해본 경험이 있다면 구체적인 사례로 소개해보세요.", sourceQuote: "화장품 / 건강기능식품 디자인 업무 경험자" },
  ],
  // 아트라미 - [뚜누] 브랜드 커머스 디자이너
  cmuserhge004h9g2jx23tdqzw: [
    { title: "아이덴티티 반영 상세페이지 기획", body: "브랜드만의 아이덴티티를 반영해 상세페이지를 기획하고 제작해본 경험을 사례와 함께 구체적으로 정리해보세요.", sourceQuote: "브랜드의 아이덴티티를 반영한 상세페이지 기획 및 제작 경험이 있으신 분" },
    { title: "구매 전환 중심 콘텐츠 제작", body: "구매로 이어지도록 설계한 상세페이지나 콘텐츠를, 전환을 고려한 의도와 함께 구체적인 사례로 보여주세요.", sourceQuote: "구매 전환 중심의 상세페이지 기획 및 제작" },
    { title: "촬영 디렉팅 및 이미지 보정 경험", body: "외주 스튜디오 촬영을 디렉팅하거나 이미지를 직접 보정하고 가공해본 경험이 있다면 구체적으로 소개해보세요.", sourceQuote: "외주 스튜디오 디렉팅, 이미지 보정 및 2차 가공" },
  ],
  // 디마프 - 스킨케어 웹 디자이너
  cmuserhm9004k9g2j86n3wyit: [
    { title: "Figma 활용 숙련도", body: "Figma로 처음부터 끝까지 직접 완성해본 프로젝트를, 실제 작업 과정과 함께 구체적으로 보여주세요.", sourceQuote: "Figma 활용이 능숙하신 분" },
    { title: "제품 상세페이지 디자인 경험", body: "제품의 특징을 설득력 있게 전달하는 상세페이지를 직접 디자인해본 경험을 구체적인 사례로 정리해보세요.", sourceQuote: "제품 상세페이지 디자인 작업" },
    { title: "홈페이지·배너 디자인 경험", body: "홈페이지나 커뮤니티 채널의 다양한 페이지와 배너를 직접 디자인해본 경험을 모아서 구체적으로 소개해보세요.", sourceQuote: "홈페이지/커뮤니티 채널의 각종 페이지, 배너 등 디자인 작업" },
  ],
  // 사이오닉에이아이 - Product Designer (3년 이상)
  cmuserhse004n9g2jo0o0ln2s: [
    { title: "디자인 시스템 구축 및 운영 경험", body: "디자인 시스템을 직접 만들거나 운영하고 개선해본 경험을, 적용 전후 비교와 함께 구체적으로 보여주세요.", sourceQuote: "디자인 시스템을 직접 구축하거나 운영·개선해본 경험" },
    { title: "복잡한 기술의 UX 단순화 경험", body: "복잡하고 어려운 기술을 비전문가도 직관적으로 쓸 수 있게 풀어낸 UX 설계 사례를 구체적으로 소개해보세요.", sourceQuote: "복잡한 기술을 AI 비전문가인 고객이 쉽게 이해하고 직관적으로 활용할 수 있도록 UX설계" },
    { title: "AI 툴 활용 빠른 프로토타입 제작", body: "AI 기반 툴로 목업이나 프로토타입을 빠르게 만들어본 경험이 있다면 작업 과정과 함께 구체적으로 보여주세요.", sourceQuote: "Harness, MCP 등 AI 기반 툴을 활용해 목업/프로토타입 빠르게 제작해본 경험" },
  ],
  // 팀플레이어 - UXUI 컨설턴트, 기획, 디자이너
  cmuserhz9004q9g2jzkzy76zw: [
    { title: "실험과 반복을 통한 개선 역량", body: "새로운 아이디어를 직접 실험하고 반복하며 건설적인 피드백을 받아들여 개선해본 과정을 구체적으로 보여주세요.", sourceQuote: "기꺼이 실험하고 반복하며, 건설적인 비판을 수용할 수 있는 능력" },
    { title: "UX 리서치 기반 인사이트 도출", body: "사용자 리서치로 데이터를 모으고 분석해 의미 있는 인사이트를 끌어낸 과정을 구체적으로 정리해보세요.", sourceQuote: "사용자 경험 리서치 및 분석을 통해 인사이트 도출" },
    { title: "다양한 이해관계자와의 협업 경험", body: "여러 이해관계자와 소통하며 프로젝트를 직접 이끌어본 경험을, 협업 과정과 함께 구체적으로 소개해보세요.", sourceQuote: "다양한 이해관계자와의 협업을 통한 프로젝트 관리" },
  ],
  // 코스멘토코리아 - [인턴] Design/디자인 (헤브블루)
  cmuseri6q004t9g2je4pj0gcm: [
    { title: "디자인 가이드 이해 및 적용력", body: "정해진 디자인 가이드와 톤앤매너를 빠르게 파악해 그대로 적용해본 경험을 구체적인 사례로 보여주세요.", sourceQuote: "기존 디자인 가이드와 톤앤매너를 빠르게 이해할 수 있는 분" },
    { title: "배너·상세페이지 제작 지원 경험", body: "배너나 썸네일, 상세페이지처럼 실제로 쓰이는 결과물을 직접 만들어본 경험을 구체적으로 정리해보세요.", sourceQuote: "배너 / 썸네일 / 프로모션 소재 제작 지원" },
    { title: "뷰티 브랜드 디자인에 대한 관심", body: "뷰티나 화장품 브랜드의 디자인을 평소 꾸준히 눈여겨보고 분석해본 경험이 있다면 구체적으로 소개해보세요.", sourceQuote: "뷰티 / 화장품 브랜드 디자인에 관심이 많은 분" },
  ],
  // 퀀텀에어로 - UI/UX 디자이너(2년 이상)
  cmuserik8004z9g2jtqtrnwl7: [
    { title: "타이포그래피·레이아웃 구성력", body: "타이포그래피와 레이아웃을 세심하게 다뤄 완성도를 높인 작업을 실제 화면과 함께 구체적으로 보여주세요.", sourceQuote: "뛰어난 타이포그래피 및 레이아웃 등 시각적 구성 능력 보유자" },
    { title: "반응형 UI/UX 설계 경험", body: "여러 화면 환경에 맞춰 반응형으로 최적화한 UI/UX를 설계해본 사례를 화면과 함께 구체적으로 정리해보세요.", sourceQuote: "다양한 환경에 최적화된 반응형 및 적응형 UI/UX 디자인 도출" },
    { title: "인포그래픽·브로슈어 제작 경험", body: "사업제안서나 전시용 브로슈어에 들어가는 인포그래픽을 직접 제작해본 경험이 있다면 구체적으로 소개해보세요.", sourceQuote: "전시용 브로슈어 디자인 및 인포그래픽 제작" },
  ],
  // 더크림유니언 - UI/UX 디자인(3년 이상~10년 이하)
  cmuseriqn00529g2jyrv5fm9g: [
    { title: "기획 의도를 반영한 비주얼 완성도", body: "기획 의도와 사용자 편의성을 함께 고려해 완성도 높은 비주얼을 만들어본 과정을 구체적으로 보여주세요.", sourceQuote: "기획 의도와 사용자 편의성을 고려해 완성도 높은 비주얼을 만들어낼 수 있으신 분" },
    { title: "비즈니스 목표 반영 IA 설계", body: "비즈니스 목표와 사용자 니즈를 함께 고려해 화면 구조를 설계해본 과정을 구체적인 사례로 정리해보세요.", sourceQuote: "비즈니스 목표와 사용자 니즈를 반영한 화면 구조(IA) 설계" },
    { title: "신규 프로젝트 제안 디자인 경험", body: "새로운 프로젝트를 제안하기 위해 콘셉트부터 핵심 화면까지 직접 만들어본 경험을 구체적으로 소개해보세요.", sourceQuote: "신규 프로젝트 제안을 위한 디자인 콘셉트 기획, 핵심 화면 설계 및 비주얼 디자인 제작" },
  ],
  // 뤼튼 - UX Writer (캬라푸)
  cmv0mvhi800019swjl6gb5b16: [
    { title: "사용자 관점 근거로 설득하는 역량", body: "감이 아닌 사용자 관점의 근거로 문구를 다듬고 동료를 설득해본 과정을 구체적인 사례와 함께 보여주세요.", sourceQuote: "감이 아닌 사용자 관점의 근거로 문구의 이유를 설명하고 동료를 설득할 수 있으신 분" },
    { title: "일본어 문구 작성·관리 경험", body: "앱/웹 UI 문구부터 에러 메시지, 푸시 알림까지 다양한 문구를 작성하고 관리해본 경험을 보여주세요.", sourceQuote: "캬라푸 앱/웹의 UI 문구는 물론, 에러 및 시스템 메시지, 푸시 알림 등 캬라푸 제품에 노출되는 모든 일본어 문구를 작성하고 관리합니다." },
    { title: "현지화 가이드라인·시스템 구축 경험", body: "단순 번역을 넘어 팀이 재사용할 가이드라인이나 템플릿으로 직접 확장해본 경험이 있다면 소개해주세요.", sourceQuote: "단순 번역을 넘어 팀 전체가 재사용할 수 있는 가이드라인, 템플릿, 시스템으로 확장해본 경험이 있으신 분" },
  ],
};
