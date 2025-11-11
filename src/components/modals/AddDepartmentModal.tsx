"use client";

import { useState } from "react";
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

interface AddDepartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddDepartmentModal({ isOpen, onClose }: AddDepartmentModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    head: "",
    description: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Creating department:", formData);
    onClose();
    setFormData({ name: "", head: "", description: "" });
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
              <DialogTitle className="text-xl">Add New Department</DialogTitle>
              <DialogDescription className="text-sm">
                Create a new department and assign a department head
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
            <Label htmlFor="head" className="text-sm font-medium text-gray-700">
              Department Head <span className="text-red-500">*</span>
            </Label>
            <Input
              id="head"
              placeholder="e.g., Dr. John Smith"
              value={formData.head}
              onChange={(e) => setFormData({ ...formData, head: e.target.value })}
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
            <Button type="button" variant="outline" onClick={onClose} className="px-6">
              Cancel
            </Button>
            <Button type="submit" className="px-6 bg-blue-600 hover:bg-blue-700">
              Add Department
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
