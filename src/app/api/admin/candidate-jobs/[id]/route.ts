import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isAdminEmail } from "@/lib/admin";
import { createJobFromCandidate } from "@/lib/job-intake";

export const dynamic = "force-dynamic";

// /admin/candidates 검토 화면의 승인/거절 액션. 승인이면 CandidateJob 내용 그대로 Job으로
// 발행하고, 거절이면 그냥 CandidateJob만 지운다. 둘 다 소유자 계정만 호출 가능.
export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!isAdminEmail(session?.user?.email)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { action } = (await req.json()) as { action: "approve" | "reject" };

  const candidate = await prisma.candidateJob.findUnique({ where: { id: params.id } });
  if (!candidate) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  if (action === "approve") {
    await createJobFromCandidate({
      companyName: candidate.companyName,
      companyLogo: candidate.companyLogo,
      title: candidate.title,
      applyUrl: candidate.applyUrl,
      description: candidate.description,
    });
  }

  await prisma.candidateJob.delete({ where: { id: params.id } });

  return NextResponse.json({ ok: true });
}
