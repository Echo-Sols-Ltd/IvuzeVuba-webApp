"use client";

import { useState, useEffect } from "react";
import { Calendar, DollarSign, Users } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/doctor/Navbar";
import PatientSidebar from "@/components/patient/PatientSidebar";
import { StatsCard } from "@/components/patient/dashboard/StatsCard";
import { RecentVisitsCard } from "@/components/patient/dashboard/RecentVisitsCard";
import { UpcomingAppointmentCard } from "@/components/patient/dashboard/UpcomingAppointmentCard";
import { NotificationsCard } from "@/components/patient/dashboard/NotificationsCard";
import { RecentMedicationsCard } from "@/components/patient/dashboard/RecentMedicationsCard";
import { Chatbot } from "@/components/patient/Chatbot";

const DashboardPage = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const statsCards = [
    {
      title: "Current Queue Status",
      value: "General",
      subtitle: "position #3 • 12 mins",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Assigned Doctor",
      value: "Kabalisa Jean",
      subtitle: "General",
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Total Visits",
      value: "General",
      subtitle: "position #3 • 12 mins",
      icon: Calendar,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Amount in wallet",
      value: "General",
      subtitle: "position #3 • 12 mins",
      icon: DollarSign,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  const recentVisits = [
    {
      id: "1",
      hospital: "Kigali Hospital",
      date: "Today",
      status: "waiting" as const,
    },
    {
      id: "2",
      hospital: "Kigali Hospital",
      date: "2024-05-9",
      department: "Cardiology",
      doctor: "Dr. John Doe",
      status: "completed" as const,
    },
    {
      id: "3",
      hospital: "Kigali Hospital",
      date: "2025-05-0",
      department: "Cardiology",
      doctor: "Dr. John Doe",
      status: "canceled" as const,
    },
  ];

  const upcomingAppointment = {
    hospital: "Kigali Hospital",
    date: "2025-07-9",
    department: "Cardiology",
    doctor: "Dr. John Doe",
  };

  if (isMobile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <PatientSidebar />
        <div className="pt-20 px-4 space-y-4">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, John
            </h1>
            <p className="text-gray-600">
              Here&apos;s your health overview for today
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {statsCards.map((card, index) => (
              <StatsCard key={index} {...card} />
            ))}
          </div>

          <RecentVisitsCard visits={recentVisits} />
          <UpcomingAppointmentCard {...upcomingAppointment} />
          <NotificationsCard />
          <RecentMedicationsCard />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-20 flex">
        <div className="w-64 flex-shrink-0">
          <PatientSidebar />
        </div>
        <div className="flex-1 p-6 space-y-6">
          <motion.div 
            className="mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, John
            </h1>
            <p className="text-gray-600 text-lg">
              Here&apos;s your health overview for today
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
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
            {statsCards.map((card, index) => (
              <motion.div
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
                whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
              >
                <StatsCard {...card} />
              </motion.div>
            ))}
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="lg:col-span-2">
              <RecentVisitsCard visits={recentVisits} />
            </div>
            <div className="space-y-6">
              <UpcomingAppointmentCard {...upcomingAppointment} />
              <NotificationsCard />
            </div>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <div className="lg:col-span-2">
              <RecentMedicationsCard />
            </div>
            <div>
              <div className="h-full"></div>
            </div>
          </motion.div>
        </div>
      </div>
      <Chatbot />
    </div>
  );
};

export default DashboardPage;
