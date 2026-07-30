import mixpanel from "mixpanel-browser";

const MIXPANEL_TOKEN = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;
const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
// 로컬 개발 트래픽이 실제 운영 지표에 섞이지 않도록, next build로 빌드된
// 프로덕션 환경(Vercel 배포)에서만 실제로 전송한다. next dev에서는 항상 no-op.
const IS_PROD = process.env.NODE_ENV === "production";

let mixpanelReady = false;

function ensureMixpanel() {
  if (mixpanelReady || typeof window === "undefined" || !IS_PROD) return;
  if (!MIXPANEL_TOKEN) {
    console.warn("NEXT_PUBLIC_MIXPANEL_TOKEN이 설정되지 않아 Mixpanel을 건너뜁니다.");
    return;
  }
  mixpanel.init(MIXPANEL_TOKEN, {
    track_pageview: false, // 페이지뷰는 Next.js App Router 라우팅에 맞춰 직접 트래킹한다.
    persistence: "localStorage",
  });
  mixpanelReady = true;
  registerVisitCount();
}

const VISIT_COUNT_KEY = "uxui_visit_count";
const SESSION_COUNTED_KEY = "uxui_visit_counted";
const LAST_VISIT_AT_KEY = "uxui_last_visit_at";

// "이번이 몇 번째 방문인지"(visitCount), "재방문자인지"(isReturningVisitor), "지난
// 방문에서 며칠 만에 돌아왔는지"(daysSinceLastVisit)를 신규 vs 재방문/복귀 주기 분석에
// 쓸 수 있도록 super property로 등록해, 이후 이 세션에서 보내는 모든 이벤트에 자동으로
// 붙게 한다. sessionStorage로 같은 세션(탭) 안에서는 페이지를 여러 번 이동해도 중복
// 카운트되지 않게 막는다. daysSinceLastVisit은 "저장된 마지막 방문 시각 → 지금"으로 이번
// 세션 시작 시점에 한 번만 계산하고, 그 다음엔 지금 시각으로 마지막 방문 시각을 갱신한다.
function registerVisitCount() {
  try {
    if (sessionStorage.getItem(SESSION_COUNTED_KEY)) return;
    const raw = localStorage.getItem(VISIT_COUNT_KEY);
    const count = (raw ? parseInt(raw, 10) : 0) + 1;
    localStorage.setItem(VISIT_COUNT_KEY, String(count));
    sessionStorage.setItem(SESSION_COUNTED_KEY, "1");

    const lastVisitRaw = localStorage.getItem(LAST_VISIT_AT_KEY);
    const daysSinceLastVisit = lastVisitRaw
      ? Math.floor((Date.now() - Number(lastVisitRaw)) / (1000 * 60 * 60 * 24))
      : null;
    localStorage.setItem(LAST_VISIT_AT_KEY, String(Date.now()));

    const isReturningVisitor = count > 1;
    mixpanel.register({
      visitCount: count,
      isReturningVisitor,
      ...(daysSinceLastVisit !== null && { daysSinceLastVisit }),
    });
    gtag("set", "user_properties", {
      visit_count: count,
      is_returning_visitor: isReturningVisitor,
      ...(daysSinceLastVisit !== null && { days_since_last_visit: daysSinceLastVisit }),
    });
  } catch {
    // 시크릿 모드 등 storage 접근이 막힌 환경이면 건너뛴다.
  }
}

// @next/third-parties의 <GoogleAnalytics>가 gtag.js를 로드하면 window.gtag가 생긴다.
// 타입은 최소한으로만 선언한다.
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

function gtag(...args: unknown[]) {
  if (typeof window === "undefined" || !window.gtag || !GA_ID || !IS_PROD) return;
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
