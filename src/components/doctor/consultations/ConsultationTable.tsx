"use client";

import { Download, ChevronLeft, ChevronRight } from "lucide-react";
import * as XLSX from "xlsx";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const consultations = [
  {
    date: "2020-04-05",
    patient: "King Faisal",
    department: "Pediatrics",
    doctor: "Dr John Doe",
    diagnosis: "Heart follow up",
    duration: "penicillin 2",
    status: "completed",
    cost: "150 000 rwf",
  },
  {
    date: "2020-04-05",
    patient: "King Faisal",
    department: "Pediatrics",
    doctor: "Dr John Doe",
    diagnosis: "Heart follow up",
    duration: "penicillin 2",
    status: "completed",
    cost: "150 000 rwf",
  },
];

export default function ConsultationTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const totalPages = Math.ceil(consultations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentConsultations = consultations.slice(startIndex, endIndex);

  const handleExport = () => {
    const worksheet = XLSX.utils.json_to_sheet(consultations);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Consultations");
    XLSX.writeFile(workbook, "consultations.xlsx");
  };

  const handleDownloadSingle = (consultation: typeof consultations[0]) => {
    const worksheet = XLSX.utils.json_to_sheet([consultation]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Consultation");
    XLSX.writeFile(workbook, `consultation_${consultation.patient.replace(/\s+/g, "_")}.xlsx`);
  };

  return (
    <div className="bg-white shadow rounded-lg border p-4">
      <div className="flex justify-end mb-4">
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 text-sm border rounded hover:bg-gray-50"
        >
          <Download className="w-4 h-4" />
          Export to Excel
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Patient</th>
              <th className="px-4 py-2 text-left">Department</th>
              <th className="px-4 py-2 text-left">Doctor</th>
              <th className="px-4 py-2 text-left">Diagnosis</th>
              <th className="px-4 py-2 text-left">Duration</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentConsultations.map((c, i) => (
              <tr key={i} className="border-b">
                <td className="px-4 py-2">{c.date}</td>
                <td className="px-4 py-2">{c.patient}</td>
                <td className="px-4 py-2">{c.department}</td>
                <td className="px-4 py-2">{c.doctor}</td>
                <td className="px-4 py-2">{c.diagnosis}</td>
                <td className="px-4 py-2">{c.duration}</td>
                <td className="px-4 py-2">{c.status}</td>
                <td className="px-4 py-2">
                  <button 
                    onClick={() => handleDownloadSingle(c)}
                    className="p-2 rounded hover:bg-gray-100"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-700">
            Showing {startIndex + 1} to {Math.min(endIndex, consultations.length)} of {consultations.length} results
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage - 1)}
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
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
