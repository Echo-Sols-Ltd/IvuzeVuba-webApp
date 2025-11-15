"use client";

import { useState } from "react";
import ReferralTable from "./ReferralTable";
import { Referral } from "@/lib/doctorApi";

type ReferralLocal = {
  date: string;
  patient: string;
  department: string;
  specialist: string;
  reason: string;
  urgency: "Urgent" | "semi-urgent" | "normal";
  status: string;
};

interface ReferralTabsProps {
  searchQuery?: string;
  statusFilter?: string;
  outgoingReferrals: Referral[];
  incomingReferrals: Referral[];
}

export default function ReferralTabs({ 
  searchQuery = "", 
  statusFilter = "all",
  outgoingReferrals,
  incomingReferrals 
}: ReferralTabsProps) {
  const [activeTab, setActiveTab] = useState<"Outgoing" | "Incoming">("Outgoing");

  // Transform API data to component format
  const transformReferral = (referral: Referral): ReferralLocal => ({
    date: new Date(referral.date).toLocaleDateString(),
    patient: referral.patientName,
    department: "N/A", // Not provided by API
    specialist: referral.referredTo || referral.referredFrom || "N/A",
    reason: referral.reason,
    urgency: "normal", // Map from API if available
    status: referral.status,
  });

  const outgoing = outgoingReferrals.map(transformReferral);
  const incoming = incomingReferrals.map(transformReferral);

  // Filter referrals based on search and status
  const filterReferrals = (referrals: ReferralLocal[]) => {
    return referrals.filter((referral) => {
      const matchesSearch =
        !searchQuery ||
        referral.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
        referral.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        referral.specialist.toLowerCase().includes(searchQuery.toLowerCase()) ||
        referral.reason.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        referral.status.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  };

  const filteredOutgoing = filterReferrals(outgoing);
  const filteredIncoming = filterReferrals(incoming);

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        <button
          className={`px-4 py-2 rounded-t-md font-medium transition-colors ${
            activeTab === "Outgoing"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
          onClick={() => setActiveTab("Outgoing")}
        >
          Outgoing ({filteredOutgoing.length})
        </button>
        <button
          className={`px-4 py-2 rounded-t-md font-medium transition-colors ${
            activeTab === "Incoming"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
          onClick={() => setActiveTab("Incoming")}
        >
          Incoming ({filteredIncoming.length})
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "Outgoing" ? (
        filteredOutgoing.length > 0 ? (
          <ReferralTable data={filteredOutgoing} />
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No outgoing referrals found matching your search criteria.</p>
          </div>
        )
      ) : (
        filteredIncoming.length > 0 ? (
          <ReferralTable data={filteredIncoming} />
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No incoming referrals found matching your search criteria.</p>
          </div>
        )
      )}
    </div>
  );
}
