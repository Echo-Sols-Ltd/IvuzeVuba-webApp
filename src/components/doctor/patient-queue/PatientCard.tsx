"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { updateAppointmentToConsultation } from "@/lib/doctorApi";
import ReferralModal from "./ReferralModal";

interface PatientCardProps {
  patient: {
    id: string;
    name: string;
    description: string;
    serviceDate: string;
    urgent: boolean;
    image: string;
    status: string; // Add status field
  };
  onRefresh?: () => void;
}

export default function PatientCard({ patient, onRefresh }: PatientCardProps) {
  const [isStartingConsultation, setIsStartingConsultation] = useState(false);
  const [showReferralModal, setShowReferralModal] = useState(false);
  const { toast } = useToast();

  const handleStartConsultation = async () => {
    setIsStartingConsultation(true);
    try {
      await updateAppointmentToConsultation(patient.id);
      toast({
        title: "Success",
        description: `Consultation started for ${patient.name}`,
      });
      onRefresh?.(); // Refresh the queue list
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start consultation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsStartingConsultation(false);
    }
  };

  const handleReferralSuccess = () => {
    setShowReferralModal(false);
    onRefresh?.(); // Refresh the queue list
  };

  // Get status display info
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'IN_CONSULTATION':
        return {
          label: 'In Consultation',
          className: 'bg-green-100 text-green-700 border-green-200',
          icon: '🩺'
        };
      case 'IN_QUEUE':
        return {
          label: 'In Queue',
          className: 'bg-yellow-100 text-yellow-700 border-yellow-200',
          icon: '⏳'
        };
      case 'SCHEDULED':
        return {
          label: 'Scheduled',
          className: 'bg-blue-100 text-blue-700 border-blue-200',
          icon: '📅'
        };
      case 'REFERRED':
        return {
          label: 'Referred',
          className: 'bg-purple-100 text-purple-700 border-purple-200',
          icon: '↗️'
        };
      default:
        return {
          label: status,
          className: 'bg-gray-100 text-gray-700 border-gray-200',
          icon: '📋'
        };
    }
  };

  const statusInfo = getStatusInfo(patient.status);
  const isInConsultation = patient.status === 'IN_CONSULTATION';

  return (
    <>
      <div className={`bg-white rounded-lg border p-4 shadow-sm flex items-start justify-between ${
        isInConsultation ? 'border-green-300 bg-green-50' : ''
      }`}>
        {/* Patient Info */}
        <div className="flex items-start gap-3">
          <Image
            src={patient.image || "/placeholder-avatar.png"}
            alt="Patient Avatar"
            width={48}
            height={48}
            className="rounded-full"
          />
          <div>
            <div className="flex items-center gap-2 mb-1">
              <p className="font-medium">{patient.name}</p>
              <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full border ${statusInfo.className}`}>
                <span>{statusInfo.icon}</span>
                {statusInfo.label}
              </span>
            </div>
            <p className="text-sm text-gray-500">Appointment #{patient.id.substring(0, 8)}</p>
            <p className="text-sm text-gray-700">
              Description: {patient.description}
            </p>
            <p className="text-sm text-gray-500">
              Service Date: {new Date(patient.serviceDate).toLocaleDateString()}
            </p>
            {patient.urgent && (
              <span className="mt-1 inline-block bg-red-100 text-red-600 text-xs font-medium px-2 py-0.5 rounded">
                urgent
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          <Link href={`/doctor/patients/${patient.id}`} className="block w-full">
            <Button variant="outline" size="sm">
              Open Chart
            </Button>
          </Link>
          
          {isInConsultation ? (
            <Button
              className="bg-green-600 text-white hover:bg-green-700"
              size="sm"
              asChild
            >
              <Link href={`/doctor/patients/${patient.id}`}>
                Continue Consultation
              </Link>
            </Button>
          ) : (
            <Button
              className="bg-[#616161] text-white hover:bg-opacity-80"
              size="sm"
              onClick={handleStartConsultation}
              disabled={isStartingConsultation}
            >
              {isStartingConsultation ? "Starting..." : "Start Consultation"}
            </Button>
          )}
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowReferralModal(true)}
            disabled={isInConsultation}
          >
            Refer
          </Button>
        </div>
      </div>

      {/* Referral Modal */}
      <ReferralModal
        isOpen={showReferralModal}
        onClose={() => setShowReferralModal(false)}
        appointmentId={patient.id}
        patientName={patient.name}
        onSuccess={handleReferralSuccess}
      />
    </>
  );
}
