"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import InventoryFilters from "@/components/manager/pharmacy/InventoryFilters";
import InventoryList from "@/components/manager/pharmacy/InventoryList";
import InventoryStats from "@/components/manager/pharmacy/InventoryStats";
import PharmacyHeader from "@/components/manager/pharmacy/PharmacyHeader";

const allItems = [
  {
    name: "Amoxicillin 500mg",
    type: "Antibiotic",
    stock: "450/1000",
    supplier: "PharmaCorp",
    status: "In stock",
    lastRestocked: "2024-07-05",
  },
  {
    name: "Paracetamol 500mg",
    type: "Painkiller",
    stock: "320/800",
    supplier: "HealthPlus",
    status: "In stock",
    lastRestocked: "2024-07-10",
  },
  {
    name: "Ibuprofen 200mg",
    type: "Painkiller",
    stock: "0/600",
    supplier: "MediSupply",
    status: "Out of stock",
    lastRestocked: "2024-06-28",
  },
];

export default function PharmacyPage() {
  const [filterType, setFilterType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Apply search + filter
  const filteredItems = allItems.filter((item) => {
    const matchesType = filterType === "all" || item.type === filterType;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.supplier.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <PharmacyHeader />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <InventoryStats />
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
        <InventoryList items={filteredItems} />
      </motion.div>
    </div>
  );
}
