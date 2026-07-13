import type { Config } from "tailwindcss";

// 다크모드 미지원: dark: 유틸리티를 사용하지 않고, globals.css의 color-scheme: light로 강제한다.
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      screens: {
        // 1920×1080을 기준 데스크톱 해상도로 별도 대응하기 위한 브레이크포인트
        "3xl": "1920px",
      },
      colors: {
        // SOCAR Frame 2.0 토큰 적용: ink/neutral 램프를 쏘카의 푸른 기 도는 그레이로,
        // primary/blue를 브랜드 블루로 교체. 나머지 컴포넌트는 대부분 ink·neutral·white만
        // 사용하므로 여기서 값만 바꿔도 전역 리스킨이 대부분 전파된다.
        ink: "oklch(0.211 0.026 261)",
        paper: "#ffffff",
        primary: {
          DEFAULT: "oklch(0.620 0.219 257)",
          regular: "oklch(0.620 0.219 257)",
          strong: "oklch(0.586 0.236 261)",
          heavy: "oklch(0.526 0.224 263)",
        },
        blue: {
          50: "oklch(0.962 0.022 248)",
          100: "oklch(0.917 0.040 240)",
          200: "oklch(0.789 0.111 234)",
        },
        neutral: {
          50: "oklch(0.984 0.002 286)",
          100: "oklch(0.967 0.004 271)",
          200: "oklch(0.927 0.009 264)",
          300: "oklch(0.851 0.018 264)",
          400: "oklch(0.781 0.027 267)",
          500: "oklch(0.687 0.035 265)",
          600: "oklch(0.519 0.039 263)",
          700: "oklch(0.405 0.036 264)",
          800: "oklch(0.331 0.034 264)",
          900: "oklch(0.268 0.030 263)",
        },
        positive: "oklch(0.745 0.176 162)",
        negative: "oklch(0.649 0.219 19)",
        caution: "oklch(0.741 0.166 56)",
      },
      fontFamily: {
        sans: [
          "Pretendard Variable",
          "Pretendard",
          "var(--font-sans)",
          "system-ui",
          "sans-serif",
        ],
      },
      maxWidth: {
        content: "1120px",
      },
      boxShadow: {
        // SOCAR는 카드에 그림자를 쓰지 않고 1px 디바이더로만 표면을 구분한다.
        // 드롭다운/토스트 같은 부양 오버레이에만 아주 옅은 그림자를 남긴다.
        dropdown: "0 2px 4px oklch(0 0 0 / 0.12)",
        sheet: "0 0 20px oklch(0 0 0 / 0.25)",
      },
      transitionTimingFunction: {
        standard: "cubic-bezier(0.42, 0, 0.58, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
