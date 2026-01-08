"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Search, Plus } from "lucide-react";
import { API_ENDPOINTS, getAuthHeaders } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface Order {
  id: string;
  orderType: "LAB" | "IMAGING" | "PROCEDURE" | "CONSULTATION";
  orderName: string;
  createdAt: string;
  status: "PENDING" | "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  description?: string;
  scheduledDate?: string;
}

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newOrder, setNewOrder] = useState({
    orderType: "LAB" as const,
    orderName: "",
    description: "",
  });
  const { toast } = useToast();
  const params = useParams();
  const patientId = params?.patientId;

  useEffect(() => {
    if (patientId) {
      fetchOrders();
    }
  }, [patientId]);

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${API_ENDPOINTS.DOCTOR.BASE}/chart/medical-orders/${patientId}`, {
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const handleAddOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newOrder.orderName.trim()) {
      toast({
        title: "Error",
        description: "Please enter an order name",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_ENDPOINTS.DOCTOR.BASE}/chart/medical-orders`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          patientId,
          ...newOrder,
        }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Medical order created successfully!",
        });
        setNewOrder({
          orderType: "LAB",
          orderName: "",
          description: "",
        });
        setShowAddForm(false);
        fetchOrders(); // Refresh the orders list
      } else {
        const error = await response.text();
        toast({
          title: "Error",
          description: error || "Failed to create medical order",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create medical order",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-700";
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-700";
      case "SCHEDULED":
        return "bg-yellow-100 text-yellow-700";
      case "CANCELLED":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="bg-white border rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Medical Orders</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <Plus className="w-4 h-4" />
          Add Order
        </button>
      </div>

      {/* Add Order Form */}
      {showAddForm && (
        <form onSubmit={handleAddOrder} className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Order Type
              </label>
              <select
                value={newOrder.orderType}
                onChange={(e) => setNewOrder(prev => ({ ...prev, orderType: e.target.value as any }))}
                className="w-full rounded border px-3 py-2 text-sm"
              >
                <option value="LAB">Lab</option>
                <option value="IMAGING">Imaging</option>
                <option value="PROCEDURE">Procedure</option>
                <option value="CONSULTATION">Consultation</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Order Name
              </label>
              <input
                type="text"
                value={newOrder.orderName}
                onChange={(e) => setNewOrder(prev => ({ ...prev, orderName: e.target.value }))}
                placeholder="e.g., Complete Blood Count"
                className="w-full rounded border px-3 py-2 text-sm"
                required
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={newOrder.description}
              onChange={(e) => setNewOrder(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Additional instructions or notes"
              className="w-full rounded border px-3 py-2 text-sm"
              rows={2}
            />
          </div>
          <div className="flex gap-2 mt-4">
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Order"}
            </button>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Orders List */}
      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-gray-600 py-8">
          <Search className="w-16 h-16 mb-4" />
          <p className="text-sm font-medium">No medical orders found</p>
          <p className="text-xs text-gray-500">Click "Add Order" to create a new medical order</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="text-left border-b">
                <th className="p-2">Type</th>
                <th className="p-2">Order</th>
                <th className="p-2">Date</th>
                <th className="p-2">Status</th>
                <th className="p-2">Description</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b hover:bg-gray-50">
                  <td className="p-2">{order.orderType}</td>
                  <td className="p-2">{order.orderName}</td>
                  <td className="p-2">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="p-2">
                    <span
                      className={`px-2 py-1 rounded text-xs ${getStatusColor(order.status)}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="p-2 max-w-xs truncate">{order.description || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Orders;
