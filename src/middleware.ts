import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: { signIn: "/login" },
});

export const config = {
  // /jobs, /feedback, /mypage(저장 공고)는 비로그인 사용자도 이용할 수 있어야 해서 제외.
  // 저장/팔로우/캘린더 개인일정 같은 로그인 전용 액션은 각 컴포넌트에서 useLoginPrompt로
  // 개별 처리하고, /mypage 자체는 게스트일 땐 localStorage 기반 목록을 보여준다.
  matcher: ["/onboarding/:path*"],
};
