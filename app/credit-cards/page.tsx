"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  Plus,
  CreditCard,
  Calendar,
  DollarSign,
  AlertCircle,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

const creditCards = [
  {
    id: 1,
    name: "Chase Sapphire Preferred",
    lastFour: "4523",
    balance: 1200,
    limit: 10000,
    dueDate: new Date("2024-12-05"),
    minPayment: 35,
    interestRate: 18.99,
    rewards: "2x points on travel",
  },
  {
    id: 2,
    name: "American Express Blue Cash",
    lastFour: "8901",
    balance: 650,
    limit: 5000,
    dueDate: new Date("2024-12-10"),
    minPayment: 25,
    interestRate: 15.99,
    rewards: "3% cash back on groceries",
  },
  {
    id: 3,
    name: "Capital One Quicksilver",
    lastFour: "2367",
    balance: 450,
    limit: 8000,
    dueDate: new Date("2024-12-15"),
    minPayment: 25,
    interestRate: 19.99,
    rewards: "1.5% cash back on all purchases",
  },
];

export default function CreditCardsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const totalBalance = creditCards.reduce((sum, card) => sum + card.balance, 0);
  const totalLimit = creditCards.reduce((sum, card) => sum + card.limit, 0);
  const utilizationRate = (totalBalance / totalLimit) * 100;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Credit Cards</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your credit cards and track balances
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Card
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Credit Card</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Card Name
                </label>
                <Input placeholder="e.g., Chase Sapphire" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Last 4 Digits
                </label>
                <Input placeholder="1234" maxLength={4} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Credit Limit
                </label>
                <Input type="number" placeholder="0.00" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Current Balance
                </label>
                <Input type="number" placeholder="0.00" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Due Date
                </label>
                <Input type="date" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Interest Rate (%)
                </label>
                <Input type="number" step="0.01" placeholder="0.00" />
              </div>
              <Button className="w-full">Add Credit Card</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <CreditCard className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {formatCurrency(totalBalance)}
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Across {creditCards.length} cards
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Credit Limit
            </CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(totalLimit)}
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Available credit
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Utilization Rate
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {utilizationRate.toFixed(1)}%
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {utilizationRate < 30 ? "Good" : "Consider paying down"}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {creditCards.map((card) => {
          const utilization = (card.balance / card.limit) * 100;
          const daysUntilDue = Math.ceil(
            (card.dueDate.getTime() - new Date().getTime()) /
              (1000 * 60 * 60 * 24)
          );

          return (
            <Card key={card.id} className="overflow-hidden">
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-6 text-white">
                <div className="flex items-start justify-between mb-8">
                  <CreditCard className="h-8 w-8" />
                  <Badge
                    variant="secondary"
                    className="bg-white/20 text-white hover:bg-white/30"
                  >
                    {card.rewards}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-sm opacity-80">
                    •••• •••• •••• {card.lastFour}
                  </p>
                  <p className="text-xl font-bold">{card.name}</p>
                </div>
              </div>

              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      Balance
                    </span>
                    <span className="font-bold text-orange-600">
                      {formatCurrency(card.balance)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      Credit Limit
                    </span>
                    <span className="font-medium">
                      {formatCurrency(card.limit)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        utilization > 70
                          ? "bg-red-600"
                          : utilization > 30
                          ? "bg-yellow-600"
                          : "bg-green-600"
                      }`}
                      style={{ width: `${Math.min(utilization, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {utilization.toFixed(1)}% utilized
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <Calendar className="h-4 w-4" />
                      Due Date
                    </div>
                    <span className="font-medium">
                      {formatDate(card.dueDate)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      Min Payment
                    </span>
                    <span className="font-medium">
                      {formatCurrency(card.minPayment)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      APR
                    </span>
                    <span className="font-medium">{card.interestRate}%</span>
                  </div>
                  {daysUntilDue <= 7 && (
                    <Badge
                      variant="destructive"
                      className="w-full justify-center"
                    >
                      Due in {daysUntilDue} days
                    </Badge>
                  )}
                </div>

                <Button className="w-full" variant="outline">
                  Make Payment
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
