"use client";

import { motion } from "framer-motion";
import Card from "@/components/doctor/Card";
import TopQueue from "@/components/doctor/TopQueue";
import NextInQueue from "@/components/doctor/NextQueue";
import RecentNotifications from "@/components/doctor/RecentNotification";
import CalendarCard from "@/components/doctor/CalendarCard";
import Navbar from "@/components/doctor/Navbar";
import Sidebar from "@/components/doctor/Sidebar";
import { Chatbot } from "@/components/patient/Chatbot";

const Page = () => {
  const data = [
    { title: "Waiting", total: 12 },
    { title: "In consultation", total: 12 },
    { title: "Referred", total: 12 },
    { title: "Completed", total: 12 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex pt-20">
        <main className="flex-1 p-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="font-semibold text-2xl">Welcome back, John</h1>
            <p className="text-gray-600">
              Here&apos;s your health overview for today
            </p>
          </motion.div>

          <motion.div 
            className="flex gap-4 mt-6"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
          >
            {data.map((item, idx) => (
              <motion.div 
                key={idx} 
                className="flex-1"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
                whileHover={{ scale: 1.05 }}
              >
                <Card title={item.title} total={item.total} />
              </motion.div>
            ))}
          </motion.div>

          <motion.div 
            className="flex gap-4 mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <TopQueue />
            <NextInQueue />
          </motion.div>

          <motion.div 
            className="flex gap-4 mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <RecentNotifications />
            <CalendarCard />
          </motion.div>
        </main>
      </div>
      <Chatbot />
    </div>
  );
};

export default Page;
