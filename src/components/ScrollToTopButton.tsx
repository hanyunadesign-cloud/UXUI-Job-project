"use client";

import { useEffect, useState } from "react";
import { ArrowUpIcon } from "@heroicons/react/24/outline";
import { clsx } from "clsx";

// 화면 높이 1개 분량 이상 내려갔을 때만 노출한다.
const SHOW_THRESHOLD_VH = 1;

export function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > window.innerHeight * SHOW_THRESHOLD_VH);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="맨 위로 가기"
      tabIndex={visible ? 0 : -1}
      className={clsx(
        "fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white shadow-dropdown transition-opacity duration-300 hover:bg-primary-strong active:scale-[0.92]",
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      )}
    >
      <ArrowUpIcon className="h-5 w-5" aria-hidden />
    </button>
  );
}
