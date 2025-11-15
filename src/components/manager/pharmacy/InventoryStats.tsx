"use client";

import { useState, useEffect } from "react";
import Card from "@/components/doctor/Card";
import { API_ENDPOINTS, getAuthHeaders } from "@/lib/api";

interface InventoryStatsProps {
  onRefresh?: () => void;
}

interface PharmacyStats {
  inStock: number;
  pending: number;
  lowStockItems: number;
  collected: number;
}

export default function InventoryStats({ onRefresh }: InventoryStatsProps) {
  const [stats, setStats] = useState<PharmacyStats>({
    inStock: 0,
    pending: 0,
    lowStockItems: 0,
    collected: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_ENDPOINTS.MANAGER.PHARMACY_STATS, {
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Pharmacy stats:", data);
        setStats(data);
      }
    } catch (error) {
      console.error("Error fetching pharmacy stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const statsArray = [
    { label: "In Stock", value: stats.inStock },
    { label: "Pending", value: stats.pending },
    { label: "Low stock items", value: stats.lowStockItems },
    { label: "Collected", value: stats.collected },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {statsArray.map((stat, i) => (
        <Card key={i} title={stat.label} total={loading ? "..." : stat.value} />
      ))}
    </div>
  );
}
