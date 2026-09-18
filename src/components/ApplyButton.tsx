"use client";

import { useRef } from "react";
import { Button } from "@/components/Button";
import { trackEvent } from "@/lib/analytics";

export function ApplyButton({
  jobId,
  applyUrl,
  companyName,
}: {
  jobId: string;
  applyUrl: string;
  companyName: string;
}) {
  // 지원 버튼은 새 탭으로 열려서 원래 탭의 Job Detail Time Spent(체류시간)는 클릭
  // "이후"에 찍힌다 — 그래서 두 이벤트를 나중에 시간순으로 엮기가 애매하다. 클릭
  // "그 순간" 페이지에 머문 시간을 이 이벤트 자체에 같이 실어 보내서, "충분히 읽고
  // 클릭했는지" vs "들어오자마자 바로 눌렀는지"를 이 이벤트 하나의 속성만으로
  // 걸러볼 수 있게 한다.
  const mountedAtRef = useRef(Date.now());

  return (
    <a
      href={applyUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() =>
        trackEvent("Apply Button Clicked", {
          jobId,
          companyName,
          secondsOnPage: Math.round((Date.now() - mountedAtRef.current) / 1000),
        })
      }
    >
      <Button>지원 페이지로 이동</Button>
    </a>
  );
}
