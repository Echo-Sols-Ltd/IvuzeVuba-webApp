"use client";

import { useState, useEffect } from "react";
import { Calendar, DollarSign, Users, Activity } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/doctor/Navbar";
import PatientSidebar from "@/components/patient/PatientSidebar";
import { StatsCard } from "@/components/patient/dashboard/StatsCard";
import { RecentVisitsCard } from "@/components/patient/dashboard/RecentVisitsCard";
import { UpcomingAppointmentCard } from "@/components/patient/dashboard/UpcomingAppointmentCard";
import { NotificationsCard } from "@/components/patient/dashboard/NotificationsCard";
import { RecentMedicationsCard } from "@/components/patient/dashboard/RecentMedicationsCard";
import dynamic from "next/dynamic";
import { usePatientAuth } from "@/hooks/useAuth";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useIsMobile } from "@/hooks/useMediaQuery";
import { getPatientDashboard, getAppointments, getPrescriptions, getWallet } from "@/lib/patientApi";

// Lazy load Chatbot for better performance
const Chatbot = dynamic(() => import("@/components/patient/Chatbot").then(mod => ({ default: mod.Chatbot })), {
  ssr: false,
  loading: () => null,
});

const DashboardPage = () => {
  const { isAuthenticated, isLoading: authLoading } = usePatientAuth();
  const isMobile = useIsMobile();

  const [dashboard, setDashboard] = useState<any>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [wallet, setWallet] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [patientName, setPatientName] = useState<string>("Patient");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data separately to handle individual failures
        const dashboardData = await getPatientDashboard().catch(err => {
          console.error('Dashboard fetch error:', err);
          return { upcomingAppointments: 0, activePrescriptions: 0, recentVisits: 0, walletBalance: 0 };
        });

        const appointmentsData = await getAppointments().catch(err => {
          console.error('Appointments fetch error:', err);
          return [];
        });

        const prescriptionsData = await getPrescriptions().catch(err => {
          console.error('Prescriptions fetch error:', err);
          return [];
        });

        const walletData = await getWallet().catch(err => {
          console.error('Wallet fetch error:', err);
          return { balance: 0, currency: 'RWF' };
        });

        // Fetch patient profile for name
        const { API_ENDPOINTS, getAuthHeaders } = await import("@/lib/api");
        const profileResponse = await fetch(API_ENDPOINTS.USER.PROFILE, {
          headers: getAuthHeaders(),
        }).catch(err => {
          console.error('Profile fetch error:', err);
          return null;
        });

        if (profileResponse && profileResponse.ok) {
          const profile = await profileResponse.json();
          const fullName = `${profile.firstName || ""} ${profile.lastName || ""}`.trim();
          setPatientName(fullName || "Patient");
        }

        setDashboard(dashboardData);
        setAppointments(appointmentsData);
        setPrescriptions(prescriptionsData);
        setWallet(walletData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  if (authLoading || !isAuthenticated || loading) {
    return <LoadingSpinner />;
  }

  // Calculate stats safely
  const upcomingCount = typeof dashboard?.upcomingAppointments === 'number'
    ? dashboard.upcomingAppointments
    : (Array.isArray(appointments) ? appointments.length : 0);

  const prescriptionsCount = typeof dashboard?.activePrescriptions === 'number'
    ? dashboard.activePrescriptions
    : (Array.isArray(prescriptions) ? prescriptions.length : 0);

  const visitsCount = typeof dashboard?.recentVisits === 'number'
    ? dashboard.recentVisits
    : (Array.isArray(appointments) ? appointments.filter((a: any) => a.status === 'COMPLETED').length : 0);

  const walletBalance = typeof wallet?.balance === 'number' ? wallet.balance : 0;
  const walletCurrency = wallet?.currency || "RWF";

  const statsCards = [
    {
      title: "Appointments",
      value: String(upcomingCount),
      subtitle: "scheduled visits",
      icon: Calendar,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Prescriptions",
      value: String(prescriptionsCount),
      subtitle: "medications",
      icon: Activity,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Total Visits",
      value: String(visitsCount),
      subtitle: "completed",
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Wallet Balance",
      value: String(walletBalance),
      subtitle: walletCurrency,
      icon: DollarSign,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  // Transform appointments to recent visits format
  const recentVisits = Array.isArray(appointments) ? appointments.slice(0, 3).map((apt: any) => {
    try {
      return {
        id: String(apt.id || Math.random()),
        hospital: "Hospital",
        date: apt.preferredDate ? new Date(apt.preferredDate).toLocaleDateString() : "N/A",
        department: String(apt.departmentName || "General"),
        doctor: String(apt.doctorName || "Not assigned"),
        status: (apt.status === "WAITING" ? "waiting" :
          apt.status === "COMPLETED" ? "completed" :
            apt.status === "CANCELLED" ? "canceled" : "waiting") as "waiting" | "completed" | "canceled",
      };
    } catch (error) {
      console.error('Error transforming appointment:', error);
      return {
        id: String(Math.random()),
        hospital: "Hospital",
        date: "N/A",
        status: "waiting" as const,
      };
    }
  }) : [];

  // Get upcoming appointment
  const upcomingAppointment = Array.isArray(appointments) && appointments.length > 0 ? {
    hospital: "Hospital",
    date: appointments[0].preferredDate ? new Date(appointments[0].preferredDate).toLocaleDateString() : "N/A",
    department: String(appointments[0].departmentName || "General"),
    doctor: String(appointments[0].doctorName || "Not assigned yet"),
  } : null;

  if (isMobile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <PatientSidebar />
        <div className="pt-20 px-4 space-y-4">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {patientName}
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
          {upcomingAppointment && <UpcomingAppointmentCard {...upcomingAppointment} />}
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
              Welcome back, {patientName}
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
              {upcomingAppointment && <UpcomingAppointmentCard {...upcomingAppointment} />}
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
