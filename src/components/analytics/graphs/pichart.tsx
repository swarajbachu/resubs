import React from "react";
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
} from "recharts";

export interface PieChartItem {
  name: string;
  value: number;
}

interface PieChartProps {
  data: PieChartItem[];
}

const COLORS = ["#0ea5e9", "#0284c7", "#0369a1", "#075985", "#0c4a6e"];

export function PieChart({ data }: PieChartProps) {
  return (
    <RechartsPieChart width={400} height={300}>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        labelLine={false}
        outerRadius={80}
        fill="#8884d8"
        dataKey="value"
      >
        {data.map((entry, index) => (
          <Cell
            key={`cell-${entry.value}`}
            fill={COLORS[index % COLORS.length]}
          />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </RechartsPieChart>
  );
}
