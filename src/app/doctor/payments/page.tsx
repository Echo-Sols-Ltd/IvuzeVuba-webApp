"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import PaymentTabs from "@/components/doctor/payments/PaymentTabs";
import PaymentStats from "@/components/doctor/payments/PaymentStats";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { getPayments, getPaymentStats, Payment, PaymentStats as PaymentStatsType } from "@/lib/doctorApi";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function PaymentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [payments, setPayments] = useState<Payment[]>([]);
  const [stats, setStats] = useState<PaymentStatsType>({ today: 0, lastWeek: 0, lastMonth: 0, overall: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [paymentsData, statsData] = await Promise.all([
          getPayments(),
          getPaymentStats(),
        ]);
        setPayments(paymentsData);
        setStats(statsData);
      } catch (error) {
        console.error('Error fetching payments:', error);
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
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-xl font-semibold mb-2">Payments</h1>
        <p className="text-gray-500">View and manage payment records</p>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <PaymentStats stats={stats} />
      </motion.div>

      {/* Filters */}
      <motion.div 
        className="flex gap-2"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <select 
          className="border px-3 py-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>
        
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search by patient, ID, or amount..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <motion.button 
          className="ml-auto bg-gray-100 border px-4 py-2 rounded text-sm hover:bg-gray-200 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Export Data
        </motion.button>
      </motion.div>

      {/* Tabs + Payments */}
      <motion.div 
        className="bg-white shadow rounded-lg border p-4 transition-all duration-300 hover:shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <PaymentTabs 
          searchQuery={searchQuery} 
          statusFilter={statusFilter}
          payments={payments}
        />
      </motion.div>
    </div>
  );
}
