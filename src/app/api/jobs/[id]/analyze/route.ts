import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { analyzeJobForPanel } from "@/lib/gemini";

export async function POST(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const job = await prisma.job.findUnique({
    where: { id: params.id },
    include: { analysis: true },
  });

  if (!job) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  // appealPoints가 이미 채워져 있으면(새 패널용 캐시 완료) 재호출 없이 그대로 반환한다.
  // ingest-jobs.ts 크론과 동일하게, appealPoints가 비어있는 구버전 모양 캐시는 재분석 대상이다 —
  // 그래야 크론이 오기 전에 상세페이지 방문으로 만들어진 반쪽짜리 캐시에 영구히 갇히지 않는다.
  if (job.analysis?.appealPoints) {
    return NextResponse.json({
      coreKeywords: job.analysis.coreKeywords,
      resumeTip: job.analysis.resumeTip,
      taskKeywords: job.analysis.taskKeywords,
    });
  }

  try {
    const result = await analyzeJobForPanel(job.title, job.companyName, job.description);
    // AI가 만든 sourceQuote는 사람이 검증할 수 없어서, 저장 전에 실제로 공고 원문의 정확한
    // 부분 문자열인지 코드로 다시 확인한다 — 안 맞는 항목은 조용히 제외한다.
    const verifiedAppealPoints = result.appealPoints
      .filter((p) => job.description.includes(p.sourceQuote))
      .slice(0, 3);

    const saved = await prisma.jobAnalysis.upsert({
      where: { jobId: job.id },
      create: {
        jobId: job.id,
        coreKeywords: result.coreKeywords,
        resumeTip: result.resumeTip,
        taskKeywords: result.taskKeywords,
        domainPrimary: result.domainPrimary,
        domainSecondary: result.domainSecondary,
        domainKeywords: result.domainKeywords,
        problemLede: result.problemLede,
        problemRest: result.problemRest,
        appealPoints: verifiedAppealPoints,
      },
      update: {
        coreKeywords: result.coreKeywords,
        resumeTip: result.resumeTip,
        taskKeywords: result.taskKeywords,
        domainPrimary: result.domainPrimary,
        domainSecondary: result.domainSecondary,
        domainKeywords: result.domainKeywords,
        problemLede: result.problemLede,
        problemRest: result.problemRest,
        appealPoints: verifiedAppealPoints,
      },
    });
    return NextResponse.json({
      coreKeywords: saved.coreKeywords,
      resumeTip: saved.resumeTip,
      taskKeywords: saved.taskKeywords,
    });
  } catch (error) {
    console.error("JD analysis failed", error);
    return NextResponse.json({ error: "analysis_failed" }, { status: 502 });
  }
}
