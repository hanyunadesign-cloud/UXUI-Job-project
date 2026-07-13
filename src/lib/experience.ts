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
// 자유 형식 텍스트이므로, 최소~최대 연차 범위로 파싱한 뒤 각 구간과 겹치는지로 매칭한다.
function parseExperienceRange(text: string): [number, number] {
  if (!text) return [0, Infinity];
  if (text.includes("경력무관")) return [0, Infinity];

  const rangeMatch = text.match(/(\d+)\s*[~-]\s*(\d+)\s*년/);
  if (rangeMatch) return [Number(rangeMatch[1]), Number(rangeMatch[2])];

  const aboveMatch = text.match(/(\d+)\s*년\s*이상/);
  if (aboveMatch) return [Number(aboveMatch[1]), Infinity];

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
