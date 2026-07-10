import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { analyzeJobDescription } from "@/lib/gemini";

export async function POST(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const job = await prisma.job.findUnique({
    where: { id: params.id },
    include: { analysis: true },
  });

  if (!job) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  if (job.analysis) {
    return NextResponse.json({
      coreKeywords: job.analysis.coreKeywords,
      resumeTip: job.analysis.resumeTip,
      taskKeywords: job.analysis.taskKeywords,
    });
  }

  try {
    const result = await analyzeJobDescription(job.description);
    const saved = await prisma.jobAnalysis.upsert({
      where: { jobId: job.id },
      create: {
        jobId: job.id,
        coreKeywords: result.coreKeywords,
        resumeTip: result.resumeTip,
        taskKeywords: result.taskKeywords,
      },
      update: {
        coreKeywords: result.coreKeywords,
        resumeTip: result.resumeTip,
        taskKeywords: result.taskKeywords,
      },
    });
    return NextResponse.json({
      coreKeywords: saved.coreKeywords,
      resumeTip: saved.resumeTip,
      taskKeywords: saved.taskKeywords,
    });
  } catch (error) {
    console.error("JD analysis failed", error);
    return NextResponse.json({ error: "analysis_failed" }, { status: 502 });
  }
}
