"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/doctor/Navbar";
import PatientSidebar from "@/components/patient/PatientSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, ChevronLeft, ChevronRight, Search } from "lucide-react";
import * as XLSX from "xlsx";

interface Department {
  id: string;
  name: string;
}

export default function ViewVisitsPage() {
  const [isMobile, setIsMobile] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [visits, setVisits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const fetchDepartments = async () => {
    try {
      const { getDepartments } = await import("@/lib/patientApi");
      const data = await getDepartments();
      setDepartments([{ id: "all", name: "All Departments" }, ...data]);
    } catch (error) {
      console.error('Error fetching departments:', error);
      setDepartments([{ id: "all", name: "All Departments" }]);
    }
  };

  const fetchVisits = async () => {
    try {
      setLoading(true);
      const { getAppointments } = await import("@/lib/patientApi");
      const data = await getAppointments();
      console.log('Fetched appointments:', data);
      
      // Transform API data to match table format
      const transformedVisits = data.map((apt: any, index: number) => ({
        id: apt.id || `apt-${index + 1}`,
        date: apt.scheduledTime 
          ? new Date(apt.scheduledTime).toLocaleDateString() 
          : apt.preferredDate 
            ? new Date(apt.preferredDate).toLocaleDateString()
            : 'N/A',
        time: apt.scheduledTime 
          ? new Date(apt.scheduledTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          : 'Not scheduled',
        facility: apt.hospitalName || "Hospital",
        department: apt.departmentName || "N/A",
        departmentId: apt.departmentId || "",
        doctor: apt.doctorName || apt.assignedDoctorName || "Not assigned yet",
        diagnosis: apt.reason || apt.diagnosis || "N/A",
        prescription: apt.prescriptionId ? "View Prescription" : "N/A",
        payment: apt.paymentStatus || "PENDING",
        status: apt.status || "PENDING",
        hasDownload: apt.status === "COMPLETED" || apt.status === "COMPLETE",
        queuePosition: apt.queuePosition,
      }));
      
      console.log('Transformed visits:', transformedVisits);
      setVisits(transformedVisits);
    } catch (error) {
      console.error('Error fetching visits:', error);
      setVisits([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
    fetchVisits();
  }, []);

  // Refresh data when page becomes visible (e.g., after creating a new visit)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchVisits();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const filteredVisits = visits.filter((visit) => {
    const matchesDepartment =
      selectedDepartment === "" ||
      selectedDepartment === "all" ||
      visit.departmentId === selectedDepartment ||
      visit.department.toLowerCase().includes(selectedDepartment.toLowerCase());
    const matchesSearch =
      searchQuery === "" ||
      visit.facility.toLowerCase().includes(searchQuery.toLowerCase()) ||
      visit.doctor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      visit.diagnosis.toLowerCase().includes(searchQuery.toLowerCase()) ||
      visit.department.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesDepartment && matchesSearch;
  });

  const totalPages = Math.ceil(filteredVisits.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentVisits = filteredVisits.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleDownload = (visit: typeof visits[0]) => {
    const worksheet = XLSX.utils.json_to_sheet([visit]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Visit");
    XLSX.writeFile(workbook, `visit_${visit.id}_${visit.date}.xlsx`);
  };

  const handleDownloadAll = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredVisits);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Visits");
    XLSX.writeFile(workbook, "all_visits.xlsx");
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
      PENDING: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' },
      CONFIRMED: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Confirmed' },
      IN_PROGRESS: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'In Progress' },
      COMPLETED: { bg: 'bg-green-100', text: 'text-green-800', label: 'Completed' },
      COMPLETE: { bg: 'bg-green-100', text: 'text-green-800', label: 'Completed' },
      CANCELLED: { bg: 'bg-red-100', text: 'text-red-800', label: 'Cancelled' },
      NO_SHOW: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'No Show' },
    };

    const config = statusConfig[status] || { bg: 'bg-gray-100', text: 'text-gray-800', label: status };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading visits...</p>
        </div>
      </div>
    );
  }

  if (isMobile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <PatientSidebar isCollapsed={false} />
        <div className="pt-20 px-4 space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Visit Details</h1>
            <p className="text-gray-600 mt-2">See appointment details</p>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col gap-3">
              <Select
                value={selectedDepartment}
                onValueChange={setSelectedDepartment}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Filter Department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Button
                onClick={fetchVisits}
                variant="outline"
                className="w-full mb-2"
                disabled={loading}
              >
                {loading ? "Refreshing..." : "Refresh"}
              </Button>
              <Button
                onClick={handleDownloadAll}
                variant="outline"
                className="w-full"
              >
                <Download className="h-4 w-4 mr-2" />
                Export All Visits
              </Button>
            </div>

            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px]">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date & Time
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Department
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Doctor
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Reason
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Payment
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentVisits.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                          <div className="flex flex-col items-center justify-center">
                            <p className="text-lg font-medium">No visits found</p>
                            <p className="text-sm mt-1">
                              {searchQuery || selectedDepartment !== "" && selectedDepartment !== "all"
                                ? "Try adjusting your filters"
                                : "You haven't submitted any appointments yet"}
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      currentVisits.map((visit) => (
                      <tr key={visit.id} className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          <div className="text-gray-900 font-medium">{visit.date}</div>
                          <div className="text-gray-500 text-xs">{visit.time}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          {visit.department}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              visit.doctor === 'Not assigned yet' 
                                ? 'bg-yellow-100 text-yellow-800' 
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {visit.doctor === 'Not assigned yet' ? (
                                <span className="flex items-center">
                                  <span className="w-2 h-2 rounded-full bg-yellow-500 mr-1.5"></span>
                                  Not assigned yet
                                </span>
                              ) : (
                                <span className="flex items-center">
                                  <span className="w-2 h-2 rounded-full bg-green-500 mr-1.5"></span>
                                  {visit.doctor}
                                </span>
                              )}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          <div className="max-w-xs truncate" title={visit.diagnosis}>
                            {visit.diagnosis}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          {getStatusBadge(visit.status)}
                          {visit.queuePosition && (
                            <div className="text-xs text-gray-500 mt-1">
                              Queue: #{visit.queuePosition}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            visit.payment === 'PAID' || visit.payment === 'COMPLETED'
                              ? 'bg-green-100 text-green-800'
                              : visit.payment === 'PENDING'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {visit.payment}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          {visit.hasDownload && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => handleDownload(visit)}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing {startIndex + 1} to{" "}
                  {Math.min(endIndex, filteredVisits.length)} of{" "}
                  {filteredVisits.length} results
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-gray-700">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex pt-8">
        <PatientSidebar isCollapsed={false} />
        <main className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Visit Details
              </h1>
              <p className="text-gray-600 mt-2">See appointment details</p>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Select
                  value={selectedDepartment}
                  onValueChange={setSelectedDepartment}
                >
                  <SelectTrigger className="w-64">
                    <SelectValue placeholder="Filter Department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button
                  onClick={fetchVisits}
                  variant="outline"
                  className="flex items-center gap-2"
                  disabled={loading}
                >
                  {loading ? "Refreshing..." : "Refresh"}
                </Button>

                <Button
                  onClick={handleDownloadAll}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Export All
                </Button>
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1000px]">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date & Time
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Department
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Doctor
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Reason
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Payment
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentVisits.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                          <div className="flex flex-col items-center justify-center">
                            <p className="text-lg font-medium">No visits found</p>
                            <p className="text-sm mt-1">
                              {searchQuery || selectedDepartment !== "" && selectedDepartment !== "all"
                                ? "Try adjusting your filters"
                                : "You haven't submitted any appointments yet"}
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      currentVisits.map((visit) => (
                      <tr key={visit.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="text-gray-900 font-medium">{visit.date}</div>
                          <div className="text-gray-500 text-xs">{visit.time}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {visit.department}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                              visit.doctor === 'Not assigned yet' 
                                ? 'bg-yellow-100 text-yellow-800' 
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {visit.doctor === 'Not assigned yet' ? (
                                <span className="flex items-center">
                                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500 mr-2"></span>
                                  Not assigned yet
                                </span>
                              ) : (
                                <span className="flex items-center">
                                  <span className="w-2.5 h-2.5 rounded-full bg-green-500 mr-2"></span>
                                  {visit.doctor}
                                </span>
                              )}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          <div className="max-w-xs truncate" title={visit.diagnosis}>
                            {visit.diagnosis}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {getStatusBadge(visit.status)}
                          {visit.queuePosition && (
                            <div className="text-xs text-gray-500 mt-1">
                              Queue: #{visit.queuePosition}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            visit.payment === 'PAID' || visit.payment === 'COMPLETED'
                              ? 'bg-green-100 text-green-800'
                              : visit.payment === 'PENDING'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {visit.payment}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {visit.hasDownload && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => handleDownload(visit)}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing {startIndex + 1} to{" "}
                  {Math.min(endIndex, filteredVisits.length)} of{" "}
                  {filteredVisits.length} results
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-gray-700">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
