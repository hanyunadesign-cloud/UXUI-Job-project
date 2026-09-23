import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const userId = (session.user as { id: string }).id;
  const { jobId } = await req.json();

  // saveCount는 "총 몇 번 저장됐는지" 누적치라, 이미 저장돼 있던 걸 다시 눌러도(멱등 upsert)
  // 중복으로 늘면 안 된다 — 먼저 존재 여부를 확인해 새로 생기는 경우에만 카운트를 올린다.
  const existed = await prisma.savedJob.findUnique({
    where: { userId_jobId: { userId, jobId } },
  });

  await prisma.savedJob.upsert({
    where: { userId_jobId: { userId, jobId } },
    create: { userId, jobId },
    update: {},
  });

  if (!existed) {
    await prisma.job.update({ where: { id: jobId }, data: { saveCount: { increment: 1 } } });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const userId = (session.user as { id: string }).id;
  const { jobId } = await req.json();

  await prisma.savedJob.deleteMany({ where: { userId, jobId } });

  return NextResponse.json({ ok: true });
}
