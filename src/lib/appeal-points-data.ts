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
    { title: "제약 속에서 만든 비주얼 완성도", body: "여러 제약 조건 안에서도 탁월한 비주얼 결과물을 만들어낸 경험을 포트폴리오로 보여주세요.", sourceQuote: "프로젝트가 가진 많은 제약 조건 속에서도 탁월한 비주얼을 만들어낼 수 있는 역량이 필요해요" },
    { title: "결과보다 사고 과정을 보여주는 포트폴리오", body: "결과물 나열보다 어떤 사고 흐름을 거쳐 최종 결과물에 이르렀는지 과정을 자세히 담아주세요.", sourceQuote: "결과물 위주의 구성보다, 어떤 사고 흐름을 거쳐 최종 결과물에 이르렀는지 과정이 자세히 담아 주세요" },
    { title: "이해관계자 설득 경험", body: "좋은 결과물을 위해 여러 이해관계자를 설득해본 과정을 사례로 설명해주세요.", sourceQuote: "좋은 결과물을 만들어내기 위해 다양한 이해관계자를 설득해 본 경험이 필요해요" },
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
  cmrt6jh8e000q14dq9uq4a8lk: [
    { title: "이탈 최소화 User Flow 설계 경험", body: "이탈을 최소화하는 User Flow와 정보 구조를 설계하고 사용성 테스트로 검증한 경험을 보여주세요.", sourceQuote: "이탈을 최소화하는 User Flow와 정보 구조(IA) 설계, 프로토타이핑과 사용성 테스트(UT)로 반복 검증" },
    { title: "퍼널·전환율 데이터 검증 경험", body: "Amplitude 같은 툴로 퍼널과 전환율, 리텐션을 확인하고 A/B 테스트로 개선을 검증한 경험을 보여주세요.", sourceQuote: "Amplitude 등으로 퍼널·전환율(CVR)·리텐션 지표 확인, A/B 테스트로 개선 효과 검증" },
    { title: "제품 주도 전담 경험", body: "목적 조직에 참여해 제품 디자인을 주도적으로 전담한 경험을 구체적으로 적어주세요.", sourceQuote: "목적 조직(스쿼드)에 참여하여 담당 제품·서비스의 프로덕트 디자인을 주도적으로 전담" },
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
    { title: "가설 수립·검증 통한 제품 개선", body: "데이터를 기반으로 문제를 정의하고 가설을 세워 검증한 제품 개선 경험을 보여주세요.", sourceQuote: "정량/정성 데이터를 기반으로 문제를 정의하고 가설 수립과 검증을 통해 제품을 개선합니다" },
    { title: "구조적 사고 정리 능력", body: "문제 정의부터 스펙까지 구조적으로 정리한 사고 과정을 보여주세요.", sourceQuote: "뛰어난 추상화 능력을 바탕으로 Problem → Concept → Spec 흐름을 구조적으로 정리할 수 있으신 분" },
    { title: "AI 활용 빠른 실험 경험", body: "AI를 활용해 빠르게 실험하고 반복하며 제품 완성도를 높인 경험을 보여주세요.", sourceQuote: "AI를 활용해 빠른 실험과 반복을 통해 제품 완성도를 높입니다" },
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
    {
      title: "디자인 시스템을 구축하거나 운영한 경험",
      body: "직접 디자인 시스템을 구축하거나 운영해본 경험을 포트폴리오에 1개 이상 꼭 포함해주세요. 컴포넌트나 UI 패턴을 체계화한 작업이면 좋아요.",
      sourceQuote:
        "디자인 시스템을 구축하거나 운영한 경험이 있는 분이면 좋아요.",
    },
    {
      title: "하드웨어와 멀티디바이스 설계 경험",
      body: "포스, 키오스크, 단말기, TV, 워치 등 모바일과 데스크탑 외의 화면을 설계해본 경험이 있다면 그 사례를 우선 소개해주세요.",
      sourceQuote:
        "하드웨어, 멀티디바이스(단말기, 키오스크, TV, 워치 등) 경험이 있다면 그 사례를 우선 소개해 주세요.",
    },
    {
      title: "결과물보다 사고 흐름이 드러난 구성",
      body: "완성된 결과물만 나열하기보다, 어떤 사고 흐름을 거쳐 그 결과물에 이르렀는지 과정을 자세히 담아주세요.",
      sourceQuote:
        "결과물 위주의 구성보다, 어떤 사고 흐름을 거쳐 최종 결과물에 이르렀는지 과정이 자세히 담긴 구성이 좋아요.",
    },
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
      title: "AI를 도구로 활용한 기획 감각",
      body: "AI 같은 새로운 기술을 도구로 삼아 사용자의 마음을 읽어내고 기획에 반영해본 경험을 담아주세요.",
      sourceQuote:
        "기술이 고도화될수록 결코 변하지 않는 핵심은, 결국 사용자의 마음을 읽어내는 '당신만의 날카로운 기획력'에 있습니다",
    },
    {
      title: "Excel·Figma 문서화 역량",
      body: "기획 문서를 Excel, Figma 등으로 명확하게 정리하고 전달해본 경험을 보여주세요.",
      sourceQuote:
        "문서 작성 툴 역량(Excel, Figma)",
    },
  ],
};
