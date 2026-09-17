"use client";

import { useState } from "react";
import { useToast } from "@/components/ToastProvider";
import { LoginPromptModal } from "@/components/LoginPromptModal";
import { OnboardingSuccessModal } from "@/app/(main)/jobs/OnboardingSuccessModal";
import { Button } from "@/components/Button";

// 로컬 전용 진열장: 새 팝업을 만드는 게 아니라, 지금 서비스에 실제로 존재하는
// 모달/토스트를 코드 그대로 재사용해서 한 화면에서 눌러볼 수 있게 모아둔 페이지다.
// 각 버튼 = 실제 컴포넌트가 실제 서비스에서 뜨는 시점과 문구.

function Section({ title, where, children }: { title: string; where: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-neutral-200 bg-white p-4">
      <p className="text-sm font-semibold text-ink">{title}</p>
      <p className="text-xs text-neutral-400">{where}</p>
      <div className="flex flex-wrap gap-2 pt-1">{children}</div>
    </div>
  );
}

export default function PopupsPreviewPage() {
  const showToast = useToast();
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [onboardingModalKey, setOnboardingModalKey] = useState(0);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-bold text-ink">알림 팝업 모아보기 (로컬 전용)</h1>
      <p className="text-sm text-neutral-500">
        지금 서비스에 실제로 있는 팝업/토스트를 그대로 눌러볼 수 있게 모아둔 페이지예요.
        새로 디자인한 건 없고, 전부 기존 컴포넌트를 그대로 불러온 거예요.
      </p>

      <div className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-neutral-500">모달 (화면 전체를 덮는 팝업)</h2>

        <Section title="로그인 유도 모달" where="비로그인 상태로 저장/팔로우 시도 시 (LoginPromptModal)">
          <Button variant="secondary" onClick={() => setLoginModalOpen(true)}>
            띄우기
          </Button>
        </Section>

        <Section title="온보딩 완료 모달" where="온보딩 마치고 /jobs?onboarded=1로 들어올 때 (OnboardingSuccessModal)">
          <Button variant="secondary" onClick={() => setOnboardingModalKey((k) => k + 1)}>
            띄우기
          </Button>
        </Section>
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-neutral-500">토스트 (화면 상단에 잠깐 뜨는 알림, 2.5초)</h2>

        <Section title="공고 저장 / 저장 해제" where="채용공고 카드의 저장(북마크) 버튼 (SaveButton)">
          <Button variant="secondary" onClick={() => showToast("공고가 저장되었습니다", { label: "보러가기", href: "/mypage" })}>
            저장했을 때
          </Button>
          <Button variant="secondary" onClick={() => showToast("공고가 해제되었습니다")}>
            해제했을 때
          </Button>
        </Section>

        <Section title="기업 관심 등록 / 해제" where="기업 페이지의 관심기업 버튼 (FollowButton)">
          <Button variant="secondary" onClick={() => showToast("관심기업으로 등록했어요")}>
            등록했을 때
          </Button>
          <Button variant="secondary" onClick={() => showToast("관심기업에서 해제했어요")}>
            해제했을 때
          </Button>
        </Section>

        <Section title="기업 팔로우 / 해제 (다른 위치)" where="기업 목록 카드의 팔로우 아이콘 (CompanyFollowIcon)">
          <Button variant="secondary" onClick={() => showToast("이 기업을 팔로우했어요")}>
            팔로우했을 때
          </Button>
          <Button variant="secondary" onClick={() => showToast("팔로우를 취소했어요")}>
            취소했을 때
          </Button>
        </Section>

        <Section title="외부 링크 공고 저장" where="마이페이지 '채용공고 링크 붙여넣기' (ExternalJobAddRow)">
          <Button variant="secondary" onClick={() => showToast("공고를 분석해서 저장했어요")}>
            분석 성공
          </Button>
          <Button variant="secondary" onClick={() => showToast("링크를 분석하지 못했어요.")}>
            분석 실패
          </Button>
        </Section>

        <Section title="외부 링크 공고 삭제" where="마이페이지에서 링크로 저장한 공고 삭제 (ExternalJobCard)">
          <Button variant="secondary" onClick={() => showToast("저장한 링크를 삭제했어요")}>
            삭제 성공
          </Button>
          <Button variant="secondary" onClick={() => showToast("삭제하지 못했어요. 다시 시도해주세요.")}>
            삭제 실패
          </Button>
        </Section>

        <Section title="서비스 의견 전송" where="/feedback 페이지 의견 보내기 폼 (ServiceFeedbackForm)">
          <Button variant="secondary" onClick={() => showToast("의견이 전달됐어요. 감사해요!")}>
            전송 성공
          </Button>
          <Button variant="secondary" onClick={() => showToast("전송에 실패했어요. 다시 시도해주세요")}>
            전송 실패
          </Button>
        </Section>

        <Section title="후보 공고 승인/거절 (관리자)" where="/admin/candidates 페이지 (CandidateJobActions)">
          <Button variant="secondary" onClick={() => showToast("공고를 발행했어요")}>
            승인
          </Button>
          <Button variant="secondary" onClick={() => showToast("공고를 거절했어요")}>
            거절
          </Button>
          <Button variant="secondary" onClick={() => showToast("처리에 실패했어요. 다시 시도해주세요")}>
            처리 실패
          </Button>
        </Section>
      </div>

      <LoginPromptModal
        open={loginModalOpen}
        onCancel={() => setLoginModalOpen(false)}
        onConfirm={() => setLoginModalOpen(false)}
      />
      {onboardingModalKey > 0 && <OnboardingSuccessModal key={onboardingModalKey} initialOpen />}
    </div>
  );
}
