"use client";

import { useEffect, useState } from "react";
import PatientCard from "./PatientCard";
import { getDoctorQueue, QueuePatient } from "@/lib/doctorApi";
import LoadingSpinner from "@/components/LoadingSpinner";

interface QueuePatientLocal {
  id: string;
  name: string;
  description: string;
  serviceDate: string;
  imageUrl: string;
  urgent: boolean;
}

export default function PatientQueueList({
  search,
  selectedDate,
}: {
  search?: string;
  selectedDate?: Date;
}) {
  const [patients, setPatients] = useState<QueuePatientLocal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQueue = async () => {
      try {
        const queueData = await getDoctorQueue();
        // Transform API data to component format
        const transformedData: QueuePatientLocal[] = queueData.map((item: any) => ({
          id: item.id || item.appointmentId || "",
          name: item.patientName || "Unknown Patient",
          description: item.reason || item.chiefComplaint || "No description",
          serviceDate: item.appointmentTime || item.scheduledTime || new Date().toISOString(),
          imageUrl: item.patientImage || `https://i.pravatar.cc/150?u=${item.id}`,
          urgent: item.priority === "URGENT" || item.urgent || false,
        }));
        setPatients(transformedData);
      } catch (error) {
        console.error("Error fetching queue:", error);
        setPatients([]);
      } finally {
        setLoading(false);
      }
    };

    fetchQueue();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  // Filter patients
  const filteredPatients = patients.filter((p) => {
    const matchesSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());

    const matchesDate =
      !selectedDate ||
      new Date(p.serviceDate).toDateString() === selectedDate.toDateString();

    return matchesSearch && matchesDate;
  });

  return (
    <div className="space-y-4">
      <h3 className="text-base font-medium">Today</h3>
      {filteredPatients.length > 0 ? (
        filteredPatients.map((patient, idx) => (
          <PatientCard key={patient.id || idx} patient={{ ...patient, image: patient.imageUrl }} />
        ))
      ) : (
        <p className="text-gray-500">No patients match your filters.</p>
      )}
    </div>
  );
}
