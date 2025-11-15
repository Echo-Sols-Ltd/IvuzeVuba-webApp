"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import InventoryFilters from "@/components/manager/pharmacy/InventoryFilters";
import InventoryList from "@/components/manager/pharmacy/InventoryList";
import InventoryStats from "@/components/manager/pharmacy/InventoryStats";
import PharmacyHeader from "@/components/manager/pharmacy/PharmacyHeader";
import { API_ENDPOINTS, getAuthHeaders } from "@/lib/api";
import LoadingSpinner from "@/components/LoadingSpinner";

interface InventoryItem {
  id: string;
  medicineName: string;
  category: string;
  stockQuantity: number;
  supplierName: string;
  status: string;
  lastRestocked: string;
}

export default function PharmacyPage() {
  const [allItems, setAllItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      setError("");
      
      const response = await fetch(API_ENDPOINTS.INVENTORY.LIST, {
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Inventory data:", data);
        setAllItems(data);
      } else {
        setError("Failed to load inventory");
      }
    } catch (err) {
      console.error("Error fetching inventory:", err);
      setError("Failed to load inventory");
    } finally {
      setLoading(false);
    }
  };

  // Apply search + filter
  const filteredItems = allItems
    .filter((item) => {
      const matchesStatus = filterType === "all" || item.status === filterType;
      const matchesSearch =
        !searchQuery ||
        (item.medicineName && item.medicineName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.supplierName && item.supplierName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.category && item.category.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesStatus && matchesSearch;
    })
    .map((item) => ({
      name: item.medicineName || "Unknown",
      type: item.category || "N/A",
      stock: `${item.stockQuantity || 0}`,
      supplier: item.supplierName || "Unknown",
      status: item.status ? item.status.replace(/_/g, " ") : "Unknown",
      lastRestocked: item.lastRestocked ? new Date(item.lastRestocked).toLocaleDateString() : "N/A",
      id: item.id,
    }));

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchInventory}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <PharmacyHeader onRefresh={fetchInventory} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <InventoryStats onRefresh={fetchInventory} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <InventoryFilters
          filterType={filterType}
          setFilterType={setFilterType}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      </motion.div>

      <motion.h2 
        className="text-xl font-semibold mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        Medical inventory
      </motion.h2>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <InventoryList items={filteredItems} onRefresh={fetchInventory} />
      </motion.div>
    </div>
  );
}
