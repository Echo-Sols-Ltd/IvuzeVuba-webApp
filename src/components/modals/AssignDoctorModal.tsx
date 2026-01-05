"use client";

import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { API_ENDPOINTS, getAuthHeaders } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface AssignDoctorModalProps {
  appointmentId: string;
  patientName: string;
  onRefresh?: () => void;
}

interface Doctor {
  id: string;
  firstName: string;
  lastName: string;
  departmentName: string;
}

export default function AssignDoctorModal({ appointmentId, patientName, onRefresh }: AssignDoctorModalProps) {
  const [open, setOpen] = useState(false);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  // Function to send notification
  const sendNotification = async (patientId: string, doctorName: string) => {
    try {
      const headers = getAuthHeaders();
      headers['Content-Type'] = 'application/json';
      
      const response = await fetch('/api/notifications/send', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          userId: patientId,
          type: 'info',
          title: 'Doctor Assigned',
          message: `Dr. ${doctorName} has been assigned to your appointment`,
        }),
      });

      if (!response.ok) {
        console.error('Failed to send notification');
      }
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  };

  useEffect(() => {
    if (open) {
      fetchDoctors();
    }
  }, [open]);

  const fetchDoctors = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.QUEUE.AVAILABLE_DOCTORS, {
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        const data = await response.json();
        setDoctors(data);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch available doctors",
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
    }
  };

  const handleAssign = async () => {
    if (!selectedDoctorId) {
      toast({
        title: "Error",
        description: "Please select a doctor",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // First get the doctor's name for the notification
      const selectedDoctor = doctors.find(doc => doc.id === selectedDoctorId);
      
      const response = await fetch(API_ENDPOINTS.QUEUE.ASSIGN_DOCTOR, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          appointmentId,
          doctorId: selectedDoctorId,
        }),
      });

      if (response.ok) {
        // Get the patient ID from the appointment
        const appointmentResponse = await fetch(`${API_ENDPOINTS.PATIENT.APPOINTMENTS}/${appointmentId}`, {
          headers: getAuthHeaders(),
        });
        
        if (appointmentResponse.ok) {
          const appointment = await appointmentResponse.json();
          // Send notification to the patient
          if (appointment.patientId && selectedDoctor) {
            await sendNotification(
              appointment.patientId,
              `${selectedDoctor.firstName} ${selectedDoctor.lastName}`
            );
          }
        }

        toast({
          title: "Success",
          description: "Doctor assigned successfully",
        });
        setOpen(false);
        onRefresh?.();
      } else {
        const error = await response.text();
        toast({
          title: "Error",
          description: error || "Failed to assign doctor",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to assign doctor",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">Assign Doctor</Button>
      </DialogTrigger>

      <DialogContent className="max-w-md rounded-xl">
        <DialogHeader>
          <DialogTitle>Assign Doctor To {patientName}</DialogTitle>
          <DialogDescription>
            Select a doctor to assign to this appointment.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="doctor">Doctor</Label>
            <Select value={selectedDoctorId} onValueChange={setSelectedDoctorId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a doctor" />
              </SelectTrigger>
              <SelectContent>
                {doctors.map((doctor) => (
                  <SelectItem key={doctor.id} value={doctor.id}>
                    Dr. {doctor.firstName} {doctor.lastName} - {doctor.departmentName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button className="w-full" onClick={handleAssign} disabled={loading}>
            {loading ? "Assigning..." : "Assign Doctor →"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
