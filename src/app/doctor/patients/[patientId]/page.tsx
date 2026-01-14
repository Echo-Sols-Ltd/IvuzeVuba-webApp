"use client";

import { useParams } from "next/navigation";
import PatientHeader from "@/components/doctor/patient-queue/PatientHeader";
import PatientSidebar from "@/components/doctor/patient-queue/PatientSidebar";
import PatientTabs from "@/components/doctor/patient-queue/PatientTabs";

export default function PatientChartPage() {
  const params = useParams();
  const appointmentId = params.patientId as string;

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <PatientHeader appointmentId={appointmentId} />

      {/* Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 border-r p-4 bg-white">
          <PatientSidebar appointmentId={appointmentId} />
        </div>

        {/* Main Section */}
        <div className="flex-1 p-6 overflow-y-auto">
          <PatientTabs appointmentId={appointmentId} />
        </div>
      </div>
    </div>
  );
}
