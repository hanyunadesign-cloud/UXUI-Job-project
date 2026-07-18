import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const userId = (session.user as { id: string }).id;
  const { score, comment } = await req.json();

  if (typeof score !== "number" || !Number.isInteger(score) || score < 1 || score > 10) {
    return NextResponse.json({ error: "invalid payload" }, { status: 400 });
  }

  // 위젯이 재방문마다 다시 노출되므로, 같은 유저가 같은 공고에 다시 제출하면
  // 이전 응답을 최신 내용으로 덮어쓴다 (히스토리 누적이 아니라 최신 의견만 보관).
  const feedback = await prisma.jobFeedback.upsert({
    where: { userId_jobId: { userId, jobId: params.id } },
    create: { userId, jobId: params.id, score, comment: comment || null },
    update: { score, comment: comment || null },
  });

  return NextResponse.json({ ok: true, feedback });
}
