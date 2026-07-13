import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { assertPublicUrl, fetchExternalJobPageText } from "@/lib/external-job";
import { analyzeExternalJobPosting } from "@/lib/gemini";

// Gemini 무료 티어 할당량이 사이트 전체에서 하루 20건으로 빠듯해서, 이 기능만으로 소진되지
// 않도록 유저당 하루 한도를 별도로 둔다. 총 저장 개수도 무한정 쌓이지 않게 제한한다.
const DAILY_LIMIT_PER_USER = 3;
const MAX_SAVED_PER_USER = 30;

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const userId = (session.user as { id: string }).id;

  const { url: rawUrl } = await req.json();
  if (typeof rawUrl !== "string" || !rawUrl.trim()) {
    return NextResponse.json({ error: "링크를 입력해주세요." }, { status: 400 });
  }

  const totalCount = await prisma.externalJobSave.count({ where: { userId } });
  if (totalCount >= MAX_SAVED_PER_USER) {
    return NextResponse.json(
      { error: `링크로 추가한 공고는 최대 ${MAX_SAVED_PER_USER}개까지 저장할 수 있어요.` },
      { status: 400 }
    );
  }

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const todayCount = await prisma.externalJobSave.count({
    where: { userId, createdAt: { gte: startOfToday } },
  });
  if (todayCount >= DAILY_LIMIT_PER_USER) {
    return NextResponse.json(
      { error: `링크 분석은 하루 ${DAILY_LIMIT_PER_USER}건까지 가능해요. 내일 다시 시도해주세요.` },
      { status: 429 }
    );
  }

  try {
    const url = await assertPublicUrl(rawUrl.trim());
    const pageText = await fetchExternalJobPageText(url);
    const analysis = await analyzeExternalJobPosting(pageText);

    const saved = await prisma.externalJobSave.create({
      data: {
        userId,
        sourceUrl: url.toString(),
        title: analysis.title,
        companyName: analysis.companyName,
        description: pageText,
        coreKeywords: analysis.coreKeywords,
        resumeTip: analysis.resumeTip,
      },
    });

    return NextResponse.json({ ok: true, id: saved.id });
  } catch (error) {
    const message = error instanceof Error ? error.message : "링크를 분석하지 못했어요.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
