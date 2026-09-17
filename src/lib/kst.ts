// 서버 런타임의 기본 타임존에 의존하지 않고, 항상 한국 시간(KST, UTC+9) 기준으로
// 날짜를 다루기 위한 유틸. Vercel 프로덕션은 보통 UTC로 돌고 로컬 개발 환경은 흔히
// Asia/Seoul로 도는데, 마감일 같은 저장된 시각을 .getDate()/.getMonth() 같은 로컬
// getter로 읽으면 어느 런타임에서 읽느냐에 따라 날짜가 하루 밀릴 수 있다(특히
// 자정 근처 시각). 한국은 서머타임이 없어 고정 +9시간 오프셋으로 항상 정확하다.
const KST_OFFSET_MS = 9 * 60 * 60 * 1000;

export function kstDateParts(date: Date): { year: number; month: number; day: number } {
  const shifted = new Date(date.getTime() + KST_OFFSET_MS);
  return {
    year: shifted.getUTCFullYear(),
    month: shifted.getUTCMonth() + 1,
    day: shifted.getUTCDate(),
  };
}

// 요일(0=일 ~ 6=토)도 같은 이유로 KST 기준으로 읽어야 한다.
export function kstWeekday(date: Date): number {
  return new Date(date.getTime() + KST_OFFSET_MS).getUTCDay();
}

// year/month/day(한국 달력 날짜 기준)가 나타내는 "그 날 00:00 KST" 시점의 실제 시각(Date)을
// 만든다. new Date(year, month - 1, day)처럼 호출하는 프로세스의 로컬 타임존에 따라
// 다른 시각이 만들어지는 걸 피하고, 항상 같은 인스턴트를 얻기 위함이다.
export function kstMidnight(year: number, month: number, day: number): Date {
  return new Date(Date.UTC(year, month - 1, day) - KST_OFFSET_MS);
}
