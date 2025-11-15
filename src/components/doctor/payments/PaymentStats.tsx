"use client";

import Card from "../Card";
import { PaymentStats as PaymentStatsType } from "@/lib/doctorApi";

interface PaymentStatsProps {
  stats: PaymentStatsType;
}

export default function PaymentStats({ stats }: PaymentStatsProps) {
  const statsData = [
    { label: "Today", total: stats.today || 0 },
    { label: "Last Week", total: stats.lastWeek || 0 },
    { label: "Last Month", total: stats.lastMonth || 0 },
    { label: "Total", total: stats.overall || 0 },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {statsData.map((s, i) => (
        <Card key={i} title={s.label} total={s.total} />
      ))}
    </div>
  );
}
