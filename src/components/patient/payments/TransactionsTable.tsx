"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Transaction } from "./types";
import { Download, ChevronLeft, ChevronRight } from "lucide-react";
import * as XLSX from "xlsx";

interface TransactionsTableProps {
  transactions: Transaction[];
}

export const TransactionsTable = ({ transactions }: TransactionsTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const totalPages = Math.ceil(transactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTransactions = transactions.slice(startIndex, endIndex);

  const handleExportAll = () => {
    const worksheet = XLSX.utils.json_to_sheet(transactions);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");
    XLSX.writeFile(workbook, "transactions.xlsx");
  };

  const handleDownloadSingle = (transaction: Transaction) => {
    const worksheet = XLSX.utils.json_to_sheet([transaction]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Transaction");
    XLSX.writeFile(workbook, `transaction_${transaction.reference}.xlsx`);
  };

  return (
    <div className="bg-white rounded-lg border shadow-sm">
      <div className="flex justify-end p-4">
        <Button
          onClick={handleExportAll}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Export All
        </Button>
      </div>

      <div className="overflow-x-auto">
        <Table className="min-w-[800px]">
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold text-gray-900">
                Date
              </TableHead>
              <TableHead className="font-semibold text-gray-900">
                Description
              </TableHead>
              <TableHead className="font-semibold text-gray-900">
                Method
              </TableHead>
              <TableHead className="font-semibold text-gray-900">
                Reference
              </TableHead>
              <TableHead className="font-semibold text-gray-900">
                Amount
              </TableHead>
              <TableHead className="font-semibold text-gray-900">
                Status
              </TableHead>
              <TableHead className="font-semibold text-gray-900">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentTransactions.map((transaction) => (
              <TableRow key={transaction.id} className="hover:bg-gray-50">
                <TableCell className="text-sm text-gray-600">
                  {transaction.date}
                </TableCell>
                <TableCell className="text-sm text-gray-900 font-medium">
                  <div className="flex flex-col">
                    <span
                      className="font-bold truncate max-w-[200px]"
                      title={transaction.description}
                    >
                      {transaction.description}
                    </span>
                    <span className="text-gray-600 text-xs">
                      {transaction.subDescription}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-gray-600">
                  {transaction.method}
                </TableCell>
                <TableCell className="text-sm text-gray-600 font-mono">
                  {transaction.reference}
                </TableCell>
                <TableCell className="text-sm font-medium">
                  <span
                    className={
                      transaction.type === "credit"
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  >
                    {transaction.amount}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      transaction.status === "failed"
                        ? "destructive"
                        : "secondary"
                    }
                    className={`${
                      transaction.status === "failed"
                        ? "bg-red-100 text-red-800 border-red-200"
                        : "bg-green-100 text-green-800 border-green-200"
                    } px-3 py-1 rounded-full text-sm font-medium`}
                  >
                    {transaction.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => handleDownloadSingle(transaction)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between p-4">
          <div className="text-sm text-gray-700">
            Showing {startIndex + 1} to {Math.min(endIndex, transactions.length)} of {transactions.length} results
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
