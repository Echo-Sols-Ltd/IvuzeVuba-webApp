"use client";

import { motion } from "framer-motion";
import Greeting from "@/components/manager/Greeting";
import FinancialChart from "@/components/manager/FinancialChart";
import FinancialDetails from "@/components/manager/FinancialDetails";
import Notifications from "@/components/manager/Notification";
import CalendarCard from "@/components/manager/CalendarCard";
import StatsGrid from "@/components/manager/StatsGrid";
import React from "react";
import { Chatbot } from "@/components/patient/Chatbot";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Greeting />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <StatsGrid />
        </motion.div>

        {/* Graph + Financial details */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <FinancialChart />
          <FinancialDetails />
        </motion.div>

        {/* Notifications + Calendar */}
        <motion.div 
          className="flex flex-col md:flex-row gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="flex-1">
            <Notifications />
          </div>
          <div className="w-full md:w-[510px]">
            <CalendarCard />
          </div>
        </motion.div>
      </div>
      <Chatbot />
    </div>
  );
}
