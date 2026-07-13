import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const jobs = [
  {
    title: "커머스 프로덕트 디자이너 (앱)",
    companyName: "그린카트",
    role: "프로덕트 디자인",
    platforms: ["앱", "웹"],
    industry: "커머스",
    stage: "유니콘",
    location: "서울 강남구",
    description:
      "그린카트는 신선식품 커머스 앱을 만드는 팀입니다. 장바구니부터 결제까지 전 구매 여정의 UX를 담당할 프로덕트 디자이너를 찾습니다. 주요 업무는 신규 기능 기획 단계부터 참여해 와이어프레임과 하이파이 프로토타입을 제작하고, 데이터 기반으로 퍼널 개선 실험을 설계하는 것입니다. 디자인 시스템을 함께 운영하며 개발자와 긴밀히 협업합니다. 자격 요건: UXUI 디자인 3년 이상 경력, Figma 능숙, A/B 테스트 경험 우대, 커머스 도메인 경험자 우대.",
    applyUrl: "https://example.com/jobs/greencart-product-designer",
  },
  {
    title: "UXUI 디자이너 (핀테크 웹)",
    companyName: "페이브릿지",
    role: "UXUI 디자인",
    platforms: ["웹"],
    industry: "핀테크",
    stage: "스타트업",
    location: "서울 성동구",
    description:
      "페이브릿지는 중소상공인을 위한 정산 자동화 서비스를 운영합니다. 복잡한 금융 정보를 쉽게 이해할 수 있도록 정보 구조를 설계하고, 대시보드 UI를 개선할 UXUI 디자이너를 채용합니다. 신뢰감 있는 톤앤매너와 정확한 수치 표현이 중요한 프로젝트입니다. 자격 요건: 웹 서비스 디자인 2년 이상, 복잡한 데이터 테이블/대시보드 설계 경험, 핀테크 또는 B2B SaaS 경험자 우대.",
    applyUrl: "https://example.com/jobs/paybridge-uxui",
  },
  {
    title: "GUI 디자이너 (모빌리티 클러스터)",
    companyName: "모션랩스",
    role: "GUI 디자인",
    platforms: ["모빌리티", "태블릿"],
    industry: "모빌리티",
    stage: "대기업",
    location: "경기 화성시",
    description:
      "모션랩스는 차량용 인포테인먼트 시스템을 개발합니다. 클러스터와 센터페시아 화면의 비주얼 디자인을 담당할 GUI 디자이너를 찾습니다. 주행 중 시인성과 브랜드 아이덴티티를 동시에 만족하는 아이코노그래피와 컬러 시스템을 설계합니다. 자격 요건: GUI/비주얼 디자인 3년 이상, 모션 그래픽 툴(After Effects 등) 활용 가능자, 차량 UX 가이드라인(예: NHTSA) 이해 우대.",
    applyUrl: "https://example.com/jobs/motionlabs-gui",
  },
  {
    title: "프로덕트 디자이너 (SNS 앱)",
    companyName: "루프소셜",
    role: "프로덕트 디자인",
    platforms: ["앱"],
    industry: "SNS",
    stage: "스타트업",
    location: "서울 마포구",
    description:
      "루프소셜은 관심사 기반 커뮤니티 앱을 만듭니다. 빠르게 실험하고 배우는 문화 속에서 신규 기능을 처음부터 끝까지 책임질 프로덕트 디자이너를 찾습니다. 콘텐츠 피드, 알림, 프로필 등 핵심 경험을 담당하게 됩니다. 자격 요건: 0-to-1 프로덕트 경험, 빠른 프로토타이핑 능력, 사용자 리서치를 스스로 기획하고 실행한 경험.",
    applyUrl: "https://example.com/jobs/loopsocial-product-designer",
  },
  {
    title: "UX 리서처 (헬스케어)",
    companyName: "케어노트",
    role: "UX 리서치",
    platforms: ["앱", "웹"],
    industry: "헬스케어",
    stage: "중견 기업",
    location: "서울 송파구",
    description:
      "케어노트는 만성질환 관리 플랫폼을 운영합니다. 환자와 의료진 두 축의 사용자를 이해하고 인사이트를 제품 조직에 전달할 UX 리서처를 찾습니다. 정성/정량 리서치를 설계하고, 민감한 의료 데이터를 다루는 만큼 리서치 윤리 기준을 준수해야 합니다. 자격 요건: UX 리서치 2년 이상, 심층 인터뷰 및 설문 설계 경험, 헬스케어/의료 도메인 이해 우대.",
    applyUrl: "https://example.com/jobs/carenote-researcher",
  },
  {
    title: "UX 라이터 (여행 플랫폼)",
    companyName: "어라운드트립",
    role: "UX 라이팅",
    platforms: ["앱", "웹"],
    industry: "여행/로컬",
    stage: "유니콘",
    location: "서울 서초구",
    description:
      "어라운드트립은 로컬 여행 예약 플랫폼입니다. 예약 흐름 전반의 마이크로카피와 톤앤보이스를 책임질 UX 라이터를 찾습니다. 다국어 서비스 확장을 앞두고 있어 번역 친화적인 카피 시스템 구축 경험이 있으면 좋습니다. 자격 요건: UX 라이팅 2년 이상, 카피 가이드라인 수립 경험, 여행/커머스 도메인 이해 우대.",
    applyUrl: "https://example.com/jobs/aroundtrip-writer",
  },
  {
    title: "UXUI 디자이너 (B2B SaaS 대시보드)",
    companyName: "워크플로우웍스",
    role: "UXUI 디자인",
    platforms: ["웹"],
    industry: "B2B SaaS",
    stage: "중견 기업",
    location: "서울 강남구",
    description:
      "워크플로우웍스는 협업 자동화 SaaS를 만듭니다. 관리자 대시보드와 워크플로우 빌더의 정보 구조를 설계할 UXUI 디자이너를 찾습니다. 복잡한 설정 화면을 단순한 멘탈 모델로 풀어내는 역량이 중요합니다. 자격 요건: B2B SaaS 디자인 3년 이상, 복잡한 IA 설계 경험, 디자인 시스템 운영 경험 우대.",
    applyUrl: "https://example.com/jobs/workfloworks-uxui",
  },
  {
    title: "프로덕트 디자이너 (가전 앱 연동)",
    companyName: "홈센스",
    role: "프로덕트 디자인",
    platforms: ["앱", "가전"],
    industry: "커머스",
    stage: "대기업",
    location: "경기 수원시",
    description:
      "홈센스는 스마트홈 가전과 연동되는 모바일 앱을 개발합니다. 기기 페어링부터 원격 제어까지 하드웨어와 소프트웨어가 맞닿는 경험을 설계할 프로덕트 디자이너를 찾습니다. 자격 요건: IoT/하드웨어 연동 앱 디자인 경험 우대, 온보딩 플로우 설계 경험, 크로스펑셔널 협업 능력.",
    applyUrl: "https://example.com/jobs/homesense-product-designer",
  },
  {
    title: "GUI 디자이너 (웨어러블)",
    companyName: "핏싱크",
    role: "GUI 디자인",
    platforms: ["워치/웨어러블"],
    industry: "헬스케어",
    stage: "스타트업",
    location: "서울 성수동",
    description:
      "핏싱크는 건강 지표를 추적하는 스마트워치 소프트웨어를 만듭니다. 작은 화면에서 정보 위계를 명확히 표현할 GUI 디자이너를 찾습니다. 자격 요건: 소형 스크린 UI 디자인 경험, 픽셀 단위 정교함, 워치 OS 디자인 가이드라인 이해 우대.",
    applyUrl: "https://example.com/jobs/fitsync-gui",
  },
  {
    title: "UXUI 디자이너 (VR/AR 프로토타입)",
    companyName: "스페이셜웍스",
    role: "UXUI 디자인",
    platforms: ["VR/AR"],
    industry: "SNS",
    stage: "스타트업",
    location: "서울 용산구",
    description:
      "스페이셜웍스는 공간 컴퓨팅 기반 소셜 경험을 실험하는 팀입니다. 3D 공간에서의 인터랙션 패턴을 정의할 UXUI 디자이너를 찾습니다. 자격 요건: 3D/공간 UI 디자인 경험 또는 강한 관심, 빠른 프로토타이핑 툴 활용 능력, 신기술에 대한 학습 의지.",
    applyUrl: "https://example.com/jobs/spatialworks-uxui",
  },
  {
    title: "프로덕트 디자이너 (에이전시, 다양한 클라이언트)",
    companyName: "스튜디오널",
    role: "프로덕트 디자인",
    platforms: ["웹", "앱"],
    industry: "B2B SaaS",
    stage: "에이전시",
    location: "서울 을지로",
    description:
      "스튜디오널은 스타트업 프로덕트 디자인을 전문으로 하는 에이전시입니다. 다양한 산업군의 클라이언트 프로젝트를 동시에 진행하며 짧은 사이클로 임팩트를 만들 프로덕트 디자이너를 찾습니다. 자격 요건: 다양한 프로젝트 동시 진행 경험, 클라이언트 커뮤니케이션 능력, 빠른 러닝커브.",
    applyUrl: "https://example.com/jobs/studional-product-designer",
  },
  {
    title: "UX 리서처 (모빌리티 서비스)",
    companyName: "라이드플로우",
    role: "UX 리서치",
    platforms: ["앱", "모빌리티"],
    industry: "모빌리티",
    stage: "유니콘",
    location: "서울 강서구",
    description:
      "라이드플로우는 공유 모빌리티 서비스를 운영합니다. 라이더와 드라이버 양측의 경험을 리서치할 UX 리서처를 찾습니다. 필드 리서치와 실사용 관찰 조사가 잦은 포지션입니다. 자격 요건: 필드 리서치 경험, 정량 데이터 분석 기초, 양면 시장 서비스 이해 우대.",
    applyUrl: "https://example.com/jobs/rideflow-researcher",
  },
  {
    title: "UX 라이터 (핀테크 앱)",
    companyName: "머니루트",
    role: "UX 라이팅",
    platforms: ["앱"],
    industry: "핀테크",
    stage: "중견 기업",
    location: "서울 여의도",
    description:
      "머니루트는 개인 자산관리 앱을 만듭니다. 어려운 금융 개념을 쉬운 언어로 번역할 UX 라이터를 찾습니다. 규제 문구와 사용자 친화적 표현 사이의 균형을 잡는 역할입니다. 자격 요건: 금융 서비스 라이팅 경험 우대, 정확성과 간결함을 동시에 추구하는 태도, 법무/컴플라이언스 협업 경험.",
    applyUrl: "https://example.com/jobs/moneyroute-writer",
  },
  {
    title: "GUI 디자이너 (커머스 웹)",
    companyName: "셀프마켓",
    role: "GUI 디자인",
    platforms: ["웹", "태블릿"],
    industry: "커머스",
    stage: "대기업",
    location: "서울 구로구",
    description:
      "셀프마켓은 대형 이커머스 플랫폼을 운영합니다. 시즌별 프로모션과 카테고리 페이지의 비주얼 완성도를 책임질 GUI 디자이너를 찾습니다. 자격 요건: 커머스 UI 비주얼 디자인 3년 이상, 그리드 시스템 기반 레이아웃 설계 경험, 대용량 트래픽 서비스 경험 우대.",
    applyUrl: "https://example.com/jobs/selfmarket-gui",
  },
  {
    title: "프로덕트 디자이너 (B2B SaaS, 스타트업)",
    companyName: "테이블핏",
    role: "프로덕트 디자인",
    platforms: ["웹"],
    industry: "B2B SaaS",
    stage: "스타트업",
    location: "서울 논현동",
    description:
      "테이블핏은 소상공인을 위한 예약/매장관리 SaaS를 만듭니다. 초기 팀의 유일한 디자이너로서 제품 방향성 논의부터 참여할 프로덕트 디자이너를 찾습니다. 자격 요건: 초기 스타트업 경험 또는 강한 오너십, PM/개발자와 밀착 협업 가능, 빠른 의사결정에 익숙한 분.",
    applyUrl: "https://example.com/jobs/tablefit-product-designer",
  },
  {
    title: "UXUI 디자이너 (여행 앱)",
    companyName: "로컬퍼즐",
    role: "UXUI 디자인",
    platforms: ["앱"],
    industry: "여행/로컬",
    stage: "스타트업",
    location: "서울 이태원",
    description:
      "로컬퍼즐은 현지인 추천 기반 여행 코스 앱입니다. 탐색부터 저장, 공유까지 이어지는 경험을 설계할 UXUI 디자이너를 찾습니다. 자격 요건: 콘텐츠 중심 앱 디자인 경험, 지도/위치 기반 UI 설계 경험 우대, 비주얼 감각과 시스템적 사고를 함께 갖춘 분.",
    applyUrl: "https://example.com/jobs/localpuzzle-uxui",
  },
];

async function main() {
  for (const job of jobs) {
    await prisma.job.create({ data: job });
  }
  console.log(`Seeded ${jobs.length} jobs.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
