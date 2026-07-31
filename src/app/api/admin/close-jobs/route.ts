import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// 스케줄 클라우드 에이전트가 "채용 시 마감" 공고의 지원 링크를 직접 방문해 확인한 결과,
// 더 이상 지원할 수 없다고(영입 완료/링크 만료/404 등) 판단한 공고를 마감 처리하는 라우트.
// 완전히 지우거나 별도 상태를 새로 만들지 않고, applicationDeadline을 어제 날짜로 채워서
// 기존 마감일 기반 로직(dday.ts의 "지원마감" 라벨, jobs 목록의 하단 정렬, 3주 뒤 자동
// archivedAt 처리)에 그대로 올라타게 한다.
export async function POST(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CANDIDATE_INGEST_SECRET}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { jobIds } = (await req.json()) as { jobIds: string[] };
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  // applicationDeadline이 이미 있는(원래 고정 마감일이 있던) 공고는 실수로 덮어쓰지 않도록
  // "상시채용이었던 것만" 대상으로 한정한다.
  const result = await prisma.job.updateMany({
    where: { id: { in: jobIds }, archivedAt: null, applicationDeadline: null },
    data: { applicationDeadline: yesterday, applicationPeriod: "마감(확인됨)" },
  });

  return NextResponse.json({ ok: true, closed: result.count });
}
