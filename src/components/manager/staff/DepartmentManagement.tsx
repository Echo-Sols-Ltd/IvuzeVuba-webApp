"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Plus, Search, Users, Edit2, Trash2, Building2 } from "lucide-react";
import AddDepartmentModal, { DepartmentFormData } from "@/components/modals/AddDepartmentModal";
import { API_ENDPOINTS, getAuthHeaders } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface DepartmentHead {
  id: string;
  name: string;
  email?: string;
}

interface Department {
  id: string;
  name: string;
  head: DepartmentHead | string;
  staffCount: number;
  description: string;
}

export default function DepartmentManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDepartment, setCurrentDepartment] = useState<DepartmentFormData | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const handleEdit = (dept: Department) => {
    setCurrentDepartment({
      id: dept.id,
      name: dept.name,
      description: dept.description,
      headId: typeof dept.head === 'string' ? '' : dept.head?.id || '',
      staffCount: dept.staffCount
    });
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setCurrentDepartment(null);
    setIsModalOpen(true);
  };

  const fetchDepartments = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(API_ENDPOINTS.DEPARTMENTS.LIST, {
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        const data = await response.json();
        const transformedDepts = data.map((dept: any) => {
          const head = dept.head 
            ? typeof dept.head === 'string' 
              ? dept.head 
              : { 
                  id: dept.head.id || '', 
                  name: dept.head.name || 'Unassigned',
                  email: dept.head.email
                }
            : 'Not Assigned';
            
          return {
            id: dept.id,
            name: dept.name,
            head: head,
            staffCount: dept.staffCount || 0,
            description: dept.description || "No description available",
          };
        });
        
        setDepartments(transformedDepts);
      } else {
        const errorText = await response.text();
        console.error("Failed to fetch departments:", response.status, errorText);
        toast({
          title: "Error",
          description: `Failed to load departments: ${errorText}`,
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Error fetching departments:", err);
      toast({
        title: "Error",
        description: "Failed to load departments",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this department? This cannot be undone.")) {
      return;
    }

    try {
      const response = await fetch(API_ENDPOINTS.DEPARTMENTS.DELETE(id), {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Department deleted successfully",
        });
        fetchDepartments();
      } else {
        const error = await response.text();
        toast({
          title: "Error",
          description: error || "Failed to delete department",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Error deleting department:", err);
      toast({
        title: "Error",
        description: "Failed to delete department",
        variant: "destructive",
      });
    }
  };

  const filteredDepartments = departments.filter((dept) => {
    const headName = typeof dept.head === 'string' 
      ? dept.head 
      : dept.head?.name || '';
      
    return (
      dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      headName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

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
          <div className="flex gap-2">
            <Button 
              onClick={handleAddNew}
              className="gap-2 bg-blue-600 hover:bg-blue-700 shadow-md"
            >
              <Plus className="h-4 w-4" />
              Add Department
            </Button>
          </div>
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
                {departments.reduce((sum, dept) => sum + (dept.staffCount || 0), 0)}
              </p>
            </div>
            <Users className="h-8 w-8 text-green-500" />
          </div>
        </Card>
        <Card className="p-4 bg-white border-l-4 border-l-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Average Staff/Dept</p>
              <p className="text-2xl font-bold text-gray-800">
                {departments.length > 0 
                  ? Math.round(departments.reduce((sum, dept) => sum + (dept.staffCount || 0), 0) / departments.length * 10) / 10 
                  : 0}
              </p>
            </div>
            <Users className="h-8 w-8 text-purple-500" />
          </div>
        </Card>
      </motion.div>

      {/* Search and Filter */}
      <motion.div
        className="bg-white p-4 rounded-lg shadow-sm border"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search departments..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </motion.div>

      {/* Departments List */}
      <motion.div
        className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {loading ? (
          <div className="col-span-3 flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredDepartments.length > 0 ? (
          filteredDepartments.map((dept) => (
            <Card key={dept.id} className="overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-200 hover:border-blue-200">
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Building2 className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-gray-800">{dept.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Head: {typeof dept.head === 'string' 
                          ? dept.head 
                          : dept.head?.name || 'No head assigned'}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-8 w-8 hover:bg-blue-50 hover:border-blue-200"
                      onClick={() => handleEdit(dept)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                      onClick={() => handleDelete(dept.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {dept.description}
                </p>
                <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                  <span className="flex items-center text-gray-600 text-sm">
                    <Users className="h-4 w-4 mr-2" />
                    <span className="font-medium">{dept.staffCount}</span>
                    <span className="ml-1">{dept.staffCount === 1 ? 'member' : 'members'}</span>
                  </span>
                  <span className="text-blue-600 hover:text-blue-800 cursor-pointer text-sm font-medium">
                    View all →
                  </span>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="col-span-3 text-center py-8 text-gray-500">
            No departments found. Try adjusting your search or add a new department.
          </div>
        )}
      </motion.div>

      {/* Add/Edit Department Modal */}
      <AddDepartmentModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setCurrentDepartment(null);
        }}
        onSuccess={() => {
          fetchDepartments();
          setIsModalOpen(false);
        }}
        department={currentDepartment}
      />
    </div>
  );
}
