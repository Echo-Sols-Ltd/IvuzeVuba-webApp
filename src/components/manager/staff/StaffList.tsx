"use client";

import StaffCard from "./StaffCard";
import { Pagination } from "@/components/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePagination } from "@/hooks/usePagination";

interface Staff {
  name: string;
  id: string;
  role: string;
  joined: string;
  email: string;
  department: string;
  endDate: string;
  imageUrl: string;
  isAvailable?: boolean;
  specialization?: string;
}

interface StaffListProps {
  staff: Staff[];
  onRefresh?: () => void;
}

export default function StaffList({ staff, onRefresh }: StaffListProps) {
  const {
    currentPage,
    totalPages,
    itemsPerPage,
    currentItems,
    paginationInfo,
    goToPage,
    changeItemsPerPage,
  } = usePagination(staff, { itemsPerPage: 10 });

  const handlePageChange = (page: number) => {
    goToPage(page);
    // Scroll to top of the list
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleItemsPerPageChange = (value: string) => {
    changeItemsPerPage(Number(value));
  };

  if (staff.length === 0) {
    return (
      <p className="text-center text-muted-foreground mt-6">
        No staff found.
      </p>
    );
  }

  return (
    <div className="space-y-4 mt-4">
      {/* Items per page selector */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Showing {paginationInfo.startItem} to {paginationInfo.endItem} of {paginationInfo.totalItems} staff members
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Items per page:</span>
          <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Staff cards */}
      <div className="space-y-4">
        {currentItems.map((member, i) => (
          <StaffCard key={member.id || i} {...member} onRefresh={onRefresh} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 border-t pt-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            itemsPerPage={itemsPerPage}
            totalItems={paginationInfo.totalItems}
          />
        </div>
      )}
    </div>
  );
}
