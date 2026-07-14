import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export async function sendAlertOptInEmail(to: string) {
  if (!resend) {
    console.warn("RESEND_API_KEY가 설정되지 않아 이메일 발송을 건너뜁니다.");
    return;
  }

  await resend.emails.send({
    from: process.env.EMAIL_FROM ?? "UXUI Job <onboarding@resend.dev>",
    to,
    subject: "UXUI Job 채용공고 알림 신청이 완료되었어요",
    html: "<p>관심 조건에 맞는 UXUI 채용공고가 올라오면 이메일로 알려드릴게요.</p>",
  });
}

const SITE_URL = process.env.NEXTAUTH_URL ?? "https://uxui-job.vercel.app";
// 미리보기 카드는 이메일 스크롤이 너무 길어지지 않도록 상한을 둔다. 그 이상은 "+N개 더보기"로.
const MAX_PREVIEW_JOBS = 5;

export type DigestJob = { id: string; title: string; companyName: string };

// 실제 발송(sendNewJobsDigestEmail)과 미리보기 스크립트가 같은 템플릿을 쓰도록 HTML 생성만
// 분리해뒀다.
export function buildNewJobsDigestHtml(jobs: DigestJob[]): { subject: string; html: string } {
  const preview = jobs.slice(0, MAX_PREVIEW_JOBS);
  const remaining = jobs.length - preview.length;

  const cardsHtml = preview
    .map(
      (job) => `
        <a href="${SITE_URL}/jobs/${job.id}" style="display:block;text-decoration:none;border:1px solid #e5e5e5;border-radius:12px;padding:14px 16px;margin-bottom:10px;">
          <p style="margin:0 0 4px;font-size:13px;color:#6b6b6b;">${job.companyName}</p>
          <p style="margin:0;font-size:15px;font-weight:700;color:#111;">${job.title}</p>
        </a>`
    )
    .join("");

  const moreHtml =
    remaining > 0
      ? `<p style="font-size:13px;color:#6b6b6b;margin:4px 0 0;">+${remaining}개 더보기</p>`
      : "";

  return {
    subject: `관심 조건에 맞는 새 공고 ${jobs.length}건이 올라왔어요`,
    html: `
      <div style="font-family:sans-serif;max-width:480px;">
        <p style="font-size:16px;color:#111;">관심 조건에 맞는 새 공고 <strong>${jobs.length}건</strong>이 올라왔어요.</p>
        ${cardsHtml}
        ${moreHtml}
        <a href="${SITE_URL}/jobs" style="display:inline-block;margin-top:16px;font-size:14px;color:#2E5CF6;">전체 채용공고 보러가기 →</a>
      </div>
    `,
  };
}

// 크론이 한 번 돌 때 여러 건이 한꺼번에 올라와도, 공고 1건당 메일 1통이 아니라 유저별로
// 관심 조건에 맞는 공고를 모아 하루 1통만 보낸다.
export async function sendNewJobsDigestEmail(to: string, jobs: DigestJob[]) {
  if (!resend || jobs.length === 0) {
    if (!resend) console.warn("RESEND_API_KEY가 설정되지 않아 이메일 발송을 건너뜁니다.");
    return;
  }

  const { subject, html } = buildNewJobsDigestHtml(jobs);
  await resend.emails.send({
    from: process.env.EMAIL_FROM ?? "UXUI Job <onboarding@resend.dev>",
    to,
    subject,
    html,
  });
}
