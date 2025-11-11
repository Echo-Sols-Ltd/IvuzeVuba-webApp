"use client";

import Navbar from "@/components/doctor/Navbar";
import Sidebar from "@/components/doctor/Sidebar";
import React, { ReactNode } from "react";
import { usePathname } from "next/navigation";

const DoctorLayout = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();

  // Match only /doctor/patients/[patientId]
  const isPatientChart =
    /^\/doctor\/patients\/[^/]+$/.test(pathname || "");

  if (isPatientChart) {
    // Fullscreen layout without Navbar/Sidebar
    return <div className="h-screen w-screen bg-white">{children}</div>;
  }

  // Default Doctor layout with Navbar + Sidebar
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
