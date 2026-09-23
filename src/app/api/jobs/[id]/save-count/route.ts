import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// 게스트 저장은 SavedJob 행을 안 남겨서(로그인해야 계정으로 병합됨) 로그인 저장용
// /api/saved-jobs만으로는 "총 몇 번 저장됐는지"를 집계할 수 없다. 게스트가 저장 버튼을
// 누르는 시점에 이 엔드포인트로 Job.saveCount만 증가시켜, 로그인 여부와 무관하게 모든
// 저장 액션이 누적 집계되게 한다. 인증 불필요 — 언세이브 시에는 호출하지 않는다(누적치).
export async function POST(_req: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.job.update({
      where: { id: params.id },
      data: { saveCount: { increment: 1 } },
    });
    return NextResponse.json({ ok: true });
  } catch {
    // 존재하지 않는 jobId 등으로 실패해도 저장 버튼 UX에는 영향 없게 조용히 무시한다.
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
