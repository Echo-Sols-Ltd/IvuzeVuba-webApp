"use client";

import { useState, useMemo } from "react";
import QueueCard from "./QueueCard";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Pagination } from "@/components/ui/pagination";
import { usePagination } from "@/hooks/usePagination";
import { Search } from "lucide-react";

interface Queue {
    appointmentId: string;
    departmentName: string;
    reason: string;
    preferredDate: string;
    patientId: string;
    patientName: string;
    patientEmail: string;
    patientImageUrl: string;
    status: string;
    assignedDoctorName?: string;
    assignedDoctorId?: string;
}

interface QueueListProps {
    queues: Queue[];
    onRefresh?: () => void;
}

export default function QueueList({ queues, onRefresh }: QueueListProps) {
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState<"all" | "assigned" | "unassigned">("all");

    const filteredQueues = useMemo(() => {
        return queues.filter((q) => {
            const searchText = search.toLowerCase();
            const matchesSearch =
                !search ||
                (q.patientName && q.patientName.toLowerCase().includes(searchText)) ||
                (q.reason && q.reason.toLowerCase().includes(searchText)) ||
                (q.departmentName && q.departmentName.toLowerCase().includes(searchText)) ||
                (q.appointmentId && q.appointmentId.toLowerCase().includes(searchText)) ||
                (q.patientId && q.patientId.toLowerCase().includes(searchText)) ||
                (q.patientEmail && q.patientEmail.toLowerCase().includes(searchText));

            const isAssigned = q.assignedDoctorId && q.assignedDoctorId.length > 0;
            const matchesFilter =
                filter === "all" ||
                (filter === "assigned" && isAssigned) ||
                (filter === "unassigned" && !isAssigned);

            return matchesSearch && matchesFilter;
        });
    }, [queues, search, filter]);

    const {
        currentPage,
        totalPages,
        itemsPerPage,
        currentItems,
        paginationInfo,
        goToPage,
        changeItemsPerPage,
    } = usePagination(filteredQueues, { itemsPerPage: 10 });

    const handlePageChange = (page: number) => {
        goToPage(page);
        // Scroll to top of the list
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleItemsPerPageChange = (value: string) => {
        changeItemsPerPage(Number(value));
    };

    return (
        <div className="mt-4 space-y-4">
            {/* Filters */}
            <div className="flex justify-between items-center gap-3 mb-4">
                <div className="text-sm text-gray-600">
                    Showing {paginationInfo.startItem} to {paginationInfo.endItem} of {paginationInfo.totalItems} patients
                </div>
                <div className="flex gap-3">
                    <Select value={filter} onValueChange={(val) => setFilter(val as "all" | "assigned" | "unassigned")}>
                        <SelectTrigger className="w-40">
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="assigned">Assigned</SelectItem>
                            <SelectItem value="unassigned">Unassigned</SelectItem>
                        </SelectContent>
                    </Select>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Search patients, department, or reason..."
                            className="w-80 pl-10"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Items per page selector */}
            {filteredQueues.length > 0 && (
                <div className="flex items-center justify-end gap-2 mb-4">
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
            )}

            {/* List */}
            {filteredQueues.length === 0 ? (
                <div className="text-center py-12 text-gray-500 bg-white rounded-lg border">
                    <p className="text-lg font-medium">No patients found</p>
                    <p className="text-sm mt-1">Try adjusting your search or filter criteria</p>
                </div>
            ) : (
                <>
                    <div className="space-y-4">
                        {currentItems.map((q, index) => (
                            <QueueCard 
                                key={q.appointmentId || index}
                                appointmentId={q.appointmentId}
                                name={q.patientName}
                                id={q.patientId}
                                description={q.reason}
                                serviceDate={q.preferredDate}
                                imageUrl={q.patientImageUrl}
                                departmentName={q.departmentName}
                                status={q.status}
                                assignedDoctorName={q.assignedDoctorName}
                                onRefresh={onRefresh}
                            />
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
                </>
            )}
        </div>
    );
}
