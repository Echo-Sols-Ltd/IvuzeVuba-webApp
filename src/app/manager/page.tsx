"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Greeting from "@/components/manager/Greeting";
import FinancialChart from "@/components/manager/FinancialChart";
import FinancialDetails from "@/components/manager/FinancialDetails";
import Notifications from "@/components/manager/Notification";
import CalendarCard from "@/components/manager/CalendarCard";
import StatsGrid from "@/components/manager/StatsGrid";
import React from "react";
import dynamic from "next/dynamic";
import { API_ENDPOINTS, getAuthHeaders } from "@/lib/api";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useManagerAuth } from "@/hooks/useAuth";

// Lazy load Chatbot for better performance
const Chatbot = dynamic(() => import("@/components/patient/Chatbot").then(mod => ({ default: mod.Chatbot })), {
    ssr: false,
    loading: () => null,
});

interface OverviewStats {
    totalVisitRequests: number;
    totalStaff: number;
    totalMedicalInventory: number;
    totalFacilities: number;
    totalRevenue: number;
    totalExpenses: number;
    totalProfit: number;
}

interface Notification {
    id: string;
    description: string;
    type: string;
    createdAt: string;
    recipientId?: string;
    senderId?: string;
    isRead?: boolean;
}

export default function DashboardPage() {
    // Check authentication - redirects to login if not authenticated
    const { isAuthenticated, isLoading: authLoading } = useManagerAuth();

    const [overviewStats, setOverviewStats] = useState<OverviewStats | null>(null);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        // Only fetch data if authenticated
        if (isAuthenticated) {
            fetchDashboardData();
        }
    }, [isAuthenticated]);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            setError("");

            // Fetch overview stats
            const overviewResponse = await fetch(API_ENDPOINTS.MANAGER.OVERVIEW, {
                headers: getAuthHeaders(),
            });

            if (!overviewResponse.ok) {
                throw new Error("Failed to fetch overview stats");
            }

            const overviewData = await overviewResponse.json();
            setOverviewStats(overviewData);

            // Fetch notifications
            try {
                const notificationsResponse = await fetch(API_ENDPOINTS.MANAGER.NOTIFICATIONS, {
                    headers: getAuthHeaders(),
                });

                if (notificationsResponse.ok) {
                    const notificationsData = await notificationsResponse.json();
                    console.log("Notifications received:", notificationsData);
                    console.log("Notifications type:", typeof notificationsData);
                    console.log("Is array:", Array.isArray(notificationsData));
                    
                    // Handle both array and object responses
                    if (Array.isArray(notificationsData)) {
                        setNotifications(notificationsData);
                    } else if (notificationsData && typeof notificationsData === 'object') {
                        // If it's an object, try to extract the array
                        const notifArray = notificationsData.notifications || 
                                         notificationsData.data || 
                                         [notificationsData];
                        setNotifications(notifArray);
                    } else {
                        console.warn("Unexpected notifications format:", notificationsData);
                        setNotifications([]);
                    }
                } else {
                    console.error("Failed to fetch notifications:", notificationsResponse.status);
                }
            } catch (notifError) {
                console.error("Error fetching notifications:", notifError);
                // Don't fail the whole page if notifications fail
                setNotifications([]);
            }

        } catch (err) {
            console.error("Error fetching dashboard data:", err);
            setError(err instanceof Error ? err.message : "Failed to load dashboard data");
        } finally {
            setLoading(false);
        }
    };

    // Show loading while checking auth or fetching data
    if (authLoading || loading) {
        return <LoadingSpinner />;
    }

    // If not authenticated, the hook will redirect - show loading
    if (!isAuthenticated) {
        return <LoadingSpinner />;
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600 mb-4">{error}</p>
                    <button
                        onClick={fetchDashboardData}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

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
                    <StatsGrid stats={overviewStats} />
                </motion.div>

                {/* Graph + Financial details */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-3 gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    <FinancialChart stats={overviewStats} />
                    <FinancialDetails stats={overviewStats} />
                </motion.div>

                {/* Notifications + Calendar */}
                <motion.div
                    className="flex flex-col md:flex-row gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                >
                    <div className="flex-1">
                        <Notifications notifications={notifications} />
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
