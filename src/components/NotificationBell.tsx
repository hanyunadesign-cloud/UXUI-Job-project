"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { clsx } from "clsx";
import { BellIcon } from "@heroicons/react/24/outline";
import { trackEvent } from "@/lib/analytics";

type NotificationItem = {
  id: string;
  companyId: string;
  companyName: string;
  jobId: string | null;
  jobTitle: string | null;
  count: number;
  read: boolean;
  createdAt: string;
};

function relativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "방금 전";
  if (minutes < 60) return `${minutes}분 전`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}시간 전`;
  const days = Math.floor(hours / 24);
  return `${days}일 전`;
}

export function NotificationBell() {
  const router = useRouter();
  const { status } = useSession();
  const isLoggedIn = status === "authenticated";
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications");
      if (!res.ok) return;
      const data = await res.json();
      setItems(data.notifications);
      setUnreadCount(data.unreadCount);
    } catch {
      // 조용히 무시: 알림 로드 실패가 페이지 이용을 막으면 안 된다.
    }
  };

  useEffect(() => {
    if (isLoggedIn) fetchNotifications();
  }, [isLoggedIn]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isLoggedIn) return null;

  const openDropdown = () => {
    const next = !isOpen;
    setIsOpen(next);
    if (next) {
      trackEvent("Notification Bell Clicked", { unreadCount });
      fetchNotifications();
    }
  };

  const handleItemClick = async (item: NotificationItem) => {
    setIsOpen(false);
    trackEvent("Notification Item Clicked", {
      companyId: item.companyId,
      jobId: item.jobId,
      wasUnread: !item.read,
    });
    if (!item.read) {
      setItems((prev) => prev.map((n) => (n.id === item.id ? { ...n, read: true } : n)));
      setUnreadCount((prev) => Math.max(0, prev - 1));
      fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationId: item.id }),
      }).catch(() => {});
    }
    router.push(item.jobId ? `/jobs/${item.jobId}` : `/companies/${item.companyId}`);
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={openDropdown}
        aria-label="알림"
        className="relative flex h-9 w-9 items-center justify-center text-neutral-500 transition-colors hover:text-ink"
      >
        <BellIcon className="h-6 w-6" aria-hidden />
        {unreadCount > 0 && (
          <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-negative px-1 text-[10px] font-semibold leading-none text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-[calc(100%+8px)] z-20 flex max-h-96 w-80 flex-col overflow-y-auto rounded-2xl border border-neutral-200 bg-white p-2 shadow-dropdown">
          {items.length === 0 ? (
            <p className="px-3 py-6 text-center text-sm text-neutral-400">
              아직 알림이 없어요
            </p>
          ) : (
            items.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleItemClick(item)}
                className={clsx(
                  "flex flex-col gap-0.5 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-neutral-50",
                  !item.read && "bg-neutral-50"
                )}
              >
                <div className="flex items-center gap-1.5">
                  {!item.read && (
                    <span aria-hidden className="h-1.5 w-1.5 shrink-0 rounded-full bg-negative" />
                  )}
                  <p className="truncate text-sm font-semibold text-ink">{item.companyName}</p>
                </div>
                <p className="line-clamp-2 text-xs text-neutral-500">
                  {item.count > 1
                    ? `새 공고 ${item.count}건을 등록했어요`
                    : item.jobTitle}
                </p>
                <p className="text-[11px] text-neutral-300">{relativeTime(item.createdAt)}</p>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
