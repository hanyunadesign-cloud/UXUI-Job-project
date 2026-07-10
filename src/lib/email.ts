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
