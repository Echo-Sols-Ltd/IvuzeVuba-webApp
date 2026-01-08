"use client";

import { useState } from "react";
import TodayVisitCard from "./TodayVisitCard";
import ClinicalNotes from "./ClinicalNotes";
import PrescriptionForm from "./PrescriptionForm";
import VitalsForm from "./VitalsForm";
import ClinicalAlerts from "./ClinicalAlerts";
import Orders from "./Orders";

const tabs = ["Today", "Notes", "Vitals", "Prescriptions", "Orders", "Alerts"];

export default function PatientTabs() {
  const [activeTab, setActiveTab] = useState("Today");

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-6 border-b">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-2 py-2 text-sm font-medium transition ${
              activeTab === tab
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === "Today" && <TodayVisitCard />}
        {activeTab === "Notes" && <ClinicalNotes />}
        {activeTab === "Prescriptions" && <PrescriptionForm />}
        {activeTab === "Vitals" && <VitalsForm />}
        {activeTab === "Alerts" && <ClinicalAlerts />}
        {activeTab === "Orders" && <Orders />}
        {activeTab !== "Today" && activeTab !== "Notes" && activeTab !== "Prescriptions" && activeTab !== "Vitals" && activeTab !== "Alerts" && activeTab !== "Orders" && (
          <p className="text-gray-500 text-sm">No data available</p>
        )}
      </div>
    </div>
  );
}
