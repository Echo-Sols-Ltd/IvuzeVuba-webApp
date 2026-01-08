"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { API_ENDPOINTS, getAuthHeaders } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface Prescription {
  id?: string;
  medicationName: string;
  dosage: string;
  duration: string;
  frequency: string;
  instructions?: string;
  createdAt: string;
}

export default function PrescriptionForm() {
  const [form, setForm] = useState({
    medication: "",
    dosage: "",
    duration: "",
    frequency: "",
    instructions: "",
  });
  const [loading, setLoading] = useState(false);
  const [existingPrescriptions, setExistingPrescriptions] = useState<Prescription[]>([]);
  const { toast } = useToast();
  const params = useParams();
  const patientId = params?.patientId;

  useEffect(() => {
    if (patientId) {
      fetchExistingPrescriptions();
    }
  }, [patientId]);

  const fetchExistingPrescriptions = async () => {
    try {
      // Note: You may need to create this endpoint in the backend
      const response = await fetch(`${API_ENDPOINTS.DOCTOR.BASE}/prescriptions/${patientId}`, {
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        const data = await response.json();
        setExistingPrescriptions(data);
      }
    } catch (error) {
      console.error("Error fetching prescriptions:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.medication || !form.dosage || !form.duration || !form.frequency) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const prescriptionData = {
        patientId,
        medicationName: form.medication,
        dosage: form.dosage,
        durationDays: parseInt(form.duration) || 7,
        frequencyPerDay: parseInt(form.frequency) || 1,
        instructions: form.instructions,
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + (parseInt(form.duration) || 7) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      };

      const response = await fetch(`${API_ENDPOINTS.DOCTOR.BASE}/chart/add-prescription`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(prescriptionData),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Prescription created successfully!",
        });
        setForm({
          medication: "",
          dosage: "",
          duration: "",
          frequency: "",
          instructions: "",
        });
        fetchExistingPrescriptions(); // Refresh the prescriptions list
      } else {
        const error = await response.text();
        toast({
          title: "Error",
          description: error || "Failed to create prescription",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create prescription",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Existing Prescriptions */}
      {existingPrescriptions.length > 0 && (
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium mb-3">Recent Prescriptions</h3>
          <div className="space-y-3 max-h-40 overflow-y-auto">
            {existingPrescriptions.slice(0, 3).map((prescription, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg border">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm font-medium text-gray-700">{prescription.medicationName}</span>
                  <span className="text-xs text-gray-500">
                    {new Date(prescription.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  <p>Dosage: {prescription.dosage}</p>
                  <p>Duration: {prescription.duration}</p>
                  <p>Frequency: {prescription.frequency}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* New Prescription Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow rounded-lg p-6 max-w-md"
      >
        <h2 className="text-lg font-semibold mb-4">Prescription builder</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Medication *</label>
            <input
              type="text"
              name="medication"
              value={form.medication}
              onChange={handleChange}
              placeholder="Medicine name"
              required
              className="mt-1 w-full rounded border px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Dosage *</label>
            <input
              type="text"
              name="dosage"
              value={form.dosage}
              onChange={handleChange}
              placeholder="e.g., 500mg"
              required
              className="mt-1 w-full rounded border px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Duration (days) *</label>
            <input
              type="number"
              name="duration"
              value={form.duration}
              onChange={handleChange}
              placeholder="e.g., 7"
              required
              min="1"
              className="mt-1 w-full rounded border px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Frequency (times per day) *</label>
            <input
              type="number"
              name="frequency"
              value={form.frequency}
              onChange={handleChange}
              placeholder="e.g., 2"
              required
              min="1"
              max="6"
              className="mt-1 w-full rounded border px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Specific instructions</label>
            <textarea
              name="instructions"
              value={form.instructions}
              onChange={handleChange}
              placeholder="Please enter any specific instructions for these medicines"
              className="mt-1 w-full rounded border px-3 py-2 text-sm"
              rows={3}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded bg-blue-600 text-white py-2 font-medium hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create prescription"}
        </button>
      </form>
    </div>
  );
}
