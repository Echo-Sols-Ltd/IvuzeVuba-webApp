"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import QueueList from "@/components/manager/patients/QueueList";
import QueueTabs from "@/components/manager/patients/QueueTabs";
import PageHeader from "@/components/manager/staff/PageHeader";
import StatsCards from "@/components/manager/staff/StatsCard";
import { API_ENDPOINTS, getAuthHeaders } from "@/lib/api";
import LoadingSpinner from "@/components/LoadingSpinner";

interface QueueStats {
    totalVisitRequests: number;
    availableDoctors: number;
    totalMedicalInventory: number;
    totalFacilities: number;
}

interface QueueItem {
    appointmentId: string;
    departmentName: string;
    reason: string;
    preferredDate: string;
    patientId: string;
    patientName: string;
    patientEmail: string;
    patientImageUrl: string;
    status: string;
    assignedDoctorName?: string;
    assignedDoctorId?: string;
}

export default function QueuePage() {
    const [stats, setStats] = useState<QueueStats | null>(null);
    const [unassignedQueues, setUnassignedQueues] = useState<QueueItem[]>([]);
    const [allQueues, setAllQueues] = useState<QueueItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchQueueData();
    }, []);

    const fetchQueueData = async () => {
        try {
            setLoading(true);
            setError("");

            // Fetch queue stats
            const statsResponse = await fetch(API_ENDPOINTS.MANAGER.QUEUE_STATS, {
                headers: getAuthHeaders(),
            });

            if (statsResponse.ok) {
                const statsData = await statsResponse.json();
                setStats(statsData);
            }

            // Fetch unassigned queue
            const unassignedResponse = await fetch(API_ENDPOINTS.QUEUE.UNASSIGNED, {
                headers: getAuthHeaders(),
            });

            if (unassignedResponse.ok) {
                const unassignedData = await unassignedResponse.json();
                console.log("Unassigned queue data:", unassignedData);
                setUnassignedQueues(unassignedData);
            }

            // Fetch all queue
            const allResponse = await fetch(API_ENDPOINTS.QUEUE.ALL, {
                headers: getAuthHeaders(),
            });

            if (allResponse.ok) {
                const allData = await allResponse.json();
                console.log("All queue data:", allData);
                setAllQueues(allData);
            }

        } catch (err) {
            console.error("Error fetching queue data:", err);
            setError(err instanceof Error ? err.message : "Failed to load queue data");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600 mb-4">{error}</p>
                    <button
                        onClick={fetchQueueData}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    const statsArray = [
        { label: "Total Visit Requests", value: stats?.totalVisitRequests || 0 },
        { label: "Available Doctors", value: stats?.availableDoctors || 0 },
        { label: "Total Medical Inventory", value: stats?.totalMedicalInventory || 0 },
        { label: "Total Facilities", value: stats?.totalFacilities || 0 },
    ];

    return (
        <div className="p-6">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <PageHeader
                    title="Patient Queues"
                    description="Manage patient appointments and assign doctors"
                    action={null}
                />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <StatsCards stats={statsArray} />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
            >
                <QueueTabs
                    unassignedContent={<QueueList queues={unassignedQueues} onRefresh={fetchQueueData} />}
                    allContent={<QueueList queues={allQueues} onRefresh={fetchQueueData} />}
                />
            </motion.div>
        </div>
    );
}
