import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getApplicationStatus } from "@/lib/dday";
import { TrackPageView } from "@/components/TrackPageView";
import {
  JobDeadlineCalendarGrid,
  type CalendarJobSummary,
  type WeekCell,
} from "@/components/JobDeadlineCalendarGrid";

const UPCOMING_DEADLINE_LIMIT = 8;

// 로컬 미니 시안 전용 — 배포판(origin/main)에는 없음. GNB "캘린더" 탭에서 연결된다.
export const dynamic = "force-dynamic";

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

function parseMonthParam(value: string | undefined, now: Date): { year: number; month: number } {
  const match = value?.match(/^(\d{4})-(\d{1,2})$/);
  if (match) {
    const year = Number(match[1]);
    const month = Number(match[2]);
    if (month >= 1 && month <= 12) return { year, month };
  }
  return { year: now.getFullYear(), month: now.getMonth() + 1 };
}

export default async function CalendarPage({
  searchParams,
}: {
  searchParams: { month?: string };
}) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;

  const now = new Date();
  const { year, month } = parseMonthParam(searchParams.month, now);

  const monthStart = new Date(year, month - 1, 1);
  const monthEnd = new Date(year, month, 0, 23, 59, 59, 999);

  const [jobs, savedJobsList] = await Promise.all([
    prisma.job.findMany({
      where: {
        archivedAt: null,
        // 상시채용(deadline 없음)은 애초에 이 범위 조건에 안 걸려서 자동으로 빠진다.
        applicationDeadline: { gte: monthStart, lte: monthEnd },
      },
      select: {
        id: true,
        title: true,
        companyName: true,
        companyLogo: true,
        role: true,
        applicationDeadline: true,
      },
      orderBy: { applicationDeadline: "asc" },
    }),
    userId
      ? prisma.savedJob.findMany({ where: { userId }, select: { jobId: true } })
      : Promise.resolve([]),
  ]);

  const savedIds = new Set(savedJobsList.map((s) => s.jobId));

  // "진행중인"(마감 안 지난) 공고만 남긴다. 상시채용도 위 쿼리에서 이미 빠지지만,
  // 명시적으로 한 번 더 걸러 의도를 코드로 남겨둔다.
  const activeJobs = jobs.filter(
    (job) => job.applicationDeadline && !getApplicationStatus(job.applicationDeadline).closed
  );

  const jobsByDay: Record<number, CalendarJobSummary[]> = {};
  for (const job of activeJobs) {
    const day = job.applicationDeadline!.getDate();
    const summary: CalendarJobSummary = {
      id: job.id,
      title: job.title,
      companyName: job.companyName,
      companyLogo: job.companyLogo,
      role: job.role,
      deadlineLabel: getApplicationStatus(job.applicationDeadline).label,
      saved: savedIds.has(job.id),
    };
    (jobsByDay[day] ??= []).push(summary);
  }

  // "{month}월 곧 마감되는 공고" 줄 — activeJobs는 이미 이번 달 안에서 마감일 오름차순으로
  // 정렬돼 있으니, 그 안에서 가장 빠른 마감일 몇 개만 뽑으면 된다(별도 쿼리 없이).
  const upcomingDeadlineJobs = activeJobs.slice(0, UPCOMING_DEADLINE_LIMIT).map((job) => ({
    id: job.id,
    title: job.title,
    companyName: job.companyName,
    companyLogo: job.companyLogo,
    deadlineLabel: getApplicationStatus(job.applicationDeadline).label,
    urgent: getApplicationStatus(job.applicationDeadline).urgent,
  }));

  const firstWeekday = monthStart.getDay();
  const daysInMonth = monthEnd.getDate();
  const prevMonthLastDate = new Date(year, month - 1, 0).getDate();

  const prevMonthDate = new Date(year, month - 2, 1);
  const nextMonthDate = new Date(year, month, 1);
  const prevMonthParam = `${prevMonthDate.getFullYear()}-${pad2(prevMonthDate.getMonth() + 1)}`;
  const nextMonthParam = `${nextMonthDate.getFullYear()}-${pad2(nextMonthDate.getMonth() + 1)}`;

  const isCurrentMonth = now.getFullYear() === year && now.getMonth() + 1 === month;
  const todayDate = isCurrentMonth ? now.getDate() : null;

  // 앞뒤 달 삐져나온 날짜도 옅게 같이 보여준다(빈 칸으로 안 비우고).
  const cells: WeekCell[] = [
    ...Array.from({ length: firstWeekday }, (_, i) => ({
      day: prevMonthLastDate - firstWeekday + i + 1,
      inCurrentMonth: false,
      isToday: false,
    })),
    ...Array.from({ length: daysInMonth }, (_, i) => ({
      day: i + 1,
      inCurrentMonth: true,
      isToday: todayDate === i + 1,
    })),
  ];
  let trailing = 1;
  while (cells.length % 7 !== 0) {
    cells.push({ day: trailing, inCurrentMonth: false, isToday: false });
    trailing += 1;
  }

  const weeks: WeekCell[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));

  return (
    <div className="flex w-full flex-col gap-5">
      <TrackPageView name="Calendar Viewed" props={{ year, month }} />

      <JobDeadlineCalendarGrid
        year={year}
        month={month}
        prevMonthParam={prevMonthParam}
        nextMonthParam={nextMonthParam}
        weeks={weeks}
        jobsByDay={jobsByDay}
        isLoggedIn={Boolean(userId)}
        upcomingDeadlineJobs={upcomingDeadlineJobs}
      />
    </div>
  );
}
