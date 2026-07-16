"use client";

import { Badge } from "@/components/Badge";
import { CompanyLogo } from "@/components/CompanyLogo";
import { useToast } from "@/components/ToastProvider";
import { trackEvent } from "@/lib/analytics";

export function ClubCard({
  name,
  logoSrc,
  description,
  recruitSeason,
}: {
  name: string;
  logoSrc: string;
  description: string;
  recruitSeason: string;
}) {
  const showToast = useToast();

  return (
    <button
      type="button"
      onClick={() => {
        trackEvent("Club Card Clicked", { clubName: name });
        showToast("아직 준비 중인 기능이에요!");
      }}
      className="flex flex-col gap-3 rounded-2xl border border-neutral-200 bg-white p-5 text-left transition-colors hover:border-neutral-300"
    >
      <div className="flex items-center gap-3">
        <CompanyLogo src={logoSrc} alt={name} initial={name.slice(0, 1)} size={44} />
        <p className="text-base font-semibold text-ink">{name}</p>
      </div>
      <p className="text-sm leading-relaxed text-neutral-500">{description}</p>
      <div>
        <Badge tone="ink">다음 모집 {recruitSeason}</Badge>
      </div>
    </button>
  );
}
