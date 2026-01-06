"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Activity, FileText, ClipboardList, AlertTriangle } from "lucide-react";
import { usePatientAuth } from "@/hooks/useAuth";
import LoadingSpinner from "@/components/LoadingSpinner";
import { 
  getVitalSigns, 
  getClinicalNotes, 
  getMedicalOrders, 
  getClinicalAlerts,
  VitalSigns,
  ClinicalNote,
  MedicalOrder,
  ClinicalAlert
} from "@/lib/patientApi";

const MedicalRecordsPage = () => {
  const { isAuthenticated, isLoading } = usePatientAuth();
  const [activeTab, setActiveTab] = useState("vitals");
  const [loading, setLoading] = useState(true);
  const [vitalSigns, setVitalSigns] = useState<VitalSigns[]>([]);
  const [clinicalNotes, setClinicalNotes] = useState<ClinicalNote[]>([]);
  const [medicalOrders, setMedicalOrders] = useState<MedicalOrder[]>([]);
  const [clinicalAlerts, setClinicalAlerts] = useState<ClinicalAlert[]>([]);

  useEffect(() => {
    const fetchMedicalRecords = async () => {
      try {
        setLoading(true);
        const [vitals, notes, orders, alerts] = await Promise.all([
          getVitalSigns(),
          getClinicalNotes(),
          getMedicalOrders(),
          getClinicalAlerts(),
        ]);

        setVitalSigns(vitals);
        setClinicalNotes(notes);
        setMedicalOrders(orders);
        setClinicalAlerts(alerts);
      } catch (error) {
        console.error('Error fetching medical records:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchMedicalRecords();
    }
  }, [isAuthenticated]);

  if (isLoading || !isAuthenticated) {
    return <LoadingSpinner />;
  }

  const tabs = [
    { id: "vitals", label: "Vital Signs", icon: Activity, count: vitalSigns.length },
    { id: "notes", label: "Clinical Notes", icon: FileText, count: clinicalNotes.length },
    { id: "orders", label: "Medical Orders", icon: ClipboardList, count: medicalOrders.length },
    { id: "alerts", label: "Clinical Alerts", icon: AlertTriangle, count: clinicalAlerts.length },
  ];

  const renderVitalSigns = () => (
    <div className="space-y-4">
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : vitalSigns.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Activity className="w-12 h-12 mx-auto mb-3 text-gray-400" />
          <p>No vital signs recorded yet</p>
        </div>
      ) : (
        vitalSigns.map((vital) => (
          <div key={vital.id} className="bg-white rounded-lg border p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-medium text-gray-900">Vital Signs</h3>
              <span className="text-sm text-gray-500">
                {new Date(vital.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {vital.systolicBp && vital.diastolicBp && (
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600">Blood Pressure</p>
                  <p className="text-lg font-semibold text-blue-600">
                    {vital.systolicBp}/{vital.diastolicBp}
                  </p>
                </div>
              )}
              {vital.heartRate && (
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <p className="text-sm text-gray-600">Heart Rate</p>
                  <p className="text-lg font-semibold text-red-600">
                    {vital.heartRate} bpm
                  </p>
                </div>
              )}
              {vital.temperature && (
                <div className="text-center p-3 bg-yellow-50 rounded-lg">
                  <p className="text-sm text-gray-600">Temperature</p>
                  <p className="text-lg font-semibold text-yellow-600">
                    {vital.temperature}°{vital.temperatureUnit}
                  </p>
                </div>
              )}
              {vital.oxygenSaturation && (
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-gray-600">SpO₂</p>
                  <p className="text-lg font-semibold text-green-600">
                    {vital.oxygenSaturation}%
                  </p>
                </div>
              )}
            </div>
            {vital.notes && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700">{vital.notes}</p>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );

  const renderClinicalNotes = () => (
    <div className="space-y-4">
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : clinicalNotes.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <FileText className="w-12 h-12 mx-auto mb-3 text-gray-400" />
          <p>No clinical notes available</p>
        </div>
      ) : (
        clinicalNotes.map((note) => (
          <div key={note.id} className="bg-white rounded-lg border p-6">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  {note.title || "Clinical Note"}
                </h3>
                <span className="text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded">
                  {note.noteType}
                </span>
              </div>
              <span className="text-sm text-gray-500">
                {new Date(note.createdAt).toLocaleDateString()}
              </span>
            </div>
            <p className="text-gray-700 whitespace-pre-wrap">{note.content}</p>
          </div>
        ))
      )}
    </div>
  );

  const renderMedicalOrders = () => (
    <div className="space-y-4">
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : medicalOrders.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <ClipboardList className="w-12 h-12 mx-auto mb-3 text-gray-400" />
          <p>No medical orders found</p>
        </div>
      ) : (
        medicalOrders.map((order) => (
          <div key={order.id} className="bg-white rounded-lg border p-6">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{order.orderName}</h3>
                <div className="flex gap-2 mt-1">
                  <span className="text-sm text-purple-600 bg-purple-100 px-2 py-1 rounded">
                    {order.orderType}
                  </span>
                  <span className={`text-sm px-2 py-1 rounded ${
                    order.status === 'COMPLETED' ? 'text-green-600 bg-green-100' :
                    order.status === 'IN_PROGRESS' ? 'text-blue-600 bg-blue-100' :
                    order.status === 'CANCELLED' ? 'text-red-600 bg-red-100' :
                    'text-yellow-600 bg-yellow-100'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
              <span className="text-sm text-gray-500">
                {new Date(order.createdAt).toLocaleDateString()}
              </span>
            </div>
            {order.description && (
              <p className="text-gray-700 mb-2">{order.description}</p>
            )}
            {order.instructions && (
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm font-medium text-blue-900">Instructions:</p>
                <p className="text-sm text-blue-700">{order.instructions}</p>
              </div>
            )}
            {order.results && (
              <div className="mt-3 p-3 bg-green-50 rounded-lg">
                <p className="text-sm font-medium text-green-900">Results:</p>
                <p className="text-sm text-green-700">{order.results}</p>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );

  const renderClinicalAlerts = () => (
    <div className="space-y-4">
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : clinicalAlerts.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <AlertTriangle className="w-12 h-12 mx-auto mb-3 text-gray-400" />
          <p>No clinical alerts</p>
        </div>
      ) : (
        clinicalAlerts.map((alert) => (
          <div key={alert.id} className={`rounded-lg border-l-4 p-6 ${
            alert.severity === 'CRITICAL' ? 'border-l-red-500 bg-red-50' :
            alert.severity === 'HIGH' ? 'border-l-orange-500 bg-orange-50' :
            alert.severity === 'MEDIUM' ? 'border-l-yellow-500 bg-yellow-50' :
            'border-l-blue-500 bg-blue-50'
          }`}>
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{alert.title}</h3>
                <div className="flex gap-2 mt-1">
                  <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                    {alert.alertType}
                  </span>
                  <span className={`text-sm px-2 py-1 rounded ${
                    alert.severity === 'CRITICAL' ? 'text-red-600 bg-red-100' :
                    alert.severity === 'HIGH' ? 'text-orange-600 bg-orange-100' :
                    alert.severity === 'MEDIUM' ? 'text-yellow-600 bg-yellow-100' :
                    'text-blue-600 bg-blue-100'
                  }`}>
                    {alert.severity}
                  </span>
                </div>
              </div>
              <span className="text-sm text-gray-500">
                {new Date(alert.createdAt).toLocaleDateString()}
              </span>
            </div>
            <p className="text-gray-700">{alert.message}</p>
          </div>
        ))
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="font-semibold text-2xl">Medical Records</h1>
        <p className="text-gray-600">
          View your medical history, vital signs, and clinical information
        </p>
      </motion.div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
                {tab.count > 0 && (
                  <span className="bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === "vitals" && renderVitalSigns()}
        {activeTab === "notes" && renderClinicalNotes()}
        {activeTab === "orders" && renderMedicalOrders()}
        {activeTab === "alerts" && renderClinicalAlerts()}
      </motion.div>
    </div>
  );
};

export default MedicalRecordsPage;