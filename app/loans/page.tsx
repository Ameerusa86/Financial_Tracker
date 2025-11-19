"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Plus, Landmark, Calendar, TrendingDown, Clock } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

const loans = [
  {
    id: 1,
    name: "Home Mortgage",
    type: "Mortgage",
    principal: 250000,
    balance: 235000,
    interestRate: 3.5,
    monthlyPayment: 1500,
    startDate: new Date("2020-01-15"),
    endDate: new Date("2050-01-15"),
    nextPayment: new Date("2024-12-01"),
  },
  {
    id: 2,
    name: "Car Loan - Honda Accord",
    type: "Auto",
    principal: 30000,
    balance: 12500,
    interestRate: 4.2,
    monthlyPayment: 450,
    startDate: new Date("2022-06-01"),
    endDate: new Date("2027-06-01"),
    nextPayment: new Date("2024-12-05"),
  },
  {
    id: 3,
    name: "Student Loan",
    type: "Student",
    principal: 45000,
    balance: 28000,
    interestRate: 5.5,
    monthlyPayment: 320,
    startDate: new Date("2018-09-01"),
    endDate: new Date("2028-09-01"),
    nextPayment: new Date("2024-12-10"),
  },
];

const upcomingPayments = [
  {
    loanId: 1,
    loanName: "Home Mortgage",
    dueDate: new Date("2024-12-01"),
    amount: 1500,
  },
  {
    loanId: 2,
    loanName: "Car Loan - Honda Accord",
    dueDate: new Date("2024-12-05"),
    amount: 450,
  },
  {
    loanId: 3,
    loanName: "Student Loan",
    dueDate: new Date("2024-12-10"),
    amount: 320,
  },
];

export default function LoansPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const totalBalance = loans.reduce((sum, loan) => sum + loan.balance, 0);
  const totalMonthlyPayment = loans.reduce(
    (sum, loan) => sum + loan.monthlyPayment,
    0
  );
  const totalPaid = loans.reduce(
    (sum, loan) => sum + (loan.principal - loan.balance),
    0
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Loans</h1>
          <p className="text-muted-foreground">
            Track your loans and payment schedules
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Loan
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Loan</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Loan Name</label>
                <Input placeholder="e.g., Home Mortgage" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Loan Type</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mortgage">Mortgage</SelectItem>
                    <SelectItem value="auto">Auto Loan</SelectItem>
                    <SelectItem value="student">Student Loan</SelectItem>
                    <SelectItem value="personal">Personal Loan</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Principal Amount</label>
                <Input type="number" placeholder="0.00" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Current Balance</label>
                <Input type="number" placeholder="0.00" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Interest Rate (%)</label>
                <Input type="number" step="0.01" placeholder="0.00" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Monthly Payment</label>
                <Input type="number" placeholder="0.00" />
              </div>
              <Button className="w-full">Add Loan</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <Landmark className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {formatCurrency(totalBalance)}
            </div>
            <p className="text-xs text-muted-foreground">
              Across {loans.length} loans
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Monthly Payments
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {formatCurrency(totalMonthlyPayment)}
            </div>
            <p className="text-xs text-muted-foreground">Total per month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
            <TrendingDown className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(totalPaid)}
            </div>
            <p className="text-xs text-muted-foreground">Principal paid off</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6">
        {loans.map((loan) => {
          const progress =
            ((loan.principal - loan.balance) / loan.principal) * 100;
          const monthsElapsed = Math.floor(
            (new Date().getTime() - loan.startDate.getTime()) /
              (1000 * 60 * 60 * 24 * 30)
          );
          const totalMonths = Math.floor(
            (loan.endDate.getTime() - loan.startDate.getTime()) /
              (1000 * 60 * 60 * 24 * 30)
          );
          const monthsRemaining = totalMonths - monthsElapsed;

          return (
            <Card key={loan.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{loan.name}</CardTitle>
                    <Badge className="mt-2">{loan.type}</Badge>
                  </div>
                  <Landmark className="h-6 w-6 text-purple-600" />
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Current Balance
                    </p>
                    <p className="text-2xl font-bold text-purple-600">
                      {formatCurrency(loan.balance)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Original Amount
                    </p>
                    <p className="text-xl font-semibold">
                      {formatCurrency(loan.principal)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Monthly Payment
                    </p>
                    <p className="text-xl font-semibold">
                      {formatCurrency(loan.monthlyPayment)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Interest Rate
                    </p>
                    <p className="text-xl font-semibold">
                      {loan.interestRate}%
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">
                      {progress.toFixed(1)}% paid off
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-green-600 h-3 rounded-full transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3 pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Next Payment
                      </p>
                      <p className="text-sm font-medium">
                        {formatDate(loan.nextPayment)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Months Remaining
                      </p>
                      <p className="text-sm font-medium">
                        {monthsRemaining} months
                      </p>
                    </div>
                  </div>
                  <div>
                    <Button className="w-full" variant="outline">
                      Make Payment
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Loan</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {upcomingPayments.map((payment) => {
                const daysUntilDue = Math.ceil(
                  (payment.dueDate.getTime() - new Date().getTime()) /
                    (1000 * 60 * 60 * 24)
                );
                return (
                  <TableRow key={payment.loanId}>
                    <TableCell className="font-medium">
                      {payment.loanName}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {formatDate(payment.dueDate)}
                        {daysUntilDue <= 7 && (
                          <Badge variant="destructive" className="text-xs">
                            Due in {daysUntilDue}d
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {formatCurrency(payment.amount)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="outline">
                        Pay Now
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
