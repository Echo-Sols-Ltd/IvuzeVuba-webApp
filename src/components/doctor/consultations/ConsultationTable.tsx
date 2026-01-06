"use client";

import { Download, ChevronLeft, ChevronRight } from "lucide-react";
import * as XLSX from "xlsx";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Consultation } from "@/lib/doctorApi";

interface ConsultationTableProps {
  consultations: Consultation[];
}

export default function ConsultationTable({ consultations }: ConsultationTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const totalPages = Math.ceil(consultations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentConsultations = consultations.slice(startIndex, endIndex);

  const handleExport = () => {
    const exportData = consultations.map(c => ({
      Date: c.date,
      Patient: c.patientName,
      "Patient ID": c.patientId.substring(0, 8),
      Diagnosis: c.diagnosis || "N/A",
      Status: c.status,
      Duration: c.duration ? `${c.duration} min` : "N/A",
    }));
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Consultations");
    XLSX.writeFile(workbook, "consultations.xlsx");
  };

  const handleDownloadSingle = (consultation: Consultation) => {
    const exportData = [{
      Date: consultation.date,
      Patient: consultation.patientName,
      "Patient ID": consultation.patientId.substring(0, 8),
      Diagnosis: consultation.diagnosis || "N/A",
      Status: consultation.status,
      Duration: consultation.duration ? `${consultation.duration} min` : "N/A",
    }];
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Consultation");
    XLSX.writeFile(workbook, `consultation_${consultation.patientName.replace(/\s+/g, "_")}.xlsx`);
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
              <th className="px-4 py-2 text-left">Patient ID</th>
              <th className="px-4 py-2 text-left">Diagnosis</th>
              <th className="px-4 py-2 text-left">Duration</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentConsultations.length > 0 ? (
              currentConsultations.map((c, i) => (
                <tr key={c.id || i} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{new Date(c.date).toLocaleDateString()}</td>
                  <td className="px-4 py-2">{c.patientName}</td>
                  <td className="px-4 py-2">{c.patientId.substring(0, 8)}</td>
                  <td className="px-4 py-2">{c.diagnosis || "N/A"}</td>
                  <td className="px-4 py-2">{c.duration ? `${c.duration} min` : "N/A"}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded text-xs ${
                      c.status === "completed" ? "bg-green-100 text-green-800" :
                      c.status === "in-progress" ? "bg-blue-100 text-blue-800" :
                      "bg-gray-100 text-gray-800"
                    }`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <button 
                      onClick={() => handleDownloadSingle(c)}
                      className="p-2 rounded hover:bg-gray-100"
                      title="Download consultation record"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                  No consultations found
                </td>
              </tr>
            )}
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
