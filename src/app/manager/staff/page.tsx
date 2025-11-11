"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import StaffTabs from "@/components/manager/staff/StaffTabs";
import StaffList from "@/components/manager/staff/StaffList";
import FiltersBar from "@/components/manager/staff/FiltersBar";
import PageHeader from "@/components/manager/staff/PageHeader";
import AddUserModal from "@/components/modals/AddUserModal";
import DepartmentManagement from "@/components/manager/staff/DepartmentManagement";

const staffData = [
  {
    name: "Micheal Porter",
    id: "#apt12345",
    role: "Doctor",
    joined: "2024-07-05",
    email: "king@gmail.com",
    department: "Cardiology",
    endDate: "2024-07-05",
    imageUrl: "/man.png",
  },
  {
    name: "Sarah Sanyukaa",
    id: "#apt12346",
    role: "Nurse",
    joined: "2024-07-06",
    email: "sarah@gmail.com",
    department: "Pediatrics",
    endDate: "2024-07-06",
    imageUrl: "/man.png",
  },
];

export default function StaffPage() {
  const [filterValue, setFilterValue] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filterOptions = [
    { value: "all", label: "All Roles" },
    { value: "Doctor", label: "Doctor" },
    { value: "Nurse", label: "Nurse" },
    { value: "Admin", label: "Admin" },
  ];

  const filteredStaff = staffData.filter((s) => {
    const matchesRole = filterValue === "all" || s.role === filterValue;
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.department.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesSearch;
  });

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
          action={<AddUserModal />}
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
                filterLabel="Filter by Role"
                filterOptions={filterOptions}
                searchPlaceholder="Search staff..."
                filterValue={filterValue}
                setFilterValue={setFilterValue}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
              <StaffList staff={filteredStaff} />
            </div>
          }
          departmentContent={<DepartmentManagement />}
        />
      </motion.div>
    </div>
  );
}
