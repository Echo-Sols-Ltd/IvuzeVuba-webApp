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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { API_ENDPOINTS, getAuthHeaders } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface AddMedicationModalProps {
  onSuccess?: () => void;
}

export default function AddMedicationModal({ onSuccess }: AddMedicationModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    medicineName: "",
    category: "",
    stockQuantity: "",
    stockExpiryDate: "",
    supplierName: "",
    supplierContact: "",
    storageInstructions: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.medicineName || !formData.category || !formData.stockQuantity) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(API_ENDPOINTS.INVENTORY.CREATE, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          ...formData,
          stockQuantity: parseInt(formData.stockQuantity),
        }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Medication added successfully",
        });
        setOpen(false);
        setFormData({
          medicineName: "",
          category: "",
          stockQuantity: "",
          stockExpiryDate: "",
          supplierName: "",
          supplierContact: "",
          storageInstructions: "",
        });
        onSuccess?.();
      } else {
        const errorData = await response.json().catch(() => ({ message: "Failed to add medication" }));
        toast({
          title: "Error",
          description: errorData.message || "Failed to add medication",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add medication",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary">Add medication</Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Add Medication</DialogTitle>
          <DialogDescription>
            Add a new medication to inventory
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Medicine name *</Label>
              <Input
                id="name"
                placeholder="Amoxillin"
                value={formData.medicineName}
                onChange={(e) => setFormData({ ...formData, medicineName: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Antibiotic">Antibiotic</SelectItem>
                  <SelectItem value="Analgesic">Analgesic</SelectItem>
                  <SelectItem value="Vaccine">Vaccine</SelectItem>
                  <SelectItem value="Painkiller">Painkiller</SelectItem>
                  <SelectItem value="Vitamin">Vitamin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Current Stock Quantity *</Label>
              <Input
                id="quantity"
                type="number"
                placeholder="500"
                value={formData.stockQuantity}
                onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expiry">Current stock expiry date</Label>
              <Input
                id="expiry"
                type="date"
                value={formData.stockExpiryDate}
                onChange={(e) => setFormData({ ...formData, stockExpiryDate: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="supplier">Initial Supplier Name</Label>
              <Input
                id="supplier"
                placeholder="INPA ltd co."
                value={formData.supplierName}
                onChange={(e) => setFormData({ ...formData, supplierName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contacts">Initial Supplier Contacts</Label>
              <Input
                id="contacts"
                placeholder="+250 988 9988 88"
                value={formData.supplierContact}
                onChange={(e) => setFormData({ ...formData, supplierContact: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="storage">Storage Instructions</Label>
            <Input
              id="storage"
              placeholder="Enter any storage instructions for the medicine"
              value={formData.storageInstructions}
              onChange={(e) => setFormData({ ...formData, storageInstructions: e.target.value })}
            />
          </div>

          <Button type="submit" className="w-full mt-4 bg-primary text-white" disabled={loading}>
            {loading ? "Adding..." : "ADD MEDICATION →"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
