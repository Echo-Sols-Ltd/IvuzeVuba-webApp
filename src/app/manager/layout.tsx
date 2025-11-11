"use client";

import Navbar from "@/components/doctor/Navbar";
import Sidebar from "@/components/manager/Sidebar";
import React, { ReactNode } from "react";
import { usePathname } from "next/navigation";

const DoctorLayout = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();

  // Exclude auth pages from dashboard layout
  const isAuthPage = pathname?.startsWith("/manager/auth");

  if (isAuthPage) {
    // Auth pages without layout
    return <>{children}</>;
  }

  // Default Manager layout with Navbar + Sidebar
  return (
    <div className="h-screen flex flex-col">
      <div className="fixed top-0 w-full"> 
        <Navbar />
      </div>

      <div className="flex flex-1 mt-0.5">
        <div className="fixed left-0 top-12 bottom-0">
          <Sidebar />
        </div>
        <main className="ml-64 mt-12 flex-1 overflow-y-auto p-4">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DoctorLayout;
