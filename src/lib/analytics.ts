import mixpanel from "mixpanel-browser";

const MIXPANEL_TOKEN = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;
const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

let mixpanelReady = false;

function ensureMixpanel() {
  if (mixpanelReady || typeof window === "undefined") return;
  if (!MIXPANEL_TOKEN) {
    console.warn("NEXT_PUBLIC_MIXPANEL_TOKEN이 설정되지 않아 Mixpanel을 건너뜁니다.");
    return;
  }
  mixpanel.init(MIXPANEL_TOKEN, {
    track_pageview: false, // 페이지뷰는 Next.js App Router 라우팅에 맞춰 직접 트래킹한다.
    persistence: "localStorage",
  });
  mixpanelReady = true;
}

// @next/third-parties의 <GoogleAnalytics>가 gtag.js를 로드하면 window.gtag가 생긴다.
// 타입은 최소한으로만 선언한다.
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

function gtag(...args: unknown[]) {
  if (typeof window === "undefined" || !window.gtag || !GA_ID) return;
  window.gtag(...args);
}

// 이벤트 하나를 Mixpanel과 GA4 양쪽에 동시 전송한다. 두 도구에 같은 이벤트를 각각
// 심는 대신 이 함수 하나로 모아서, 이름/속성이 어긋나지 않게 한다.
export function trackEvent(name: string, props?: Record<string, unknown>) {
  ensureMixpanel();
  if (mixpanelReady) mixpanel.track(name, props);
  // GA4는 이벤트 이름에 공백을 권장하지 않아 snake_case로 변환해서 보낸다.
  gtag("event", name.replace(/\s+/g, "_").toLowerCase(), props);
}

export function trackPageView(path: string) {
  trackEvent("Page View", { path });
  // GA4는 <GoogleAnalytics>가 라우트 변경마다 page_view를 자동으로 보내주므로 별도 호출 불필요.
}

// 로그인한 유저를 이후 이벤트와 연결한다. 로그아웃 시에는 reset()으로 다음 방문자와
// 세션이 섞이지 않게 한다.
export function identifyUser(userId: string, traits?: Record<string, unknown>) {
  ensureMixpanel();
  if (mixpanelReady) {
    mixpanel.identify(userId);
    if (traits) mixpanel.people.set(traits);
  }
  gtag("set", "user_id", userId);
}

export function resetAnalyticsUser() {
  ensureMixpanel();
  if (mixpanelReady) mixpanel.reset();
}
