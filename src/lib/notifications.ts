import { prisma } from "./prisma";

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
