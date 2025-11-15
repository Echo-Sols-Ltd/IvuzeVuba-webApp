import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface OverviewStats {
    totalVisitRequests: number;
    totalStaff: number;
    totalMedicalInventory: number;
    totalFacilities: number;
    totalRevenue: number;
    totalExpenses: number;
    totalProfit: number;
}

interface FinancialDetailsProps {
    stats: OverviewStats | null;
}

/**
 * @component FinancialDetails
 * @description Displays financial statistics in an accessible format
 * @accessibility Uses semantic HTML and ARIA labels
 */
const FinancialDetails = ({ stats }: FinancialDetailsProps) => {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("rw-RW", {
            style: "currency",
            currency: "RWF",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <Card className="shadow-md" role="region" aria-label="Financial Statistics">
            <CardHeader>
                <CardTitle>Financial Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2 text-sm">
                        <span
                            className="w-3 h-3 bg-orange-500 rounded-full"
                            aria-hidden="true"
                        ></span>
                        Total Revenue
                    </span>
                    <span className="font-semibold" aria-label="Total Revenue">
                        {formatCurrency(stats?.totalRevenue || 0)}
                    </span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2 text-sm">
                        <span
                            className="w-3 h-3 bg-orange-400 rounded-full"
                            aria-hidden="true"
                        ></span>
                        Total Expenses
                    </span>
                    <span className="font-semibold" aria-label="Total Expenses">
                        {formatCurrency(stats?.totalExpenses || 0)}
                    </span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2 text-sm">
                        <span
                            className="w-3 h-3 bg-green-500 rounded-full"
                            aria-hidden="true"
                        ></span>
                        Total Profit
                    </span>
                    <span className="font-semibold text-green-600" aria-label="Total Profit">
                        {formatCurrency(stats?.totalProfit || 0)}
                    </span>
                </div>
            </CardContent>
        </Card>
    );
};

export default FinancialDetails;
