"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ReferralTabs from "@/components/doctor/referrals/ReferralTabs";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { getOutgoingReferrals, getIncomingReferrals, Referral } from "@/lib/doctorApi";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function ReferralsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [outgoingReferrals, setOutgoingReferrals] = useState<Referral[]>([]);
  const [incomingReferrals, setIncomingReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReferrals = async () => {
      try {
        const [outgoing, incoming] = await Promise.all([
          getOutgoingReferrals(),
          getIncomingReferrals(),
        ]);
        setOutgoingReferrals(outgoing);
        setIncomingReferrals(incoming);
      } catch (error) {
        console.error('Error fetching referrals:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReferrals();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div 
        className="flex justify-between items-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h1 className="text-xl font-semibold">Referrals & Transfers</h1>
          <p className="text-gray-500">Manage patient referrals and transfers</p>
        </div>
        <motion.button 
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          + New Referral
        </motion.button>
      </motion.div>

      {/* Filters */}
      <motion.div 
        className="flex gap-2 justify-end"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <select 
          className="border px-3 py-2 rounded text-sm transition-all duration-200 hover:border-blue-500 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 focus:outline-none"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
        </select>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search by patient, facility, or doctor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-80"
          />
        </div>
      </motion.div>

      {/* Tabs + Table */}
      <motion.div 
        className="bg-white shadow rounded-lg border p-4 transition-all duration-300 hover:shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <ReferralTabs 
          searchQuery={searchQuery} 
          statusFilter={statusFilter}
          outgoingReferrals={outgoingReferrals}
          incomingReferrals={incomingReferrals}
        />
      </motion.div>
    </div>
  );
}
