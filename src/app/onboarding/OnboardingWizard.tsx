"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { clsx } from "clsx";
import { Button } from "@/components/Button";
import { ROLES, PLATFORMS, INDUSTRIES, STAGES } from "@/lib/constants";

const STEPS = [
  { key: "roles", question: "관심 직무를 선택해주세요", options: ROLES },
  { key: "platforms", question: "관심 플랫폼을 선택해주세요", options: PLATFORMS },
  { key: "industries", question: "관심 도메인을 선택해주세요", options: INDUSTRIES },
  { key: "stages", question: "목표 스테이지를 선택해주세요", options: STAGES },
] as const;

type Selections = Record<(typeof STEPS)[number]["key"], string[]>;

const EMPTY_SELECTIONS: Selections = {
  roles: [],
  platforms: [],
  industries: [],
  stages: [],
};

export function OnboardingWizard() {
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);
  const [selections, setSelections] = useState<Selections>(EMPTY_SELECTIONS);
  const [submitting, setSubmitting] = useState(false);

  const step = STEPS[stepIndex];
  const isLastStep = stepIndex === STEPS.length - 1;
  const selected = selections[step.key];

  const toggleOption = (option: string) => {
    setSelections((prev) => {
      const current = prev[step.key];
      const next = current.includes(option)
        ? current.filter((v) => v !== option)
        : [...current, option];
      return { ...prev, [step.key]: next };
    });
  };

  const savePreference = async (finalSelections: Selections) => {
    await fetch("/api/onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...finalSelections, emailOptIn: false }),
    });
  };

  const handleNext = async () => {
    if (!isLastStep) {
      setStepIndex((i) => i + 1);
      return;
    }
    setSubmitting(true);
    try {
      await savePreference(selections);
      router.push("/jobs?onboarded=1");
    } finally {
      setSubmitting(false);
    }
  };

  const handlePrev = () => {
    setStepIndex((i) => Math.max(0, i - 1));
  };

  const handleSkipAll = async () => {
    setSubmitting(true);
    try {
      await savePreference(EMPTY_SELECTIONS);
      router.push("/jobs");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex w-full max-w-content flex-col gap-8">
      <div className="flex items-center gap-1.5">
        {STEPS.map((s, i) => (
          <div
            key={s.key}
            className={clsx(
              "h-1 flex-1 rounded-full transition-colors",
              i <= stepIndex ? "bg-ink" : "bg-neutral-200"
            )}
          />
        ))}
      </div>

      <div className="flex flex-col gap-1">
        <p className="text-xs font-medium text-neutral-400">
          {stepIndex + 1} / {STEPS.length}
        </p>
        <h1 className="text-xl font-bold text-ink">{step.question}</h1>
        <p className="text-xs text-neutral-400">중복 선택 가능</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {step.options.map((option) => {
          const isSelected = selected.includes(option);
          return (
            <button
              key={option}
              type="button"
              onClick={() => toggleOption(option)}
              className={clsx(
                "rounded-full border px-4 py-2 text-sm font-medium transition-colors active:scale-[0.95]",
                isSelected
                  ? "border-primary bg-blue-50 text-primary"
                  : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300"
              )}
            >
              {option}
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between border-t border-neutral-100 pt-6">
        <div className="flex items-center gap-3">
          {stepIndex === 0 ? (
            <Button variant="tertiary" onClick={handleSkipAll} disabled={submitting}>
              나중에 설정하기
            </Button>
          ) : (
            <Button variant="ghost" onClick={handlePrev} disabled={submitting}>
              이전
            </Button>
          )}
        </div>
        <Button onClick={handleNext} disabled={submitting}>
          {isLastStep ? "완료" : "다음"}
        </Button>
      </div>
    </div>
  );
}
