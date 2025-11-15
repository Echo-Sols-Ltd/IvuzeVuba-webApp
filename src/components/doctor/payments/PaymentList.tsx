"use client";

import Image from "next/image";
import { Payment } from "@/lib/doctorApi";

type PaymentLocal = {
  name: string;
  id: string;
  serviceDate: string;
  dueDate: string;
  status: "Completed" | "Pending" | "Failed";
  amount: string;
  method: string;
  avatar?: string;
};

interface PaymentListProps {
  payments: Payment[];
  searchQuery?: string;
  statusFilter?: string;
}

export default function PaymentList({ payments, searchQuery = "", statusFilter = "all" }: PaymentListProps) {
  // Transform API data to component format
  const transformedPayments: PaymentLocal[] = payments.map(p => ({
    name: p.patientName,
    id: p.patientId,
    serviceDate: new Date(p.date).toLocaleDateString(),
    dueDate: new Date(p.date).toLocaleDateString(), // Use same date if due date not provided
    status: p.status === "completed" ? "Completed" : 
            p.status === "pending" ? "Pending" : "Failed",
    amount: `${p.amount.toLocaleString()} RWF`,
    method: p.method || "N/A",
    avatar: `https://i.pravatar.cc/150?u=${p.id}`,
  }));

  // Filter payments based on search and status
  const filteredPayments = transformedPayments.filter((payment) => {
    const matchesSearch =
      !searchQuery ||
      payment.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.amount.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.method.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      payment.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4">
      {filteredPayments.length > 0 ? (
        filteredPayments.map((p, i) => (
          <div
            key={i}
            className="flex items-center justify-between border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-4">
              <Image
                src={p.avatar || "/man.png"}
                alt={p.name}
                width={48}
                height={48}
                className="w-12 h-12 rounded-full border"
              />
              <div>
                <p className="font-medium">{p.name}</p>
                <p className="text-xs text-gray-500">ID: {p.id}</p>
                <p className="text-xs text-gray-500">
                  Service Date: {p.serviceDate}
                </p>
                <p className="text-xs text-gray-500">Due: {p.dueDate}</p>
                <p
                  className={`text-sm font-medium ${
                    p.status === "Completed"
                      ? "text-green-600"
                      : p.status === "Pending"
                      ? "text-yellow-600"
                      : "text-red-600"
                  }`}
                >
                  {p.status}
                </p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-lg font-semibold">{p.amount}</p>
              <p className="text-sm text-gray-500">{p.method}</p>
              <button className="mt-2 bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 transition-colors">
                View Details
              </button>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-8 text-gray-500">
          <p>No payments found matching your search criteria.</p>
        </div>
      )}
    </div>
  );
}
