import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const userId = (session.user as { id: string }).id;

  // deleteMany + userId 조건으로, 다른 유저 소유의 레코드는 id를 알아도 지울 수 없게 한다.
  await prisma.externalJobSave.deleteMany({ where: { id: params.id, userId } });

  return NextResponse.json({ ok: true });
}
