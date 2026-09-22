import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// 게스트로 저장해둔(localStorage) 공고를 로그인 시 계정(SavedJob)으로 옮긴다.
// 게스트 저장 이후 마감/삭제된 공고가 섞여 있을 수 있어, 실제로 존재하는 공고만
// 골라서 병합하고 나머지는 조용히 무시한다.
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const userId = (session.user as { id: string }).id;
  const { jobIds } = await req.json();

  if (!Array.isArray(jobIds) || jobIds.length === 0) {
    return NextResponse.json({ ok: true, merged: 0 });
  }

  const existingJobs = await prisma.job.findMany({
    where: { id: { in: jobIds.filter((id): id is string => typeof id === "string") } },
    select: { id: true },
  });
  const validIds = existingJobs.map((j) => j.id);

  if (validIds.length > 0) {
    await prisma.savedJob.createMany({
      data: validIds.map((jobId) => ({ userId, jobId })),
      skipDuplicates: true,
    });
  }

  return NextResponse.json({ ok: true, merged: validIds.length });
}
