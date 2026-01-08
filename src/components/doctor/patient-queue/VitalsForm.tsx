"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { API_ENDPOINTS, getAuthHeaders } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface VitalSign {
  id?: string;
  bloodPressure?: string;
  systolicBp?: number;
  diastolicBp?: number;
  heartRate?: number;
  temperature?: number;
  temperatureUnit?: string;
  spO2?: number;
  oxygenSaturation?: number;
  weight?: number;
  height?: number;
  createdAt: string;
}

export default function VitalsForm() {
  const [vitals, setVitals] = useState({
    bloodPressure: "",
    heartRate: "",
    temperature: "",
    spO2: "",
    weight: "",
    height: "",
  });
  const [loading, setLoading] = useState(false);
  const [existingVitals, setExistingVitals] = useState<VitalSign[]>([]);
  const { toast } = useToast();
  const params = useParams();
  const patientId = params?.patientId;

  useEffect(() => {
    if (patientId) {
      fetchExistingVitals();
    }
  }, [patientId]);

  const fetchExistingVitals = async () => {
    try {
      const response = await fetch(`${API_ENDPOINTS.DOCTOR.BASE}/chart/vital-signs/${patientId}`, {
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        const data = await response.json();
        setExistingVitals(data);
      }
    } catch (error) {
      console.error("Error fetching vitals:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setVitals((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Parse blood pressure
      const bpParts = vitals.bloodPressure.split('/');
      const systolicBp = bpParts[0] ? parseInt(bpParts[0]) : null;
      const diastolicBp = bpParts[1] ? parseInt(bpParts[1]) : null;

      const vitalSignsData = {
        patientId,
        systolicBp,
        diastolicBp,
        heartRate: vitals.heartRate ? parseInt(vitals.heartRate) : null,
        temperature: vitals.temperature ? parseFloat(vitals.temperature) : null,
        temperatureUnit: "F",
        oxygenSaturation: vitals.spO2 ? parseInt(vitals.spO2.replace('%', '')) : null,
        weight: vitals.weight ? parseFloat(vitals.weight) : null,
        weightUnit: "lbs",
        height: vitals.height ? parseFloat(vitals.height.replace(/['"]/g, '')) : null,
        heightUnit: "in",
      };

      const response = await fetch(`${API_ENDPOINTS.DOCTOR.BASE}/chart/vital-signs`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(vitalSignsData),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Vital signs saved successfully!",
        });
        setVitals({
          bloodPressure: "",
          heartRate: "",
          temperature: "",
          spO2: "",
          weight: "",
          height: "",
        });
        fetchExistingVitals(); // Refresh the vitals list
      } else {
        const error = await response.text();
        toast({
          title: "Error",
          description: error || "Failed to save vital signs",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save vital signs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Existing Vitals */}
      {existingVitals.length > 0 && (
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium mb-3">Recent Vital Signs</h3>
          <div className="space-y-3 max-h-40 overflow-y-auto">
            {existingVitals.slice(0, 3).map((vital, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg border">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm font-medium text-gray-700">Vital Signs</span>
                  <span className="text-xs text-gray-500">
                    {new Date(vital.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                  {vital.systolicBp && vital.diastolicBp && (
                    <span>BP: {vital.systolicBp}/{vital.diastolicBp}</span>
                  )}
                  {vital.heartRate && <span>HR: {vital.heartRate} bpm</span>}
                  {vital.temperature && <span>Temp: {vital.temperature}°{vital.temperatureUnit}</span>}
                  {vital.oxygenSaturation && <span>SpO₂: {vital.oxygenSaturation}%</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* New Vitals Form */}
      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 max-w-md">
        <h2 className="text-lg font-semibold mb-4">Vital Signs</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Blood Pressure
            </label>
            <input
              type="text"
              name="bloodPressure"
              value={vitals.bloodPressure}
              onChange={handleChange}
              placeholder="e.g., 120/80"
              className="mt-1 w-full rounded border px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Heart rate
            </label>
            <input
              type="text"
              name="heartRate"
              value={vitals.heartRate}
              onChange={handleChange}
              placeholder="e.g., 72"
              className="mt-1 w-full rounded border px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Temperature
            </label>
            <input
              type="text"
              name="temperature"
              value={vitals.temperature}
              onChange={handleChange}
              placeholder="e.g., 98.6"
              className="mt-1 w-full rounded border px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              SpO₂
            </label>
            <input
              type="text"
              name="spO2"
              value={vitals.spO2}
              onChange={handleChange}
              placeholder="e.g., 98%"
              className="mt-1 w-full rounded border px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Weight
            </label>
            <input
              type="text"
              name="weight"
              value={vitals.weight}
              onChange={handleChange}
              placeholder="e.g., 145"
              className="mt-1 w-full rounded border px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Height
            </label>
            <input
              type="text"
              name="height"
              value={vitals.height}
              onChange={handleChange}
              placeholder="e.g., 66 (inches)"
              className="mt-1 w-full rounded border px-3 py-2 text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}
