import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createJobFromCandidate } from "@/lib/job-intake";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

type CandidatePayload = {
  companyName: string;
  companyLogo?: string;
  title: string;
  applyUrl: string;
  description: string;
  sourceUrl: string;
  verdict: "match" | "ambiguous";
  aiNote?: string;
};

// 스케줄 클라우드 에이전트(이틀에 한 번, 지정 8개 기업 채용 페이지를 직접 읽고 판단)가 발견한
// 공고를 받는 라우트. CRON_SECRET 패턴과 동일하게 전용 시크릿으로 인증한다.
// verdict가 "match"(명확히 UXUI 직군)면 바로 Job으로 발행하고, "ambiguous"(애매함)면
// CandidateJob에 쌓아 사람이 /admin/candidates에서 검토하게 한다. 명확히 무관한 공고는
// 에이전트가 애초에 이 라우트로 보내지 않는다(버림).
export async function POST(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CANDIDATE_INGEST_SECRET}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const candidates = (await req.json()) as CandidatePayload[];

  let published = 0;
  let queued = 0;
  let skipped = 0;

  for (const candidate of candidates) {
    const [existingJob, existingCandidate] = await Promise.all([
      prisma.job.findUnique({ where: { applyUrl: candidate.applyUrl }, select: { id: true } }),
      prisma.candidateJob.findUnique({ where: { applyUrl: candidate.applyUrl }, select: { id: true } }),
    ]);
    if (existingJob || existingCandidate) {
      skipped += 1;
      continue;
    }

    if (candidate.verdict === "match") {
      try {
        await createJobFromCandidate({
          companyName: candidate.companyName,
          companyLogo: candidate.companyLogo,
          title: candidate.title,
          applyUrl: candidate.applyUrl,
          description: candidate.description,
        });
        published += 1;
      } catch (error) {
        console.error(`candidate-jobs: match 발행 실패 (${candidate.applyUrl})`, error);
      }
    } else {
      await prisma.candidateJob.create({
        data: {
          companyName: candidate.companyName,
          companyLogo: candidate.companyLogo,
          title: candidate.title,
          applyUrl: candidate.applyUrl,
          description: candidate.description,
          sourceUrl: candidate.sourceUrl,
          aiNote: candidate.aiNote,
        },
      });
      queued += 1;
    }
  }

  return NextResponse.json({ ok: true, published, queued, skipped });
}
