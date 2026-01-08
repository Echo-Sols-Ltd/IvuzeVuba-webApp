"use client";

import { useState, useEffect } from "react";
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


interface EditUserModalProps {
  staffId: string;
  userName: string;
  userEmail: string;
  department?: string;
  specialization?: string;
  isAvailable?: boolean;
  onSuccess?: () => void;
}

interface Department {
  id: string;
  name: string;
}

export default function EditUserModal({ 
  staffId,
  userName, 
  userEmail,
  department,
  specialization,
  isAvailable,
  onSuccess 
}: EditUserModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState<Department[]>([]);
  const { toast } = useToast();

  const nameParts = userName.split(" ");
  const [formData, setFormData] = useState({
    firstName: nameParts[0] || "",
    lastName: nameParts.slice(1).join(" ") || "",
    email: userEmail || "",
    phoneNumber: "",
    licenseNumber: "",
    specialization: specialization || "",
    departmentId: "",
    isAvailable: isAvailable ?? true,
  });

  useEffect(() => {
    if (open) {
      fetchDepartments();
    }
  }, [open]);

  const fetchDepartments = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.DEPARTMENTS.LIST, {
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        const data = await response.json();
        setDepartments(data);
        
        // Set current department if exists
        const currentDept = data.find((d: Department) => d.name === department);
        if (currentDept) {
          setFormData(prev => ({ ...prev, departmentId: currentDept.id }));
        }
      }
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setLoading(true);
    try {
      const response = await fetch(API_ENDPOINTS.STAFF.UPDATE(staffId), {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Staff member updated successfully",
        });
        setOpen(false);
        onSuccess?.();
      } else {
        const error = await response.text();
        toast({
          title: "Error",
          description: error || "Failed to update staff member",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update staff member",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Edit</Button>
      </DialogTrigger>

      <DialogContent className="max-w-lg rounded-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Staff Member</DialogTitle>
          <DialogDescription>
            Update staff member details
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              placeholder="+1 777 808 80"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="license">License Number</Label>
              <Input
                id="license"
                value={formData.licenseNumber}
                onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                placeholder="LIC123456"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="specialization">Specialization</Label>
              <Input
                id="specialization"
                value={formData.specialization}
                onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                placeholder="Cardiology"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Department</Label>
            <Select
              value={formData.departmentId}
              onValueChange={(value) => setFormData({ ...formData, departmentId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.id}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="available"
              checked={formData.isAvailable}
              onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <Label htmlFor="available" className="cursor-pointer">
              Available for appointments
            </Label>
          </div>

          <Button type="submit" className="w-full mt-4" disabled={loading}>
            {loading ? "Updating..." : "Update Staff Member →"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
