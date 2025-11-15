"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ConsultationStats from "@/components/doctor/consultations/ConsultationStats";
import ConsultationTable from "@/components/doctor/consultations/ConsultationTable";
import { getConsultations, getConsultationStats, Consultation } from "@/lib/doctorApi";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function ConsultationsPage() {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [stats, setStats] = useState({ total: 0, byMonth: 0, unique: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [consultationsData, statsData] = await Promise.all([
          getConsultations(),
          getConsultationStats(),
        ]);
        setConsultations(consultationsData);
        setStats(statsData);
      } catch (error) {
        console.error('Error fetching consultations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-xl font-semibold">Consultation history</h1>
        <p className="text-gray-500 text-sm">
          View and manage your consultation records
        </p>
      </motion.div>

      {/* Stats cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <ConsultationStats stats={stats} />
      </motion.div>

      {/* Table */}
      <motion.div 
        className="mt-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <ConsultationTable consultations={consultations} />
      </motion.div>
    </div>
  );
}
