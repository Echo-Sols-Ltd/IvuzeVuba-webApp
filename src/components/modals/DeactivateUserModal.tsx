"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { API_ENDPOINTS, getAuthHeaders } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface DeactivateUserModalProps {
  staffId: string;
  userName: string;
  isActive?: boolean;
  onSuccess?: () => void;
}

export default function DeactivateUserModal({ staffId, userName, isActive = true, onSuccess }: DeactivateUserModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleToggleActivation = async () => {
    setLoading(true);
    try {
      // If currently active, deactivate. If inactive, activate (update isAvailable to true)
      let response;
      
      if (isActive) {
        // Deactivate
        response = await fetch(API_ENDPOINTS.STAFF.DEACTIVATE(staffId), {
          method: "POST",
          headers: getAuthHeaders(),
        });
      } else {
        // Activate - use update endpoint to set isAvailable to true
        response = await fetch(API_ENDPOINTS.STAFF.UPDATE(staffId), {
          method: "PUT",
          headers: getAuthHeaders(),
          body: JSON.stringify({ isAvailable: true }),
        });
      }

      if (response.ok) {
        toast({
          title: "Success",
          description: isActive 
            ? "Staff member deactivated successfully" 
            : "Staff member activated successfully",
        });
        setOpen(false);
        onSuccess?.();
      } else {
        const error = await response.text();
        toast({
          title: "Error",
          description: error || `Failed to ${isActive ? 'deactivate' : 'activate'} staff member`,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${isActive ? 'deactivate' : 'activate'} staff member`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {isActive ? (
          <Button variant="destructive">Deactivate</Button>
        ) : (
          <Button variant="default" className="bg-green-600 hover:bg-green-700">Activate</Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-w-md rounded-xl">
        <DialogHeader>
          <DialogTitle className={isActive ? "text-red-600" : "text-green-600"}>
            {isActive ? "DEACTIVATE ALERT" : "ACTIVATE STAFF"}
          </DialogTitle>
        </DialogHeader>

        {isActive ? (
          <>
            <p className="text-gray-700">
              Are you sure you want to deactivate the account of <strong>{userName}</strong>?
            </p>
            <p className="text-sm text-gray-500 mt-2">
              This will make the staff member unavailable for new appointments.
            </p>
          </>
        ) : (
          <>
            <p className="text-gray-700">
              Are you sure you want to activate the account of <strong>{userName}</strong>?
            </p>
            <p className="text-sm text-gray-500 mt-2">
              This will make the staff member available for new appointments.
            </p>
          </>
        )}

        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
            Cancel
          </Button>
          <Button 
            variant={isActive ? "destructive" : "default"}
            className={!isActive ? "bg-green-600 hover:bg-green-700" : ""}
            onClick={handleToggleActivation} 
            disabled={loading}
          >
            {loading 
              ? (isActive ? "Deactivating..." : "Activating...") 
              : (isActive ? "Deactivate" : "Activate")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
