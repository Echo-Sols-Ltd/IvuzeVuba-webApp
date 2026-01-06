"use client";

import Navbar from "@/components/doctor/Navbar";
import PatientSidebar from "@/components/patient/PatientSidebar";
import React, { ReactNode, Suspense } from "react";
import { usePathname } from "next/navigation";
import LoadingSpinner from "@/components/LoadingSpinner";
import { ToastProvider } from "@/hooks/use-toast";
import { NotificationProvider } from "@/contexts/NotificationContext";

const PatientLayout = ({ children }: { children: ReactNode }) => {
    const pathname = usePathname();

    // Exclude auth pages from dashboard layout
    const isAuthPage = pathname?.startsWith("/patient/auth");

    if (isAuthPage) {
        // Auth pages without layout
        return <>{children}</>;
    }

    // Default Patient layout with Navbar + Sidebar
    return (
        <NotificationProvider>
            <ToastProvider>
                <div className="h-screen flex flex-col">
                    <div className="fixed top-0 w-full z-50">
                        <Navbar />
                    </div>
                    <div className="flex flex-1 mt-0.5">
                        <div className="fixed left-0 top-12 bottom-0 z-40">
                            <PatientSidebar />
                        </div>
                        <main className="ml-0 md:ml-64 mt-12 flex-1 overflow-y-auto p-4">
                            <Suspense fallback={<LoadingSpinner />}>
                                {children}
                            </Suspense>
                        </main>
                    </div>
                </div>
            </ToastProvider>
        </NotificationProvider>
    );
};

export default PatientLayout;
