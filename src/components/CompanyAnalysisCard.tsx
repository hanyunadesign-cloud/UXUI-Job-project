"use client";

import { useState } from "react";
import { ExternalLink, Info, ChevronDown } from "lucide-react";
import { clsx } from "clsx";
import { STAGES, type Stage } from "@/lib/constants";
import { trackEvent } from "@/lib/analytics";

// "기업 정보" 탭 콘텐츠. 링크는 DB에 없는 필드라 AI 추정 대신 직접 웹 검색으로 확인한 값만
// 쓴다. 확인 못 한 항목(디자인 블로그 등)은 지어내지 않고 null로 둬서 "확인 안 됨"으로 표시한다.
// 채용공고 게재 부서 항목은 정보 가치가 낮아 제외했다. 회사명으로 조회한다 — 같은 회사의 여러
// 공고가 도메인/문제 설명을 그대로 공유해서(스테이지는 공고별 job.stage를 별도 prop으로 받는다,
// 아래 CompanyAnalysisCard 참고), 공고 id가 아니라 companyName이 키다.
export type CompanyAnalysisData = {
  companyUrl: string | null;
  designBlogUrl: string | null;
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

// 회사명으로 조회한다. 회사명 문자열은 반드시 job.companyName과 정확히 일치해야 한다.
const COMPANY_ANALYSIS: Record<string, CompanyAnalysisData> = {
  토스인슈어런스: {
    companyUrl: "https://tossinsu.com",
    designBlogUrl: "https://toss.tech/category/design",
    domainPrimary: "핀테크 · 보험",
    domainSecondary:
      "보험과 기술을 결합한 인슈어테크 서비스예요. 법인보험대리점(GA)으로서 보험설계사와 고객을 연결하는 플랫폼을 만들어요.",
    domainKeywords: ["인슈어테크", "보험 GA", "B2C·B2B"],
    problemLede: "보험 설계사와 고객 사이의 정보 비대칭·번거로운 절차를 제품으로 줄이는 게 핵심 문제예요.",
    problemRest:
      "설계사에게는 반복 업무 효율을, 고객에게는 직관적인 가입·상담 경험을 만드는 B2C·B2B 제품을 함께 만들어요.",
  },
  아정당: {
    companyUrl: "https://recruit.ajd.co.kr",
    designBlogUrl: null,
    domainPrimary: "홈서비스 · O2O",
    domainSecondary:
      "이사·청소 같은 생활 서비스를 전문가와 연결하는 O2O 플랫폼이에요. 복잡한 예약·매칭 과정을 제품으로 편리하게 만들어요.",
    domainKeywords: ["O2O", "생활 서비스", "디자인 시스템"],
    problemLede: "이사·청소처럼 복잡한 생활 서비스를 예약하는 과정을 더 쉽게 만드는 게 핵심 문제예요.",
    problemRest: "고객이 겪는 문제를 논리적 근거로 정의하고, 일관된 디자인 시스템으로 풀어내는 프로덕트를 만들어요.",
  },
  네이버웹툰: {
    companyUrl: "https://recruit.webtoonscorp.com",
    designBlogUrl: null,
    domainPrimary: "콘텐츠 · 엔터테인먼트",
    domainSecondary:
      "전 세계 이용자에게 웹툰을 서비스하는 콘텐츠 플랫폼이에요. 작가와 독자를 연결하는 커뮤니티 기능과 창작 도구까지 함께 만들어요.",
    domainKeywords: ["웹툰", "콘텐츠 플랫폼", "글로벌"],
    problemLede: "작가와 독자가 웹툰 생태계 안에서 더 잘 만나고 소통하게 만드는 게 핵심 문제예요.",
    problemRest: "작가홈·유저홈 같은 공통 커뮤니티 플랫폼으로, 한국과 글로벌 이용자 모두에게 일관된 경험을 만들어요.",
  },
  한패스: {
    companyUrl: "https://www.hanpass.com",
    designBlogUrl: null,
    domainPrimary: "핀테크 · 외국인금융",
    domainSecondary:
      "외국인 고객을 위한 해외송금·금융 서비스를 만드는 핀테크예요. 송금을 넘어 교통, 통신, 커리어 매칭까지 생활 전반의 금융 경험을 확장하고 있어요.",
    domainKeywords: ["핀테크", "해외송금", "외국인 고객"],
    problemLede: "외국인 고객이 낯선 한국에서 겪는 복잡한 금융 절차를 쉽게 만드는 게 핵심 문제예요.",
    problemRest: "언어와 제도가 낯선 고객도 직관적으로 쓸 수 있는 해외송금·금융 서비스를 만들어요.",
  },
  엑스에이아이: {
    companyUrl: "https://x.ai",
    designBlogUrl: null,
    domainPrimary: "AI",
    domainSecondary: "우주를 이해하는 AI 시스템을 만드는 걸 미션으로 하는 AI 기업이에요. 소셜·AI 기반 프로덕트 전반의 경험을 설계해요.",
    domainKeywords: ["AI", "소셜 프로덕트", "글로벌"],
    problemLede: "AI가 만드는 새로운 경험을, 사람이 실제로 쓸 수 있는 제품으로 다듬는 게 핵심 문제예요.",
    problemRest: "빠르게 움직이는 팀에서, AI 도구까지 활용해 프로덕트 경험을 처음부터 끝까지 설계해요.",
  },
  "111퍼센트": {
    companyUrl: "http://www.111percent.net/",
    designBlogUrl: null,
    domainPrimary: "게임 · 모바일",
    domainSecondary: "'랜덤다이스' 등 캐주얼 모바일 게임을 만드는 게임 개발사예요. 전 세계 1억 명 이상의 유저가 즐기는 타이틀을 다수 보유하고 있어요.",
    domainKeywords: ["캐주얼 게임", "모바일 게임", "글로벌 서비스"],
    problemLede: "짧은 시간에 강한 재미를 주는 캐주얼 게임을 만들어 전 세계 유저에게 꾸준히 새로운 즐거움을 전하는 게 핵심 문제예요.",
    problemRest: "빠른 출시와 반복 개선으로 글로벌 시장에서 경쟁력 있는 게임 경험을 만들어가요.",
  },
  "BGF리테일": {
    companyUrl: "https://www.bgfretail.com/",
    designBlogUrl: null,
    domainPrimary: "유통 · 편의점",
    domainSecondary: "CU 편의점을 운영하는 국내 대표 유통 서비스 기업이에요. 오프라인 매장과 온라인 서비스를 아우르는 다양한 디지털 플랫폼을 함께 만들어요.",
    domainKeywords: ["편의점 유통", "커머스", "O2O 플랫폼"],
    problemLede: "전국 매장망과 연결된 디지털 서비스를 통해 고객이 더 편리하게 상품과 혜택을 이용하도록 만드는 게 핵심 문제예요.",
    problemRest: "모바일 앱부터 운영 어드민까지 다양한 플랫폼의 사용자 경험을 함께 설계해요.",
  },
  "Bjak": {
    companyUrl: "https://bjak.my/en",
    designBlogUrl: null,
    domainPrimary: "핀테크 · AI",
    domainSecondary: "동남아시아 최대 보험 비교 플랫폼 BJAK를 운영하며, 최근에는 AI 네이티브 개인 비서 프로덕트 'A1'을 새로 만들고 있어요.",
    domainKeywords: ["인슈어테크", "AI 어시스턴트", "동남아 핀테크"],
    problemLede: "복잡한 금융·보험 상품을 비교하고 가입하는 과정을 쉽게 만들고, 나아가 AI가 사용자의 일상 업무를 대신 처리해주는 신뢰할 수 있는 경험을 만드는 게 핵심 문제예요.",
    problemRest: "특히 A1 프로덕트에서는 사용자가 AI의 행동을 이해하고 통제할 수 있는 새로운 상호작용 방식을 처음부터 정의하고 있어요.",
  },
  "F&CO(에프앤코)": {
    companyUrl: "https://banila.com",
    designBlogUrl: null,
    domainPrimary: "뷰티 · 화장품",
    domainSecondary: "바닐라코 등 뷰티 브랜드를 운영하는 화장품 기업이에요. 상세페이지, 광고 소재 등 브랜드 콘텐츠를 만들어요.",
    domainKeywords: ["뷰티 브랜드", "이커머스 콘텐츠", "생성형 AI 활용"],
    problemLede: "브랜드 톤앤매너를 지키면서도 다양한 채널의 콘텐츠를 빠르게, 많은 양으로 만들어내는 게 핵심 문제예요.",
    problemRest: "생성형 AI 등 새로운 제작 방식을 접목해 반복적인 콘텐츠 제작 효율을 높이는 시도를 함께 하고 있어요.",
  },
  "LG유플러스": {
    companyUrl: "https://www.lguplus.com/",
    designBlogUrl: "https://techblog.uplus.co.kr/",
    domainPrimary: "통신 · IT서비스",
    domainSecondary: "국내 3대 이동통신사 중 하나로, 모바일·인터넷·IPTV 등 통신 서비스와 다양한 모바일 프로덕트를 운영해요.",
    domainKeywords: ["이동통신", "모바일 프로덕트", "디자인시스템"],
    problemLede: "수많은 고객이 매일 쓰는 모바일 서비스를 자체 디자인시스템(UDS) 기준으로 일관되게 개선하는 게 핵심 문제예요.",
    problemRest: "NPS 등 정량 지표와 UX 리서치를 함께 활용해 고객경험을 지속적으로 고도화해요.",
  },
  "Loonshot Games": {
    companyUrl: "https://job-boards.greenhouse.io/loonshotgames",
    designBlogUrl: null,
    domainPrimary: "게임 · 서브컬처",
    domainSecondary: "크래프톤의 완전 자회사로, 모바일 수집형 RPG(서브컬처 장르) 신작을 개발하는 게임 스튜디오예요.",
    domainKeywords: ["서브컬처 게임", "모바일 RPG", "크래프톤 계열사"],
    problemLede: "다양한 모바일 해상도와 글로벌 서비스 환경에서도 매력적인 서브컬처 게임의 GUI 경험을 일관되게 전달하는 게 핵심 문제예요.",
    problemRest: "Unity 3D와 Noesis GUI를 기반으로 게임 플레이에 맞는 UI 구조와 연출을 설계해요.",
  },
  "OliveTree Games": {
    companyUrl: "https://job-boards.greenhouse.io/olivetreegames",
    designBlogUrl: null,
    domainPrimary: "게임 · 캐주얼",
    domainSecondary: "크래프톤 자회사로, 전 세계 유저가 함께 즐기는 소셜·캐주얼·퍼즐 게임을 만드는 글로벌 게임 스튜디오예요.",
    domainKeywords: ["캐주얼 퍼즐 게임", "소셜 게임", "크래프톤 계열사"],
    problemLede: "북미 스타일의 캐주얼 게임 감성을 유지하면서도 글로벌 유저가 직관적으로 즐길 수 있는 UI를 만드는 게 핵심 문제예요.",
    problemRest: "메타 씬과 인게임 전반의 UI 컨셉·레이아웃을 함께 설계해요.",
  },
  "pxd": {
    companyUrl: "https://www.pxd.co.kr/ko",
    designBlogUrl: "https://story.pxd.co.kr",
    domainPrimary: "디자인 컨설팅 · 에이전시",
    domainSecondary: "UX 리서치부터 UI/GUI 디자인, 프론트엔드 개발까지 아우르는 UX 디자인 컨설팅 회사예요. 다양한 산업의 클라이언트 프로젝트를 함께 진행해요.",
    domainKeywords: ["UX 컨설팅", "에이전시", "프로덕트 디자인"],
    problemLede: "클라이언트마다 다른 서비스와 사용자 문제를 짧은 프로젝트 기간 안에 리서치부터 디자인까지 풀어내는 게 핵심 문제예요.",
    problemRest: "웹, 모바일, IoT 등 다양한 디바이스와 산업을 넘나들며 UX/UI 문제를 해결해요.",
  },
  "골프존": {
    companyUrl: "https://www.golfzon.com/",
    designBlogUrl: null,
    domainPrimary: "스포츠테크 · 골프",
    domainSecondary: "스크린골프 시뮬레이터를 중심으로 한 골프 플랫폼 기업이에요. 앱과 운영 서비스를 위한 다양한 디지털 프로덕트를 만들어요.",
    domainKeywords: ["스크린골프", "스포츠테크", "모바일 서비스"],
    problemLede: "스크린골프 이용자가 예약부터 이벤트 참여까지 앱에서 편하게 이용할 수 있도록 만드는 게 핵심 문제예요.",
    problemRest: "디자인 시스템 기반의 일관된 UI로 서비스 운영과 프로모션을 함께 지원해요.",
  },
  "그린리본": {
    companyUrl: "https://home.green-ribbon.co.kr/",
    designBlogUrl: null,
    domainPrimary: "핀테크 · 헬스케어",
    domainSecondary: "핀테크·SaaS·보험·헬스케어 데이터를 다루는 플랫폼을 만드는 서울 기반 초기 스타트업이에요.",
    domainKeywords: ["데이터 플랫폼", "인슈어테크", "초기 스타트업"],
    problemLede: "흩어진 보험·금융·헬스케어 데이터를 사용자가 쉽게 확인하고 활용할 수 있도록 만드는 게 핵심 문제예요.",
    problemRest: "리텐션과 전환율을 데이터 기반으로 개선하며 제품을 빠르게 검증해가요.",
  },
  "네오위즈": {
    companyUrl: "https://www.neowiz.com/kr/aboutus",
    designBlogUrl: null,
    domainPrimary: "게임 · 엔터테인먼트",
    domainSecondary: "피망 등 다양한 게임 서비스를 운영하는 국내 대표 게임 기업이에요. Onetake 스튜디오는 서브컬처 장르의 PC/콘솔 신작을 만들어요.",
    domainKeywords: ["게임 퍼블리싱", "서브컬처 게임", "PC·콘솔"],
    problemLede: "서브컬처 팬들이 몰입할 수 있는 개성 있는 게임 비주얼과 UI 연출을 만드는 게 핵심 문제예요.",
    problemRest: "드로잉 역량과 AI 활용 등 새로운 제작 방식을 함께 접목해 다양한 컨셉을 빠르게 제안해요.",
  },
  "슈퍼센트": {
    companyUrl: "https://supercent.io/",
    designBlogUrl: null,
    domainPrimary: "게임 · 퍼블리싱",
    domainSecondary: "캐주얼 모바일 게임을 만들고 퍼블리싱하는 회사예요. XP Hero, Pizza Ready, Burger Please! 등 자체 게임과 글로벌 퍼블리싱 사업을 함께 하고 있어요.",
    domainKeywords: ["캐주얼 게임", "모바일 퍼블리싱", "글로벌 서비스"],
    problemLede: "많은 유저가 짧은 시간에도 몰입할 수 있는 캐주얼 게임 경험을 빠르게 만들고 검증하는 게 핵심 문제예요.",
    problemRest: "라이브 서비스 운영과 글로벌 다운로드 확장을 동시에 다뤄야 해서, UI가 다양한 장르와 문화권에서 일관되게 작동해야 해요.",
  },
  "스노우": {
    companyUrl: "https://www.snowcorp.com/",
    designBlogUrl: null,
    domainPrimary: "IT/서비스 · 카메라·콘텐츠",
    domainSecondary: "네이버 계열의 카메라·콘텐츠 앱 기업이에요. SNOW, EPIK, LINE Camera, 소다, 푸디 등 다양한 카메라·이미지 편집 서비스를 운영해요.",
    domainKeywords: ["카메라 앱", "AI 콘텐츠", "글로벌 서비스"],
    problemLede: "사진과 영상을 누구나 쉽고 재미있게 꾸밀 수 있게 만드는 게 핵심 문제예요.",
    problemRest: "생성형 AI를 활용한 콘텐츠 제작 워크플로우를 서비스 곳곳에 빠르게 녹여내는 것도 중요한 과제예요.",
  },
  "스마일게이트": {
    companyUrl: "https://www.smilegate.com/ko/",
    designBlogUrl: null,
    domainPrimary: "게임 · 엔터테인먼트",
    domainSecondary: "로스트아크, 크로스파이어 등을 서비스하는 게임 그룹이에요. MMORPG를 비롯한 다양한 장르의 게임을 개발·서비스해요.",
    domainKeywords: ["MMORPG", "게임 퍼블리싱", "글로벌 서비스"],
    problemLede: "복잡한 게임 시스템을 유저가 직관적으로 이해하고 몰입할 수 있는 UI로 풀어내는 게 핵심 문제예요.",
    problemRest: "오랜 기간 서비스되는 대형 MMORPG 특성상, UI 일관성을 지키면서도 콘텐츠 업데이트에 유연하게 대응해야 해요.",
  },
  "스타쉽엔터테인먼트": {
    companyUrl: "https://www.starship-ent.com/",
    designBlogUrl: null,
    domainPrimary: "엔터테인먼트 · 콘텐츠",
    domainSecondary: "몬스타엑스, IVE, 우주소녀 등 아티스트를 매니지먼트하는 연예기획사예요. 아티스트 관련 마케팅·프로모션 콘텐츠도 함께 제작해요.",
    domainKeywords: ["연예기획사", "아티스트 마케팅", "콘텐츠 제작"],
    problemLede: "아티스트의 매력을 다양한 채널에서 일관되고 매력적인 비주얼로 전달하는 게 핵심 문제예요.",
    problemRest: "온·오프라인 프로모션이 끊임없이 이어지는 만큼, 빠른 속도로 완성도 높은 콘텐츠를 만들어내는 역량이 중요해요.",
  },
  "스펙터": {
    companyUrl: "https://www.specter.co.kr/",
    designBlogUrl: null,
    domainPrimary: "HR테크 · 채용",
    domainSecondary: "온라인 평판조회(레퍼런스 체크) 서비스를 제공하는 인재 검증 플랫폼이에요. 기업의 채용 검증 과정을 디지털로 빠르고 간편하게 만들어요.",
    domainKeywords: ["레퍼런스 체크", "채용 검증", "B2B SaaS"],
    problemLede: "몇 주씩 걸리던 평판조회 절차를 며칠로 줄이면서도 신뢰할 수 있게 만드는 게 핵심 문제예요.",
    problemRest: "복잡한 채용 검증 워크플로우를 인사담당자가 직접, 쉽게 다룰 수 있는 경험으로 구조화하는 게 중요해요.",
  },
  "시나미로빌리지": {
    companyUrl: null,
    designBlogUrl: null,
    domainPrimary: "광고테크 · 마케팅",
    domainSecondary: "광고주 센터를 포함한 웹/앱 서비스를 운영하는 회사예요. 프로덕트 디자인과 마케팅 콘텐츠 제작을 함께 담당해요.",
    domainKeywords: ["광고 플랫폼", "광고주 센터", "그로스 마케팅"],
    problemLede: "광고주가 복잡한 광고 운영 기능을 헷갈리지 않고 다룰 수 있는 인터페이스를 만드는 게 핵심 문제예요.",
    problemRest: "초기 서비스 단계라 프로덕트 개선과 마케팅 콘텐츠 제작을 동시에 빠르게 진행해야 해요.",
  },
  "씨티티디": {
    companyUrl: "https://www.cttd.co.kr",
    designBlogUrl: null,
    domainPrimary: "이커머스 · 디지털 에이전시",
    domainSecondary: "이커머스 플랫폼의 UX/UI를 설계하고 운영하는 디지털 에이전시예요. 브랜드와 커머스를 아우르는 웹/앱 프로젝트와 광고·프로모션 콘텐츠도 함께 만들어요.",
    domainKeywords: ["이커머스 UX/UI", "디지털 에이전시", "브랜드 커머스"],
    problemLede: "여러 클라이언트의 이커머스 서비스를 짧은 주기 안에 완성도 있게 만들어내는 게 핵심 문제예요.",
    problemRest: "브랜드마다 다른 방향성과 개발 환경에 맞춰 유연하게 UX/UI를 설계하고 커뮤니케이션하는 역량이 중요해요.",
  },
  "아이스크림아트": {
    companyUrl: "https://i-screamarts.com/",
    designBlogUrl: null,
    domainPrimary: "에듀테크 · 콘텐츠",
    domainSecondary: "AI 기반 디지털 아트 교육 플랫폼 '아트봉봉'을 만드는 회사예요. 아트봉봉스쿨을 통해 선생님과 학생을 위한 디지털 미술 교육 서비스를 운영해요.",
    domainKeywords: ["에듀테크", "디지털 아트 교육", "아트봉봉"],
    problemLede: "어린이와 선생님이 쉽게 쓸 수 있는 디지털 미술 교육 도구를 만드는 게 핵심 문제예요.",
    problemRest: "서비스 UI/UX뿐 아니라 상세페이지·프로모션 같은 마케팅 디자인까지 함께 다뤄야 하는 환경이에요.",
  },
  "아이헤이트플라잉버그스": {
    companyUrl: "https://mildang.kr/",
    designBlogUrl: null,
    domainPrimary: "에듀테크 · AI",
    domainSecondary: "AI 기반 어댑티브 러닝 서비스 '밀당영어'와 온택트 학습 관리 서비스 '밀당PT'를 만드는 에듀테크 기업이에요.",
    domainKeywords: ["어댑티브 러닝", "에듀테크", "온택트 교육"],
    problemLede: "학생 개개인에게 맞는 학습 경험을 데이터와 AI로 설계하는 게 핵심 문제예요.",
    problemRest: "질 높은 교육 기회의 평등이라는 미션 아래, 반복 개선을 통해 실제 학습 성과로 이어지는 제품을 만드는 게 중요해요.",
  },
  "알세미": {
    companyUrl: "https://www.alsemy.com/",
    designBlogUrl: null,
    domainPrimary: "B2B SaaS · 반도체 AI",
    domainSecondary: "반도체 공정 엔지니어를 위한 AI 기반 소프트웨어를 만드는 스타트업이에요. 공정 정의, 3D 시각화, 데이터 분석, 모델링을 하나의 제품 안에서 지원해요.",
    domainKeywords: ["반도체 EDA", "AI 소프트웨어", "B2B 툴"],
    problemLede: "반도체 엔지니어가 다루는 복잡한 작업을 하나의 제품 안에서 직관적으로 처리할 수 있게 만드는 게 핵심 문제예요.",
    problemRest: "디자이너 없이 성장해온 제품이라, 첫 전담 디자이너가 UX 방향성과 일관성을 새로 정의해야 하는 단계예요.",
  },
  "어댑트": {
    companyUrl: "https://www.adaptkorea.com/",
    designBlogUrl: null,
    domainPrimary: "커머스 · K-뷰티",
    domainSecondary: "푸드올로지, 오브제 등 K-뷰티·이너뷰티 브랜드를 운영하는 D2C 미디어커머스 기업이에요. 국내 성과를 바탕으로 아마존, Shopee 등 글로벌 채널로 확장하고 있어요.",
    domainKeywords: ["D2C 커머스", "K-뷰티", "글로벌 확장"],
    problemLede: "국내에서 검증된 브랜드력을 해외 채널에서도 통하는 비주얼과 상세페이지로 옮기는 게 핵심 문제예요.",
    problemRest: "권역별로 다른 시장 트렌드와 플랫폼 특성에 맞춰 일관된 브랜드 가이드라인을 확장해야 해요.",
  },
  "큐라움": {
    companyUrl: "https://www.curaum.com",
    designBlogUrl: null,
    domainPrimary: "헬스케어 · 의료기기",
    domainSecondary: "구강 내 장치를 세척·보관·살균하는 클리움 클리너 등 개인 맞춤형 의료기기와 디지털치료제를 만드는 헬스케어 기업이에요.",
    domainKeywords: ["헬스케어", "의료기기", "디지털치료제"],
    problemLede: "구강 내 장치 관리처럼 번거롭고 놓치기 쉬운 위생 관리를 기기와 서비스로 편리하게 만드는 게 핵심 문제예요.",
    problemRest: "센싱·처리 기술을 활용해 의료기기 사용 경험을 일반 사용자도 쉽게 다룰 수 있는 서비스로 풀어내요.",
  },
  "크래프톤": {
    companyUrl: "https://www.krafton.com",
    designBlogUrl: null,
    domainPrimary: "게임 · 엔터테인먼트",
    domainSecondary: "배틀그라운드 등 글로벌 IP를 보유한 게임 개발사예요. 최근 AI 기반 신사업(AI Frontier)에도 투자하며 서비스 영역을 넓히고 있어요.",
    domainKeywords: ["게임", "글로벌 IP", "AI 서비스"],
    problemLede: "대규모 이용자를 대상으로 한 게임·AI 서비스에서 일관되고 완성도 높은 사용자 경험을 만드는 게 핵심 문제예요.",
    problemRest: "웹/모바일 서비스의 UX 설계부터 디자인 시스템 구축까지, 신규 AI 서비스의 사용성을 데이터 기반으로 최적화해요.",
  },
  "토스": {
    companyUrl: "https://toss.im",
    designBlogUrl: "https://toss.tech/category/design",
    domainPrimary: "핀테크 · 금융 슈퍼앱",
    domainSecondary: "송금, 결제, 대출, 보험, 투자 등 다양한 금융 서비스를 하나의 앱에 모은 종합 금융 플랫폼이에요. 토스뱅크, 토스증권 등 여러 계열사를 아우르는 토스 커뮤니티의 중심이에요.",
    domainKeywords: ["핀테크", "슈퍼앱", "금융 플랫폼"],
    problemLede: "복잡하고 진입장벽 높은 금융 서비스를 쉽고 간편한 경험으로 바꾸는 게 핵심 문제예요.",
    problemRest: "여러 금융 상품을 하나의 앱과 디자인 원칙 아래 일관되게 묶어, 사용자가 어렵게 느끼던 절차를 단순화해요.",
  },
  "토스뱅크": {
    companyUrl: "https://www.tossbank.com",
    designBlogUrl: "https://toss.tech/category/design",
    domainPrimary: "핀테크 · 인터넷은행",
    domainSecondary: "토스의 인터넷전문은행이에요. 예·적금, 대출, 외환 등 기존 은행 상품을 더 쉽고 유리한 조건으로 제공해요.",
    domainKeywords: ["인터넷은행", "핀테크", "예대출·외환"],
    problemLede: "복잡하고 불편했던 은행 업무를 누구나 쉽게 이용할 수 있는 경험으로 바꾸는 게 핵심 문제예요.",
    problemRest: "'지금 이자 받기', '평생 무료 환전'처럼 기존 은행에 없던 가치를 제품으로 만들어 제공해요.",
  },
  "토스인컴": {
    companyUrl: "https://tossincome.com",
    designBlogUrl: "https://toss.tech/category/design",
    domainPrimary: "핀테크 · 세무",
    domainSecondary: "토스 커뮤니티의 계열사로, 소득·세무 영역의 불편함을 해소하는 서비스를 만들어요. '숨은 환급액 찾기' 등이 대표 서비스예요.",
    domainKeywords: ["세무테크", "환급", "핀테크"],
    problemLede: "개인이 스스로 해결하기 어려운 세무 영역의 복잡함을 제품으로 쉽게 풀어주는 게 핵심 문제예요.",
    problemRest: "매일 쓰는 서비스는 아니지만 누구나 마주치는 세무 영역에서, 놓치기 쉬운 환급 같은 가치를 찾아줘요.",
  },
  "토스증권": {
    companyUrl: "https://www.tossinvest.com",
    designBlogUrl: "https://toss.tech/category/design",
    domainPrimary: "핀테크 · 증권",
    domainSecondary: "누적 가입자 740만 명 규모의 모바일 증권 서비스예요. 국내·해외 주식, 채권, 옵션 등 다양한 투자 상품을 쉽고 직관적인 경험으로 제공해요.",
    domainKeywords: ["증권", "투자", "핀테크"],
    problemLede: "어렵고 진입장벽 높던 투자 경험을 누구나 쉽게 시작할 수 있게 만드는 게 핵심 문제예요.",
    problemRest: "해외주식 거래대금 1위로 빠르게 성장하며, 복잡한 투자 정보를 이해하기 쉬운 UX로 풀어내요.",
  },
  "토스페이먼츠": {
    companyUrl: "https://www.tosspayments.com",
    designBlogUrl: "https://toss.tech/category/design",
    domainPrimary: "핀테크 · 페이먼츠",
    domainSecondary: "카드, 계좌이체, 간편결제 등 온라인 사업에 필요한 전자결제 솔루션을 제공하는 페이테크 기업이에요. 결제부터 사업 운영까지 필요한 솔루션을 지원해요.",
    domainKeywords: ["페이먼츠", "PG", "핀테크"],
    problemLede: "사업자가 겪는 결제·운영의 비효율을 기술로 해소하는 게 핵심 문제예요.",
    problemRest: "기술부터 운영까지 사업에 필요한 모든 결제 솔루션을 한 곳에서 제공해 사업자의 부담을 줄여요.",
  },
  "토스플레이스": {
    companyUrl: "https://tossplace.com",
    designBlogUrl: "https://toss.tech/category/design",
    domainPrimary: "핀테크 · 오프라인 결제",
    domainSecondary: "오프라인 매장을 위한 결제 단말기와 포스(POS) 솔루션을 만드는 토스 계열사예요. 출시 2년 만에 가맹점 10만 개를 돌파했어요.",
    domainKeywords: ["오프라인 결제", "POS", "핀테크"],
    problemLede: "200만 자영업자가 겪는 매장 운영의 번거로움을 제품으로 줄이는 게 핵심 문제예요.",
    problemRest: "결제 단말기, 포스기에 대한 익숙한 고정관념을 깨고, 사장님·고객·대리점 모두에게 새로운 경험을 만들어요.",
  },
  "네이버클라우드": {
    companyUrl: "https://career.navercloudcorp.com/navercloud/",
    designBlogUrl: null,
    domainPrimary: "클라우드 · B2B SaaS",
    domainSecondary: "네이버의 클라우드 사업 계열사로, 기업용 협업 툴 NAVER WORKS를 비롯한 클라우드·AI 기반 B2B 솔루션을 제공해요.",
    domainKeywords: ["클라우드", "그룹웨어", "B2B SaaS"],
    problemLede: "기업의 결재·근태 등 반복적인 경영지원 업무를 더 쉽고 정확하게 처리하도록 돕는 게 핵심 문제예요.",
    problemRest: "AI를 접목한 기능으로 관리자와 실무자 모두의 업무 효율을 높이는 방향을 고민해요.",
  },
  "넷마블네오": {
    companyUrl: "https://mcompany.netmarble.com/studio/list/neo",
    designBlogUrl: null,
    domainPrimary: "게임",
    domainSecondary: "넷마블의 자회사로, 리니지2 레볼루션 등 실사풍 대형 모바일 게임을 개발하는 스튜디오예요.",
    domainKeywords: ["모바일 게임", "실사풍 그래픽", "넷마블 계열사"],
    problemLede: "대규모 실사풍 게임에서 몰입감 있는 비주얼과 직관적인 UI를 동시에 구현하는 게 핵심 문제예요.",
    problemRest: "화려한 그래픽 안에서도 플레이어가 정보를 빠르게 읽고 조작할 수 있는 인터페이스를 만들어요.",
  },
  "누비랩": {
    companyUrl: "https://www.nuvilab.com/ko",
    designBlogUrl: null,
    domainPrimary: "헬스케어 · 푸드테크",
    domainSecondary: "헬스케어·교육·푸드서비스의 식사 데이터를 AI로 분석하는 푸드테크 스타트업이에요. 누적 투자 160억원, 한국·미국 1,100여 고객사를 보유하고 있어요.",
    domainKeywords: ["푸드테크", "AI 비주얼", "B2B SaaS"],
    problemLede: "식사 데이터를 AI로 정확히 분석하고, 그 결과를 신뢰감 있는 비주얼로 전달하는 게 핵심 문제예요.",
    problemRest: "생성형 AI로 만든 콘텐츠가 실제 브랜드·서비스에 바로 쓸 수 있는 품질인지 검증하는 과정이 중요해요.",
  },
  "닥터나우": {
    companyUrl: "https://doctornow.co.kr",
    designBlogUrl: null,
    domainPrimary: "헬스케어 · 디지털헬스",
    domainSecondary: "비대면진료와 약 처방, 실시간 의료상담을 제공하는 국내 대표 비대면진료 플랫폼이에요.",
    domainKeywords: ["비대면진료", "헬스케어 플랫폼", "모바일 앱"],
    problemLede: "환자·의료진 등 여러 이해관계자를 연결하는 비대면진료 경험을 데이터 기반으로 설계하는 게 핵심 문제예요.",
    problemRest: "리서치와 가설 검증을 반복하며 사용자 피드백을 제품에 빠르게 반영해요.",
  },
  "당근": {
    companyUrl: "https://about.daangn.com/",
    designBlogUrl: "https://medium.com/daangn",
    domainPrimary: "커머스 · 하이퍼로컬",
    domainSecondary: "동네 이웃과 지역 업체를 연결하는 하이퍼로컬 플랫폼이에요. 중고거래를 넘어 동네 소식, 지역 비즈니스, 커뮤니티까지 아우르는 서비스를 만들어가고 있어요.",
    domainKeywords: ["하이퍼로컬", "중고거래", "디자인 시스템"],
    problemLede: "수천만 명이 매일 쓰는 서비스에서 일관되고 신뢰할 수 있는 경험을 만드는 게 핵심 문제예요.",
    problemRest: "디자인 시스템과 팀 간 협업 기준을 통해 하나의 결정이 제품 전체 완성도로 이어지도록 해요.",
  },
  "대상웰라이프": {
    companyUrl: "https://www.daesangwellife.com/kr/index",
    designBlogUrl: null,
    domainPrimary: "헬스케어 · 뉴트리션",
    domainSecondary: "과학 기반 영양 솔루션을 중심으로 개인 맞춤형 건강기능식품과 헬스케어 앱을 만드는 기업이에요. 뉴케어, 스포식스 등의 브랜드를 운영해요.",
    domainKeywords: ["헬스케어 앱", "뉴트리션", "커머스"],
    problemLede: "영양 제품과 디지털 서비스를 연결해 사용자가 자신에게 맞는 건강 관리를 쉽게 하도록 돕는 게 핵심 문제예요.",
    problemRest: "신규 헬스케어 앱과 커머스 앱의 UX를 사용자 친화적으로 설계하는 게 중요해요.",
  },
  "더플라토": {
    companyUrl: "https://tiro.ooo/ko/",
    designBlogUrl: null,
    domainPrimary: "AI · 생산성 툴",
    domainSecondary: "AI 미팅 어시스턴트 '티로(Tiro)'를 만드는 스타트업이에요. 출시 1년 만에 ARR 100만 달러를 돌파했고, 사용의 35%가 일본·미국 등 해외에서 발생해요.",
    domainKeywords: ["AI 미팅 어시스턴트", "글로벌 서비스", "Human-AI 인터랙션"],
    problemLede: "비정형적인 비즈니스 대화를 AI가 이해할 수 있는 구조화된 데이터로 바꾸는 게 핵심 문제예요.",
    problemRest: "한·미·일 등 여러 나라 고객이 함께 쓰는 만큼 언어와 맥락 차이를 고려한 인터페이스가 필요해요.",
  },
  "듀오톤": {
    companyUrl: "https://duotone.io/",
    designBlogUrl: null,
    domainPrimary: "디자인 에이전시",
    domainSecondary: "비즈니스와 사용자 문제를 구조화해 실행 가능한 디지털 경험으로 설계하는 디자인 에이전시예요.",
    domainKeywords: ["UX 컨설팅", "디자인 에이전시", "B2B 프로젝트"],
    problemLede: "클라이언트의 비즈니스 목표와 사용자 요구를 함께 만족시키는 UX 전략을 설계하는 게 핵심 문제예요.",
    problemRest: "화면을 그리는 데 그치지 않고 문제의 배경을 이해하고 설계 근거를 만들어 구현까지 함께해요.",
  },
  "디지털웍스": {
    companyUrl: "https://www.digitalworks.co.kr/",
    designBlogUrl: null,
    domainPrimary: "디자인 에이전시",
    domainSecondary: "PC·모바일 앱의 UI/UX 디자인을 수행하는 디자인 에이전시예요.",
    domainKeywords: ["UI/UX 디자인", "에이전시", "PL 프로젝트"],
    problemLede: "다양한 클라이언트의 서비스를 트렌드와 사용성을 반영한 화면으로 구현하는 게 핵심 문제예요.",
    problemRest: "여러 프로젝트를 동시에 리딩하며 완성도 높은 디자인 결과물을 만들어요.",
  },
  "딥오토": {
    companyUrl: "http://deepauto.ai",
    designBlogUrl: null,
    domainPrimary: "AI · B2B SaaS",
    domainSecondary: "KAIST AI대학원 교수와 연구원이 창립한 스타트업으로, 생성형 AI 기술을 기업용 제품으로 전환해요.",
    domainKeywords: ["Agentic AI", "B2B SaaS", "브랜드 커뮤니케이션"],
    problemLede: "복잡한 AI 기술을 투자자와 고객이 이해할 수 있는 시각언어로 전달하는 게 핵심 문제예요.",
    problemRest: "IR 자료부터 브랜드 콘텐츠까지 회사의 핵심 커뮤니케이션을 일관된 톤앤매너로 만들어요.",
  },
  "라이터스컴퍼니": {
    companyUrl: "https://www.kooky.io/",
    designBlogUrl: null,
    domainPrimary: "콘텐츠 · 엔터테인먼트",
    domainSecondary: "글로벌 K-Pop 팬덤 플랫폼 'Kooky'를 운영하는 스타트업이에요. 아티스트와 팬을 온·오프라인으로 연결하는 경험을 만들어요.",
    domainKeywords: ["K-Pop 팬덤", "글로벌 서비스", "커뮤니티"],
    problemLede: "언어와 국가가 다른 팬들이 아티스트와 더 가깝게 연결되는 경험을 만드는 게 핵심 문제예요.",
    problemRest: "제품 기획부터 화면 설계, 필요시 구현까지 한 사람이 폭넓게 책임지는 구조예요.",
  },
  "라이트브레인": {
    companyUrl: "https://rightbrain.co.kr/",
    designBlogUrl: null,
    domainPrimary: "UX 컨설팅 · 에이전시",
    domainSecondary: "리서치, 컨설팅, UI 디자인을 아우르는 UX 전문 컨설팅 기업이에요. 금융, 미디어, 커머스 등 다양한 산업의 프로젝트를 수행해요.",
    domainKeywords: ["UX 컨설팅", "리서치", "디자인 그룹"],
    problemLede: "고객사의 도메인마다 다른 사용자 문제를 리서치로 정확히 짚어내는 게 핵심 문제예요.",
    problemRest: "정량·정성 리서치와 사용성 테스트로 인사이트를 도출하고 이를 실제 디자인 전략으로 연결해요.",
  },
  "라인페이플러스": {
    companyUrl: "https://linepaypluscorp.com/",
    designBlogUrl: null,
    domainPrimary: "핀테크 · 결제",
    domainSecondary: "대만의 결제 플랫폼 LINE Pay의 기획·개발을 담당하는 라인 계열사예요. 대만, 태국, 일본에서 모바일 송금·결제 서비스를 지원해요.",
    domainKeywords: ["모바일 결제", "리워드 광고", "글로벌 서비스"],
    problemLede: "결제를 넘어 리워드 광고·커머스 등 새로운 서비스에서도 신뢰할 수 있는 경험을 만드는 게 핵심 문제예요.",
    problemRest: "AI를 활용해 프로토타입 제작과 디자인 생산성을 높이는 방법을 함께 고민해요.",
  },
  "라포랩스": {
    companyUrl: "https://www.rapportlabs.kr/",
    designBlogUrl: null,
    domainPrimary: "커머스 · 패션",
    domainSecondary: "4050세대를 위한 라이프스타일 플랫폼 '퀸잇' 등을 운영하는 커머스 스타트업이에요.",
    domainKeywords: ["이커머스", "패션 플랫폼", "PB 브랜드"],
    problemLede: "타깃 세대가 신뢰할 수 있는 상품 정보를 빠르게 전달하는 상세페이지를 만드는 게 핵심 문제예요.",
    problemRest: "여러 PB 브랜드의 상품을 브랜드 가이드에 맞게 일관되게 보여주는 게 중요해요.",
  },
  "레트리카": {
    companyUrl: "https://retrica.co/",
    designBlogUrl: null,
    domainPrimary: "IT/서비스 · 카메라 앱",
    domainSecondary: "5억+ 다운로드를 기록한 글로벌 카메라 앱 '레트리카'와 신규 AI 사진·영상 앱 'acha AI'를 만드는 회사예요.",
    domainKeywords: ["카메라 앱", "AI 이미지", "글로벌 서비스"],
    problemLede: "전 세계 사용자가 매일 쓰는 카메라 앱에서 재미있고 완성도 높은 촬영·편집 경험을 만드는 게 핵심 문제예요.",
    problemRest: "새로운 AI 카메라 앱까지 함께 확장하며 디자인 시스템을 유지해요.",
  },
  "룰루랩": {
    companyUrl: "https://www.lulu-lab.com/",
    designBlogUrl: null,
    domainPrimary: "헬스케어 · 뷰티테크",
    domainSecondary: "AI 기반 피부 분석 솔루션 '루미니'로 뷰티·메디컬 산업의 디지털 혁신을 이끄는 기업이에요. 삼성전자 사내벤처 C랩에서 스핀오프했어요.",
    domainKeywords: ["AI 피부분석", "뷰티테크", "B2B 세일즈"],
    problemLede: "복잡한 AI 피부 분석 기술을 병원·에스테틱·해외 파트너가 쉽게 이해하도록 시각화하는 게 핵심 문제예요.",
    problemRest: "제품 소개서부터 키오스크 UI까지 다양한 접점에서 일관된 브랜드 경험을 만들어요.",
  },
  "뤼튼": {
    companyUrl: "https://wrtn.ai",
    designBlogUrl: null,
    domainPrimary: "AI · 콘텐츠",
    domainSecondary: "AI 캐릭터와의 인터랙티브 스토리 경험을 만드는 서비스예요. 한국(크랙)과 일본(Kyarapu) 두 시장에서 서비스 중이며 유료화 1개월 만에 월매출 20억원을 넘었어요.",
    domainKeywords: ["AI 캐릭터", "인터랙티브 스토리", "글로벌 서비스"],
    problemLede: "AI 캐릭터와의 대화를 게임·웹소설처럼 몰입감 있는 콘텐츠 경험으로 설계하는 게 핵심 문제예요.",
    problemRest: "서비스 구조와 사용자 여정을 정의하고, 배포 후 성과를 분석해 지속적으로 개선해요.",
  },
  "마상소프트": {
    companyUrl: "https://www.masangsoft.com/",
    designBlogUrl: null,
    domainPrimary: "게임",
    domainSecondary: "부산에 기반한 게임 개발사로, 라이브 서비스 중인 게임의 UI/UX와 웹·플랫폼 서비스를 함께 만들어요.",
    domainKeywords: ["라이브 게임", "게임 UI", "부산 게임사"],
    problemLede: "서비스 중인 게임에서 플레이어가 직관적으로 조작할 수 있는 UI 리소스를 지속적으로 관리하는 게 핵심 문제예요.",
    problemRest: "게임 UI뿐 아니라 프로모션·이벤트, 웹 플랫폼 디자인까지 폭넓게 다뤄요.",
  },
  "무신사": {
    companyUrl: "https://www.musinsa.com/",
    designBlogUrl: "https://techblog.musinsa.com/",
    domainPrimary: "커머스 · 패션",
    domainSecondary: "약 6,000개 패션 브랜드를 다루는 국내 대표 온라인 패션 플랫폼이에요.",
    domainKeywords: ["이커머스", "패션 플랫폼", "리커머스"],
    problemLede: "수많은 사용자가 무신사의 다양한 서비스를 탐색하고 다시 찾아오게 만드는 게 핵심 문제예요.",
    problemRest: "멤버십, 커뮤니티, 리커머스 등 여러 서비스를 연결해 참여와 재방문 경험을 설계해요.",
  },
  "문토": {
    companyUrl: "https://www.munto.kr/",
    designBlogUrl: null,
    domainPrimary: "커뮤니티 · 라이프스타일",
    domainSecondary: "취향을 통해 나를 발견하고 사람들과 연결되도록 돕는 관심사 기반 소셜 밋업 플랫폼이에요. 누적 회원가입 130만 명을 기록했어요.",
    domainKeywords: ["소셜 밋업", "커뮤니티 플랫폼", "브랜드 경험"],
    problemLede: "취향이 비슷한 사람들이 부담 없이 만날 수 있는 신뢰할 수 있는 커뮤니티 경험을 만드는 게 핵심 문제예요.",
    problemRest: "브랜드의 첫인상부터 사용자 경험의 끝까지 일관되게 설계하는 게 중요해요.",
  },
  "미소": {
    companyUrl: "https://miso.kr",
    designBlogUrl: null,
    domainPrimary: "O2O · 홈서비스",
    domainSecondary: "청소·이사·인테리어 등 다양한 홈서비스를 하나의 앱에서 예약할 수 있는 국내 1위 O2O 홈서비스 플랫폼이에요. 2016년 홈클리닝을 시작으로 180개 이상의 서비스로 사업을 확장했어요.",
    domainKeywords: ["O2O", "홈서비스", "온디맨드 매칭"],
    problemLede: "청소, 이사, 인테리어 같은 오프라인 서비스를 찾고 예약하는 과정의 번거로움과 신뢰 문제를 해결하는 게 핵심이에요.",
    problemRest: "제품을 살 때 아마존이나 쿠팡을 쓰듯, 오프라인 서비스도 앱으로 쉽고 빠르게 매칭받을 수 있게 만들어요.",
  },
  "블루엘리펀트": {
    companyUrl: "https://blueelephant.co",
    designBlogUrl: null,
    domainPrimary: "패션 · 아이웨어",
    domainSecondary: "안경·선글라스를 만드는 컨템포러리 아이웨어 브랜드예요. 비주얼크리에이티브 조직에서 브랜드 웹과 마케팅 콘텐츠를 직접 제작해요.",
    domainKeywords: ["아이웨어", "브랜드 커머스", "비주얼 크리에이티브"],
    problemLede: "브랜드의 감도를 온라인 화면과 마케팅 콘텐츠로 일관되게 전달하는 게 핵심 문제예요.",
    problemRest: "상품상세페이지부터 배너, SNS 콘텐츠까지 크리에이티브 결과물의 품질과 속도를 함께 잡아야 해요.",
  },
  "비나우": {
    companyUrl: "https://www.benow.co.kr",
    designBlogUrl: null,
    domainPrimary: "뷰티 · D2C 커머스",
    domainSecondary: "넘버즈인, 퓌, 노크(Knock) 등 여러 스킨케어·뷰티 브랜드를 직접 만들고 글로벌로 확장하는 뷰티 기업이에요. Knock팀은 브랜드의 시각 언어와 고객 접점 경험을 담당해요.",
    domainKeywords: ["D2C 뷰티", "브랜드 커머스", "글로벌 확장"],
    problemLede: "여러 개의 자체 브랜드가 각자의 감도를 지키면서도 일관된 브랜드 경험을 전달하는 게 핵심 문제예요.",
    problemRest: "브랜드·마케팅·MD와 긴밀히 협업해 국내외 고객 접점에서 매력적인 첫인상을 만들어야 해요.",
  },
  "삼신홀딩스": {
    companyUrl: "https://ollocdam.com",
    designBlogUrl: null,
    domainPrimary: "커머스 · 브랜드",
    domainSecondary: "올록담(프리미엄 올리브 식품), 파노티, 아스토리스 등 여러 브랜드를 직접 탄생시키는 브랜드·미디어 커머스 기업이에요. 자사몰을 카페24 기반으로 직접 기획·운영해요.",
    domainKeywords: ["브랜드 커머스", "자사몰", "미디어 커머스"],
    problemLede: "여러 브랜드의 자사몰을 직접 기획·운영하며 전환율까지 책임지는 게 핵심 과제예요.",
    problemRest: "디자인부터 퍼블리싱, UX 개선까지 한 사람이 독립적으로 수행할 수 있어야 해요.",
  },
  "세모컴퍼니": {
    companyUrl: "https://whipped.co.kr",
    designBlogUrl: null,
    domainPrimary: "뷰티 · D2C 커머스",
    domainSecondary: "비건 스킨케어 브랜드 '휩드'를 만드는 뷰티 커머스 스타트업이에요. 마케팅 캠페인과 상세페이지 등 브랜드 콘텐츠를 직접 제작해요.",
    domainKeywords: ["비건 뷰티", "D2C 커머스", "콘텐츠 디자인"],
    problemLede: "빠르게 변하는 뷰티 트렌드 안에서 브랜드 메시지를 효과적으로 전달하는 콘텐츠를 만드는 게 핵심이에요.",
    problemRest: "상세페이지와 SNS 배너 등으로 구매 전환까지 이어지는 콘텐츠를 팀과 함께 만들어요.",
  },
  "에이블리": {
    companyUrl: "https://a-bly.com",
    designBlogUrl: null,
    domainPrimary: "커머스 · 패션",
    domainSecondary: "2030 여성을 중심으로 한 스타일 커머스 플랫폼이에요. PB 브랜드부터 프로덕트 전반까지 데이터 기반으로 빠르게 만들고 개선해요.",
    domainKeywords: ["스타일 커머스", "PB 브랜드", "데이터 기반 디자인"],
    problemLede: "수많은 상품과 콘텐츠 속에서 구매 전환까지 이어지는 경험을 데이터로 검증하며 만드는 게 핵심 문제예요.",
    problemRest: "스쿼드·챕터 조직에서 빠른 의사결정과 반복 개선으로 서비스를 고도화해요.",
  },
  "에이온비": {
    companyUrl: null,
    designBlogUrl: null,
    domainPrimary: "헬스케어 · 뷰티테크",
    domainSecondary: "피부과·성형외과 전용 EMR/CRM SaaS와 뷰티 관리 앱을 만드는 3인 규모의 Pre-A 단계 스타트업이에요.",
    domainKeywords: ["헬스케어 SaaS", "뷰티테크", "초기 스타트업"],
    problemLede: "병원의 복잡한 운영 업무를 SaaS로 단순화하고, 환자에게는 편리한 뷰티 관리 경험을 제공하는 게 핵심 문제예요.",
    problemRest: "적은 인원으로 프로덕트부터 마케팅·운영 디자인까지 폭넓게 다뤄야 해요.",
  },
  "엑스퍼트아이엔씨": {
    companyUrl: "https://xpertinc.co.kr",
    designBlogUrl: null,
    domainPrimary: "AI · 웨어러블",
    domainSecondary: "AI 음성인식과 AR을 결합한 스마트안경·자막안경을 만드는 스타트업이에요. 소리 때문에 놓치는 순간을 자막으로 줄이는 게 목표예요.",
    domainKeywords: ["AI 스마트안경", "접근성", "웨어러블"],
    problemLede: "소리를 놓치는 사람들에게 실시간 자막으로 정보를 보이게 만드는 게 핵심 문제예요.",
    problemRest: "안경이라는 새로운 폼팩터 위에서 사용자 흐름과 인터페이스를 처음부터 설계해야 해요.",
  },
  "엑스플리트": {
    companyUrl: "https://www.xpleat.kr",
    designBlogUrl: null,
    domainPrimary: "UX 컨설팅 · 에이전시",
    domainSecondary: "유플리트에서 분사한 UX 컨설턴시로, 금융·유통 등 다양한 기업과 공공기관의 UX 리서치와 서비스 디자인 프로젝트를 수행해요.",
    domainKeywords: ["UX 컨설팅", "서비스 디자인", "리서치"],
    problemLede: "클라이언트마다 다른 서비스 환경과 사용자 맥락을 빠르게 파악해 적합한 UX 전략을 제시하는 게 핵심이에요.",
    problemRest: "리서치부터 컨셉 디자인, 구현 가이드라인까지 프로젝트 단위로 폭넓게 다뤄요.",
  },
  "오늘의집": {
    companyUrl: "https://www.bucketplace.com",
    designBlogUrl: "https://www.bucketplace.com/culture/Design/",
    domainPrimary: "커머스 · 라이프스타일",
    domainSecondary: "인테리어 콘텐츠와 커머스를 연결하는 라이프스타일 슈퍼앱이에요. 콘텐츠·커머스·브랜드 영역을 아우르며 다양한 사용자 접점을 만들어요.",
    domainKeywords: ["라이프스타일 커머스", "인테리어", "콘텐츠·커머스 연결"],
    problemLede: "영감을 주는 콘텐츠와 실제 구매로 이어지는 커머스를 자연스럽게 연결하는 게 핵심 문제예요.",
    problemRest: "브랜드 경험, 프로모션, 리서치 등 다양한 접점에서 일관된 완성도를 유지해야 해요.",
  },
  "오스템임플란트": {
    companyUrl: "https://www.osstem.com",
    designBlogUrl: null,
    domainPrimary: "헬스케어 · 의료기기",
    domainSecondary: "임플란트를 중심으로 한 치과용 의료기기와 소프트웨어를 만드는 국내 대표 치과 전문 기업이에요.",
    domainKeywords: ["치과 의료기기", "헬스케어 SW", "의료 서비스 디자인"],
    problemLede: "치과 병원 현장에서 실제로 쓰기 편한 SW를 만드는 게 핵심 문제예요.",
    problemRest: "병원 방문 인터뷰와 VOC 분석을 바탕으로 UX를 개선하고 디자인 시스템을 운영해요.",
  },
  "올웨이즈": {
    companyUrl: "https://alwayz.co",
    designBlogUrl: null,
    domainPrimary: "커머스 · 공동구매",
    domainSecondary: "팀구매(공동구매)로 초특가 쇼핑을 제공하는 이커머스 플랫폼이에요. 낮은 수수료 구조로 가격 경쟁력을 만들어요.",
    domainKeywords: ["공동구매", "이커머스", "가격 경쟁력"],
    problemLede: "완벽한 비주얼보다 핵심 가치인 가격과 신뢰에 집중해 빠르게 성장하는 제품을 만드는 게 핵심 문제예요.",
    problemRest: "가설 검증과 데이터 분석을 반복하며 디자인 시스템과 업무 프로세스를 처음부터 구축해가요.",
  },
  "와디즈": {
    companyUrl: "https://www.wadiz.kr",
    designBlogUrl: "https://blog.wadiz.kr",
    domainPrimary: "핀테크 · 크라우드펀딩",
    domainSecondary: "누구나 아이디어에 도전할 수 있도록 돕는 국내 1위 크라우드펀딩 플랫폼이에요. 200개국 사용자와 연결되는 아시아 대표 혁신 플랫폼으로 성장했어요.",
    domainKeywords: ["크라우드펀딩", "글로벌 서비스", "다국가·다언어"],
    problemLede: "언어와 문화가 다른 글로벌 사용자도 새로운 프로덕트를 발견하고 펀딩에 참여하기까지의 여정을 매끄럽게 만드는 게 핵심 문제예요.",
    problemRest: "데이터와 리서치를 기반으로 문제를 정의하고, 다국가 환경에서도 일관된 디자인 시스템을 확장해요.",
  },
  "우아한형제들": {
    companyUrl: "https://www.woowahan.com",
    designBlogUrl: "https://techblog.woowahan.com",
    domainPrimary: "커머스 · 배달 플랫폼",
    domainSecondary: "배달의민족을 운영하는 국내 대표 배달 플랫폼 기업이에요. 주문부터 배달 완료까지 전체 여정을 라이더와 고객 양쪽 관점에서 설계해요.",
    domainKeywords: ["배달 플랫폼", "라이더 서비스", "대규모 서비스"],
    problemLede: "주문이 시작되는 순간부터 문 앞 도착까지, 고객과 라이더 모두에게 일관되고 안정적인 경험을 제공하는 게 핵심 문제예요.",
    problemRest: "대규모 트래픽과 다양한 이해관계자를 데이터 기반으로 조율하며 서비스를 개선해요.",
  },
  "유안타증권": {
    companyUrl: "https://www.yuantakorea.com",
    designBlogUrl: null,
    domainPrimary: "금융 · 증권",
    domainSecondary: "대만계 유안타금융그룹 산하의 증권사예요. 리서치센터에서 투자 분석 자료를 발간해요.",
    domainKeywords: ["증권", "리서치 발간물", "금융 그래픽"],
    problemLede: "복잡한 투자 리서치 정보를 명확하고 신뢰감 있는 자료로 편집·시각화하는 게 핵심 문제예요.",
    problemRest: "정기적으로 발간되는 리서치 자료의 서식과 그래픽 완성도를 일관되게 관리해야 해요.",
  },
  "이니션": {
    companyUrl: "https://inition.kr",
    designBlogUrl: null,
    domainPrimary: "UX 컨설팅 · 에이전시",
    domainSecondary: "삼성, LG 등 대기업부터 스타트업까지 다양한 기업의 UX 혁신을 돕는 UX 디자인 컨설팅 회사예요. 세계 3대 디자인 어워드 수상 이력이 있어요.",
    domainKeywords: ["UX 컨설팅", "서비스 디자인", "리서치·전략"],
    problemLede: "클라이언트마다 다른 산업과 비즈니스 맥락 안에서 사용자 조사부터 전략, 시각화까지 프로젝트를 리드하는 게 핵심 문제예요.",
    problemRest: "사용자 리서치, UX 전략, UI 설계, 출시 관리까지 프로젝트 전체를 책임지는 역량이 필요해요.",
  },
  "이마트": {
    companyUrl: "https://company.emart.com",
    designBlogUrl: null,
    domainPrimary: "유통 · 리테일",
    domainSecondary: "국내 대표 대형마트 이마트가 운영하는 앱 서비스를 만드는 조직이에요. 오프라인 매장과 온라인 쇼핑 경험을 함께 설계해요.",
    domainKeywords: ["대형 유통", "리테일 앱", "옴니채널"],
    problemLede: "오프라인 매장의 익숙함과 온라인 쇼핑의 편리함을 하나의 앱 경험으로 잇는 게 핵심 문제예요.",
    problemRest: "비즈니스 요구사항과 고객 피드백을 함께 반영해 이마트앱의 UX/UI를 지속적으로 개선해요.",
  },
  "인플루디오": {
    companyUrl: "https://phocamarket.com",
    designBlogUrl: null,
    domainPrimary: "커머스 · 팬덤",
    domainSecondary: "K팝 포토카드 거래를 위한 글로벌 플랫폼 '포카마켓'을 운영해요. 온라인 거래를 넘어 오프라인 포카스팟과 B2B 사업으로 확장하고 있어요.",
    domainKeywords: ["팬덤 커머스", "C2C 거래", "글로벌 서비스"],
    problemLede: "언어와 문화가 다른 전 세계 팬들이 신뢰하고 자연스럽게 거래할 수 있는 경험을 만드는 게 핵심 문제예요.",
    problemRest: "1:1 매칭 거래부터 인벤토리 입고 거래까지, 거래 방식을 계속 실험하며 컬렉팅 문화를 재정의해요.",
  },
  "지로": {
    companyUrl: "https://aistudio.dropshot.io",
    designBlogUrl: null,
    domainPrimary: "AI · 영상 콘텐츠",
    domainSecondary: "생성형 AI 서비스 '드롭샷 AI'와 영상 제작 매칭 플랫폼 '드롭샷매치'를 만드는 스타트업이에요. 누구나 간편하게 영상을 제작할 수 있도록 돕고 있어요.",
    domainKeywords: ["생성형 AI", "영상 제작", "초기 스타트업"],
    problemLede: "영상 제작의 높은 진입 장벽을 소프트웨어로 낮추는 게 핵심 문제예요.",
    problemRest: "누구나 좋은 퀄리티의 영상으로 자신의 이야기를 전달할 수 있게 만드는 프로덕트를 함께 만들어가요.",
  },
  "채널톡": {
    companyUrl: "https://channel.io",
    designBlogUrl: null,
    domainPrimary: "B2B SaaS · 고객 커뮤니케이션",
    domainSecondary: "상담, 마케팅, 팀 메신저를 하나로 묶은 올인원 비즈니스 메신저를 만들어요. AI 기반 고객 커뮤니케이션 솔루션으로 서비스를 확장하고 있어요.",
    domainKeywords: ["B2B SaaS", "AI 고객상담", "비즈니스 메신저"],
    problemLede: "기업과 고객 사이의 커뮤니케이션을 하나의 툴 안에서 매끄럽게 잇는 게 핵심 문제예요.",
    problemRest: "B2B와 B2C 두 사용자 그룹의 다른 니즈를 동시에 만족시키는 AI 기반 UX를 설계해요.",
  },
  "카카오": {
    companyUrl: "https://www.kakaocorp.com",
    designBlogUrl: null,
    domainPrimary: "IT · 플랫폼",
    domainSecondary: "카카오톡을 중심으로 다양한 서비스를 운영하는 국내 대표 IT 플랫폼 기업이에요. 여러 서비스에 공통으로 적용되는 디자인 시스템과 인터랙션을 만들어요.",
    domainKeywords: ["플랫폼 디자인 시스템", "인터랙션 디자인", "대규모 서비스"],
    problemLede: "카카오톡을 비롯한 여러 서비스에서 일관되고 매끄러운 사용자 경험을 유지하는 게 핵심 문제예요.",
    problemRest: "공통 UX와 인터랙션 가이드라인을 정의하고 고도화해 서비스 전반의 완성도를 높여요.",
  },
  "카카오스타일": {
    companyUrl: "https://kakaostyle.com",
    designBlogUrl: null,
    domainPrimary: "커머스 · 패션",
    domainSecondary: "지그재그, 포스티, 피요나(PIYONNA) 등 스타일 커머스 서비스를 운영하는 기업이에요. 국내를 넘어 글로벌 K-뷰티·패션 시장으로 사업을 확장하고 있어요.",
    domainKeywords: ["스타일 커머스", "패션 플랫폼", "글로벌 확장"],
    problemLede: "각기 다른 타겟에 맞는 쇼핑 경험을 서비스별로 최적화하는 게 핵심 문제예요.",
    problemRest: "디자인 시스템을 기반으로 각 서비스의 UX/UI 완성도와 핸드오프 품질을 함께 관리해요.",
  },
  "카카오엔터테인먼트": {
    companyUrl: "https://kakaoent.com",
    designBlogUrl: null,
    domainPrimary: "콘텐츠 · 엔터테인먼트",
    domainSecondary: "뮤직, 웹툰·웹소설, 드라마 등 다양한 IP와 팬덤을 기반으로 커머스 사업을 전개하는 엔터테인먼트 기업이에요.",
    domainKeywords: ["IP 커머스", "팬덤 비즈니스", "MD 상품"],
    problemLede: "아티스트와 작품이 가진 IP의 매력을 실제 구매 가능한 상품과 비주얼로 옮기는 게 핵심 문제예요.",
    problemRest: "외부 파트너와 협업하며 IP 특성에 맞는 상품 기획부터 그래픽 제작까지 함께 담당해요.",
  },
  "카카오페이": {
    companyUrl: "https://www.kakaopay.com",
    designBlogUrl: "https://story.kakaopay.com",
    domainPrimary: "핀테크 · 결제",
    domainSecondary: "송금, 결제, 혜택, 광고 등 다양한 금융 서비스를 제공하는 국내 대표 핀테크 기업이에요. 사용자 편의와 비즈니스 가치를 함께 고려한 서비스를 만들어요.",
    domainKeywords: ["핀테크", "결제·혜택 서비스", "데이터 기반 UX"],
    problemLede: "복잡한 금융 정책과 기술적 제약 속에서도 쉽고 편리한 결제·혜택 경험을 만드는 게 핵심 문제예요.",
    problemRest: "지표 분석과 실험을 반복하며 광고·혜택 서비스의 UX를 지속적으로 고도화해요.",
  },
  "캐치테이블": {
    companyUrl: "https://app.catchtable.co.kr",
    designBlogUrl: null,
    domainPrimary: "커머스 · 외식 플랫폼",
    domainSecondary: "예약, 웨이팅, 포스, 픽업, 결제까지 아우르는 요식업 슈퍼플랫폼이에요. 소비자용 앱부터 사장님용 솔루션까지 전 제품을 함께 만들어요.",
    domainKeywords: ["외식 슈퍼플랫폼", "예약·웨이팅", "B2B2C"],
    problemLede: "소비자의 예약 경험과 사장님의 매장 운영 효율을 하나의 플랫폼 안에서 함께 풀어야 하는 게 핵심 문제예요.",
    problemRest: "여러 스쿼드가 데이터 기반으로 가설을 검증하며 디자인 시스템을 일관되게 확장해요.",
  },
  "컬리": {
    companyUrl: "https://www.kurly.com",
    designBlogUrl: "https://helloworld.kurly.com",
    domainPrimary: "커머스 · 유통",
    domainSecondary: "신선식품과 생활용품을 새벽배송으로 전달하는 이커머스 플랫폼이에요. 최근에는 컬리페이, 물류 등으로 서비스 영역을 확장하고 있어요.",
    domainKeywords: ["새벽배송", "이커머스", "신선식품"],
    problemLede: "신선식품을 빠르고 안전하게 배송하는 물류·주문 경험을 만드는 게 핵심 문제예요.",
    problemRest: "홈, 검색, 상품 상세, 주문 등 주요 접점에서 일관된 경험을 설계해 고객이 믿고 살 수 있는 커머스를 만들어요.",
  },
  "코드잇": {
    companyUrl: "https://www.codeit.kr",
    designBlogUrl: null,
    domainPrimary: "에듀테크",
    domainSecondary: "온라인으로 프로그래밍, 데이터 사이언스 등 IT 실무 교육 콘텐츠를 자체 제작해 제공하는 코딩 교육 플랫폼이에요.",
    domainKeywords: ["코딩 교육", "온라인 강의", "에듀테크"],
    problemLede: "누구나 실무에 필요한 IT 역량을 효율적으로 배울 수 있게 만드는 게 핵심 문제예요.",
    problemRest: "웹 서비스 전반의 학습 경험을 설계해 수강생이 끝까지 완주하고 실력을 키우도록 돕는 제품을 만들어요.",
  },
  "코딧": {
    companyUrl: "https://thecodit.com",
    designBlogUrl: null,
    domainPrimary: "B2B SaaS · 정책 인텔리전스",
    domainSecondary: "입법·정책·규제 변화를 실시간으로 모니터링해 기업에 맞춤형으로 요약·알림을 제공하는 정책 인텔리전스 플랫폼이에요.",
    domainKeywords: ["정책 모니터링", "레귤레이션 테크", "B2B SaaS"],
    problemLede: "복잡한 입법·규제 데이터를 기업이 쉽게 활용할 수 있게 만드는 게 핵심 문제예요.",
    problemRest: "실시간 정책·규제 변화를 추적하고 정리해 기업의 대응 속도를 높이는 B2B SaaS 서비스를 만들어요.",
  },
  "쿠팡": {
    companyUrl: "https://www.coupang.com",
    designBlogUrl: "https://brunch.co.kr/@coupangdesign",
    domainPrimary: "커머스 · 이커머스",
    domainSecondary: "빠른 배송과 넓은 상품 구색으로 국내 이커머스를 이끄는 플랫폼이에요. 쿠팡페이, 쿠팡이츠 등으로 커머스를 넘어 핀테크·물류까지 사업을 확장하고 있어요.",
    domainKeywords: ["이커머스", "로켓배송", "핀테크"],
    problemLede: "수억 건의 주문을 빠르고 정확하게 처리하는 고객 경험을 만드는 게 핵심 문제예요.",
    problemRest: "검색, 상품 상세, 결제 등 구매 여정 전반을 데이터 기반으로 최적화해 고객이 더 편하게 쇼핑하도록 만들어요.",
  },
  "티빙": {
    companyUrl: "https://www.tving.com",
    designBlogUrl: "https://medium.com/tving-team",
    domainPrimary: "콘텐츠 · OTT",
    domainSecondary: "드라마, 영화, 예능부터 라이브 스포츠까지 다양한 콘텐츠를 제공하는 국내 OTT 플랫폼이에요.",
    domainKeywords: ["OTT", "스트리밍", "콘텐츠"],
    problemLede: "다양한 콘텐츠를 이용자가 원하는 순간에 쉽게 찾고 즐기게 만드는 게 핵심 문제예요.",
    problemRest: "콘텐츠 노출 영역의 아트웍과 비주얼을 통해 이용자의 콘텐츠 발견과 시청 경험을 개선해요.",
  },
  "티피씨인터넷": {
    companyUrl: "https://www.tpcinternet.com",
    designBlogUrl: null,
    domainPrimary: "IT·서비스 · 크리에이터 이코노미",
    domainSecondary: "크리에이터와 팬을 메신저, 영상통화, 후원 등으로 연결하는 올인원 크리에이터 비즈니스 플랫폼 LIKEY를 운영해요.",
    domainKeywords: ["크리에이터 이코노미", "메신저", "후원 서비스"],
    problemLede: "크리에이터가 팬과 소통하며 안정적으로 수익을 낼 수 있는 구조를 만드는 게 핵심 문제예요.",
    problemRest: "메신저, 영상통화, 후원 등 여러 기능을 하나의 서비스에서 자연스럽게 잇는 경험을 설계해요.",
  },
  "팀스파르타": {
    companyUrl: "https://spartaclub.kr",
    designBlogUrl: null,
    domainPrimary: "에듀테크",
    domainSecondary: "스파르타코딩클럽, 항해99 등으로 코딩·IT 교육을 대중화해온 교육 플랫폼이에요. 최근에는 AI 시대 커리어 성장 플랫폼으로 확장하고 있어요.",
    domainKeywords: ["코딩 교육", "부트캠프", "커리어 성장"],
    problemLede: "누구나 알기 쉽게 배우고 실제 취업·성장으로 이어지게 만드는 게 핵심 문제예요.",
    problemRest: "정량·정성 데이터를 기반으로 가설을 검증하며 학습자의 성장 경험을 지속적으로 개선해요.",
  },
  "파마리서치": {
    companyUrl: "https://pharmaresearch.co.kr",
    designBlogUrl: null,
    domainPrimary: "헬스케어 · 화장품",
    domainSecondary: "PDRN·PN 성분 기반의 의약품, 의료기기, 화장품을 개발하는 바이오 기업이에요. 리쥬란 등 뷰티·메디컬 브랜드를 운영해요.",
    domainKeywords: ["바이오", "코스메틱", "메디컬 뷰티"],
    problemLede: "제품의 신뢰도와 매력을 온라인 콘텐츠로 정확히 전달하는 게 핵심 문제예요.",
    problemRest: "상세페이지와 프로모션 에셋을 통해 여러 채널에서 일관된 브랜드 경험을 만들어요.",
  },
  "페이타랩": {
    companyUrl: "https://www.passorder.co.kr",
    designBlogUrl: null,
    domainPrimary: "IT·서비스 · O2O",
    domainSecondary: "카페 점주와 고객을 연결하는 스마트오더 서비스 패스오더를 운영해요. 사전 주문, 결제, 적립을 자동화해 매장 운영 효율을 높여요.",
    domainKeywords: ["스마트오더", "O2O", "커머스 결제"],
    problemLede: "매장 운영 효율과 고객의 대기 시간 문제를 함께 해결하는 게 핵심 문제예요.",
    problemRest: "사전 주문부터 결제, 적립까지 자연스럽게 이어지는 경험을 설계해 점주와 고객 모두를 만족시켜요.",
  },
  "풀무원": {
    companyUrl: "https://www.pulmuone.co.kr",
    designBlogUrl: null,
    domainPrimary: "식품 · 유통",
    domainSecondary: "건강한 먹거리와 지속가능한 식생활을 지향하는 식품 기업이에요. B2E사업부는 임직원 복지 플랫폼을 운영해요.",
    domainKeywords: ["식품", "복지 플랫폼", "B2E"],
    problemLede: "임직원이 만족할 수 있는 복지 콘텐츠와 경험을 만드는 게 핵심 문제예요.",
    problemRest: "온라인 이벤트와 프로모션 콘텐츠를 통해 플랫폼의 브랜드 경쟁력과 사용자 경험을 함께 끌어올려요.",
  },
  "플렉스": {
    companyUrl: "https://flex.team",
    designBlogUrl: null,
    domainPrimary: "IT·서비스 · B2B SaaS",
    domainSecondary: "근태, 연차, 전자계약, HR 데이터 관리를 하나로 묶은 올인원 HR 플랫폼이에요. 조직과 구성원의 성장을 돕는 것을 목표로 해요.",
    domainKeywords: ["HR 플랫폼", "B2B SaaS", "피플 오퍼레이션"],
    problemLede: "복잡한 조직·인사 업무를 단순하고 명확한 제품 경험으로 바꾸는 게 핵심 문제예요.",
    problemRest: "복잡한 도메인의 규칙과 관계를 제품 모델로 번역해 누구나 쉽게 쓸 수 있는 HR 플랫폼을 만들어요.",
  },
  "피플인사이드": {
    companyUrl: "http://peoplei.kr",
    designBlogUrl: null,
    domainPrimary: "UX 컨설팅 · 에이전시",
    domainSecondary: "다양한 산업의 제품·서비스를 대상으로 사용자 경험을 리서치하고 설계하는 UX 디자인 전문가 그룹이에요.",
    domainKeywords: ["UX 컨설팅", "사용자 리서치", "화면 설계"],
    problemLede: "다양한 산업의 클라이언트가 가진 사용자 경험 문제를 리서치 기반으로 푸는 게 핵심 문제예요.",
    problemRest: "모바일, PC, 차량 등 여러 플랫폼에서 리서치부터 화면 설계까지 전 과정을 수행해요.",
  },
  "하이브랩": {
    companyUrl: "https://hivelab.co.kr",
    designBlogUrl: null,
    domainPrimary: "디지털 에이전시 · AI테크",
    domainSecondary: "UX/UI 디자인, 웹·모바일 서비스, 브랜딩까지 아우르는 디지털 커뮤니케이션 에이전시예요. 최근에는 AX·AI 기반 고객경험 솔루션으로 사업을 확장하고 있어요.",
    domainKeywords: ["디지털 에이전시", "UX/UI", "브랜딩"],
    problemLede: "클라이언트마다 다른 서비스의 UX 구조와 정보를 명확하게 설계하는 게 핵심 문제예요.",
    problemRest: "IA, User Flow, Wireframe 등 UX 산출물을 통해 클라이언트 서비스의 완성도를 높여요.",
  },
  "현대백화점": {
    companyUrl: "https://www.ehyundai.com",
    designBlogUrl: null,
    domainPrimary: "유통 · 리테일",
    domainSecondary: "더현대 서울 등 오프라인 백화점과 더현대닷컴 등 온라인몰을 함께 운영하는 유통 기업이에요.",
    domainKeywords: ["백화점", "리테일", "이커머스"],
    problemLede: "오프라인과 온라인을 아우르는 일관된 쇼핑 경험을 만드는 게 핵심 문제예요.",
    problemRest: "더현대 HI 앱의 UI와 비주얼 에셋을 통해 플랫폼 전반의 브랜드 경험을 일관되게 관리해요.",
  },
  "현대자동차": {
    companyUrl: "https://www.hyundai.com",
    designBlogUrl: null,
    domainPrimary: "모빌리티 · 자동차",
    domainSecondary: "완성차 제조를 넘어 수요응답형 모빌리티 서비스 셔클(SHUCLE) 등 새로운 이동 경험을 만드는 모빌리티 사업도 함께 운영해요.",
    domainKeywords: ["모빌리티", "DRT", "자동차"],
    problemLede: "이용자가 필요한 순간에 편하게 이동할 수 있는 서비스를 만드는 게 핵심 문제예요.",
    problemRest: "수요응답형 교통 서비스의 UX와 운영 도구를 설계해 승객과 운영자 모두의 경험을 개선해요.",
  },
  "화이트큐브": {
    companyUrl: "https://challengers.kr",
    designBlogUrl: null,
    domainPrimary: "커머스 · 마케팅테크",
    domainSecondary: "브랜드가 직접 리뷰와 체험단을 운영하며 성장할 수 있도록 돕는 챌린지 커머스 플랫폼 챌린저스를 운영해요.",
    domainKeywords: ["체험단 플랫폼", "리뷰 마케팅", "브랜드 커머스"],
    problemLede: "브랜드가 광고비에 의존하지 않고 스스로 성장할 수 있는 구조를 만드는 게 핵심 문제예요.",
    problemRest: "정량 데이터와 정성 리서치로 문제를 우선순위화하고, 콘텐츠 실험을 통해 브랜드 성장을 돕는 제품을 만들어요.",
  },
  "지바이크": {
    companyUrl: "https://gbike.io",
    designBlogUrl: null,
    domainPrimary: "모빌리티 · 공유경제",
    domainSecondary: "전동킥보드·전기자전거 공유 서비스 'GCOO'를 5개국 140개 도시에서 운영하는 아시아 1위 퍼스널 모빌리티 기업이에요. 배터리 구독·교체 등 하드웨어와 연결된 신사업도 함께 만들어가고 있어요.",
    domainKeywords: ["퍼스널 모빌리티", "O2O", "하드웨어 연동"],
    problemLede: "화면 속 디자인이 실제 자전거·배터리·현장으로 이어지는 O2O 서비스 경험을 설계하는 게 핵심 문제예요.",
    problemRest: "앱 화면부터 하드웨어 접점, 현장 콘텐츠까지 사용자가 마주치는 경험 전체를 처음부터 끝까지 책임져요.",
  },
  "피트크루": {
    companyUrl: null,
    designBlogUrl: null,
    domainPrimary: "헬스케어 · 디지털 헬스",
    domainSecondary: "만성질환자의 복약관리를 돕는 앱 'Pillo'를 만드는 회사예요. 북미 시장에서 가장 사랑받는 복약 관리 앱으로 자리잡았어요.",
    domainKeywords: ["복약관리", "북미 시장", "모바일 앱"],
    problemLede: "복약이라는 반복적이고 지루한 행동을 더 편리하고 즐겁게 만드는 게 핵심 문제예요.",
    problemRest: "듀오링고처럼 유쾌한 톤으로, 설계부터 사용자에게 닿는 순간까지 경험 전체를 주도적으로 만들어가요.",
  },
  "샵라이브": {
    companyUrl: "https://www.shoplive.cloud",
    designBlogUrl: null,
    domainPrimary: "B2B SaaS · 라이브커머스",
    domainSecondary: "라이브 스트리밍·숏폼·Video AI 기반 비디오 커머스 플랫폼을 제공하는 글로벌 B2B SaaS 기업이에요. 무신사·삼성·LG 등 국내외 대기업과 협업하며 해외 시장으로도 빠르게 확장하고 있어요.",
    domainKeywords: ["비디오 커머스", "B2B SaaS", "글로벌 확장"],
    problemLede: "여러 글로벌 고객사에 일관되게 적용되는 비디오 커머스 경험을 설계하는 게 핵심 문제예요.",
    problemRest: "전환율·재구매율 같은 핵심 지표에 임팩트를 주는 디자인 의사결정을 프로덕트 전반에서 주도해요.",
  },
  "커넥트웨이브": {
    companyUrl: "https://connectwave.co.kr",
    designBlogUrl: null,
    domainPrimary: "커머스 · 가격비교",
    domainSecondary: "다나와·에누리 등 가격비교 서비스와 메이크샵 등 쇼핑몰 솔루션을 운영하는 데이터 커머스 기업이에요. 여러 커머스 플랫폼을 인수합병하며 종합 쇼핑·광고 플랫폼으로 성장해왔어요.",
    domainKeywords: ["가격비교", "데이터 커머스", "대규모 트래픽"],
    problemLede: "대규모 트래픽 속에서 상품 탐색부터 구매 결정까지 이어지는 쇼핑 여정을 매끄럽게 만드는 게 핵심 문제예요.",
    problemRest: "모바일웹·앱을 아우르는 크로스플랫폼 화면과 디자인 시스템을 새롭게 정비해가고 있어요.",
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

function LinkChip({
  href,
  label,
  onNavigate,
}: {
  href: string | null;
  label: string;
  onNavigate?: () => void;
}) {
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
      onClick={onNavigate}
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
  onToggle,
}: {
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  label: string;
  infoText: string;
  value: string;
  tags: readonly string[];
  children: React.ReactNode;
  onToggle?: (open: boolean) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-xl bg-neutral-50 p-[28px]">
      <button
        type="button"
        onClick={() =>
          setOpen((v) => {
            onToggle?.(!v);
            return !v;
          })
        }
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
          {children}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-600"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function CompanyAnalysisCard({
  companyName,
  stage,
  data: directData,
  hideLinks = false,
}: {
  companyName: string;
  stage: string;
  // 마이페이지 "링크로 추가" 공고처럼 회사명이 COMPANY_ANALYSIS에 없는 경우, 저장 시점에
  // AI가 만든 데이터를 여기로 직접 넘겨서 같은 카드 UI를 재사용한다(링크 저장 상세페이지 참고).
  data?: CompanyAnalysisData;
  // AI가 생성한 데이터는 companyUrl/designBlogUrl을 알 수 없어(추측 금지 규칙) 항상 비어
  // 있으므로, 그 경우 "확인 안 됨" 칩 두 개만 뜨는 걸 막기 위해 링크 줄 자체를 생략한다.
  hideLinks?: boolean;
}) {
  const data = directData ?? COMPANY_ANALYSIS[companyName];
  if (!data) return null;
  // 링크로 추가한 공고는 stage를 AI가 확신 못 하면 아예 안 준다(null/빈 문자열) — 그런
  // 경우 스테이지 타일 자체를 생략한다(모르는 값을 억지로 4개 중 하나로 보여주지 않는다).
  const validStage = (STAGES as readonly string[]).includes(stage) ? (stage as Stage) : null;

  return (
    <div className="flex flex-col gap-5">
      {!hideLinks && (
        <div className="flex flex-wrap gap-2">
          <LinkChip
            href={data.companyUrl}
            label="홈페이지"
            onNavigate={() => trackEvent("Company Info Link Clicked", { companyName, label: "홈페이지" })}
          />
          <LinkChip
            href={data.designBlogUrl}
            label="디자인 블로그"
            onNavigate={() => trackEvent("Company Info Link Clicked", { companyName, label: "디자인 블로그" })}
          />
        </div>
      )}

      <div className={clsx("grid grid-cols-1 gap-3", validStage && "sm:grid-cols-2")}>
        {validStage && (
          <ExpandableTile
            icon={<BarChartIcon className="h-3.5 w-3.5" />}
            iconBg="bg-blue-50"
            iconColor="text-primary"
            label="스테이지"
            infoText="스타트업부터 대기업까지, 기업이 현재 어떤 단계에 있는지에 따라 요구되는 역량이 달라요."
            value={validStage}
            tags={STAGE_KEYWORDS[validStage]}
            onToggle={(open) =>
              trackEvent("Company Analysis Tile Toggled", { companyName, tile: "스테이지", open })
            }
          >
            <p className="text-sm leading-relaxed tracking-[-0.005em] text-neutral-700">
              {STAGE_FIT[validStage]}
            </p>
          </ExpandableTile>
        )}

        <ExpandableTile
          icon={<BriefcaseIcon className="h-3.5 w-3.5" />}
          iconBg="bg-[oklch(0.962_0.045_162)]"
          iconColor="text-positive"
          label="도메인"
          infoText="해당 기업이 어떤 산업군의 서비스를 운영 중인지 확인하세요."
          value={data.domainPrimary}
          tags={data.domainKeywords}
          onToggle={(open) =>
            trackEvent("Company Analysis Tile Toggled", { companyName, tile: "도메인", open })
          }
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
