"use client";

import Link from "next/link";
import { Badge } from "@/components/Badge";
import { CompanyLogo } from "@/components/CompanyLogo";
import { CompanyFollowIcon } from "@/components/CompanyFollowIcon";
import { trackEvent } from "@/lib/analytics";

export type CompanyCardData = {
  id: string;
  name: string;
  logo: string | null;
  industries: string[];
  stage: string;
  hasOpenJobs: boolean;
};

export function CompanyCard({
  company,
  following,
  isLoggedIn,
  source,
}: {
  company: CompanyCardData;
  following: boolean;
  isLoggedIn: boolean;
  // 이 카드가 어느 화면에 떠 있었는지("companies_grid"/"recommended_carousel").
  source: "companies_grid" | "recommended_carousel";
}) {
  return (
    <div className="relative flex h-full flex-col rounded-2xl border border-neutral-200 bg-white px-3.5 pt-4 pb-8 transition-colors hover:border-neutral-300">
      {company.hasOpenJobs && (
        <div className="absolute left-4 top-4">
          <Badge>채용중</Badge>
        </div>
      )}
      <div className="absolute right-2 top-2">
        <CompanyFollowIcon
          companyId={company.id}
          initialFollowing={following}
          isLoggedIn={isLoggedIn}
        />
      </div>

      <Link
        href={`/companies/${company.id}`}
        onClick={() =>
          trackEvent("Company Card Clicked", { companyId: company.id, companyName: company.name, source })
        }
        className="flex flex-1 flex-col items-center gap-3 pt-8 text-center"
      >
        <CompanyLogo
          src={company.logo}
          alt={company.name}
          initial={company.name.slice(0, 1)}
          size={56}
        />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-ink hover:underline">
            {company.name}
          </p>
          <p className="mt-1 truncate text-xs text-neutral-400">
            {[company.stage, ...company.industries].join(" · ")}
          </p>
        </div>
      </Link>
    </div>
  );
}
