import ManagerRegistrationWizard from "@/components/manager/ManagerRegistrationWizard";
import { ToastProvider } from "@/hooks/use-toast";

export default function RegisterManagerPage() {
  return (
    <ToastProvider>
      <ManagerRegistrationWizard />
    </ToastProvider>
  );
}