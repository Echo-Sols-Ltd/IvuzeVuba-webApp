"use client";

import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

interface InventoryFiltersProps {
  filterType: string;
  setFilterType: (value: string) => void;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
}

export default function InventoryFilters({
  filterType,
  setFilterType,
  searchQuery,
  setSearchQuery,
}: InventoryFiltersProps) {
  return (
    <div className="flex justify-end gap-3 mb-6">
      <Select value={filterType} onValueChange={setFilterType}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Filter By Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Items</SelectItem>
          <SelectItem value="IN_STOCK">In Stock</SelectItem>
          <SelectItem value="LOW_STOCK">Low Stock</SelectItem>
          <SelectItem value="OUT_OF_STOCK">Out of Stock</SelectItem>
        </SelectContent>
      </Select>

      <Input
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search by medicine or supplier..."
        className="w-80"
      />
    </div>
  );
}
