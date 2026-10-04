import { Header } from "@/components/Header";
import { ToastProvider } from "@/components/ToastProvider";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <Header />
      <div className="mx-auto w-full px-4 py-10 sm:px-6 lg:max-w-[1440px] lg:px-16 xl:max-w-[1400px] xl:px-16 3xl:max-w-[1700px] 3xl:px-24">
        {children}
      </div>
    </ToastProvider>
  );
}
