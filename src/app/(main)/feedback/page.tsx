import { ServiceFeedbackForm } from "@/components/ServiceFeedbackForm";

export default function FeedbackPage() {
  return (
    <div className="mx-auto flex w-full max-w-content flex-col gap-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-bold text-ink">서비스 의견</h1>
        <p className="text-sm text-neutral-400">
          UXUI Job을 이용하며 불편했던 점이나 있었으면 하는 기능을 자유롭게 남겨주세요.
          하나하나 꼼꼼히 읽고 서비스를 개선하는 데 반영할게요.
        </p>
      </div>
      <ServiceFeedbackForm />
    </div>
  );
}
