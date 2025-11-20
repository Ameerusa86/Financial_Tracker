"use client";

import { useState, useEffect } from "react";
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
import { AccountStorage } from "@/lib/storage";
import { Account } from "@/lib/types";
import Link from "next/link";

export default function LoansPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loans, setLoans] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadLoans = async () => {
      try {
        const accounts = await AccountStorage.getAll();
        const loanAccounts = accounts.filter((acc) => acc.type === "loan");
        setLoans(loanAccounts);
      } catch (error) {
        console.error("Failed to load loans:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadLoans();
  }, []);

  const totalBalance = loans.reduce((sum, loan) => sum + loan.balance, 0);
  const totalMonthlyPayment = loans.reduce(
    (sum, loan) => sum + (loan.minPayment || 0),
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

      </div>

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">
          Loading loans...
        </div>
      ) : loans.length === 0 ? (
        <Card className="p-12">
          <div className="text-center space-y-4">
            <Landmark className="h-16 w-16 mx-auto text-muted-foreground" />
            <div>
              <h3 className="text-lg font-semibold mb-2">No Loans Yet</h3>
              <p className="text-muted-foreground mb-4">
                Add your loans to track balances and payment schedules
              </p>
              <Link href="/accounts">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Loan
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      ) : (
        <>
          <div className="grid gap-6">
            {loans.map((loan) => {
              const daysUntilDue = loan.dueDay
                ? (() => {
                    const today = new Date();
                    const currentMonth = today.getMonth();
                    const currentYear = today.getFullYear();
                    let dueDate = new Date(
                      currentYear,
                      currentMonth,
                      loan.dueDay
                    );
                    if (dueDate < today) {
                      dueDate = new Date(
                        currentYear,
                        currentMonth + 1,
                        loan.dueDay
                      );
                    }
                    return Math.ceil(
                      (dueDate.getTime() - today.getTime()) /
                        (1000 * 60 * 60 * 24)
                    );
                  })()
                : null;

              return (
                <Card key={loan.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{loan.name}</CardTitle>
                        <Badge className="mt-2">Loan</Badge>
                      </div>
                      <Landmark className="h-6 w-6 text-purple-600" />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Current Balance
                        </p>
                        <p className="text-2xl font-bold text-purple-600">
                          {formatCurrency(loan.balance)}
                        </p>
                      </div>
                      {loan.minPayment && (
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Monthly Payment
                          </p>
                          <p className="text-xl font-semibold">
                            {formatCurrency(loan.minPayment)}
                          </p>
                        </div>
                      )}
                      {loan.apr && (
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Interest Rate
                          </p>
                          <p className="text-xl font-semibold">{loan.apr}%</p>
                        </div>
                      )}
                    </div>

                    <div className="grid gap-4 md:grid-cols-3 pt-4 border-t">
                      {loan.dueDay && (
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-xs text-muted-foreground">
                              Due Day
                            </p>
                            <p className="text-sm font-medium">
                              Day {loan.dueDay}
                            </p>
                          </div>
                        </div>
                      )}
                      {daysUntilDue !== null && daysUntilDue <= 7 && (
                        <Badge
                          variant="destructive"
                          className="flex items-center justify-center"
                        >
                          Due in {daysUntilDue} days
                        </Badge>
                      )}
                      {loan.website && (
                        <a
                          href={loan.website}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button variant="outline" size="sm" className="w-full">
                            Visit Website
                          </Button>
                        </a>
                      )}
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
              {loans.filter((l) => l.dueDay && l.minPayment).length === 0 ? (
                <p className="text-center py-8 text-muted-foreground">
                  No upcoming payments. Add due dates to your loans to see them
                  here.
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Loan</TableHead>
                      <TableHead>Due Day</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loans
                      .filter((loan) => loan.dueDay && loan.minPayment)
                      .map((loan) => {
                        const daysUntilDue = loan.dueDay
                          ? (() => {
                              const today = new Date();
                              const currentMonth = today.getMonth();
                              const currentYear = today.getFullYear();
                              let dueDate = new Date(
                                currentYear,
                                currentMonth,
                                loan.dueDay
                              );
                              if (dueDate < today) {
                                dueDate = new Date(
                                  currentYear,
                                  currentMonth + 1,
                                  loan.dueDay
                                );
                              }
                              return Math.ceil(
                                (dueDate.getTime() - today.getTime()) /
                                  (1000 * 60 * 60 * 24)
                              );
                            })()
                          : null;
                        return (
                          <TableRow key={loan.id}>
                            <TableCell className="font-medium">
                              {loan.name}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                Day {loan.dueDay}
                                {daysUntilDue !== null && daysUntilDue <= 7 && (
                                  <Badge
                                    variant="destructive"
                                    className="text-xs"
                                  >
                                    Due in {daysUntilDue}d
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-right font-semibold">
                              {formatCurrency(loan.minPayment || 0)}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
