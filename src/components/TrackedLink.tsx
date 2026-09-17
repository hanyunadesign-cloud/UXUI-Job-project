"use client";

import Link, { type LinkProps } from "next/link";
import type { ReactNode } from "react";
import { trackEvent } from "@/lib/analytics";

// 서버 컴포넌트 안에서 순수 <Link>로는 클릭을 못 남기는 자리에 쓰는 범용 래퍼.
// ExternalSourceLinkButton.tsx/PreferenceEditLink.tsx와 같은 패턴이지만, 매번
// 전용 컴포넌트를 새로 만들지 않아도 되게 이벤트 이름/props를 인자로 받는다.
export function TrackedLink({
  href,
  eventName,
  eventProps,
  className,
  children,
}: {
  href: LinkProps["href"];
  eventName: string;
  eventProps?: Record<string, unknown>;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link href={href} className={className} onClick={() => trackEvent(eventName, eventProps)}>
      {children}
    </Link>
  );
}
