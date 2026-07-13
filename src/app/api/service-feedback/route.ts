import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const CATEGORIES = ["불편했어요", "이런 기능이 있으면 좋겠어요", "기타"];

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const userId = (session.user as { id: string }).id;
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
