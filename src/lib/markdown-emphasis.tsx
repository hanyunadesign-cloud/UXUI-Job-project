import type { ReactNode } from "react";

// AI가 "**구절**"처럼 마크다운 굵게 표시로 감싼 부분을, 굵은 검정 대신 파란 글씨로 렌더링한다.
// (문단형 강조가 font-bold보다 가볍게 읽혀서 이쪽으로 정했다.)
export function renderWithBlueEmphasis(text: string): ReactNode[] {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <span key={i} className="font-medium text-primary">
        {part}
      </span>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

// 공고 원문의 "**소제목**" 마커를 굵은 검정 텍스트로 렌더링한다. 마커가 없는 일반
// 공고 텍스트는 split이 원본 그대로 반환하므로 렌더링 결과가 바뀌지 않는다.
export function renderWithBoldTitles(text: string): ReactNode[] {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="font-bold text-ink">
        {part}
      </strong>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}
