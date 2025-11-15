"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import StaffTabs from "@/components/manager/staff/StaffTabs";
import StaffList from "@/components/manager/staff/StaffList";
import FiltersBar from "@/components/manager/staff/FiltersBar";
import PageHeader from "@/components/manager/staff/PageHeader";
import AddUserModal from "@/components/modals/AddUserModal";
import DepartmentManagement from "@/components/manager/staff/DepartmentManagement";
import { API_ENDPOINTS, getAuthHeaders } from "@/lib/api";
import LoadingSpinner from "@/components/LoadingSpinner";

interface StaffMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  licenseNumber: string;
  specialization: string;
  isAvailable: boolean;
  joinedDate: string;
  department: {
    id: string;
    name: string;
  };
  hospital: {
    id: string;
    name: string;
  };
}

export default function StaffPage() {
  const [staffData, setStaffData] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterValue, setFilterValue] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      setError("");
      
      const response = await fetch(API_ENDPOINTS.STAFF.LIST, {
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Staff data:", data);
        setStaffData(data);
      } else {
        setError("Failed to load staff data");
      }
    } catch (err) {
      console.error("Error fetching staff:", err);
      setError("Failed to load staff data");
    } finally {
      setLoading(false);
    }
  };

  const filterOptions = [
    { value: "all", label: "All Staff" },
    { value: "available", label: "Available" },
    { value: "unavailable", label: "Unavailable" },
  ];

  const filteredStaff = staffData
    .filter((s) => {
      const matchesFilter =
        filterValue === "all" ||
        (filterValue === "available" && s.isAvailable) ||
        (filterValue === "unavailable" && !s.isAvailable);
      
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        s.firstName?.toLowerCase().includes(searchLower) ||
        s.lastName?.toLowerCase().includes(searchLower) ||
        s.email?.toLowerCase().includes(searchLower) ||
        s.department?.name?.toLowerCase().includes(searchLower) ||
        s.specialization?.toLowerCase().includes(searchLower);
      
      return matchesFilter && matchesSearch;
    })
    .map((s) => ({
      name: `${s.firstName || ""} ${s.lastName || ""}`.trim(),
      id: s.id,
      role: "Doctor",
      joined: s.joinedDate || "",
      email: s.email || "",
      department: s.department?.name || "N/A",
      endDate: "",
      imageUrl: "/man.png",
      isAvailable: s.isAvailable,
      specialization: s.specialization,
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
            onClick={fetchStaff}
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
        <PageHeader
          title="Users & Staff Management"
          description="Manage staff directory and user accounts"
          action={<AddUserModal onSuccess={fetchStaff} />}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <StaffTabs
          staffContent={
            <div>
              <FiltersBar
                filterLabel="Filter by Availability"
                filterOptions={filterOptions}
                searchPlaceholder="Search staff by name, email, department..."
                filterValue={filterValue}
                setFilterValue={setFilterValue}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
              <StaffList staff={filteredStaff} onRefresh={fetchStaff} />
            </div>
          }
          departmentContent={<DepartmentManagement />}
        />
      </motion.div>
    </div>
  );
}
