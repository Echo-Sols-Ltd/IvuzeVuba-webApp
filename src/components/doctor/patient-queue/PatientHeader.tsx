"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { getPatientChart, PatientChartData } from "@/lib/doctorApi";

interface PatientHeaderProps {
  appointmentId: string;
}

export default function PatientHeader({ appointmentId }: PatientHeaderProps) {
  const router = useRouter();
  const [chartData, setChartData] = useState<PatientChartData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        setLoading(true);
        const data = await getPatientChart(appointmentId);
        setChartData(data);
      } catch (error) {
        console.error('Error fetching chart data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (appointmentId) {
      fetchChartData();
    }
  }, [appointmentId]);

  const handleClick = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-between border-b bg-white px-6 py-3">
        <div className="flex items-center gap-3">
          <ArrowLeft className="w-5 h-5 cursor-pointer" onClick={handleClick} />
          <div>
            <h1 className="font-semibold">Loading...</h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between border-b bg-white px-6 py-3">
      <div className="flex items-center gap-3">
        <ArrowLeft className="w-5 h-5 cursor-pointer" onClick={handleClick} />
        <div>
          <h1 className="font-semibold">Patient Chart - {chartData?.patientName || 'Unknown Patient'}</h1>
          <p className="text-sm text-gray-500">#{appointmentId}</p>
        </div>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" size="sm">
          Save Draft
        </Button>
        <Button variant="outline" size="sm">
          Sign &amp; Submit
        </Button>
        <Button variant="outline" size="sm">
          Transfer
        </Button>
        <Button size="sm" className="bg-blue-600 text-white hover:bg-blue-700">
          Complete visit
        </Button>
      </div>
    </div>
  );
}
