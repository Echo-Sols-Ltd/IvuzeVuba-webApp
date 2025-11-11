"use client";

import { useState, useEffect } from "react";
import { Search, Download, X } from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import * as XLSX from "xlsx";

interface Prescription {
  id: string;
  name: string;
  status: "active" | "completed" | "expired";
  prescribedDate: string;
  location: string;
  duration: string;
  endDate: string;
  dosage: string;
  frequency: string;
  instructions: string[];
  sideEffects: string[];
  prescribedBy: string;
  startDate: string;
}

const PrescriptionsPage = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPrescription, setSelectedPrescription] =
    useState<Prescription | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const departments = [
    { value: "all", label: "All Departments" },
    { value: "cardiology", label: "Cardiology" },
    { value: "neurology", label: "Neurology" },
    { value: "orthopedics", label: "Orthopedics" },
    { value: "pediatrics", label: "Pediatrics" },
  ];

  const prescriptions: Prescription[] = [
    {
      id: "1",
      name: "Amoxicillin",
      status: "active",
      prescribedDate: "2024-07-05",
      location: "King Faisal",
      duration: "2 weeks",
      endDate: "2024-07-19",
      dosage: "500 mg",
      frequency: "3 times a day",
      instructions: ["Taken with food", "Don't drink milk in the mean time"],
      sideEffects: ["Nausea", "Stomach upset"],
      prescribedBy: "Dr Sharma",
      startDate: "2024-07-05",
    },
    {
      id: "2",
      name: "Ibuprofen",
      status: "active",
      prescribedDate: "2024-07-03",
      location: "King Faisal",
      duration: "1 week",
      endDate: "2024-07-10",
      dosage: "400 mg",
      frequency: "2 times a day",
      instructions: ["Take after meals", "Avoid alcohol"],
      sideEffects: ["Dizziness", "Stomach irritation"],
      prescribedBy: "Dr Sharma",
      startDate: "2024-07-03",
    },
    {
      id: "3",
      name: "Paracetamol",
      status: "completed",
      prescribedDate: "2024-06-20",
      location: "King Faisal",
      duration: "5 days",
      endDate: "2024-06-25",
      dosage: "500 mg",
      frequency: "4 times a day",
      instructions: ["Take as needed for fever", "Stay hydrated"],
      sideEffects: ["Rare side effects"],
      prescribedBy: "Dr Sharma",
      startDate: "2024-06-20",
    },
    {
      id: "4",
      name: "Omeprazole",
      status: "completed",
      prescribedDate: "2024-06-15",
      location: "King Faisal",
      duration: "2 weeks",
      endDate: "2024-06-29",
      dosage: "20 mg",
      frequency: "Once daily",
      instructions: ["Take on empty stomach", "Avoid late meals"],
      sideEffects: ["Headache", "Diarrhea"],
      prescribedBy: "Dr Sharma",
      startDate: "2024-06-15",
    },
    {
      id: "5",
      name: "Cetirizine",
      status: "expired",
      prescribedDate: "2024-05-10",
      location: "King Faisal",
      duration: "1 month",
      endDate: "2024-06-10",
      dosage: "10 mg",
      frequency: "Once daily",
      instructions: ["Take in the evening", "Avoid driving if drowsy"],
      sideEffects: ["Drowsiness", "Dry mouth"],
      prescribedBy: "Dr Sharma",
      startDate: "2024-05-10",
    },
    {
      id: "6",
      name: "Metformin",
      status: "expired",
      prescribedDate: "2024-05-01",
      location: "King Faisal",
      duration: "3 months",
      endDate: "2024-08-01",
      dosage: "500 mg",
      frequency: "Twice daily",
      instructions: ["Take with meals", "Monitor blood sugar"],
      sideEffects: ["Nausea", "Diarrhea"],
      prescribedBy: "Dr Sharma",
      startDate: "2024-05-01",
    },
  ];

  const filteredPrescriptions = prescriptions.filter((prescription) => {
    const matchesDepartment =
      selectedDepartment === "all" ||
      prescription.location.toLowerCase().includes(selectedDepartment);
    const matchesSearch =
      prescription.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prescription.prescribedBy
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    return matchesDepartment && matchesSearch;
  });

  const activePrescriptions = filteredPrescriptions.filter(
    (p) => p.status === "active"
  );
  const completedPrescriptions = filteredPrescriptions.filter(
    (p) => p.status === "completed"
  );
  const expiredPrescriptions = filteredPrescriptions.filter(
    (p) => p.status === "expired"
  );

  const handleViewDetails = (prescription: Prescription) => {
    setSelectedPrescription(prescription);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPrescription(null);
  };

  const handleDownloadPrescription = (prescription: Prescription) => {
    const worksheet = XLSX.utils.json_to_sheet([prescription]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Prescription");
    XLSX.writeFile(workbook, `prescription_${prescription.name.replace(/\s+/g, "_")}.xlsx`);
  };

  const handleDownloadAll = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredPrescriptions);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Prescriptions");
    XLSX.writeFile(workbook, "all_prescriptions.xlsx");
  };

  const PrescriptionCard = ({
    prescription,
  }: {
    prescription: Prescription;
  }) => (
    <motion.div 
      className="bg-white rounded-lg border p-4 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse-soft"></div>
          <span className="text-sm text-gray-600">
            Prescribed: {prescription.prescribedDate}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <span className="text-sm text-gray-600">
            Location: {prescription.location}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <span className="text-sm text-gray-600">
            Duration: {prescription.duration}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <span className="text-sm text-gray-600">
            End date: {prescription.endDate}
          </span>
        </div>
      </div>
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          onClick={() => handleViewDetails(prescription)}
          variant="outline"
          className="w-full mt-4 border-black text-black hover:bg-black hover:text-white transition-all duration-300"
        >
          View Details
        </Button>
      </motion.div>
    </motion.div>
  );

  if (isMobile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <PatientSidebar />
        <div className="pt-20 px-4 space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              My prescriptions
            </h1>
            <p className="text-gray-600 mt-1">Manage your medications</p>
          </div>

          <div className="space-y-3">
            <Select
              value={selectedDepartment}
              onValueChange={setSelectedDepartment}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter Department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept.value} value={dept.value}>
                    {dept.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Tabs defaultValue="active" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="active">
                Active({activePrescriptions.length})
              </TabsTrigger>
              <TabsTrigger value="completed">
                Completed({completedPrescriptions.length})
              </TabsTrigger>
              <TabsTrigger value="expired">
                Expired({expiredPrescriptions.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="mt-4">
              <div className="grid grid-cols-1 gap-4">
                {activePrescriptions.map((prescription) => (
                  <PrescriptionCard
                    key={prescription.id}
                    prescription={prescription}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="completed" className="mt-4">
              <div className="grid grid-cols-1 gap-4">
                {completedPrescriptions.map((prescription) => (
                  <PrescriptionCard
                    key={prescription.id}
                    prescription={prescription}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="expired" className="mt-4">
              <div className="grid grid-cols-1 gap-4">
                {expiredPrescriptions.map((prescription) => (
                  <PrescriptionCard
                    key={prescription.id}
                    prescription={prescription}
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-20 flex">
        <div className="w-64 flex-shrink-0">
          <PatientSidebar />
        </div>
        <div className="flex-1 p-6 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold text-gray-900">
              My prescriptions
            </h1>
            <p className="text-gray-600 mt-2">Manage your medications</p>
          </motion.div>

          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Select
                value={selectedDepartment}
                onValueChange={setSelectedDepartment}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter Department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept.value} value={dept.value}>
                      {dept.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            </div>

            <Button
              onClick={handleDownloadAll}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export All
            </Button>
          </div>

          <Tabs defaultValue="active" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="active">
                Active({activePrescriptions.length})
              </TabsTrigger>
              <TabsTrigger value="completed">
                Completed({completedPrescriptions.length})
              </TabsTrigger>
              <TabsTrigger value="expired">
                Expired({expiredPrescriptions.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activePrescriptions.map((prescription) => (
                  <PrescriptionCard
                    key={prescription.id}
                    prescription={prescription}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="completed" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {completedPrescriptions.map((prescription) => (
                  <PrescriptionCard
                    key={prescription.id}
                    prescription={prescription}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="expired" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {expiredPrescriptions.map((prescription) => (
                  <PrescriptionCard
                    key={prescription.id}
                    prescription={prescription}
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Prescription Details Modal */}
      {isModalOpen && selectedPrescription && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">
                Prescription details
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={closeModal}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      Medical information
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-gray-700">
                          Name: {selectedPrescription.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-gray-700">
                          Dosage: {selectedPrescription.dosage}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-gray-700">
                          Duration: {selectedPrescription.duration}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-gray-700">
                          Frequency: {selectedPrescription.frequency}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      Instructions
                    </h3>
                    <div className="space-y-3">
                      {selectedPrescription.instructions.map(
                        (instruction, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span className="text-gray-700">{instruction}</span>
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      Possible side-effects
                    </h3>
                    <div className="space-y-3">
                      {selectedPrescription.sideEffects.map((effect, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="text-gray-700">{effect}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Prescription information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-gray-700">
                        Prescribed by: {selectedPrescription.prescribedBy}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-gray-700">
                        Location: {selectedPrescription.location}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-gray-700">
                        Start Date: {selectedPrescription.startDate}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-gray-700">
                        End date: {selectedPrescription.endDate}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-8 pt-6 border-t">
                <Button 
                  onClick={() => handleDownloadPrescription(selectedPrescription)}
                  className="flex-1 bg-black text-white hover:bg-gray-800"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download prescription
                </Button>
                <Button
                  variant="outline"
                  onClick={closeModal}
                  className="flex-1 border-black text-black hover:bg-black hover:text-white"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrescriptionsPage;
