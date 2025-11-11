"use client";

import { motion } from "framer-motion";
import ReferralTabs from "@/components/doctor/referrals/ReferralTabs";

export default function ReferralsPage() {
  return (
    <div className="p-6">
      {/* Header */}
      <motion.div 
        className="flex justify-between items-center mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-xl font-semibold">Referrals & Transfers</h1>
        <motion.button 
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          + New Referral
        </motion.button>
      </motion.div>

      <motion.p 
        className="text-gray-500 mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Manage patient referrals and transfers
      </motion.p>

      {/* Filters */}
      <motion.div 
        className="flex gap-2 mb-4 justify-end"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <select className="border px-3 py-2 rounded text-sm transition-all duration-200 hover:border-blue-500 focus:border-blue-600 focus:ring-2 focus:ring-blue-200">
          <option>Filter Status</option>
          <option>Completed</option>
          <option>Pending</option>
        </select>
        <input
          type="text"
          placeholder="Search..."
          className="border px-3 py-2 rounded text-sm transition-all duration-200 hover:border-blue-500 focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
        />
      </motion.div>

      {/* Tabs + Table */}
      <motion.div 
        className="bg-white shadow rounded-lg border p-4 transition-all duration-300 hover:shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <ReferralTabs />
      </motion.div>
    </div>
  );
}
