"use client";

import { Button } from "@/components/Button";

export function LoginPromptModal({
  open,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6"
      onClick={onCancel}
    >
      <div
        className="flex w-full max-w-sm flex-col gap-6 rounded-2xl bg-white p-6 text-center shadow-sheet"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center gap-2">
          <h2 className="text-lg font-bold text-ink">로그인이 필요해요</h2>
          <p className="text-sm text-neutral-500">
            공고 저장, 기업 팔로우 같은 기능은
            <br />
            로그인 후 이용할 수 있어요. 지금 로그인하시겠어요?
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="tertiary" onClick={onCancel} className="flex-1">
            취소
          </Button>
          <Button onClick={onConfirm} className="flex-1">
            로그인하기
          </Button>
        </div>
      </div>
    </div>
  );
}
