"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { useState } from "react";
import { API_ENDPOINTS, getAuthHeaders } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface InventoryCardProps {
  id?: string;
  name: string;
  type: string;
  stock: string;
  supplier: string;
  status: string;
  lastRestocked: string;
  onRefresh?: () => void;
}

export default function InventoryCard({
  id,
  name,
  type,
  stock,
  supplier,
  status,
  lastRestocked,
  onRefresh,
}: InventoryCardProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleReorder = async () => {
    if (!id) {
      toast({
        title: "Error",
        description: "Cannot reorder: Item ID missing",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(API_ENDPOINTS.INVENTORY.REORDER(id), {
        method: "POST",
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Reorder initiated successfully",
        });
        onRefresh?.();
      } else {
        const error = await response.text();
        toast({
          title: "Error",
          description: error || "Failed to reorder",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reorder medication",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async () => {
    if (!id) {
      toast({
        title: "Error",
        description: "Cannot remove: Item ID missing",
        variant: "destructive",
      });
      return;
    }

    if (!confirm(`Are you sure you want to remove ${name}?`)) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(API_ENDPOINTS.INVENTORY.DELETE(id), {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Item removed successfully",
        });
        onRefresh?.();
      } else {
        const error = await response.text();
        toast({
          title: "Error",
          description: error || "Failed to remove item",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove item",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower.includes("in stock")) return "text-green-600";
    if (statusLower.includes("low stock")) return "text-yellow-600";
    if (statusLower.includes("out")) return "text-red-600";
    return "text-gray-600";
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">{name}</CardTitle>
        <p className="text-muted-foreground text-sm">{type}</p>
      </CardHeader>
      <CardContent className="space-y-2">
        <p><span className="font-medium">Stock level:</span> {stock}</p>
        <p><span className="font-medium">Supplier:</span> {supplier}</p>
        <p><span className="font-medium">Status:</span> <span className={getStatusColor(status)}>{status}</span></p>
        <p><span className="font-medium">Last Restocked:</span> {lastRestocked}</p>
        <div className="flex gap-2 mt-4">
          <Button 
            variant="outline" 
            onClick={handleRemove}
            disabled={loading}
          >
            {loading ? "Removing..." : "Remove"}
          </Button>
          <Button 
            onClick={handleReorder}
            disabled={loading}
          >
            {loading ? "Processing..." : "Re-Order"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
