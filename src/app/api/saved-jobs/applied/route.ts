import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// 저장 공고 페이지의 "지원완료" 토글. kind가 "job"이면 SavedJob(우리 DB 공고),
// "external"이면 링크로 추가한 공고(ExternalJobSave)의 appliedAt을 켜고 끈다.
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const userId = (session.user as { id: string }).id;
  const { kind, id, applied } = (await req.json()) as {
    kind: "job" | "external";
    id: string;
    applied: boolean;
  };
  const appliedAt = applied ? new Date() : null;

  const result =
    kind === "external"
      ? await prisma.externalJobSave.updateMany({ where: { id, userId }, data: { appliedAt } })
      : await prisma.savedJob.updateMany({ where: { jobId: id, userId }, data: { appliedAt } });

  if (result.count === 0) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
