# UXUI Job

UXUI 디자이너 구직자를 위한 채용공고 모음 + AI 분석 웹앱. PRD.md 참고.

## 기술 스택

- Next.js 14 (App Router) + TypeScript + Tailwind CSS
- NextAuth.js (Google OAuth, JWT 세션) + Prisma Adapter
- Prisma + PostgreSQL
- Google Gemini API (`gemini-2.5-flash`, 무료 티어) — 공고 상세페이지 진입 시 AI 분석
- Resend — 이메일 알림
- Vercel 배포

## 시작하기

```bash
npm install
cp .env.example .env.local   # 값 채우기
npx prisma db push           # DB에 스키마 반영
npm run fetch:jobs           # 실제 채용공고 수집 (당근마켓/쿠팡/미소/Bjak 공개 API)
npm run dev
```

> `prisma/seed.ts` + `npm run prisma:seed`는 레이아웃 확인용 더미 데이터를 넣는 레거시 스크립트이며,
> 실제 서비스 데이터는 `npm run fetch:jobs`(=`src/lib/ingest-jobs.ts`)로 채운다.

### 필요한 환경 변수 (`.env.local`)

| 변수 | 설명 |
| --- | --- |
| `DATABASE_URL` | PostgreSQL 연결 문자열 (Vercel Postgres / Supabase / Neon 등) |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google OAuth 클라이언트 (Google Cloud Console) |
| `NEXTAUTH_URL` | 로컬은 `http://localhost:3000` |
| `NEXTAUTH_SECRET` | `openssl rand -base64 32` |
| `GEMINI_API_KEY` | JD 분석용 Google Gemini API 키 (무료, https://aistudio.google.com/apikey) |
| `RESEND_API_KEY` / `EMAIL_FROM` | 이메일 알림 발송용 |
| `CRON_SECRET` | Vercel Cron 인증용 (`openssl rand -base64 32`). Vercel 프로젝트 환경 변수에도 동일하게 등록 필요 |

## 폴더 구조

```
src/
  app/
    page.tsx                # 화면1 · 첫화면
    login/page.tsx           # 화면2 · 로그인
    onboarding/               # 화면3 · 온보딩 (4단계)
    (main)/
      layout.tsx              # 공통 헤더가 있는 레이아웃
      jobs/page.tsx            # 화면4 · 홈 (공고 목록 + 필터)
      jobs/[id]/page.tsx       # 화면5 · 공고 상세 + AI 분석
      mypage/page.tsx          # 화면6 · 마이페이지
    api/
      auth/[...nextauth]/      # NextAuth 핸들러
      jobs/[id]/analyze/       # AI 분석 트리거 (캐시 우선)
      saved-jobs/               # 공고 저장/저장 취소
      onboarding/                # 온보딩 결과 저장, 이메일 알림 토글
      cron/fetch-jobs/           # Vercel Cron이 매일 새벽 3시(KST)에 호출하는 채용공고 수집 라우트
  components/                 # 재사용 UI 컴포넌트
  lib/                        # prisma, auth, gemini, email, constants, ingest-jobs
prisma/
  schema.prisma
  fetch-real-jobs.ts          # ingest-jobs.ts를 호출하는 로컬 CLI 래퍼 (npm run fetch:jobs)
  seed.ts                     # (레거시) 레이아웃 확인용 더미 채용공고
vercel.json                   # Cron 스케줄 설정
```

## 배포 (Vercel)

1. GitHub 저장소 연결 후 Vercel에 import
2. 위 환경 변수를 Vercel 프로젝트 설정에 등록 (`CRON_SECRET` 포함)
3. Google OAuth 콘솔의 승인된 리디렉션 URI에 `https://<도메인>/api/auth/callback/google` 추가
4. 배포 후 `npx prisma db push`로 프로덕션 DB 스키마 반영, `npm run fetch:jobs`로 초기 채용공고 채우기
5. `vercel.json`에 정의된 Cron이 배포와 동시에 자동 등록됨 — 별도 설정 불필요

## 채용공고 자동 수집 (Vercel Cron)

- 매일 새벽 3시(KST, `vercel.json`에는 UTC 18시로 등록)에 Vercel이 `/api/cron/fetch-jobs`를 자동 호출해
  당근마켓/쿠팡(Greenhouse)·미소/Bjak(Ashby) 공개 API에서 새 UXUI 공고를 가져와 DB에 반영한다.
- 실제 수집 로직은 `src/lib/ingest-jobs.ts`에 있고, 로컬 CLI(`npm run fetch:jobs`)와 Cron 라우트가 동일한 함수를 공유한다.
- Cron 라우트는 `CRON_SECRET` 환경 변수와 일치하는 `Authorization: Bearer` 헤더가 없으면 401을 반환해,
  외부에서 임의로 호출해 Gemini 호출을 낭비시키는 것을 막는다.
- 로컬 개발 중에는 크론이 실행되지 않으므로(배포된 URL이 있어야 Vercel이 호출 가능), 그동안은 `npm run fetch:jobs`로 수동 실행한다.
- Vercel **Hobby 플랜은 크론을 하루 1회까지만** 허용하고 함수 실행 시간도 최대 60초로 제한된다
  (`maxDuration = 60`으로 맞춰둠). 신규 공고가 한 번에 많이 올라와 Gemini 분석이 몰리면 60초를 넘길 수 있는데,
  이 경우 처리되지 않은 나머지 공고는 다음날 크론 실행 시 이어서 처리되거나(캐시 스킵 로직 덕분에 중복 호출은 안 됨),
  사용자가 상세페이지를 방문할 때 그때그때 분석된다.

## 완료 기준

UXUI 디자인 취업준비생 1명이 URL만 받고 오류 없이 채용공고를 탐색하고 관심 채용공고를 저장한다.
