import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PaymentMethod } from "./types";
import { 
  getPaymentMethods, 
  addPaymentMethod, 
  updatePaymentMethod 
} from "@/lib/patientApi";

export const MethodsTab = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(null);
  const [newPhoneNumber, setNewPhoneNumber] = useState("");
  const [newProvider, setNewProvider] = useState("");
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [addMessage, setAddMessage] = useState("");
  const [editMessage, setEditMessage] = useState("");
  const [isAddLoading, setIsAddLoading] = useState(false);
  const [isSaveLoading, setIsSaveLoading] = useState(false);

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const fetchPaymentMethods = async () => {
    try {
      const methods = await getPaymentMethods();
      setPaymentMethods(methods);
    } catch (error) {
      console.error("Error fetching payment methods:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (method: PaymentMethod) => {
    setEditingMethod(method);
    setEditMessage("");
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    setEditMessage("Payment methods management feature is coming soon.");
    return;

    // Commented out until backend implements this feature
    /*
    if (!editingMethod) return;

    setIsSaveLoading(true);
    setEditMessage("");

    try {
      await updatePaymentMethod(editingMethod.id, {
        provider: editingMethod.provider,
        phoneNumber: editingMethod.phoneNumber,
        isDefault: editingMethod.isDefault,
      });
      setEditMessage("Payment method updated successfully!");
      setTimeout(() => {
        setIsEditModalOpen(false);
        setEditingMethod(null);
        fetchPaymentMethods();
      }, 1500);
    } catch (error) {
      setEditMessage(error instanceof Error ? error.message : "Failed to update payment method");
    } finally {
      setIsSaveLoading(false);
    }
    */
  };

  const handleAddMethod = async () => {
    setAddMessage("Payment methods management feature is coming soon. For now, you can select payment methods directly when topping up or withdrawing.");
    return;

    // Commented out until backend implements this feature
    /*
    if (!newPhoneNumber || !newProvider) {
      setAddMessage("Please enter phone number and select provider");
      return;
    }

    setIsAddLoading(true);
    setAddMessage("");

    try {
      await addPaymentMethod(newPhoneNumber, newProvider);
      setAddMessage("Payment method added successfully!");
      setNewPhoneNumber("");
      setNewProvider("");
      setTimeout(() => {
        setAddMessage("");
        fetchPaymentMethods();
      }, 1500);
    } catch (error) {
      setAddMessage(error instanceof Error ? error.message : "Failed to add payment method");
    } finally {
      setIsAddLoading(false);
    }
    */
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading payment methods...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">
          Payment Methods
        </h2>
        <p className="text-gray-600 mt-2">
          Manage your payment methods and add new ones
        </p>
        <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800">
          <strong>Note:</strong> Payment methods management is coming soon. For now, you can select your preferred payment method directly when topping up or withdrawing from your wallet.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border p-6 shadow-sm">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Your payment methods
            </h3>

            {paymentMethods.length === 0 ? (
              <p className="text-gray-500 text-sm py-4">No payment methods added yet</p>
            ) : (
              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className="bg-gray-50 rounded-lg border p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-gray-900">
                            {method.provider}
                          </span>
                          {method.isDefault && (
                            <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-xs">
                              Default
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">
                          {method.phoneNumber}
                        </p>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(method)}
                        className="border-black text-black hover:bg-black hover:text-white"
                      >
                        Edit
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6 shadow-sm">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Add payment method
              </h3>
              <p className="text-gray-600 text-sm">
                Link a new mobile money account
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <Label
                  htmlFor="phone-number"
                  className="text-sm font-medium text-gray-700"
                >
                  Phone number
                </Label>
                <Input
                  id="phone-number"
                  type="tel"
                  placeholder="Enter phone number"
                  value={newPhoneNumber}
                  onChange={(e) => setNewPhoneNumber(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label
                  htmlFor="provider"
                  className="text-sm font-medium text-gray-700"
                >
                  Provider
                </Label>
                <Select value={newProvider} onValueChange={setNewProvider}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select provider" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MTN_MOBILE_MONEY">MTN Mobile money</SelectItem>
                    <SelectItem value="AIRTEL_MONEY">Airtel money</SelectItem>
                    <SelectItem value="BANK_TRANSFER">Bank transfer</SelectItem>
                    <SelectItem value="CASH">Cash</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {addMessage && (
                <p className={`text-sm ${addMessage.includes("success") ? "text-green-600" : "text-red-600"}`}>
                  {addMessage}
                </p>
              )}

              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                onClick={handleAddMethod}
                disabled={isAddLoading}
              >
                {isAddLoading ? "Adding..." : "Add method"}
              </Button>

              <p className="text-xs text-gray-500 text-center">
                You&apos;ll receive an SMS to verify your phone number
              </p>
            </div>
          </div>
        </div>
      </div>

      {isEditModalOpen && editingMethod && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Edit Payment Method
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditModalOpen(false)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Provider
                </Label>
                <Input
                  value={editingMethod.provider}
                  onChange={(e) =>
                    setEditingMethod({
                      ...editingMethod,
                      provider: e.target.value,
                    })
                  }
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Phone Number
                </Label>
                <Input
                  value={editingMethod.phoneNumber}
                  onChange={(e) =>
                    setEditingMethod({
                      ...editingMethod,
                      phoneNumber: e.target.value,
                    })
                  }
                  className="mt-1"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="default-method"
                  checked={editingMethod.isDefault}
                  onChange={(e) =>
                    setEditingMethod({
                      ...editingMethod,
                      isDefault: e.target.checked,
                    })
                  }
                  className="rounded border-gray-300"
                />
                <Label
                  htmlFor="default-method"
                  className="text-sm text-gray-700"
                >
                  Set as default payment method
                </Label>
              </div>

              {editMessage && (
                <p className={`text-sm ${editMessage.includes("success") ? "text-green-600" : "text-red-600"}`}>
                  {editMessage}
                </p>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setIsEditModalOpen(false)}
                className="flex-1"
                disabled={isSaveLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveEdit}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isSaveLoading}
              >
                {isSaveLoading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
