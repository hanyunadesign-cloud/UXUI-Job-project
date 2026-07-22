import type { ExperienceLevel } from "@/lib/constants";

// 각 경력 구간이 대응하는 연차 범위. C레벨은 상한을 두지 않는다.
const BUCKET_RANGES: Record<ExperienceLevel, [number, number]> = {
  신입: [0, 0],
  주니어: [1, 3],
  미들: [3, 7],
  시니어: [7, 15],
  "C레벨": [15, Infinity],
};

// 공고 원문에서 추출한 experienceLevel은 "3~10년", "8년 이상", "신입", "경력무관" 등
// 자유 형식 텍스트이거나, 필터 버킷 이름 자체("미들" 등)가 그대로 들어있는 경우도 있다.
// 최소~최대 연차 범위로 파싱한 뒤 각 구간과 겹치는지로 매칭한다.
function parseExperienceRange(text: string): [number, number] {
  if (!text) return [0, Infinity];

  // 버킷 이름 그대로 저장된 경우(신입/주니어/미들/시니어/C레벨) 그 버킷 범위를 바로 쓴다.
  // 이걸 먼저 체크하지 않으면 "미들"/"주니어"/"시니어" 같은 텍스트에는 숫자도 "경력"도
  // 없어서 맨 아래 기본값([0, Infinity])으로 빠져, 모든 경력 필터에 다 걸리는 버그가 난다.
  if (text in BUCKET_RANGES) return BUCKET_RANGES[text as ExperienceLevel];

  if (text.includes("경력무관")) return [0, Infinity];

  // "2년 이상~4년 이하"처럼 상/하한이 각각 "이상"/"이하"로 명시된 범위.
  const boundedRangeMatch = text.match(/(\d+)\s*년\s*이상\s*[~-]?\s*(\d+)\s*년\s*이하/);
  if (boundedRangeMatch) return [Number(boundedRangeMatch[1]), Number(boundedRangeMatch[2])];

  const rangeMatch = text.match(/(\d+)\s*[~-]\s*(\d+)\s*년/);
  if (rangeMatch) return [Number(rangeMatch[1]), Number(rangeMatch[2])];

  // "신입~2년"처럼 하한이 신입(0년)인 범위.
  const newGradRangeMatch = text.match(/신입\s*[~-]\s*(\d+)\s*년/);
  if (newGradRangeMatch) return [0, Number(newGradRangeMatch[1])];

  const aboveMatch = text.match(/(\d+)\s*년\s*이상/);
  if (aboveMatch) return [Number(aboveMatch[1]), Infinity];

  // "2년 이하"처럼 상한만 명시된 경우 하한은 0(신입 포함)으로 본다.
  const belowMatch = text.match(/(\d+)\s*년\s*이하/);
  if (belowMatch) return [0, Number(belowMatch[1])];

  const exactMatch = text.match(/(\d+)\s*년/);
  if (exactMatch) return [Number(exactMatch[1]), Number(exactMatch[1])];

  // 숫자 없이 "신입"만 있으면 0년차, "신입"과 "경력"이 함께 쓰였으면(예: 신입·경력)
  // 범위를 특정할 수 없으므로 전체 매칭으로 처리한다.
  if (text.includes("신입")) {
    return text.includes("경력") ? [0, Infinity] : [0, 0];
  }

  // 숫자 없는 "경력"만 있으면 신입은 아니라는 것만 확실하므로 1년차부터 전체 매칭.
  if (text.includes("경력")) return [1, Infinity];

  return [0, Infinity];
}

export function matchesExperienceLevel(
  experienceLevel: string,
  bucket: string
): boolean {
  const range = BUCKET_RANGES[bucket as ExperienceLevel];
  if (!range) return false;

  const [jobMin, jobMax] = parseExperienceRange(experienceLevel);
  const [bucketMin, bucketMax] = range;

  return jobMin <= bucketMax && jobMax >= bucketMin;
}
