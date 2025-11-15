import React, { useState } from "react";
import PaymentAnalytics from "./PaymentAnalytics";
import PaymentSettings from "./PaymentSettings";
import PaymentList from "./PaymentList";
import { Payment } from "@/lib/doctorApi";

interface PaymentsTabProps {
  searchQuery?: string;
  statusFilter?: string;
  payments: Payment[];
}

const PaymentsTab: React.FC<PaymentsTabProps> = ({ searchQuery = "", statusFilter = "all", payments }) => {
  const [tab, setTab] = useState("Recent");

  return (
    <div>
      {/* Tab navigation */}
      <div className="flex border-b mb-4">
        <button
          onClick={() => setTab("Recent")}
          className={`px-4 py-2 transition-colors ${
            tab === "Recent" ? "border-b-2 border-blue-500 font-semibold text-blue-600" : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Recent Payments
        </button>
        <button
          onClick={() => setTab("Analytics")}
          className={`px-4 py-2 transition-colors ${
            tab === "Analytics" ? "border-b-2 border-blue-500 font-semibold text-blue-600" : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Analytics
        </button>
        <button
          onClick={() => setTab("Settings")}
          className={`px-4 py-2 transition-colors ${
            tab === "Settings" ? "border-b-2 border-blue-500 font-semibold text-blue-600" : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Payment settings
        </button>
      </div>

      {/* Tab content */}
      {tab === "Recent" && <PaymentList payments={payments} searchQuery={searchQuery} statusFilter={statusFilter} />}
      {tab === "Analytics" && <PaymentAnalytics />}
      {tab === "Settings" && <PaymentSettings />}
    </div>
  );
};

export default PaymentsTab;
