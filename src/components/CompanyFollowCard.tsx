import Link from "next/link";
import { Badge } from "@/components/Badge";
import { CompanyLogo } from "@/components/CompanyLogo";
import { FollowButton } from "@/components/FollowButton";

export type CompanyFollowCardData = {
  id: string;
  name: string;
  logo: string | null;
  industry: string;
  stage: string;
};

export function CompanyFollowCard({ company }: { company: CompanyFollowCardData }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-neutral-200 bg-white p-4">
      <Link href={`/companies/${company.id}`} className="flex min-w-0 flex-1 items-center gap-3">
        <CompanyLogo
          src={company.logo}
          alt={company.name}
          initial={company.name.slice(0, 1)}
          size={48}
        />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-ink hover:underline">
            {company.name}
          </p>
          <div className="mt-1 flex flex-wrap gap-1">
            <Badge>{company.industry}</Badge>
            <Badge>{company.stage}</Badge>
          </div>
        </div>
      </Link>
      <FollowButton companyId={company.id} initialFollowing isLoggedIn />
    </div>
  );
}
