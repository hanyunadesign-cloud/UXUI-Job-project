import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: { signIn: "/login" },
});

export const config = {
  // /jobs는 비로그인 사용자도 둘러볼 수 있어야 해서 제외. 저장/팔로우 같은 로그인 전용
  // 액션은 각 컴포넌트에서 useLoginPrompt로 개별 처리한다.
  matcher: ["/onboarding/:path*", "/mypage/:path*", "/feedback/:path*"],
};
