"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getDoctorQueue, updateAppointmentToConsultation } from "@/lib/doctorApi";
import { useToast } from "@/hooks/use-toast";
import ReferralModal from "./patient-queue/ReferralModal";

const NextInQueue = () => {
  const [nextPatient, setNextPatient] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isStartingConsultation, setIsStartingConsultation] = useState(false);
  const [showReferralModal, setShowReferralModal] = useState(false);
  const { toast } = useToast();

  const fetchQueue = async () => {
    try {
      const queueData = await getDoctorQueue();
      // Get the first patient in queue
      if (queueData.length > 0) {
        setNextPatient(queueData[0]);
      } else {
        setNextPatient(null);
      }
    } catch (error) {
      console.error("Error fetching next in queue:", error);
      setNextPatient(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  const handleStartConsultation = async () => {
    if (!nextPatient) return;
    
    setIsStartingConsultation(true);
    try {
      await updateAppointmentToConsultation(nextPatient.id);
      toast({
        title: "Success",
        description: `Consultation started for ${nextPatient.patientName}`,
      });
      fetchQueue(); // Refresh to get next patient
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
    fetchQueue(); // Refresh to get next patient
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border p-4 shadow-sm w-[350px]">
        <h2 className="font-semibold mb-2">Next In queue</h2>
        <p className="text-sm text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!nextPatient) {
    return (
      <div className="bg-white rounded-lg border p-4 shadow-sm w-[350px]">
        <h2 className="font-semibold mb-2">Next In queue</h2>
        <p className="text-sm text-gray-500">No patients in queue</p>
      </div>
    );
  }

  const isUrgent = nextPatient.priority === "URGENT" || nextPatient.urgent;
  const isInConsultation = nextPatient.status === 'IN_CONSULTATION';
  const appointmentTime = nextPatient.appointmentTime 
    ? new Date(nextPatient.appointmentTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : "N/A";

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'IN_CONSULTATION':
        return <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full border border-green-200">🩺 In Consultation</span>;
      case 'IN_QUEUE':
        return <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full border border-yellow-200">⏳ In Queue</span>;
      case 'SCHEDULED':
        return <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200">📅 Scheduled</span>;
      default:
        return <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full border border-gray-200">{status}</span>;
    }
  };

  return (
    <>
      <div className={`bg-white rounded-lg border p-4 shadow-sm w-[350px] ${
        isInConsultation ? 'border-green-300 bg-green-50' : ''
      }`}>
        <h2 className="font-semibold mb-2">Next In queue</h2>

        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Appointment #{nextPatient.id ? nextPatient.id.substring(0, 8) : 'N/A'}</span>
          <div className="flex gap-2">
            {getStatusBadge(nextPatient.status)}
            {isUrgent && (
              <span className="text-xs border border-red-500 text-red-500 rounded-full px-2 py-0.5">
                urgent
              </span>
            )}
          </div>
        </div>

        <p className="text-xs text-gray-500 mb-2">{appointmentTime}</p>
        <p className="text-sm">
          <span className="font-semibold">Names: </span>
          {nextPatient.patientName || "Unknown Patient"}
        </p>
        <p className="text-sm mb-4">
          <span className="font-semibold">Description: </span>
          {nextPatient.reason || nextPatient.chiefComplaint || "No description"}
        </p>

        <div className="space-y-2">
          <Link href={`/doctor/patients/${nextPatient.id}`}>
            <Button className="w-full bg-[#118CDB] text-white">View Details</Button>
          </Link>
          
          {isInConsultation ? (
            <Button 
              className="w-full bg-green-600 text-white hover:bg-green-700"
              asChild
            >
              <Link href={`/doctor/patients/${nextPatient.id}`}>
                Continue Consultation
              </Link>
            </Button>
          ) : (
            <Button 
              className="w-full bg-green-600 text-white hover:bg-green-700"
              onClick={handleStartConsultation}
              disabled={isStartingConsultation}
            >
              {isStartingConsultation ? "Starting..." : "Start Consultation"}
            </Button>
          )}
          
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => setShowReferralModal(true)}
            disabled={isInConsultation}
          >
            Refer Patient
          </Button>
        </div>
      </div>

      {/* Referral Modal */}
      <ReferralModal
        isOpen={showReferralModal}
        onClose={() => setShowReferralModal(false)}
        appointmentId={nextPatient.id}
        patientName={nextPatient.patientName || "Patient"}
        onSuccess={handleReferralSuccess}
      />
    </>
  );
};

export default NextInQueue;
