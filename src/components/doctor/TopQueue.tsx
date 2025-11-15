"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getDoctorQueue } from "@/lib/doctorApi";

const TopQueue = () => {
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

    fetchQueue();
  }, []);

  return (
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
          patients.map((p, idx) => (
            <div key={p.id || idx} className="border rounded-lg p-3 flex justify-between items-center">
              <div>
                <p className="font-semibold">{p.patientName || "Unknown Patient"}</p>
                <p className="text-sm text-gray-600">{p.reason || "No description"}</p>
                <p className="text-xs text-gray-500">position: {idx + 1}</p>
              </div>
              <div className="flex gap-2">
                <Link href={`/doctor/patients/${p.id}`}>
                  <Button variant="outline" size="sm">View Details</Button>
                </Link>
                <Button size="sm" className="bg-[#118CDB] text-white">Call In</Button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">No patients in queue</p>
        )}
      </div>
    </div>
  );
};

export default TopQueue;
