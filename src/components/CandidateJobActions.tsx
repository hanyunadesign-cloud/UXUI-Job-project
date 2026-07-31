"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import { useToast } from "@/components/ToastProvider";

export function CandidateJobActions({ candidateId }: { candidateId: string }) {
  const router = useRouter();
  const showToast = useToast();
  const [isPending, startTransition] = useTransition();
  const [resolved, setResolved] = useState(false);

  const act = (action: "approve" | "reject") => {
    startTransition(async () => {
      try {
        const res = await fetch(`/api/admin/candidate-jobs/${candidateId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action }),
        });
        if (!res.ok) throw new Error("failed");
        setResolved(true);
        showToast(action === "approve" ? "공고를 발행했어요" : "공고를 거절했어요");
        router.refresh();
      } catch {
        showToast("처리에 실패했어요. 다시 시도해주세요");
      }
    });
  };

  if (resolved) return null;

  return (
    <div className="flex gap-2">
      <Button variant="tertiary" disabled={isPending} onClick={() => act("reject")}>
        거절
      </Button>
      <Button disabled={isPending} onClick={() => act("approve")}>
        승인
      </Button>
    </div>
  );
}
