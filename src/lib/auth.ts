import { PrismaAdapter } from "@next-auth/prisma-adapter";
import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
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
