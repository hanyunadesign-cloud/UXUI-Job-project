import { ClubCard } from "@/components/ClubCard";

function faviconFor(domain: string): string {
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
}

// 기수마다 모집 일정이 바뀌므로 정확한 날짜 대신 매년 반복되는 대략적인 시기만 안내한다.
const CLUBS = [
  {
    name: "디프만 (DEPROMEET)",
    domain: "depromeet.com",
    description: "디자이너와 프로그래머가 만나 서비스를 함께 만드는 IT 연합 동아리",
    recruitSeason: "연 2회 · 매년 2월, 8월경",
  },
  {
    name: "매쉬업 (Mash-Up)",
    domain: "mash-up.kr",
    description: "기획·디자인·개발 직군이 팀을 이뤄 프로덕트를 만드는 IT 연합 동아리",
    recruitSeason: "연 2회 · 매년 6월, 12월",
  },
  {
    name: "YAPP",
    domain: "yapp.co.kr",
    description: "대학생 중심으로 웹/앱 프로덕트를 기획부터 출시까지 경험하는 연합 동아리",
    recruitSeason: "연 1회 · 매년 4월경",
  },
  {
    name: "DND",
    domain: "dnd.ac",
    description: "프론트엔드·백엔드·디자이너가 6인 1팀으로 8주간 프로젝트를 진행하는 동아리",
    recruitSeason: "연 2회 · 매년 7월, 12월경",
  },
  {
    name: "넥스터즈 (NEXTERS)",
    domain: "nexters.co.kr",
    description: "개발자와 디자이너가 아이디어를 실제 서비스로 만드는 IT 연합 동아리",
    recruitSeason: "연 1회 · 매년 5월경",
  },
];

export default function ClubsPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-xl font-bold text-ink">IT 동아리</h1>
        <p className="mt-1 text-sm text-neutral-500">
          국내 주요 IT 연합 동아리와 다음 모집 시기를 한눈에 확인하세요.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CLUBS.map((club) => (
          <ClubCard
            key={club.name}
            name={club.name}
            logoSrc={faviconFor(club.domain)}
            description={club.description}
            recruitSeason={club.recruitSeason}
          />
        ))}
      </div>

      <p className="text-xs text-neutral-400">
        모집 시기는 기수마다 조금씩 달라질 수 있어요. 정확한 일정은 각 동아리 공식 채널에서 확인해주세요.
      </p>
    </div>
  );
}
