// 광역자치단체명은 "도" 접미사를 단순히 잘라내면 틀리는 경우가 있어(예: 충청북도 → 충청북 X, 충북 O)
// 매핑 테이블로 처리한다. 기초자치단체(성남시 등)는 접미사 제거만으로 충분하다.
const REGION_MAP: Record<string, string> = {
  서울특별시: "서울",
  부산광역시: "부산",
  대구광역시: "대구",
  인천광역시: "인천",
  광주광역시: "광주",
  대전광역시: "대전",
  울산광역시: "울산",
  세종특별자치시: "세종",
  경기도: "경기",
  강원특별자치도: "강원",
  강원도: "강원",
  충청북도: "충북",
  충청남도: "충남",
  전북특별자치도: "전북",
  전라북도: "전북",
  전라남도: "전남",
  경상북도: "경북",
  경상남도: "경남",
  제주특별자치도: "제주",
  제주도: "제주",
  // Greenhouse 등 해외 채용 API가 영문으로 내려주는 경우 대응
  seoul: "서울",
  busan: "부산",
  daegu: "대구",
  incheon: "인천",
  gwangju: "광주",
  daejeon: "대전",
  ulsan: "울산",
  sejong: "세종",
};

// 기초자치단체(시/군/구) 접미사. 긴 것부터 검사해야 "세종특별자치시" 같은 표기를 안 망가뜨린다.
const SUFFIXES = ["특별자치시", "특별자치도", "특별시", "광역시", "자치도", "시", "군", "구"];

export function formatLocation(raw: string | null | undefined): string | null {
  if (!raw) return null;

  // "Seoul, South Korea" 처럼 콤마 뒤에 국가명이 붙는 영문 표기는 도시명만 취한다.
  const primary = raw.split(",")[0].trim();
  if (!primary) return null;

  if (REGION_MAP[primary]) return REGION_MAP[primary];
  const lower = primary.toLowerCase();
  if (REGION_MAP[lower]) return REGION_MAP[lower];

  for (const suffix of SUFFIXES) {
    if (primary.endsWith(suffix) && primary.length > suffix.length) {
      return primary.slice(0, -suffix.length);
    }
  }

  return primary;
}
