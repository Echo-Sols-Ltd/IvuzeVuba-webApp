"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import AssignDoctorModal from "@/components/modals/AssignDoctorModal";
import UnassignDoctorModal from "@/components/modals/UnassignDoctorModal";
import NotifyDoctorModal from "@/components/modals/NotifyDoctorModal";

interface QueueCardProps {
  appointmentId: string;
  name: string;
  id: string;
  description: string;
  serviceDate: string;
  imageUrl: string;
  departmentName: string;
  status?: string;
  assignedDoctorName?: string;
  onRefresh?: () => void;
}

export default function QueueCard({ 
  appointmentId,
  name, 
  id, 
  description, 
  serviceDate, 
  imageUrl, 
  departmentName,
  status,
  assignedDoctorName,
  onRefresh
}: QueueCardProps) {
  const getStatusBadge = (status?: string) => {
    if (!status) {
      return (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          UNKNOWN
        </span>
      );
    }
    
    const statusColors: Record<string, string> = {
      SCHEDULED: "bg-blue-100 text-blue-800",
      IN_QUEUE: "bg-yellow-100 text-yellow-800",
      IN_CONSULTATION: "bg-green-100 text-green-800",
      COMPLETED: "bg-gray-100 text-gray-800",
      CANCELLED: "bg-red-100 text-red-800",
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status] || "bg-gray-100 text-gray-800"}`}>
        {status.replace(/_/g, " ")}
      </span>
    );
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Image 
            src={imageUrl || "/man.png"} 
            alt={name ? `${name} profile picture` : "Patient profile picture"} 
            width={40} 
            height={40} 
            className="rounded-full object-cover"
            onError={(e) => {
              e.currentTarget.src = "/man.png";
            }}
          />
          <div>
            <CardTitle className="text-lg">{name || "Unknown Patient"}</CardTitle>
            <p className="text-muted-foreground text-sm">ID: {id ? id.substring(0, 8) + "..." : "N/A"}</p>
          </div>
        </div>
        {getStatusBadge(status)}
      </CardHeader>

      <CardContent className="flex justify-between items-center">
        <div className="space-y-1">
          <p><span className="font-medium">Reason:</span> {description}</p>
          <p><span className="font-medium">Department:</span> {departmentName}</p>
          <p><span className="font-medium">Service Date:</span> {new Date(serviceDate).toLocaleDateString()}</p>
          {assignedDoctorName && (
            <p><span className="font-medium">Assigned Doctor:</span> {assignedDoctorName}</p>
          )}
        </div>

        {/* Buttons with modals */}
        <div className="flex gap-2">
          {assignedDoctorName ? (
            <UnassignDoctorModal 
              appointmentId={appointmentId}
              patientName={name}
              assignedDoctorName={assignedDoctorName}
              onRefresh={onRefresh}
            />
          ) : (
            <AssignDoctorModal 
              appointmentId={appointmentId}
              patientName={name} 
              onRefresh={onRefresh}
            />
          )}
          <NotifyDoctorModal 
            appointmentId={appointmentId}
            patientName={name}
            onRefresh={onRefresh}
          />
        </div>
      </CardContent>
    </Card>
  );
}
