import { ToastProvider } from "@/hooks/use-toast";

export default function ManagerRegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ToastProvider>
      {children}
    </ToastProvider>
  );
}