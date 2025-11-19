"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";

const recentTransactions = [
  {
    id: 1,
    date: new Date("2024-11-15"),
    description: "Salary Deposit",
    amount: 5000,
    type: "income",
    category: "Salary",
  },
  {
    id: 2,
    date: new Date("2024-11-14"),
    description: "Grocery Shopping",
    amount: -120,
    type: "expense",
    category: "Food",
  },
  {
    id: 3,
    date: new Date("2024-11-13"),
    description: "Electric Bill",
    amount: -85,
    type: "expense",
    category: "Utilities",
  },
  {
    id: 4,
    date: new Date("2024-11-12"),
    description: "Freelance Project",
    amount: 800,
    type: "income",
    category: "Freelance",
  },
  {
    id: 5,
    date: new Date("2024-11-11"),
    description: "Gas Station",
    amount: -50,
    type: "expense",
    category: "Transportation",
  },
  {
    id: 6,
    date: new Date("2024-11-10"),
    description: "Restaurant",
    amount: -65,
    type: "expense",
    category: "Food",
  },
];

export function RecentTransactions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
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
            {recentTransactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell className="font-medium">
                  {formatDate(transaction.date)}
                </TableCell>
                <TableCell>{transaction.description}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      transaction.type === "income" ? "default" : "secondary"
                    }
                  >
                    {transaction.category}
                  </Badge>
                </TableCell>
                <TableCell
                  className={`text-right font-semibold ${
                    transaction.amount > 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {formatCurrency(transaction.amount)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
