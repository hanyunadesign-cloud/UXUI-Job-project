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
        ink: "#111111",
        paper: "#ffffff",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      maxWidth: {
        content: "1120px",
      },
    },
  },
  plugins: [],
};

export default config;
