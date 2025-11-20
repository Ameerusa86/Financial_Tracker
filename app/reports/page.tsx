"use client";

import { useEffect, useState } from "react";
import {
  getMonthlyExpenseTotals,
  getMonthlyIncomeTotals,
  getMonthlyCategoryBreakdown,
  getCurrentNetWorth,
  getSavingsRate,
  exportIncomeVsExpenseCSV,
  exportCategoryTrendsCSV,
} from "@/lib/reports";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  TrendingDown,
  PieChart,
  LineChart,
  Download,
  Wallet,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import {
  ResponsiveContainer,
  LineChart as ReLineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  BarChart,
  Bar,
} from "recharts";

const MONTH_WINDOW = 6;

export default function ReportsPage() {
  const [expenseTotals, setExpenseTotals] = useState<any[]>([]);
  const [incomeTotals, setIncomeTotals] = useState<any[]>([]);
  const [categorySeries, setCategorySeries] = useState<any[]>([]);
  const [netWorth, setNetWorth] = useState<{
    assets: number;
    liabilities: number;
    netWorth: number;
    savings: number;
  } | null>(null);
  const [savingsRate, setSavingsRate] = useState<number>(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setExpenseTotals(getMonthlyExpenseTotals(MONTH_WINDOW));
    setIncomeTotals(getMonthlyIncomeTotals(MONTH_WINDOW));
    setCategorySeries(getMonthlyCategoryBreakdown(MONTH_WINDOW));
    setNetWorth(getCurrentNetWorth());
    setSavingsRate(getSavingsRate());
  }, []);

  const incomeVsExpenseData = incomeTotals.map((inc, i) => ({
    month: inc.label,
    income: inc.value,
    expenses: expenseTotals[i]?.value || 0,
    net: inc.value - (expenseTotals[i]?.value || 0),
  }));

  // Transform category series for stacked view
  const allCategories = Array.from(
    new Set(categorySeries.flatMap((p) => Object.keys(p.categoryTotals)))
  );
  const categoryChartData = categorySeries.map((p) => ({
    month: p.label,
    ...allCategories.reduce((acc, c) => {
      acc[c] = p.categoryTotals[c] || 0;
      return acc;
    }, {} as Record<string, number>),
  }));

  function download(filename: string, content: string) {
    const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  function exportIncomeVsExpense() {
    const csv = exportIncomeVsExpenseCSV(MONTH_WINDOW);
    download("income_vs_expenses.csv", csv);
  }

  function exportCategoryTrends() {
    const csv = exportCategoryTrendsCSV(MONTH_WINDOW);
    download("category_trends.csv", csv);
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Reports & Analytics
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Insights across income, spending, and net worth. Historical net worth
          will require future transaction snapshots.
        </p>
      </div>

      <Tabs defaultValue="income-expenses" className="space-y-6">
        <TabsList>
          <TabsTrigger value="income-expenses">Income vs Expenses</TabsTrigger>
          <TabsTrigger value="spending">Spending Trends</TabsTrigger>
          <TabsTrigger value="categories">Category Breakdown</TabsTrigger>
          <TabsTrigger value="net-worth">Net Worth</TabsTrigger>
          <TabsTrigger value="savings">Savings Rate</TabsTrigger>
          <TabsTrigger value="export">Export</TabsTrigger>
        </TabsList>

        <TabsContent value="income-expenses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LineChart className="h-5 w-5 text-blue-500" /> Income vs
                Expenses (Last {MONTH_WINDOW} Months)
              </CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              {mounted && (
                <ResponsiveContainer width="100%" height="100%">
                  <ReLineChart data={incomeVsExpenseData}>
                    <XAxis dataKey="month" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip
                      formatter={(v: any) => formatCurrency(Number(v))}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="income"
                      stroke="#3b82f6"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="expenses"
                      stroke="#ef4444"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="net"
                      stroke="#10b981"
                      strokeWidth={2}
                    />
                  </ReLineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="spending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingDown className="h-5 w-5 text-rose-500" /> Monthly
                Expense Totals
              </CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              {mounted && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={expenseTotals.map((e) => ({
                      month: e.label,
                      total: e.value,
                    }))}
                  >
                    <XAxis dataKey="month" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip
                      formatter={(v: any) => formatCurrency(Number(v))}
                    />
                    <Bar dataKey="total" fill="#ef4444" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5 text-purple-500" /> Category
                Breakdown (Stacked)
              </CardTitle>
            </CardHeader>
            <CardContent className="h-96">
              {mounted && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryChartData}>
                    <XAxis dataKey="month" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip
                      formatter={(v: any) => formatCurrency(Number(v))}
                    />
                    <Legend />
                    {allCategories.map((c, idx) => (
                      <Bar
                        key={c}
                        dataKey={c}
                        stackId="a"
                        fill={COLOR_PALETTE[idx % COLOR_PALETTE.length]}
                      />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="net-worth" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5 text-emerald-500" /> Current Net
                Worth Snapshot
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <MetricBox
                label="Assets"
                value={netWorth?.assets || 0}
                color="text-blue-500"
              />
              <MetricBox
                label="Liabilities"
                value={netWorth?.liabilities || 0}
                color="text-red-500"
              />
              <MetricBox
                label="Savings"
                value={netWorth?.savings || 0}
                color="text-purple-500"
              />
              <MetricBox
                label="Net Worth"
                value={netWorth?.netWorth || 0}
                color="text-emerald-500"
              />
              <div className="md:col-span-4 text-xs text-gray-500 dark:text-gray-400">
                Historical tracking will be added once account balance history &
                transactions are implemented.
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="savings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" /> Savings Rate
                (Current Month)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-green-600 dark:text-green-400">
                {((savingsRate || 0) * 100).toFixed(1)}%
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Calculated as (Income - Expenses) / Income for current month.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="export" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5 text-blue-500" /> Export Reports
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Export aggregated data as CSV for external analysis. PDF &
                  advanced export formats will be added in a later phase.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button variant="outline" onClick={exportIncomeVsExpense}>
                    Income vs Expenses CSV
                  </Button>
                  <Button variant="outline" onClick={exportCategoryTrends}>
                    Category Trends CSV
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function MetricBox({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="p-4 rounded-lg bg-gray-900 border border-gray-800 flex flex-col gap-1">
      <div className="text-xs uppercase tracking-wide text-gray-500">
        {label}
      </div>
      <div className={`text-xl font-semibold ${color}`}>
        {formatCurrency(value)}
      </div>
    </div>
  );
}

const COLOR_PALETTE = [
  "#6366F1",
  "#EC4899",
  "#F59E0B",
  "#10B981",
  "#84CC16",
  "#06B6D4",
  "#8B5CF6",
  "#F97316",
  "#2DD4BF",
  "#EF4444",
];
