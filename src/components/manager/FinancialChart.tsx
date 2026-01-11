"use client";
import React from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

interface OverviewStats {
    totalVisitRequests: number;
    totalStaff: number;
    totalMedicalInventory: number;
    totalFacilities: number;
    totalRevenue: number;
    totalExpenses: number;
    totalProfit: number;
}

interface FinancialChartProps {
    stats: OverviewStats | null;
}

const FinancialChart = ({ stats }: FinancialChartProps) => {
    // Generate mock monthly data based on current totals
    // In a real app, this would come from the backend
    const generateMonthlyData = () => {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
        const revenue = stats?.totalRevenue || 0;
        const expenses = stats?.totalExpenses || 0;
        const profit = stats?.totalProfit || 0;

        return months.map((month, index) => {
            // Create variation in the data (±20%)
            const variation = 0.8 + (Math.random() * 0.4);
            return {
                name: month,
                revenue: Math.round((revenue / 6) * variation),
                expenses: Math.round((expenses / 6) * variation),
                profit: Math.round((profit / 6) * variation),
            };
        });
    };

    const data = generateMonthlyData();

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("rw-RW", {
            style: "currency",
            currency: "RWF",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
            notation: "compact",
            compactDisplay: "short",
        }).format(value);
    };

    return (
        <Card className="md:col-span-2 shadow-md">
            <CardHeader>
                <CardTitle>Overall Financial Performance</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={data}>
                        <XAxis dataKey="name" />
                        <YAxis tickFormatter={formatCurrency} />
                        <Tooltip
                            formatter={(value: number | undefined) => value !== undefined ? formatCurrency(value) : ''}
                            contentStyle={{
                                backgroundColor: "white",
                                border: "1px solid #e5e7eb",
                                borderRadius: "0.5rem",
                            }}
                        />
                        <Legend />
                        <Bar dataKey="revenue" fill="#f97316" name="Revenue" />
                        <Bar dataKey="expenses" fill="#fb923c" name="Expenses" />
                        <Bar dataKey="profit" fill="#22c55e" name="Profit" />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};

export default FinancialChart;
