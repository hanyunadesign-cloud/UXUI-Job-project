"use client";

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
  return (
    <a
      href={applyUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackEvent("Apply Button Clicked", { jobId, companyName })}
    >
      <Button>지원 페이지로 이동</Button>
    </a>
  );
}
