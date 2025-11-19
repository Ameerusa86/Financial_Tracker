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
import { Plus, TrendingUp } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

const incomeTransactions = [
  {
    id: 1,
    date: new Date("2024-11-15"),
    source: "Monthly Salary",
    amount: 5000,
    category: "Salary",
    recurring: true,
  },
  {
    id: 2,
    date: new Date("2024-11-12"),
    source: "Freelance Project - Website Design",
    amount: 800,
    category: "Freelance",
    recurring: false,
  },
  {
    id: 3,
    date: new Date("2024-11-08"),
    source: "Stock Dividends",
    amount: 150,
    category: "Investment",
    recurring: false,
  },
  {
    id: 4,
    date: new Date("2024-11-05"),
    source: "Side Hustle - Consulting",
    amount: 450,
    category: "Consulting",
    recurring: false,
  },
  {
    id: 5,
    date: new Date("2024-11-01"),
    source: "Rental Income",
    amount: 1200,
    category: "Rental",
    recurring: true,
  },
  {
    id: 6,
    date: new Date("2024-10-28"),
    source: "Bonus",
    amount: 900,
    category: "Salary",
    recurring: false,
  },
];

export default function IncomePage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const totalIncome = incomeTransactions.reduce((sum, t) => sum + t.amount, 0);
  const monthlyRecurring = incomeTransactions
    .filter((t) => t.recurring)
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Income</h1>
          <p className="text-muted-foreground">Track all your income sources</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Income
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Income</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Source</label>
                <Input placeholder="e.g., Monthly Salary" />
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
                    <SelectItem value="salary">Salary</SelectItem>
                    <SelectItem value="freelance">Freelance</SelectItem>
                    <SelectItem value="investment">Investment</SelectItem>
                    <SelectItem value="rental">Rental</SelectItem>
                    <SelectItem value="consulting">Consulting</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Date</label>
                <Input type="date" />
              </div>
              <Button className="w-full">Add Income</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(totalIncome)}
            </div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Monthly Recurring
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(monthlyRecurring)}
            </div>
            <p className="text-xs text-muted-foreground">Expected monthly</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Income Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {incomeTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">
                    {formatDate(transaction.date)}
                  </TableCell>
                  <TableCell>{transaction.source}</TableCell>
                  <TableCell>
                    <Badge variant="default">{transaction.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={transaction.recurring ? "secondary" : "outline"}
                    >
                      {transaction.recurring ? "Recurring" : "One-time"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-semibold text-green-600">
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
