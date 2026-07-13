import { prisma } from "./prisma";

// 회사명을 기준으로 기업 프로필(Company)을 찾고 없으면 새로 만든다.
// 자동 수집 파이프라인(ingest-jobs.ts)과 수동으로 공고를 추가하는 스크립트가 공통으로 사용해서,
// 어떤 경로로 공고가 들어오든 기업 프로필 페이지가 항상 자동으로 만들어지거나 연결되도록 한다.
export async function findOrCreateCompanyId(params: {
  companyName: string;
  companyLogo?: string | null;
  industry: string;
  stage: string;
}): Promise<string> {
  const company = await prisma.company.upsert({
    where: { name: params.companyName },
    create: {
      name: params.companyName,
      logo: params.companyLogo ?? null,
      industry: params.industry,
      stage: params.stage,
    },
    update: {},
  });
  return company.id;
}
