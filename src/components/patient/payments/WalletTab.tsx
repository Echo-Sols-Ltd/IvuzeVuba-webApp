import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { topUpWallet, withdrawFromWallet } from "@/lib/patientApi";

export const WalletTab = () => {
  const [topupAmount, setTopupAmount] = useState("");
  const [topupMethod, setTopupMethod] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawMethod, setWithdrawMethod] = useState("");
  const [isTopupLoading, setIsTopupLoading] = useState(false);
  const [isWithdrawLoading, setIsWithdrawLoading] = useState(false);
  const [topupMessage, setTopupMessage] = useState("");
  const [withdrawMessage, setWithdrawMessage] = useState("");

  const handleTopUp = async () => {
    if (!topupAmount || !topupMethod) {
      setTopupMessage("Please enter amount and select payment method");
      return;
    }

    const amount = parseFloat(topupAmount);
    if (isNaN(amount) || amount <= 0) {
      setTopupMessage("Please enter a valid amount");
      return;
    }

    if (amount < 1000) {
      setTopupMessage("Minimum top-up amount is 1000 RWF");
      return;
    }

    setIsTopupLoading(true);
    setTopupMessage("");

    try {
      await topUpWallet(amount, topupMethod);
      setTopupMessage("Wallet topped up successfully!");
      setTopupAmount("");
      setTopupMethod("");
      setTimeout(() => window.location.reload(), 1500);
    } catch (error) {
      setTopupMessage(error instanceof Error ? error.message : "Failed to top up wallet");
    } finally {
      setIsTopupLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount || !withdrawMethod) {
      setWithdrawMessage("Please enter amount and select payment method");
      return;
    }

    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0) {
      setWithdrawMessage("Please enter a valid amount");
      return;
    }

    if (amount < 1000) {
      setWithdrawMessage("Minimum withdrawal amount is 1000 RWF");
      return;
    }

    setIsWithdrawLoading(true);
    setWithdrawMessage("");

    try {
      await withdrawFromWallet(amount, withdrawMethod);
      setWithdrawMessage("Withdrawal successful!");
      setWithdrawAmount("");
      setWithdrawMethod("");
      setTimeout(() => window.location.reload(), 1500);
    } catch (error) {
      setWithdrawMessage(error instanceof Error ? error.message : "Failed to withdraw");
    } finally {
      setIsWithdrawLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">
          Wallet Management
        </h2>
        <p className="text-gray-600 mt-2">
          Manage your wallet balance and transactions
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border p-6 shadow-sm">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Top-up wallet
              </h3>
              <p className="text-gray-600 text-sm">Add money to your wallet</p>
            </div>

            <div className="space-y-3">
              <div>
                <Label
                  htmlFor="topup-amount"
                  className="text-sm font-medium text-gray-700"
                >
                  Amount (RWF)
                </Label>
                <Input
                  id="topup-amount"
                  type="number"
                  placeholder="Minimum 1000 RWF"
                  value={topupAmount}
                  onChange={(e) => setTopupAmount(e.target.value)}
                  className="mt-1"
                  min="1000"
                />
              </div>

              <div>
                <Label
                  htmlFor="topup-method"
                  className="text-sm font-medium text-gray-700"
                >
                  Payment method
                </Label>
                <Select value={topupMethod} onValueChange={setTopupMethod}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MTN_MOBILE_MONEY">MTN mobile money</SelectItem>
                    <SelectItem value="AIRTEL_MONEY">Airtel money</SelectItem>
                    <SelectItem value="BANK_TRANSFER">Bank transfer</SelectItem>
                    <SelectItem value="CASH">Cash</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {topupMessage && (
                <p className={`text-sm ${topupMessage.includes("success") ? "text-green-600" : "text-red-600"}`}>
                  {topupMessage}
                </p>
              )}

              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                onClick={handleTopUp}
                disabled={isTopupLoading}
              >
                {isTopupLoading ? "Processing..." : "Top Up"}
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6 shadow-sm">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Withdraw funds
              </h3>
              <p className="text-gray-600 text-sm">
                Transfer money from your wallet
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <Label
                  htmlFor="withdraw-amount"
                  className="text-sm font-medium text-gray-700"
                >
                  Amount (RWF)
                </Label>
                <Input
                  id="withdraw-amount"
                  type="number"
                  placeholder="Minimum 1000 RWF"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="mt-1"
                  min="1000"
                />
              </div>

              <div>
                <Label
                  htmlFor="withdraw-method"
                  className="text-sm font-medium text-gray-700"
                >
                  Payment method
                </Label>
                <Select value={withdrawMethod} onValueChange={setWithdrawMethod}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MTN_MOBILE_MONEY">MTN mobile money</SelectItem>
                    <SelectItem value="AIRTEL_MONEY">Airtel money</SelectItem>
                    <SelectItem value="BANK_TRANSFER">Bank transfer</SelectItem>
                    <SelectItem value="CASH">Cash</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {withdrawMessage && (
                <p className={`text-sm ${withdrawMessage.includes("success") ? "text-green-600" : "text-red-600"}`}>
                  {withdrawMessage}
                </p>
              )}

              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                onClick={handleWithdraw}
                disabled={isWithdrawLoading}
              >
                {isWithdrawLoading ? "Processing..." : "Withdraw"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
