"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { API_ENDPOINTS, getAuthHeaders } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface Doctor {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  departmentName?: string;
}

interface ReferralModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointmentId: string;
  patientName: string;
  onSuccess: () => void;
}

export default function ReferralModal({
  isOpen,
  onClose,
  appointmentId,
  patientName,
  onSuccess,
}: ReferralModalProps) {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>("");
  const [referralReason, setReferralReason] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [fetchingDoctors, setFetchingDoctors] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      fetchAvailableDoctors();
    }
  }, [isOpen]);

  const fetchAvailableDoctors = async () => {
    setFetchingDoctors(true);
    try {
      const response = await fetch(API_ENDPOINTS.DOCTOR.AVAILABLE_DOCTORS, {
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        const data = await response.json();
        setDoctors(data);
      } else {
        const errorText = await response.text();
        console.error("Failed to fetch doctors:", response.status, errorText);
        toast({
          title: "Error",
          description: `Failed to fetch available doctors: ${response.status}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching doctors:", error);
      toast({
        title: "Error",
        description: "Failed to fetch available doctors",
        variant: "destructive",
      });
    } finally {
      setFetchingDoctors(false);
    }
  };

  const handleReferral = async () => {
    if (!selectedDoctorId) {
      toast({
        title: "Error",
        description: "Please select a doctor for referral",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${API_ENDPOINTS.DOCTOR.BASE}/referrals/add-referral/${appointmentId}/${selectedDoctorId}`,
        {
          method: "PATCH",
          headers: getAuthHeaders(),
        }
      );

      if (response.ok) {
        toast({
          title: "Success",
          description: `${patientName} has been referred successfully`,
        });
        onSuccess();
        handleClose();
      } else {
        const error = await response.text();
        console.error("Referral failed:", response.status, error);
        toast({
          title: "Error",
          description: error || `Failed to refer patient (${response.status})`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Referral error:", error);
      toast({
        title: "Error",
        description: "Failed to refer patient. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedDoctorId("");
    setReferralReason("");
    onClose();
  };

  const selectedDoctor = doctors.find(d => d.id === selectedDoctorId);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Refer Patient</DialogTitle>
          <DialogDescription>
            Refer {patientName} to another doctor for specialized care.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Doctor Selection */}
          <div className="space-y-2">
            <Label htmlFor="doctor-select">Select Doctor</Label>
            {fetchingDoctors ? (
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <Select value={selectedDoctorId} onValueChange={setSelectedDoctorId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a doctor..." />
                </SelectTrigger>
                <SelectContent>
                  {doctors.map((doctor) => (
                    <SelectItem key={doctor.id} value={doctor.id}>
                      <div className="flex flex-col">
                        <span className="font-medium">
                          Dr. {doctor.firstName} {doctor.lastName}
                        </span>
                        {doctor.departmentName && (
                          <span className="text-sm text-gray-500">
                            {doctor.departmentName}
                          </span>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Referral Reason */}
          <div className="space-y-2">
            <Label htmlFor="referral-reason">Referral Reason (Optional)</Label>
            <Textarea
              id="referral-reason"
              placeholder="Enter reason for referral..."
              value={referralReason}
              onChange={(e) => setReferralReason(e.target.value)}
              rows={3}
            />
          </div>

          {/* Selected Doctor Info */}
          {selectedDoctor && (
            <div className="p-3 bg-blue-50 rounded-lg border">
              <p className="text-sm font-medium text-blue-900">
                Referring to: Dr. {selectedDoctor.firstName} {selectedDoctor.lastName}
              </p>
              {selectedDoctor.departmentName && (
                <p className="text-sm text-blue-700">
                  Department: {selectedDoctor.departmentName}
                </p>
              )}
              <p className="text-sm text-blue-700">
                Email: {selectedDoctor.email}
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-end pt-4">
          <Button variant="outline" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button 
            onClick={handleReferral} 
            disabled={loading || !selectedDoctorId}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {loading ? "Referring..." : "Refer Patient"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}