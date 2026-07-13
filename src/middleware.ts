import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: { signIn: "/login" },
});

export const config = {
  matcher: ["/onboarding/:path*", "/jobs/:path*", "/mypage/:path*", "/feedback/:path*"],
};
