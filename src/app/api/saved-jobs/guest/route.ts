import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// 게스트의 localStorage 저장 목록(jobId만 들고 있음)을 실제 공고 데이터로 채워준다.
// 요청에 담긴 순서(최근 저장한 순)를 그대로 유지해서 응답한다.
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const ids = (searchParams.get("ids") ?? "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean)
    .slice(0, 100);

  if (ids.length === 0) return NextResponse.json([]);

  const jobs = await prisma.job.findMany({
    where: { id: { in: ids }, archivedAt: null },
    include: { analysis: { select: { taskKeywords: true } } },
  });
  const byId = new Map(jobs.map((job) => [job.id, job]));
  const ordered = ids
    .map((id) => byId.get(id))
    .filter((job): job is NonNullable<typeof job> => Boolean(job));

  return NextResponse.json(
    ordered.map((job) => ({ ...job, taskKeywords: job.analysis?.taskKeywords ?? [] }))
  );
}
