"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: "Jun", income: 7200, expenses: 3800 },
  { month: "Jul", income: 7500, expenses: 4100 },
  { month: "Aug", income: 8000, expenses: 4500 },
  { month: "Sep", income: 7800, expenses: 3900 },
  { month: "Oct", income: 8200, expenses: 4200 },
  { month: "Nov", income: 8500, expenses: 4250 },
];

export function MonthlyChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Income vs Expenses (Last 6 Months)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip
              formatter={(value) => `$${value.toLocaleString()}`}
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                border: "1px solid #ccc",
              }}
            />
            <Legend />
            <Bar dataKey="income" fill="#10b981" name="Income" />
            <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
