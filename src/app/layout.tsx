import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Providers } from "@/components/Providers";
import "./globals.css";

// 로컬(next dev)에서 뜬 트래픽이 실제 운영 GA4 지표에 섞이지 않도록,
// 프로덕션 빌드(Vercel 배포)에서만 스크립트를 아예 심는다.
const GA_MEASUREMENT_ID =
  process.env.NODE_ENV === "production" ? process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID : undefined;

const notoSansKr = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "UXUI Job",
  description: "흩어진 UXUI 채용공고를 한 곳에서, 나에게 맞는 공고만 놓치지 않게",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={notoSansKr.variable}>
      <body className="font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
      {GA_MEASUREMENT_ID && <GoogleAnalytics gaId={GA_MEASUREMENT_ID} />}
    </html>
  );
}
