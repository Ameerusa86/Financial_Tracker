/* eslint-disable */
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TransactionStorage } from "@/lib/storage";
import type { Transaction } from "@/lib/types";

export default function TransactionTestPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [type, setType] = useState<string>("income_deposit");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [description, setDescription] = useState("");
  const [toAccountId, setToAccountId] = useState("");

  const loadTransactions = async () => {
    const txns = await TransactionStorage.getAll();
    setTransactions(txns);
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  const handleCreate = async () => {
    if (!amount) {
      alert("Please enter an amount");
      return;
    }

    const transaction = await TransactionStorage.add({
      type: type as
        | "income_deposit"
        | "payment"
        | "expense"
        | "transfer"
        | "adjustment",
      amount: parseFloat(amount),
      date: date,
      description: description || undefined,
      toAccountId: toAccountId || undefined,
    });

    if (transaction) {
      alert("Transaction created successfully!");
      setAmount("");
      setDescription("");
      setToAccountId("");
      await loadTransactions();
    } else {
      alert("Failed to create transaction");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete this transaction?")) {
      const success = await TransactionStorage.delete(id);
      if (success) {
        await loadTransactions();
      }
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Transaction System Test</h1>

        {/* Create Transaction Form */}
        <Card>
          <CardHeader>
            <CardTitle>Create Test Transaction</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Type</label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="income_deposit">
                      Income Deposit
                    </SelectItem>
                    <SelectItem value="payment">Payment</SelectItem>
                    <SelectItem value="expense">Expense</SelectItem>
                    <SelectItem value="transfer">Transfer</SelectItem>
                    <SelectItem value="adjustment">Adjustment</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Amount</label>
                <Input
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Date</label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Optional description"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                To Account ID (optional)
              </label>
              <Input
                value={toAccountId}
                onChange={(e) => setToAccountId(e.target.value)}
                placeholder="Account ID for deposit"
              />
            </div>

            <Button onClick={handleCreate} className="w-full">
              Create Transaction
            </Button>
          </CardContent>
        </Card>

        {/* Transactions List */}
        <Card>
          <CardHeader>
            <CardTitle>Transactions ({transactions.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {transactions.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No transactions yet. Create one above to test.
              </p>
            ) : (
              <div className="space-y-2">
                {transactions.map((txn) => (
                  <div
                    key={txn.id}
                    className="p-4 border rounded-lg flex items-center justify-between"
                  >
                    <div>
                      <div className="font-medium">
                        {txn.type.replace("_", " ").toUpperCase()} - $
                        {txn.amount.toFixed(2)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {txn.date}
                        {txn.description && ` - ${txn.description}`}
                      </div>
                      {txn.toAccountId && (
                        <div className="text-xs text-muted-foreground">
                          To Account: {txn.toAccountId}
                        </div>
                      )}
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(txn.id)}
                    >
                      Delete
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Test Results */}
        <Card>
          <CardHeader>
            <CardTitle>✅ Transaction System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div>✅ Transaction TypeScript types added</div>
              <div>✅ Transaction Mongoose model created</div>
              <div>✅ Transaction API routes implemented</div>
              <div>✅ TransactionStorage helpers added</div>
              <div>✅ PaySchedule model updated with owner field</div>
              <div>✅ PlannedPayment model updated with execution tracking</div>
              <div className="pt-2 border-t mt-4">
                <strong>Ready for:</strong> Step 2 - Payday Session UI
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
