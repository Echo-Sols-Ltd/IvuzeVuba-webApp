import PatientHeader from "@/components/doctor/patient-queue/PatientHeader";
import PatientSidebar from "@/components/doctor/patient-queue/PatientSidebar";
import PatientTabs from "@/components/doctor/patient-queue/PatientTabs";

export default function PatientChartPage() {
  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <PatientHeader />

      {/* Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 border-r p-4 bg-white">
          <PatientSidebar />
        </div>

        {/* Main Section */}
        <div className="flex-1 p-6 overflow-y-auto">
          <PatientTabs />
        </div>
      </div>
    </div>
  );
}
