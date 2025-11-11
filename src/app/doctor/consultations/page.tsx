"use client";

import { motion } from "framer-motion";
import ConsultationStats from "@/components/doctor/consultations/ConsultationStats";
import ConsultationTable from "@/components/doctor/consultations/ConsultationTable";

export default function ConsultationsPage() {
  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-xl font-semibold">Consultation history</h1>
        <p className="text-gray-500 text-sm mb-6">
          View and manage your consultation records
        </p>
      </motion.div>

      {/* Stats cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <ConsultationStats />
      </motion.div>

      {/* Table */}
      <motion.div 
        className="mt-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <ConsultationTable />
      </motion.div>
    </div>
  );
}
