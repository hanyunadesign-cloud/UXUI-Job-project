import { lookup } from "dns/promises";
import * as cheerio from "cheerio";

const FETCH_TIMEOUT_MS = 10_000;
const MAX_RESPONSE_BYTES = 3_000_000; // 3MB
const MAX_EXTRACTED_CHARS = 8_000;

// SSRF 방지: 사용자가 준 임의의 URL을 서버가 대신 fetch하는 구조라, 내부망/클라우드 메타데이터
// 주소로 요청하지 못하게 IP 대역을 직접 걸러야 한다. 도메인 자체가 아니라 실제로 연결될 IP를
// 확인해야 하므로(DNS 리바인딩 방지), 프로토콜 검증 → DNS 조회 → IP 대역 검사 순서로 진행한다.
function isPrivateIPv4(ip: string): boolean {
  const parts = ip.split(".").map(Number);
  if (parts.length !== 4 || parts.some((n) => Number.isNaN(n))) return true; // 파싱 실패는 안전하게 차단
  const [a, b] = parts;
  if (a === 10) return true;
  if (a === 127) return true;
  if (a === 0) return true;
  if (a === 169 && b === 254) return true; // link-local, 클라우드 메타데이터 169.254.169.254 포함
  if (a === 172 && b >= 16 && b <= 31) return true;
  if (a === 192 && b === 168) return true;
  if (a === 100 && b >= 64 && b <= 127) return true; // carrier-grade NAT
  return false;
}

function isPrivateIPv6(ip: string): boolean {
  const lower = ip.toLowerCase();
  if (lower === "::1") return true; // loopback
  if (lower.startsWith("fc") || lower.startsWith("fd")) return true; // unique local (fc00::/7)
  if (lower.startsWith("fe80")) return true; // link-local
  const mapped = lower.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/);
  if (mapped) return isPrivateIPv4(mapped[1]);
  return false;
}

export async function assertPublicUrl(rawUrl: string): Promise<URL> {
  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    throw new Error("올바른 URL 형식이 아니에요.");
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("http 또는 https 링크만 지원해요.");
  }
  if (url.hostname === "localhost") {
    throw new Error("이 주소는 지원하지 않아요.");
  }

  const { address, family } = await lookup(url.hostname);
  const isPrivate = family === 6 ? isPrivateIPv6(address) : isPrivateIPv4(address);
  if (isPrivate) {
    throw new Error("이 주소는 지원하지 않아요.");
  }

  return url;
}

// 특정 ATS 구조를 미리 알고 있는 ingest-jobs.ts와 달리, 어떤 회사 페이지든 올 수 있으므로
// nav/header/footer 등 공고 본문과 무관한 영역을 최대한 걷어내고 남은 텍스트를 넘긴다.
// 완벽한 정제는 기대할 수 없어 이후 Gemini 프롬프트에서 "메뉴/푸터가 섞여 있을 수 있다"고
// 미리 안내한다.
export async function fetchExternalJobPageText(url: URL): Promise<string> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  let res: Response;
  try {
    res = await fetch(url, {
      signal: controller.signal,
      redirect: "follow",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; UXUIJobBot/1.0; +https://uxui-job.vercel.app)",
      },
    });
  } finally {
    clearTimeout(timeout);
  }

  if (!res.ok) {
    throw new Error("공고 페이지를 불러오지 못했어요.");
  }

  const contentType = res.headers.get("content-type") ?? "";
  if (!contentType.includes("html")) {
    throw new Error("지원하지 않는 페이지 형식이에요.");
  }

  const buf = await res.arrayBuffer();
  if (buf.byteLength > MAX_RESPONSE_BYTES) {
    throw new Error("페이지 용량이 너무 커요.");
  }

  const html = Buffer.from(buf).toString("utf-8");
  const $ = cheerio.load(html);
  $("script, style, nav, header, footer, svg, noscript, iframe").remove();
  $("br").replaceWith("\n");
  $("li").each((_, el) => {
    $(el).prepend("- ");
  });
  $("p, div, li, h1, h2, h3, h4, h5, h6, ul, ol, hr, tr").each((_, el) => {
    $(el).append("\n");
  });

  const text = $.root()
    .text()
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  // 일부 ATS(Ashby 등)는 본문을 JS로 렌더링해서, 정적 HTML만 가져오면 페이지 껍데기(제목 정도)만
  // 남는 경우가 있다. 이런 빈약한 입력으로 AI를 호출하면 할당량만 소모하고 품질 낮은 결과가
  // 나오므로, 최소 길이 미달이면 미리 에러로 처리한다.
  if (text.length < 200) {
    throw new Error(
      "이 페이지에서 공고 내용을 충분히 읽지 못했어요. 다른 링크(회사 자체 채용 페이지 등)로 시도해보세요."
    );
  }

  return text.slice(0, MAX_EXTRACTED_CHARS);
}
