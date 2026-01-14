"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { getPatientChart, PatientChartData } from "@/lib/doctorApi";

interface PatientSidebarProps {
  appointmentId: string;
}

export default function PatientSidebar({ appointmentId }: PatientSidebarProps) {
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
      <div className="space-y-6">
        <div className="text-center">
          <div className="animate-pulse">
            <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto"></div>
            <div className="h-4 bg-gray-200 rounded mt-2 w-32 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!chartData) {
    return (
      <div className="space-y-6">
        <div className="text-center text-gray-500">
          <p>No patient data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Patient Info */}
      <div className="text-center">
        <Image
          src="/man.png"
          alt="Patient"
          width={96}
          height={96}
          className="rounded-full mx-auto"
        />
        <h2 className="font-semibold mt-2">{chartData.patientName}</h2>
        <p className="text-sm text-gray-500">#{appointmentId}</p>
      </div>

      {/* Contact Info */}
      <div>
        <h3 className="font-medium mb-2">Contact Information</h3>
        {chartData.patientPhone && (
          <p className="text-sm">Phone: {chartData.patientPhone}</p>
        )}
        {chartData.patientEmail && (
          <p className="text-sm">Email: {chartData.patientEmail}</p>
        )}
        {chartData.appointmentDate && (
          <p className="text-sm">
            Service Date: {new Date(chartData.appointmentDate).toLocaleDateString()}
          </p>
        )}
        {chartData.patientAddress && (
          <p className="text-sm">Address: {chartData.patientAddress}</p>
        )}
      </div>

      {/* Appointment Details */}
      <div>
        <h3 className="font-medium mb-2">Appointment Details</h3>
        {chartData.departmentName && (
          <p className="text-sm">Department: {chartData.departmentName}</p>
        )}
        {chartData.reason && (
          <p className="text-sm">Reason: {chartData.reason}</p>
        )}
        {chartData.status && (
          <p className="text-sm">
            Status: <span className="capitalize">{chartData.status.toLowerCase()}</span>
          </p>
        )}
      </div>
    </div>
  );
}
