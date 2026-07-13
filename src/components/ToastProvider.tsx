"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Link from "next/link";
import { CheckIcon } from "@heroicons/react/24/outline";

type ToastAction = { label: string; href: string };
type ToastState = { id: number; message: string; action?: ToastAction } | null;
type ShowToast = (message: string, action?: ToastAction) => void;

const ToastContext = createContext<ShowToast | null>(null);

const DISPLAY_MS = 2500;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastState>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const idRef = useRef(0);

  // 연속 클릭 시 메시지가 쌓이지 않고 최신 상태로 즉시 교체되도록 항상 단일 슬롯만 사용한다.
  const showToast = useCallback<ShowToast>((message, action) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    idRef.current += 1;
    setToast({ id: idRef.current, message, action });
    timerRef.current = setTimeout(() => setToast(null), DISPLAY_MS);
  }, []);

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 top-16 z-50 flex justify-center px-4">
        {toast && (
          <div className="pointer-events-auto flex w-80 items-center gap-3 rounded-2xl bg-ink px-5 py-3.5 text-sm text-white shadow-sheet">
            <span
              aria-hidden
              className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white text-ink"
            >
              <CheckIcon className="h-4 w-4" strokeWidth={2.5} />
            </span>
            <span>{toast.message}</span>
            {toast.action && (
              <Link
                href={toast.action.href}
                className="ml-auto shrink-0 text-xs font-normal text-neutral-300 hover:text-white"
              >
                {toast.action.label}
              </Link>
            )}
          </div>
        )}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ShowToast {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
