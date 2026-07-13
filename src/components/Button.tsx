import { clsx } from "clsx";
import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "tertiary" | "ghost";

// SOCAR Frame 2.0의 ActionButton 위계를 차용: fill/primary(강조) · fill/secondary(연한 블루,
// 낮은 우선순위 확정 행동) · fill/tertiary(중립 회색, 취소/건너뛰기류) · 텍스트 전용(ghost).
// 라운드는 large 버튼 기준 14px(radius-350).
const variantClasses: Record<Variant, string> = {
  primary: "bg-primary text-white hover:bg-primary-strong disabled:bg-neutral-300",
  secondary:
    "bg-blue-100 text-primary-strong hover:bg-blue-200 disabled:bg-neutral-100 disabled:text-neutral-300",
  tertiary:
    "bg-neutral-100 text-ink hover:bg-neutral-200 disabled:text-neutral-300",
  ghost: "bg-transparent text-neutral-600 hover:text-ink disabled:text-neutral-300",
};

export function Button({
  variant = "primary",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-[14px] px-5 py-2.5 text-sm font-medium transition-colors active:scale-[0.92] disabled:cursor-not-allowed disabled:active:scale-100",
        variantClasses[variant],
        className
      )}
      {...props}
    />
  );
}
