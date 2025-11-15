"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Card from "@/components/doctor/Card";
import { FilterByDate } from "@/components/doctor/patient-queue/FIlterByDate";
import PatientQueueList from "@/components/doctor/patient-queue/PatientQueueList";
import { Input } from "@/components/ui/input";
import { getQueueCount } from "@/lib/doctorApi";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function PatientQueuePage() {
  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [queueCount, setQueueCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQueueCount = async () => {
      try {
        const count = await getQueueCount();
        setQueueCount(count);
      } catch (error) {
        console.error('Error fetching queue count:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQueueCount();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div 
        className="flex items-center justify-between gap-4 mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h1 className="text-2xl font-semibold">View Patient Queues</h1>
          <p className="text-gray-500">Here&apos;s your patient queue overview</p>
        </div>
        {/* Total in Queue */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          <Card total={queueCount} title="Total in Queue" />
        </motion.div>
      </motion.div>

      <motion.div 
        className="rounded-lg border-2 border-gray-200 p-6 shadow-sm mt-5 transition-all duration-300 hover:shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {/* Queue Overview */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-medium">All queue</h2>
            <p className="text-sm text-[#404040]">Here are all your queue</p>
          </div>
          <div className="flex items-center gap-3">
            <FilterByDate onChange={setSelectedDate} />
            <Input
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="transition-all duration-200 focus:scale-105"
            />
          </div>
        </div>
        {/* Patient Queue List */}
        <PatientQueueList search={search} selectedDate={selectedDate} />
      </motion.div>
    </div>
  );
}
