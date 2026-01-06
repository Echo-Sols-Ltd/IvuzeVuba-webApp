"use client";

import Navbar from "@/components/doctor/Navbar";
import Sidebar from "@/components/manager/Sidebar";
import React, { ReactNode, Suspense } from "react";
import { usePathname } from "next/navigation";
import LoadingSpinner from "@/components/LoadingSpinner";
import { ToastProvider } from "@/hooks/use-toast";

const ManagerLayout = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();

  // Exclude auth pages and registration page from dashboard layout
  const isAuthPage = pathname?.startsWith("/manager/auth");
  const isRegisterPage = pathname === "/manager/register";

  if (isAuthPage || isRegisterPage) {
    // Auth and registration pages without layout
    return <>{children}</>;
  }

  // Default Manager layout with Navbar + Sidebar
  return (
    <ToastProvider>
      <div className="h-screen flex flex-col">
        <div className="fixed top-0 w-full z-50"> 
          <Navbar />
        </div>

        <div className="flex flex-1 mt-0.5">
          <div className="fixed left-0 top-12 bottom-0 z-40">
            <Sidebar />
          </div>
          <main className="ml-64 mt-12 flex-1 overflow-y-auto p-4">
            <Suspense fallback={<LoadingSpinner />}>
              {children}
            </Suspense>
          </main>
        </div>
      </div>
    </ToastProvider>
  );
};

export default ManagerLayout;
