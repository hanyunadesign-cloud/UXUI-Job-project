import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const CATEGORIES = ["불편했어요", "이런 기능이 있으면 좋겠어요", "기타"];

export async function POST(req: Request) {
  // 로그인 없이도 제출 가능 — 세션이 있으면 작성자로 연결하고, 없으면 익명으로 저장한다.
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id ?? null;
  const { category, content } = await req.json();

  const trimmed = typeof content === "string" ? content.trim() : "";
  if (!trimmed) {
    return NextResponse.json({ error: "invalid payload" }, { status: 400 });
  }

  const feedback = await prisma.serviceFeedback.create({
    data: {
      userId,
      category: CATEGORIES.includes(category) ? category : null,
      content: trimmed,
    },
  });

  return NextResponse.json({ ok: true, feedback });
}
