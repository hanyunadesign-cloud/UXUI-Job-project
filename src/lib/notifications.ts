import { prisma } from "./prisma";
import { computeMatchScore, type MatchableJob } from "./matching";
import { sendNewJobsDigestEmail } from "./email";

// 팔로우한 기업에 새 공고가 올라오면 팔로워 전원에게 알림을 만든다.
// 한 기업이 한 번에 여러 건을 올려도 유저당 알림 1개로 묶어서("OO 기업이 새 공고 N건을
// 등록했습니다") 알림함이 도배되지 않게 한다. 공고가 1건이면 그 공고로 바로 이동하도록
// jobId를 채우고, 여러 건이면 기업 프로필로 보내도록 jobId는 비워둔다.
export async function notifyFollowersOfNewJobs(
  companyId: string,
  companyName: string,
  newJobs: { id: string; title: string }[]
): Promise<void> {
  if (newJobs.length === 0) return;

  const followers = await prisma.follow.findMany({
    where: { companyId },
    select: { userId: true },
  });
  if (followers.length === 0) return;

  const isSingle = newJobs.length === 1;

  await prisma.notification.createMany({
    data: followers.map(({ userId }) => ({
      userId,
      companyId,
      companyName,
      jobId: isSingle ? newJobs[0].id : null,
      jobTitle: isSingle ? newJobs[0].title : null,
      count: newJobs.length,
    })),
  });
}

// 크론 1회 실행에서 새로 생긴 공고 전체를 대상으로, 이메일 알림을 켠 유저마다 본인의 온보딩
// 관심 조건(직무/플랫폼/산업/규모)에 맞는 것만 걸러 하루 1통으로 묶어 보낸다. 공고 1건당
// 메일 1통이 아니라, 한 번에 여러 건이 올라와도 유저 입장에서는 다이제스트 메일 1통만 받는다.
export async function sendMatchingJobEmailDigests(
  newJobs: (MatchableJob & { id: string; title: string; companyName: string })[]
): Promise<void> {
  if (newJobs.length === 0) return;

  const optedIn = await prisma.preference.findMany({
    where: { emailOptIn: true },
    include: { user: { select: { email: true } } },
  });

  for (const pref of optedIn) {
    const email = pref.user.email;
    if (!email) continue;

    const matched = newJobs.filter(
      (job) =>
        computeMatchScore(job, {
          roles: pref.roles,
          platforms: pref.platforms,
          industries: pref.industries,
          stages: pref.stages,
        }) > 0
    );
    if (matched.length === 0) continue;

    try {
      await sendNewJobsDigestEmail(
        email,
        matched.map(({ id, title, companyName }) => ({ id, title, companyName }))
      );
    } catch (error) {
      console.error(`관심 공고 다이제스트 메일 발송 실패 (${email})`, error);
    }
  }
}
