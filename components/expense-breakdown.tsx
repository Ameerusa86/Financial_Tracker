"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

const data = [
  { name: "Food & Dining", value: 850, color: "#ef4444" },
  { name: "Transportation", value: 420, color: "#f59e0b" },
  { name: "Utilities", value: 320, color: "#eab308" },
  { name: "Entertainment", value: 280, color: "#3b82f6" },
  { name: "Shopping", value: 650, color: "#8b5cf6" },
  { name: "Healthcare", value: 380, color: "#ec4899" },
  { name: "Other", value: 350, color: "#6b7280" },
];

export function ExpenseBreakdown() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Expense Breakdown by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent = 0 }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
