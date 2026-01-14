"use client";

import { useEffect, useState } from "react";
import { getPatientChart, PatientChartData } from "@/lib/doctorApi";

interface TodayVisitCardProps {
  appointmentId: string;
}

export default function TodayVisitCard({ appointmentId }: TodayVisitCardProps) {
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

  if (loading) {
    return (
      <div className="bg-white rounded-lg border shadow-sm p-4 w-80">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-32 mb-3"></div>
          <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  if (!chartData) {
    return (
      <div className="bg-white rounded-lg border shadow-sm p-4 w-80">
        <h3 className="font-semibold mb-3">Today&apos;s Visit</h3>
        <p className="text-sm text-gray-500">No visit data available</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border shadow-sm p-4 w-80">
      <h3 className="font-semibold mb-3">Today&apos;s Visit</h3>
      <p className="text-sm">
        <span className="font-medium">Patient</span>: {chartData.patientName}
      </p>
      <p className="text-sm mt-2">
        <span className="font-medium">Reason</span>: {chartData.reason || 'Not specified'}
      </p>
      {chartData.departmentName && (
        <p className="text-sm mt-2">
          <span className="font-medium">Department</span>: {chartData.departmentName}
        </p>
      )}
      <p className="text-sm mt-2">
        <span className="font-medium">Status</span>: 
        <span className={`ml-1 capitalize ${
          chartData.status === 'URGENT' ? 'text-red-600' : 
          chartData.status === 'IN_PROGRESS' ? 'text-blue-600' : 
          'text-gray-600'
        }`}>
          {chartData.status.toLowerCase().replace('_', ' ')}
        </span>
      </p>
      {chartData.appointmentDate && (
        <p className="text-sm mt-2">
          <span className="font-medium">Date</span>: {new Date(chartData.appointmentDate).toLocaleDateString()}
        </p>
      )}
    </div>
  );
}
