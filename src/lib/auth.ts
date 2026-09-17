import { PrismaAdapter } from "@next-auth/prisma-adapter";
import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    // 로컬 미니 사이트 전용 — 배포판(origin/main)에는 없음. 비밀번호 없이 바로 로그인해서
    // 로그인 필요한 기능(관심 공고, 캘린더 등)을 빠르게 테스트하기 위한 용도.
    CredentialsProvider({
      id: "local-test-login",
      name: "테스트 로그인",
      credentials: {},
      async authorize() {
        const user = await prisma.user.findUnique({
          where: { email: "local-test@uxui-job.local" },
        });
        if (!user) return null;
        return { id: user.id, name: user.name, email: user.email, image: user.image };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      // prompt를 안 주면 브라우저에 이미 로그인된 구글 세션이 있을 때 계정 선택 화면 없이
      // 그 계정으로 바로 넘어간다. 항상 계정 선택 화면이 뜨게 강제한다.
      authorization: {
        params: {
          prompt: "select_account",
        },
      },
    }),
  ],
  session: {
    // 세션 확인이 미들웨어(엣지 런타임)에서도 이뤄지므로 DB 조회 없이 검증 가능한 JWT 전략을 사용한다.
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        (session.user as { id?: string }).id = token.id as string;
      }
      return session;
    },
  },
};
