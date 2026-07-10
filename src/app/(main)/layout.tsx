import { Header } from "@/components/Header";
import { ToastProvider } from "@/components/ToastProvider";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <Header />
      <div className="mx-auto w-full px-4 py-10 sm:px-6 lg:max-w-[1440px] lg:px-8 3xl:max-w-[1760px] 3xl:px-16">
        {children}
      </div>
    </ToastProvider>
  );
}
