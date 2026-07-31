import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// 스케줄 클라우드 에이전트가 "채용 시 마감"(상시채용, applicationDeadline 없음) 공고들의
// 생존 여부를 주기적으로 점검하기 위해 대상 목록을 가져가는 라우트. 대상 전체를 한 에이전트가
// 처리하기엔 많아서, 쿼리 파라미터 slice/of로 N등분 중 하나만 받아갈 수 있다
// (예: ?slice=0&of=4 → 전체를 4등분한 것 중 0번째).
export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CANDIDATE_INGEST_SECRET}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const slice = Number(url.searchParams.get("slice") ?? "0");
  const of = Number(url.searchParams.get("of") ?? "1");

  const jobs = await prisma.job.findMany({
    where: { archivedAt: null, applicationDeadline: null },
    select: { id: true, companyName: true, title: true, applyUrl: true, description: true },
    orderBy: { id: "asc" },
  });

  const mine = jobs.filter((_, i) => i % of === slice);

  return NextResponse.json({ total: jobs.length, count: mine.length, jobs: mine });
}
