import { NextResponse } from "next/server";
import { ingestJobs } from "@/lib/ingest-jobs";

export const dynamic = "force-dynamic";
// 신규 공고가 여러 건일 경우 Gemini 호출 사이 3초 대기가 누적되어 오래 걸릴 수 있어 넉넉히 잡는다.
// Vercel Hobby 플랜의 최대 허용치(60초)에 맞춘 값 — Pro 이상이면 더 늘릴 수 있다.
export const maxDuration = 60;

// Vercel Cron이 CRON_SECRET 환경 변수를 Authorization: Bearer 헤더로 자동으로 실어 보낸다.
// 이 라우트가 외부에 그대로 노출되므로, 값이 일치하지 않으면 거부해 아무나 실행시키지 못하게 한다.
export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const result = await ingestJobs();
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    console.error("Cron job ingestion failed", error);
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
