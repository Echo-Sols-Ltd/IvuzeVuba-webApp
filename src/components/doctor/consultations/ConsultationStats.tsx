"use client";

import Card from "../Card";

interface ConsultationStatsProps {
  stats: {
    total: number;
    byMonth: number;
    unique: number;
  };
}

export default function ConsultationStats({ stats }: ConsultationStatsProps) {
  const statsData = [
    { label: "Total consultations", value: stats.total || 0 },
    { label: "This month", value: stats.byMonth || 0 },
    { label: "Average Duration", value: 0 }, // Not provided by API yet
    { label: "Unique patients", value: stats.unique || 0 },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statsData.map((stat) => (
        <Card key={stat.label} title={stat.label} total={stat.value} />
      ))}
    </div>
  );
}
