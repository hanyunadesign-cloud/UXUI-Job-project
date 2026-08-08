import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// 상시채용 생존확인 루틴이 지원 링크를 방문했을 때, "마감됐다"고 단정하긴 어렵지만
// 제목/본문이 아예 없거나 우리가 저장한 내용과 안 맞는 경우를 여기로 남긴다. 자동으로
// 마감 처리(close-jobs)하지 않고 flaggedReason만 채워서 사람이 확인하게 한다.

// 지금까지 플래그된 공고 목록 확인용.
export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CANDIDATE_INGEST_SECRET}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const jobs = await prisma.job.findMany({
    where: { flaggedReason: { not: null }, archivedAt: null },
    select: {
      id: true,
      companyName: true,
      title: true,
      applyUrl: true,
      flaggedReason: true,
      flaggedAt: true,
    },
    orderBy: { flaggedAt: "desc" },
  });

  return NextResponse.json({ count: jobs.length, jobs });
}

export async function POST(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CANDIDATE_INGEST_SECRET}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { jobIds, reason } = (await req.json()) as { jobIds: string[]; reason: string };

  const result = await prisma.job.updateMany({
    where: { id: { in: jobIds }, archivedAt: null },
    data: { flaggedReason: reason, flaggedAt: new Date() },
  });

  return NextResponse.json({ ok: true, flagged: result.count });
}
