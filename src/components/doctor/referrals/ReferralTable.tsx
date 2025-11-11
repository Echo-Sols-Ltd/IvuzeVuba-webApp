"use client";

import { Download, ChevronLeft, ChevronRight } from "lucide-react";
import * as XLSX from "xlsx";
import { useState } from "react";
import { Button } from "@/components/ui/button";

type Referral = {
  date: string;
  patient: string;
  department: string;
  specialist: string;
  reason: string;
  urgency: "Urgent" | "semi-urgent" | "normal";
  status: string;
};

const referrals: Referral[] = [
  {
    date: "2020-04-5",
    patient: "King Faisal",
    department: "Pediatrics",
    specialist: "Dr John Doe",
    reason: "Heart follow up",
    urgency: "Urgent",
    status: "completed",
  },
  {
    date: "2020-04-5",
    patient: "King Faisal",
    department: "Pediatrics",
    specialist: "Dr John Doe",
    reason: "Heart follow up",
    urgency: "semi-urgent",
    status: "pending",
  },
];

export default function ReferralTable({ data }: { data?: Referral[] }) {
  const tableData = data || referrals;
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const totalPages = Math.ceil(tableData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentReferrals = tableData.slice(startIndex, endIndex);

  const handleExport = (records: Referral[], filename = "referrals.xlsx") => {
    const worksheet = XLSX.utils.json_to_sheet(records);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Referrals");
    XLSX.writeFile(workbook, filename);
  };

  return (
    <div className="bg-white shadow rounded-lg border p-4">
      {/* Export All */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => handleExport(tableData, "referrals.xlsx")}
          className="flex items-center gap-2 px-4 py-2 text-sm border rounded hover:bg-gray-50"
        >
          <Download className="w-4 h-4" />
          Export All
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
              <th className="px-4 py-2 text-left">Specialist</th>
              <th className="px-4 py-2 text-left">Reason</th>
              <th className="px-4 py-2 text-left">Urgency</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentReferrals.map((r, i) => (
              <tr key={i} className="border-b">
                <td className="px-4 py-2">{r.date}</td>
                <td className="px-4 py-2">{r.patient}</td>
                <td className="px-4 py-2">{r.department}</td>
                <td className="px-4 py-2">{r.specialist}</td>
                <td className="px-4 py-2">{r.reason}</td>
                <td
                  className={`px-4 py-2 font-medium ${
                    r.urgency === "Urgent"
                      ? "text-red-600"
                      : r.urgency === "semi-urgent"
                      ? "text-green-600"
                      : "text-gray-600"
                  }`}
                >
                  {r.urgency}
                </td>
                <td className="px-4 py-2">{r.status}</td>
                <td className="px-4 py-2">                  
                  <button
                    onClick={() =>
                      handleExport([r], `${r.patient.replace(/\s+/g, "_")}.xlsx`)
                    }
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
            Showing {startIndex + 1} to {Math.min(endIndex, tableData.length)} of {tableData.length} results
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
