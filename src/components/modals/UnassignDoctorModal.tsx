"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { API_ENDPOINTS, getAuthHeaders } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface UnassignDoctorModalProps {
  appointmentId: string;
  patientName: string;
  assignedDoctorName: string;
  onRefresh?: () => void;
}

export default function UnassignDoctorModal({ 
  appointmentId, 
  patientName, 
  assignedDoctorName,
  onRefresh 
}: UnassignDoctorModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleUnassign = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_ENDPOINTS.QUEUE.UNASSIGN_DOCTOR, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          appointmentId,
        }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Doctor unassigned successfully",
        });
        setOpen(false);
        onRefresh?.();
      } else {
        const error = await response.text();
        toast({
          title: "Error",
          description: error || "Failed to unassign doctor",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to unassign doctor",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="bg-sky-100 text-sky-700 border-sky-300 hover:bg-sky-200"
        >
          Unassign
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md rounded-xl">
        <DialogHeader>
          <DialogTitle>Unassign Doctor from {patientName}</DialogTitle>
          <DialogDescription>
            Are you sure you want to unassign Dr. {assignedDoctorName} from this appointment?
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-3 justify-end">
          <Button 
            variant="outline" 
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleUnassign} 
            disabled={loading}
          >
            {loading ? "Unassigning..." : "Unassign Doctor"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}