// 사이트 소유자 1인 운영이라 별도 역할(role) 체계 없이 이메일 하나로 관리자 여부를 판단한다.
const ADMIN_EMAILS = ["hanyuna.design@gmail.com"];

export function isAdminEmail(email: string | null | undefined): boolean {
  return Boolean(email && ADMIN_EMAILS.includes(email));
}
