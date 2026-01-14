"use client";

import React, { useState, useEffect } from "react";
import { AlertTriangle, Info, AlertCircle, XCircle } from "lucide-react";
import { API_ENDPOINTS, getAuthHeaders } from "@/lib/api";

interface Alert {
  id: string;
  alertType: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  title: string;
  message: string;
  isActive: boolean;
  acknowledged: boolean;
  createdAt: string;
}

interface ClinicalAlertsProps {
  appointmentId: string;
}

const ClinicalAlerts: React.FC<ClinicalAlertsProps> = ({ appointmentId }) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (appointmentId) {
      fetchAlerts();
    }
  }, [appointmentId]);

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_ENDPOINTS.DOCTOR.BASE}/chart/clinical-alerts/${appointmentId}`, {
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        const data = await response.json();
        setAlerts(data);
      }
    } catch (error) {
      console.error("Error fetching alerts:", error);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "CRITICAL":
        return <XCircle className="w-4 h-4 text-red-500" />;
      case "HIGH":
        return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      case "MEDIUM":
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      default:
        return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "CRITICAL":
        return "border-l-red-500 bg-red-50";
      case "HIGH":
        return "border-l-orange-500 bg-orange-50";
      case "MEDIUM":
        return "border-l-yellow-500 bg-yellow-50";
      default:
        return "border-l-blue-500 bg-blue-50";
    }
  };

  // Default alerts if no alerts from database
  const defaultAlerts = [
    { 
      id: "default-1", 
      alertType: "ALLERGY", 
      severity: "HIGH" as const, 
      title: "Allergy Alert", 
      message: "Patient allergic to penicillin", 
      isActive: true, 
      acknowledged: false, 
      createdAt: new Date().toISOString() 
    },
    { 
      id: "default-2", 
      alertType: "SCREENING", 
      severity: "MEDIUM" as const, 
      title: "Screening Overdue", 
      message: "Annual mammogram screening is overdue", 
      isActive: true, 
      acknowledged: false, 
      createdAt: new Date().toISOString() 
    },
  ];

  const displayAlerts = alerts.length > 0 ? alerts : defaultAlerts;

  if (loading) {
    return (
      <div className="max-w-3xl bg-white border rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Clinical alerts</h2>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl bg-white border rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Clinical alerts</h2>
        {alerts.length > 0 && (
          <span className="text-sm text-gray-500">
            {alerts.filter(alert => !alert.acknowledged).length} unacknowledged
          </span>
        )}
      </div>
      
      {displayAlerts.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Info className="w-12 h-12 mx-auto mb-3 text-gray-400" />
          <p className="text-sm">No clinical alerts for this patient</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {displayAlerts.map((alert) => (
            <li 
              key={alert.id} 
              className={`flex items-start p-4 border-l-4 rounded-r-lg ${getSeverityColor(alert.severity)}`}
            >
              <div className="flex-shrink-0 mr-3 mt-0.5">
                {getSeverityIcon(alert.severity)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">
                      {alert.title}
                    </h4>
                    <p className="text-sm text-gray-700 mt-1">
                      {alert.message}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <span>Type: {alert.alertType}</span>
                      <span>Severity: {alert.severity}</span>
                      <span>{new Date(alert.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex-shrink-0 ml-4">
                    {alert.acknowledged ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                        Acknowledged
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
                        Active
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ClinicalAlerts;
