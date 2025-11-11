import { Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Invoice } from "./types";

interface InvoiceCardProps {
  invoice: Invoice;
  onPayNow: (invoiceId: string) => void;
}

export const InvoiceCard = ({ invoice, onPayNow }: InvoiceCardProps) => (
  <div className="bg-white rounded-lg border p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      <div className="flex-1">
        <div className="mb-3">
          <h3 className="font-semibold text-gray-900 text-lg mb-1 transition-colors duration-200">
            {invoice.serviceType}
          </h3>
          <p className="text-gray-600 text-sm">
            {invoice.hospital} • {invoice.doctor}
          </p>
        </div>

        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-2 transition-all duration-200 hover:translate-x-1">
            <Calendar className="h-4 w-4" />
            <span>Service Date: {invoice.serviceDate}</span>
          </div>
          <div className="flex items-center gap-2 transition-all duration-200 hover:translate-x-1">
            <Clock className="h-4 w-4" />
            <span>Due: {invoice.dueDate}</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              className={`${
                invoice.status === "overdue"
                  ? "bg-red-100 text-red-800 border-red-200"
                  : "bg-blue-100 text-blue-800 border-blue-200"
              } px-3 py-1 rounded-full text-sm font-medium w-fit transition-all duration-200`}
            >
              {invoice.status === "overdue" ? "Overdue" : "pending"}
            </Badge>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-end gap-3">
        <div className="text-right">
          <p className="text-2xl font-bold text-gray-900 transition-all duration-200">{invoice.amount}</p>
        </div>
        <Button
          onClick={() => onPayNow(invoice.id)}
          className={`${
            invoice.status === "overdue"
              ? "bg-red-600 hover:bg-red-700 text-white"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          } px-6 py-2 rounded-md font-medium transition-all duration-300 hover:scale-105`}
        >
          Pay now
        </Button>
      </div>
    </div>
  </div>
);
