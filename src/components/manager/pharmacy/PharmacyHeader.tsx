"use client";

import AddMedicationModal from "@/components/modals/AddMedicationModal";

interface PharmacyHeaderProps {
  onRefresh?: () => void;
}

export default function PharmacyHeader({ onRefresh }: PharmacyHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-2xl font-bold">Pharmacy Management</h1>
        <p className="text-muted-foreground">Manage medical inventory</p>
      </div>
    
      <AddMedicationModal onSuccess={onRefresh} />
    </div>
  );
}
