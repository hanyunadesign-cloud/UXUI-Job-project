import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendAlertOptInEmail } from "@/lib/email";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const userId = (session.user as { id: string }).id;
  const { roles, platforms, industries, stages, emailOptIn } = await req.json();

  await prisma.preference.upsert({
    where: { userId },
    create: {
      userId,
      roles: roles ?? [],
      platforms: platforms ?? [],
      industries: industries ?? [],
      stages: stages ?? [],
      emailOptIn: Boolean(emailOptIn),
    },
    update: {
      roles: roles ?? [],
      platforms: platforms ?? [],
      industries: industries ?? [],
      stages: stages ?? [],
      emailOptIn: Boolean(emailOptIn),
    },
  });

  if (emailOptIn && session.user.email) {
    await sendAlertOptInEmail(session.user.email).catch((error) =>
      console.error("Failed to send opt-in email", error)
    );
  }

  return NextResponse.json({ ok: true });
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const userId = (session.user as { id: string }).id;
  const { emailOptIn } = await req.json();

  const preference = await prisma.preference.update({
    where: { userId },
    data: { emailOptIn: Boolean(emailOptIn) },
  });

  if (emailOptIn && session.user.email) {
    await sendAlertOptInEmail(session.user.email).catch((error) =>
      console.error("Failed to send opt-in email", error)
    );
  }

  return NextResponse.json({ ok: true, emailOptIn: preference.emailOptIn });
}
