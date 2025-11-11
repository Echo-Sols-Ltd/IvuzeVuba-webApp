"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Plus, Search, Users, Edit, Trash2, Building2 } from "lucide-react";
import AddDepartmentModal from "@/components/modals/AddDepartmentModal";

interface Department {
  id: string;
  name: string;
  head: string;
  staffCount: number;
  description: string;
  color: string;
}

export default function DepartmentManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const departments: Department[] = [
    {
      id: "dept001",
      name: "Cardiology",
      head: "Dr. Michael Porter",
      staffCount: 12,
      description: "Heart and cardiovascular system care",
      color: "bg-blue-500",
    },
    {
      id: "dept002",
      name: "Pediatrics",
      head: "Dr. Sarah Johnson",
      staffCount: 8,
      description: "Medical care for infants, children, and adolescents",
      color: "bg-pink-500",
    },
    {
      id: "dept003",
      name: "Emergency",
      head: "Dr. James Wilson",
      staffCount: 15,
      description: "24/7 emergency medical services",
      color: "bg-red-500",
    },
    {
      id: "dept004",
      name: "Radiology",
      head: "Dr. Emily Chen",
      staffCount: 6,
      description: "Medical imaging and diagnostics",
      color: "bg-purple-500",
    },
    {
      id: "dept005",
      name: "Surgery",
      head: "Dr. Robert Martinez",
      staffCount: 10,
      description: "Surgical procedures and operations",
      color: "bg-green-500",
    },
    {
      id: "dept006",
      name: "Laboratory",
      head: "Dr. Lisa Anderson",
      staffCount: 7,
      description: "Medical testing and analysis",
      color: "bg-yellow-500",
    },
  ];

  const filteredDepartments = departments.filter((dept) =>
    dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dept.head.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div 
        className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-500 p-3 rounded-lg">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Department Management</h2>
              <p className="text-sm text-gray-600">
                Manage hospital departments and their staff
              </p>
            </div>
          </div>
          <Button 
            onClick={() => setIsAddModalOpen(true)} 
            className="gap-2 bg-blue-600 hover:bg-blue-700 shadow-md"
          >
            <Plus className="h-4 w-4" />
            Add Department
          </Button>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="p-4 bg-white border-l-4 border-l-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Departments</p>
              <p className="text-2xl font-bold text-gray-800">{departments.length}</p>
            </div>
            <Building2 className="h-8 w-8 text-blue-500" />
          </div>
        </Card>
        <Card className="p-4 bg-white border-l-4 border-l-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Staff</p>
              <p className="text-2xl font-bold text-gray-800">
                {departments.reduce((acc, dept) => acc + dept.staffCount, 0)}
              </p>
            </div>
            <Users className="h-8 w-8 text-green-500" />
          </div>
        </Card>
        <Card className="p-4 bg-white border-l-4 border-l-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Staff/Dept</p>
              <p className="text-2xl font-bold text-gray-800">
                {Math.round(departments.reduce((acc, dept) => acc + dept.staffCount, 0) / departments.length)}
              </p>
            </div>
            <Users className="h-8 w-8 text-purple-500" />
          </div>
        </Card>
      </motion.div>

      {/* Search */}
      <motion.div 
        className="relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <Input
          placeholder="Search departments by name or head..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
        />
      </motion.div>

      {/* Departments Grid */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
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
        {filteredDepartments.map((dept) => (
          <motion.div
            key={dept.id}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <Card className="p-6 hover:shadow-xl transition-all duration-300 border-t-4 relative overflow-hidden group">
              {/* Color accent */}
              <div className={`absolute top-0 left-0 right-0 h-1 ${dept.color}`} />
              
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className={`${dept.color} p-2.5 rounded-lg`}>
                    <Building2 className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">{dept.name}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{dept.description}</p>
                  </div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-blue-50">
                    <Edit className="h-4 w-4 text-blue-600" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-red-50">
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="bg-gray-100 p-1.5 rounded">
                    <Users className="h-4 w-4 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">Department Head</p>
                    <p className="text-sm font-medium text-gray-800">{dept.head}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-gray-100 p-1.5 rounded">
                    <Users className="h-4 w-4 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">Staff Members</p>
                    <p className="text-sm font-medium text-gray-800">{dept.staffCount} members</p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {filteredDepartments.length === 0 && (
        <motion.div 
          className="text-center py-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Building2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No departments found matching your search.</p>
          <p className="text-gray-400 text-sm mt-2">Try adjusting your search terms</p>
        </motion.div>
      )}

      <AddDepartmentModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />
    </div>
  );
}
