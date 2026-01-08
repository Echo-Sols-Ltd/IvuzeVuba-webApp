"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getDoctorQueue, updateAppointmentToConsultation } from "@/lib/doctorApi";
import { useToast } from "@/hooks/use-toast";
import ReferralModal from "./patient-queue/ReferralModal";

const TopQueue = () => {
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());
  const [showReferralModal, setShowReferralModal] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchQueue = async () => {
    try {
      const queueData = await getDoctorQueue();
      // Get top 3 patients
      setPatients(queueData.slice(0, 3));
    } catch (error) {
      console.error("Error fetching top queue:", error);
      setPatients([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  const handleStartConsultation = async (patientId: string, patientName: string) => {
    setProcessingIds(prev => new Set(prev).add(patientId));
    try {
      await updateAppointmentToConsultation(patientId);
      toast({
        title: "Success",
        description: `Consultation started for ${patientName}`,
      });
      fetchQueue(); // Refresh the queue
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start consultation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(patientId);
        return newSet;
      });
    }
  };

  const handleReferralSuccess = () => {
    setShowReferralModal(null);
    fetchQueue(); // Refresh the queue
  };

  return (
    <>
      <div className="bg-white rounded-lg border p-4 shadow-sm flex-1">
        <div className="flex justify-between items-center mb-2">
          <h2 className="font-semibold">Top Queue</h2>
          <Link href={`/doctor/patients`}>
            <button className="text-sm text-[#118CDB] hover:underline">View more</button>
          </Link>
        </div>
        <p className="text-sm text-gray-600 mb-4">Here are your top queues.</p>

        <div className="space-y-3">
          {loading ? (
            <p className="text-sm text-gray-500">Loading...</p>
          ) : patients.length > 0 ? (
            patients.map((p, idx) => {
              const isInConsultation = p.status === 'IN_CONSULTATION';
              const getStatusBadge = (status: string) => {
                switch (status) {
                  case 'IN_CONSULTATION':
                    return <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">🩺 In Consultation</span>;
                  case 'IN_QUEUE':
                    return <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">⏳ In Queue</span>;
                  case 'SCHEDULED':
                    return <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">📅 Scheduled</span>;
                  default:
                    return <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">{status}</span>;
                }
              };

              return (
                <div key={p.id || idx} className={`border rounded-lg p-3 flex justify-between items-center ${
                  isInConsultation ? 'border-green-300 bg-green-50' : ''
                }`}>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold">{p.patientName || "Unknown Patient"}</p>
                      {getStatusBadge(p.status)}
                    </div>
                    <p className="text-sm text-gray-600">{p.reason || "No description"}</p>
                    <p className="text-xs text-gray-500">position: {idx + 1}</p>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/doctor/patients/${p.id}`}>
                      <Button variant="outline" size="sm">View Details</Button>
                    </Link>
                    {isInConsultation ? (
                      <Button 
                        size="sm" 
                        className="bg-green-600 text-white hover:bg-green-700"
                        asChild
                      >
                        <Link href={`/doctor/patients/${p.id}`}>Continue</Link>
                      </Button>
                    ) : (
                      <Button 
                        size="sm" 
                        className="bg-[#118CDB] text-white"
                        onClick={() => handleStartConsultation(p.id, p.patientName)}
                        disabled={processingIds.has(p.id)}
                      >
                        {processingIds.has(p.id) ? "Starting..." : "Call In"}
                      </Button>
                    )}
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setShowReferralModal(p.id)}
                      disabled={isInConsultation}
                    >
                      Refer
                    </Button>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-sm text-gray-500">No patients in queue</p>
          )}
        </div>
      </div>

      {/* Referral Modal */}
      {showReferralModal && (
        <ReferralModal
          isOpen={!!showReferralModal}
          onClose={() => setShowReferralModal(null)}
          appointmentId={showReferralModal}
          patientName={patients.find(p => p.id === showReferralModal)?.patientName || "Patient"}
          onSuccess={handleReferralSuccess}
        />
      )}
    </>
  );
};

export default TopQueue;
