import { prisma } from "../src/lib/prisma";
import { ingestJobs } from "../src/lib/ingest-jobs";

// 로컬에서 수동으로 돌리는 CLI 래퍼. 실제 수집 로직은 src/lib/ingest-jobs.ts에 있고,
// Vercel Cron이 호출하는 /api/cron/fetch-jobs 라우트도 같은 로직을 공유한다.
ingestJobs()
  .then(({ count, archived }) => {
    console.log(`\nDone. Upserted ${count} real job postings. Archived ${archived} stale jobs.`);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
