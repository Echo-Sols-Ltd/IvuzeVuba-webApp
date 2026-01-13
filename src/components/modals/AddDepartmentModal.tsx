"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Building2 } from "lucide-react";
import { API_ENDPOINTS, getAuthHeaders } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export interface DepartmentFormData {
  id?: string;
  name: string;
  description: string;
  headId?: string;
  staffCount?: number;
}

interface AddDepartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  department?: DepartmentFormData | null;
}

export default function AddDepartmentModal({ 
  isOpen, 
  onClose, 
  onSuccess, 
  department 
}: AddDepartmentModalProps) {
  const [formData, setFormData] = useState<DepartmentFormData>({
    name: "",
    description: "",
    headId: "",
    staffCount: 0,
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Update form data when department prop changes
  useEffect(() => {
    if (department) {
      setFormData({
        id: department.id,
        name: department.name,
        description: department.description || '',
        headId: department.headId || '',
        staffCount: department.staffCount || 0
      });
    } else {
      setFormData({
        name: "",
        description: "",
        headId: "",
        staffCount: 0
      });
    }
  }, [department]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.name.trim()) {
      toast({
        title: "Error",
        description: "Department name is required",
        variant: "destructive",
      });
      return;
    }

    if (!formData.description || !formData.description.trim()) {
      toast({
        title: "Error",
        description: "Department description is required",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const isEdit = !!formData.id;
      const url = isEdit 
        ? API_ENDPOINTS.DEPARTMENTS.UPDATE(formData.id as string)
        : API_ENDPOINTS.DEPARTMENTS.CREATE;
      
      const method = isEdit ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify({
          name: formData.name.trim(),
          description: formData.description.trim(),
          headId: formData.headId || null,
        }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: `Department ${isEdit ? 'updated' : 'created'} successfully`,
        });
        setFormData({ name: "", description: "", headId: "", staffCount: 0 });
        onSuccess?.();
        onClose();
      } else {
        const errorData = await response.json().catch(() => null);
        const errorMessage = errorData?.error || errorData?.message || 'Failed to save department';
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Department creation error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create department",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Building2 className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <DialogTitle className="text-xl">
                {formData.id ? 'Edit Department' : 'Add New Department'}
              </DialogTitle>
              <DialogDescription className="text-sm">
                {formData.id 
                  ? 'Update department details and assign a department head'
                  : 'Create a new department and assign a department head'}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-gray-700">
              Department Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              placeholder="e.g., Cardiology"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="h-11"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium text-gray-700">
              Description <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="description"
              placeholder="Brief description of the department's role and responsibilities..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="resize-none"
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose} className="px-6" disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" className="px-6" disabled={loading}>
              {loading 
                ? formData.id ? 'Updating...' : 'Creating...' 
                : formData.id ? 'Update Department' : 'Create Department'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
