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
  const [payments, setPayments] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [wallet, setWallet] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { getPayments, getTransactions, getWallet } = await import("@/lib/patientApi");
        
        // Fetch data separately to handle individual failures
        const paymentsData = await getPayments().catch(err => {
          console.error('Payments fetch error:', err);
          return [];
        });
        
        const transactionsData = await getTransactions().catch(err => {
          console.error('Transactions fetch error:', err);
          return [];
        });
        
        const walletData = await getWallet().catch(err => {
          console.error('Wallet fetch error:', err);
          return { balance: 0, currency: 'RWF' };
        });

        setPayments(paymentsData);
        
        // Transform transactions safely
        const transformedTransactions: Transaction[] = Array.isArray(transactionsData) 
          ? transactionsData.map((t: any) => {
              try {
                return {
                  id: String(t.id || Math.random()),
                  date: t.date ? new Date(t.date).toLocaleDateString() : "N/A",
                  description: String(t.description || "Transaction"),
                  subDescription: t.type === "TOPUP" ? "Increase" : "Payment",
                  method: String(t.method || "Mobile money"),
                  reference: `#REF${String(t.id || '').substring(0, 8)}`,
                  amount: `${t.amount >= 0 ? '+' : ''}${Number(t.amount || 0).toLocaleString()} RWF`,
                  status: String(t.status || "completed").toLowerCase(),
                  type: (t.amount >= 0 ? "credit" : "debit") as "credit" | "debit",
                };
              } catch (error) {
                console.error('Error transforming transaction:', error);
                return {
                  id: String(Math.random()),
                  date: "N/A",
                  description: "Transaction",
                  subDescription: "N/A",
                  method: "N/A",
                  reference: "#N/A",
                  amount: "0 RWF",
                  status: "completed",
                  type: "credit" as const,
                };
              }
            })
          : [];
        
        setTransactions(transformedTransactions);
        setWallet(walletData);
      } catch (error) {
        console.error('Error fetching payment data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Transform payments to invoices
  const pendingInvoices: Invoice[] = payments
    .filter((p: any) => p.status === "pending" || p.status === "overdue")
    .map((p: any) => ({
      id: p.id,
      hospital: "Hospital",
      doctor: "Doctor",
      serviceDate: new Date(p.date).toLocaleDateString(),
      dueDate: new Date(p.date).toLocaleDateString(),
      amount: `${p.amount.toLocaleString()} RWF`,
      status: p.status as "pending" | "overdue",
      serviceType: p.description || "Medical Service",
    }));

  const currentBalance = wallet ? `${wallet.balance.toLocaleString()} ${wallet.currency}` : "0 RWF";

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading payment data...</p>
        </div>
      </div>
    );
  }

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
      <div className="flex pt-8">
        <PatientSidebar />
        <main className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-4">
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
        </main>
      </div>
    </div>
  );
};

export default PaymentsPage;
