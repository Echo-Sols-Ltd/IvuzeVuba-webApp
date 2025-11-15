import React from "react";
import Card from "../doctor/Card";

interface OverviewStats {
    totalVisitRequests: number;
    totalStaff: number;
    totalMedicalInventory: number;
    totalFacilities: number;
    totalRevenue: number;
    totalExpenses: number;
    totalProfit: number;
}

interface StatsGridProps {
    stats: OverviewStats | null;
}

/**
 * StatsGrid Component
 * Displays a grid of statistics cards for the manager dashboard
 * @returns {JSX.Element} A grid of statistical information
 */
const StatsGrid = ({ stats }: StatsGridProps) => {
    const statsData = [
        { title: "Total Visit Requests", total: stats?.totalVisitRequests || 0 },
        { title: "Total Staff", total: stats?.totalStaff || 0 },
        { title: "Total Medical Inventory", total: stats?.totalMedicalInventory || 0 },
        { title: "Total Facilities", total: stats?.totalFacilities || 0 },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {statsData.map((s, i) => (
                <Card key={i} title={s.title} total={s.total} />
            ))}
        </div>
    );
};

export default StatsGrid;
