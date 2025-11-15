"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getDoctorQueue } from "@/lib/doctorApi";

const NextInQueue = () => {
  const [nextPatient, setNextPatient] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQueue = async () => {
      try {
        const queueData = await getDoctorQueue();
        // Get the first patient in queue
        if (queueData.length > 0) {
          setNextPatient(queueData[0]);
        }
      } catch (error) {
        console.error("Error fetching next in queue:", error);
        setNextPatient(null);
      } finally {
        setLoading(false);
      }
    };

    fetchQueue();
  }, []);

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
  const appointmentTime = nextPatient.appointmentTime 
    ? new Date(nextPatient.appointmentTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : "N/A";

  return (
    <div className="bg-white rounded-lg border p-4 shadow-sm w-[350px]">
      <h2 className="font-semibold mb-2">Next In queue</h2>

      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium">#{nextPatient.patientId || nextPatient.id}</span>
        {isUrgent && (
          <span className="text-xs border border-red-500 text-red-500 rounded-full px-2 py-0.5">
            urgent
          </span>
        )}
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

      <Link href={`/doctor/patients/${nextPatient.id}`}>
        <Button className="w-full bg-[#118CDB] text-white">View Details</Button>
      </Link>
    </div>
  );
};

export default NextInQueue;
