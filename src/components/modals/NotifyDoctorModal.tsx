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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { API_ENDPOINTS, getAuthHeaders } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface NotifyDoctorModalProps {
  appointmentId: string;
  patientName: string;
  onRefresh?: () => void;
}

export default function NotifyDoctorModal({ appointmentId, patientName, onRefresh }: NotifyDoctorModalProps) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleNotify = async () => {
    if (!message.trim()) {
      toast({
        title: "Error",
        description: "Please enter a notification message",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_ENDPOINTS.QUEUE.DELAYED.replace('/delayed', '')}/notify/${appointmentId}`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          description: message,
        }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Notification sent successfully",
        });
        setMessage("");
        setOpen(false);
        onRefresh?.();
      } else {
        const error = await response.text();
        toast({
          title: "Error",
          description: error || "Failed to send notification",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send notification",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Notify</Button>
      </DialogTrigger>

      <DialogContent className="max-w-md rounded-xl">
        <DialogHeader>
          <DialogTitle>Send Notification for {patientName}</DialogTitle>
          <DialogDescription>
            Enter a notification message for the assigned doctor.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Textarea 
            placeholder="Enter notification message..." 
            className="min-h-[120px]"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button className="w-full" onClick={handleNotify} disabled={loading}>
            {loading ? "Sending..." : "Notify →"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
