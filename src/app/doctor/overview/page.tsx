"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Card from "@/components/doctor/Card";
import TopQueue from "@/components/doctor/TopQueue";
import NextInQueue from "@/components/doctor/NextQueue";
import RecentNotifications from "@/components/doctor/RecentNotification";
import CalendarCard from "@/components/doctor/CalendarCard";
import dynamic from "next/dynamic";
import { useDoctorAuth } from "@/hooks/useAuth";
import LoadingSpinner from "@/components/LoadingSpinner";
import { getDashboardStats, OverviewStats } from "@/lib/doctorApi";

// Lazy load Chatbot for better performance
const Chatbot = dynamic(() => import("@/components/patient/Chatbot").then(mod => ({ default: mod.Chatbot })), {
  ssr: false,
  loading: () => null,
});

const Page = () => {
  const { isAuthenticated, isLoading } = useDoctorAuth();
  const [stats, setStats] = useState<OverviewStats>({
    waiting: 0,
    inConsultation: 0,
    referred: 0,
    completed: 0,
  });
  const [loading, setLoading] = useState(true);
  const [doctorName, setDoctorName] = useState<string>("Doctor");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch dashboard stats
        const dashboardStats = await getDashboardStats();
        setStats(dashboardStats);
        
        // Fetch doctor profile for name
        const { API_ENDPOINTS, getAuthHeaders } = await import("@/lib/api");
        const profileResponse = await fetch(API_ENDPOINTS.USER.PROFILE, {
          headers: getAuthHeaders(),
        });
        
        if (profileResponse.ok) {
          const profile = await profileResponse.json();
          const fullName = `${profile.firstName || ""} ${profile.lastName || ""}`.trim();
          setDoctorName(fullName || "Doctor");
        }
      } catch (error) {
        console.error('Error fetching overview data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  if (isLoading || !isAuthenticated || loading) {
    return <LoadingSpinner />;
  }
  
  const data = [
    { title: "Total in Queue", total: stats.waiting },
    { title: "In consultation", total: stats.inConsultation },
    { title: "Referred", total: stats.referred },
    { title: "Completed", total: stats.completed },
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="font-semibold text-2xl">Welcome back, Dr. {doctorName}</h1>
        <p className="text-gray-600">
          Here&apos;s your health overview for today
        </p>
      </motion.div>

      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
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
        className="grid grid-cols-1 lg:grid-cols-2 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <TopQueue />
        <NextInQueue />
      </motion.div>

      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-2 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <RecentNotifications />
        <CalendarCard />
      </motion.div>
      
      <Chatbot />
    </div>
  );
};

export default Page;
