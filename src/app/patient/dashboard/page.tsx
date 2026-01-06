"use client";

import { useState, useEffect } from "react";
import { Calendar, DollarSign, Users, Activity } from "lucide-react";
import type {
  Appointment,
  Prescription,
  PatientDashboard,
  Wallet
} from "@/lib/patientApi";
import {
  getPatientDashboard,
  getAppointments,
  getPrescriptions,
  getWallet
} from "@/lib/patientApi";
import { useIsMobile } from "@/hooks/useMediaQuery";
import { usePatientAuth } from "@/hooks/useAuth";
import Navbar from "@/components/doctor/Navbar";
import PatientSidebar from "@/components/patient/PatientSidebar";
import { StatsCard } from "@/components/patient/dashboard/StatsCard";
import { RecentVisitsCard } from "@/components/patient/dashboard/RecentVisitsCard";
import { UpcomingAppointmentCard } from "@/components/patient/dashboard/UpcomingAppointmentCard";
import { NotificationsCard } from "@/components/patient/dashboard/NotificationsCard";
import { RecentMedicationsCard } from "@/components/patient/dashboard/RecentMedicationsCard";
import dynamic from "next/dynamic";
import LoadingSpinner from "@/components/LoadingSpinner";

// Lazy load Chatbot for better performance
const Chatbot = dynamic(() => import("@/components/patient/Chatbot").then(mod => ({ default: mod.Chatbot })), {
  ssr: false,
  loading: () => null,
});

// Extend the API types with any additional properties needed for the UI
interface UIDashboardStats extends PatientDashboard {
  totalAppointments: number;
  completedAppointments: number;
  totalPrescriptions: number;
}

// Define the shape of the transformed appointment for the UI
interface UIVisit {
  id: string;
  hospital: string;
  date: string;
  department: string;
  doctor: string;
  status: "waiting" | "completed" | "canceled";
}

// Define the shape of stats cards
interface StatCard {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
}

const DashboardPage = () => {
  const { isAuthenticated } = usePatientAuth();
  const isMobile = useIsMobile();

  const [dashboard, setDashboard] = useState<UIDashboardStats>({
    upcomingAppointments: 0,
    activePrescriptions: 0,
    recentVisits: 0,
    walletBalance: 0,
    totalAppointments: 0,
    completedAppointments: 0,
    totalPrescriptions: 0
  });
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [wallet, setWallet] = useState<Wallet>({ balance: 0, currency: 'RWF' });
  const [loading, setLoading] = useState(true);
  const [patientName, setPatientName] = useState<string>("Patient");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data separately to handle individual failures
        const dashboardData = await getPatientDashboard().catch(err => {
          console.error('Dashboard fetch error:', err);
          return {
            upcomingAppointments: 0,
            activePrescriptions: 0,
            recentVisits: 0,
            walletBalance: 0,
            totalAppointments: 0,
            completedAppointments: 0,
            totalPrescriptions: 0
          };
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

        // Handle recentVisits properly - it might be an array or number
        let recentVisitsCount = 0;
        if (typeof dashboardData.recentVisits === 'number') {
          recentVisitsCount = dashboardData.recentVisits;
        } else if (Array.isArray(dashboardData.recentVisits)) {
          recentVisitsCount = dashboardData.recentVisits.length;
        } else if (dashboardData.recentVisits && typeof dashboardData.recentVisits === 'object') {
          // If it's an object, try to get a count property or default to 0
          recentVisitsCount = (dashboardData.recentVisits as any).count || 0;
        }

        // Update state with fetched data
        setDashboard(prev => ({
          ...prev,
          ...dashboardData,
          recentVisits: recentVisitsCount, // Ensure this is always a number
          totalAppointments: dashboardData.totalAppointments || appointmentsData.length || 0,
          completedAppointments: dashboardData.completedAppointments ||
            appointmentsData.filter(a => a.status === 'completed').length || 0,
          totalPrescriptions: dashboardData.totalPrescriptions || prescriptionsData.length || 0
        }));
        setAppointments(appointmentsData);
        setPrescriptions(prescriptionsData);
        setWallet(walletData);

        // Fetch patient profile for name
        const { API_ENDPOINTS, getAuthHeaders } = await import("@/lib/api");
        const profileResponse = await fetch(API_ENDPOINTS.USER.PROFILE, {
          headers: getAuthHeaders(),
        }).catch(err => {
          console.error('Profile fetch error:', err);
          return null;
        });

        if (profileResponse?.ok) {
          const profile = await profileResponse.json();
          const fullName = `${profile.firstName || ""} ${profile.lastName || ""}`.trim();
          setPatientName(fullName || "Patient");
        }
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

  // Rest of the component remains the same...

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex pt-8">
        <PatientSidebar />
        <main className="flex-1 p-4 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <LoadingSpinner />
            </div>
          ) : (
            <div className="space-y-4">
              <h1 className="text-2xl font-bold text-gray-800">Welcome back, {patientName}!</h1>

              {/* Stats Grid */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                  title="Upcoming Appointments"
                  value={dashboard.upcomingAppointments.toString()}
                  subtitle="Scheduled visits"
                  icon={Calendar}
                  color="text-blue-600"
                  bgColor="bg-blue-100"
                />
                <StatsCard
                  title="Active Prescriptions"
                  value={dashboard.activePrescriptions.toString()}
                  subtitle="Current medications"
                  icon={Activity}
                  color="text-green-600"
                  bgColor="bg-green-100"
                />
                <StatsCard
                  title="Recent Visits"
                  value={dashboard.recentVisits.toString()}
                  subtitle="Last 30 days"
                  icon={Users}
                  color="text-purple-600"
                  bgColor="bg-purple-100"
                />
                <StatsCard
                  title="Wallet Balance"
                  value={`${wallet.currency} ${wallet.balance.toFixed(2)}`}
                  subtitle="Available funds"
                  icon={DollarSign}
                  color="text-yellow-600"
                  bgColor="bg-yellow-100"
                />
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <UpcomingAppointmentCard appointments={appointments} />
                <RecentVisitsCard visits={appointments.slice(0, 3).map(a => ({
                  id: a.id,
                  hospital: a.hospital?.name || 'Clinic',
                  date: a.scheduledTime,
                  department: a.departmentName || 'General',
                  doctor: a.doctorName || a.assignedDoctorName || 'Not assigned yet',
                  status: a.status as "waiting" | "completed" | "canceled"
                }))} />
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <RecentMedicationsCard prescriptions={prescriptions.slice(0, 3)} />
                <NotificationsCard />
              </div>
            </div>
          )}
        </main>
      </div>
      {!isMobile && <Chatbot />}
    </div>
  );
};

export default DashboardPage;
