"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  TrendingDown,
  ShoppingBag,
  Utensils,
  Car,
  Home,
  Heart,
  Film,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

const expenseTransactions = [
  {
    id: 1,
    date: new Date("2024-11-14"),
    description: "Whole Foods Market",
    amount: 120,
    category: "Food & Dining",
  },
  {
    id: 2,
    date: new Date("2024-11-13"),
    description: "Electric Bill",
    amount: 85,
    category: "Utilities",
  },
  {
    id: 3,
    date: new Date("2024-11-11"),
    description: "Shell Gas Station",
    amount: 50,
    category: "Transportation",
  },
  {
    id: 4,
    date: new Date("2024-11-10"),
    description: "Italian Restaurant",
    amount: 65,
    category: "Food & Dining",
  },
  {
    id: 5,
    date: new Date("2024-11-09"),
    description: "Amazon - Books",
    amount: 45,
    category: "Shopping",
  },
  {
    id: 6,
    date: new Date("2024-11-08"),
    description: "Gym Membership",
    amount: 50,
    category: "Healthcare",
  },
  {
    id: 7,
    date: new Date("2024-11-07"),
    description: "Netflix Subscription",
    amount: 15,
    category: "Entertainment",
  },
  {
    id: 8,
    date: new Date("2024-11-06"),
    description: "Starbucks",
    amount: 12,
    category: "Food & Dining",
  },
  {
    id: 9,
    date: new Date("2024-11-05"),
    description: "Target - Household Items",
    amount: 85,
    category: "Shopping",
  },
  {
    id: 10,
    date: new Date("2024-11-04"),
    description: "Internet Bill",
    amount: 70,
    category: "Utilities",
  },
];

const categoryIcons = {
  "Food & Dining": Utensils,
  Transportation: Car,
  Utilities: Home,
  Shopping: ShoppingBag,
  Healthcare: Heart,
  Entertainment: Film,
};

export default function ExpensesPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const totalExpenses = expenseTransactions.reduce(
    (sum, t) => sum + t.amount,
    0
  );

  const categoryTotals = expenseTransactions.reduce((acc, transaction) => {
    acc[transaction.category] =
      (acc[transaction.category] || 0) + transaction.amount;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Expenses</h1>
          <p className="text-muted-foreground">
            Track and categorize your expenses
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Expense
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Expense</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Input placeholder="e.g., Grocery Shopping" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Amount</label>
                <Input type="number" placeholder="0.00" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="food">Food & Dining</SelectItem>
                    <SelectItem value="transport">Transportation</SelectItem>
                    <SelectItem value="utilities">Utilities</SelectItem>
                    <SelectItem value="shopping">Shopping</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="entertainment">Entertainment</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Date</label>
                <Input type="date" />
              </div>
              <Button className="w-full">Add Expense</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Expenses
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(totalExpenses)}
            </div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        {Object.entries(categoryTotals)
          .slice(0, 2)
          .map(([category, amount]) => {
            const Icon =
              categoryIcons[category as keyof typeof categoryIcons] ||
              ShoppingBag;
            return (
              <Card key={category}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {category}
                  </CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatCurrency(amount)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {((amount / totalExpenses) * 100).toFixed(0)}% of total
                  </p>
                </CardContent>
              </Card>
            );
          })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Expense Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenseTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">
                    {formatDate(transaction.date)}
                  </TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{transaction.category}</Badge>
                  </TableCell>
                  <TableCell className="text-right font-semibold text-red-600">
                    {formatCurrency(transaction.amount)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
