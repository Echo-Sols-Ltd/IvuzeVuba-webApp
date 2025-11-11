"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/doctor/Navbar";
import PatientSidebar from "@/components/patient/PatientSidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InvoiceCard } from "@/components/patient/payments/InvoiceCard";
import { TransactionsTable } from "@/components/patient/payments/TransactionsTable";
import { WalletTab } from "@/components/patient/payments/WalletTab";
import { MethodsTab } from "@/components/patient/payments/MethodsTab";
import { Invoice, Transaction } from "@/components/patient/payments/types";

const PaymentsPage = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [selectedTab, setSelectedTab] = useState("pay-now");

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const pendingInvoices: Invoice[] = [
    {
      id: "1",
      hospital: "Kigali Hospital",
      doctor: "Dr. Sarah Johnson",
      serviceDate: "2024-01-15",
      dueDate: "2024-01-22",
      amount: "150 000 rwf",
      status: "pending",
      serviceType: "General Consultation",
    },
    {
      id: "2",
      hospital: "Kigali Hospital",
      doctor: "Dr. Sarah Johnson",
      serviceDate: "2024-01-15",
      dueDate: "2024-01-22",
      amount: "150 000 rwf",
      status: "overdue",
      serviceType: "General Consultation",
    },
    {
      id: "3",
      hospital: "Kigali Hospital",
      doctor: "Dr. Sarah Johnson",
      serviceDate: "2024-01-15",
      dueDate: "2024-01-22",
      amount: "150 000 rwf",
      status: "pending",
      serviceType: "General Consultation",
    },
  ];

  const transactions: Transaction[] = [
    {
      id: "1",
      date: "2020-04-5",
      description: "Wallet Topup",
      subDescription: "Increase",
      method: "MTN mobile money",
      reference: "#REF123456789",
      amount: "+150 000 frw",
      status: "completed",
      type: "credit",
    },
    {
      id: "2",
      date: "2020-04-5",
      description: "King Faisal",
      subDescription: "Dr John Doe",
      method: "MTN mobile money",
      reference: "#REF123456789",
      amount: "-150 000 frw",
      status: "completed",
      type: "debit",
    },
    {
      id: "3",
      date: "2020-04-5",
      description: "Wallet Topup",
      subDescription: "Increase",
      method: "MTN mobile money",
      reference: "#REF123456789",
      amount: "+150 000 frw",
      status: "failed",
      type: "credit",
    },
    {
      id: "4",
      date: "2020-04-5",
      description: "Wallet Topup",
      subDescription: "Increase",
      method: "MTN mobile money",
      reference: "#REF123456789",
      amount: "+150 000 frw",
      status: "completed",
      type: "credit",
    },
    {
      id: "5",
      date: "2020-04-5",
      description: "King Faisal",
      subDescription: "Dr John Doe",
      method: "MTN mobile money",
      reference: "#REF123456789",
      amount: "-150 000 frw",
      status: "completed",
      type: "debit",
    },
    {
      id: "6",
      date: "2020-04-5",
      description: "Wallet Topup",
      subDescription: "Increase",
      method: "MTN mobile money",
      reference: "#REF123456789",
      amount: "+150 000 frw",
      status: "completed",
      type: "credit",
    },
  ];

  const currentBalance = "150 000 rwf";

  const handlePayNow = (invoiceId: string) => {
    console.log(`Processing payment for invoice ${invoiceId}`);
  };

  const renderTabContent = () => {
    switch (selectedTab) {
      case "pay-now":
        return (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Pending invoices
              </h2>
              <p className="text-gray-600 mt-1">
                {pendingInvoices.length} invoices awaiting payment
              </p>
            </div>

            <div className="space-y-4">
              {pendingInvoices.map((invoice) => (
                <InvoiceCard
                  key={invoice.id}
                  invoice={invoice}
                  onPayNow={handlePayNow}
                />
              ))}
            </div>
          </div>
        );
      case "transactions":
        return (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Transaction History
              </h2>
              <p className="text-gray-600 mt-2">
                View all your payment transactions
              </p>
            </div>

            <TransactionsTable transactions={transactions} />
          </div>
        );
      case "wallet":
        return <WalletTab />;
      case "methods":
        return <MethodsTab />;
      default:
        return null;
    }
  };

  if (isMobile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <PatientSidebar />
        <div className="pt-20 px-4 space-y-6">
          <div className="space-y-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
              <p className="text-gray-600 mt-1">
                Manage your payments, wallet balance, and payment methods
              </p>
            </div>

            <div className="bg-white p-4 rounded-lg border shadow-sm w-full">
              <p className="text-sm text-gray-600">Current balance</p>
              <p className="text-xl font-bold text-gray-900">
                {currentBalance}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <Select value={selectedTab} onValueChange={setSelectedTab}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select tab" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pay-now">Pay now</SelectItem>
                <SelectItem value="transactions">Transactions</SelectItem>
                <SelectItem value="wallet">Wallet</SelectItem>
                <SelectItem value="methods">Methods</SelectItem>
              </SelectContent>
            </Select>

            <div className="mt-6">{renderTabContent()}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-20 flex">
        <div className="w-64 flex-shrink-0">
          <PatientSidebar />
        </div>
        <div className="flex-1 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Payments</h1>
              <p className="text-gray-600 mt-2">
                Manage your payments, wallet balance, and payment methods
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg border shadow-sm">
              <p className="text-sm text-gray-600">Current balance</p>
              <p className="text-2xl font-bold text-gray-900">
                {currentBalance}
              </p>
            </div>
          </div>

          <Tabs
            value={selectedTab}
            onValueChange={setSelectedTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-4 h-12">
              <TabsTrigger value="pay-now" className="text-sm font-medium">
                Pay now
              </TabsTrigger>
              <TabsTrigger value="transactions" className="text-sm font-medium">
                Transactions
              </TabsTrigger>
              <TabsTrigger value="wallet" className="text-sm font-medium">
                Wallet
              </TabsTrigger>
              <TabsTrigger value="methods" className="text-sm font-medium">
                Methods
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pay-now" className="mt-8">
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900">
                    Pending invoices
                  </h2>
                  <p className="text-gray-600 mt-2">
                    {pendingInvoices.length} invoices awaiting payment
                  </p>
                </div>

                <div className="space-y-6">
                  {pendingInvoices.map((invoice) => (
                    <InvoiceCard
                      key={invoice.id}
                      invoice={invoice}
                      onPayNow={handlePayNow}
                    />
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="transactions" className="mt-8">
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900">
                    Transaction History
                  </h2>
                  <p className="text-gray-600 mt-2">
                    View all your payment transactions
                  </p>
                </div>

                <TransactionsTable transactions={transactions} />
              </div>
            </TabsContent>

            <TabsContent value="wallet" className="mt-8">
              <WalletTab />
            </TabsContent>

            <TabsContent value="methods" className="mt-8">
              <MethodsTab />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default PaymentsPage;
