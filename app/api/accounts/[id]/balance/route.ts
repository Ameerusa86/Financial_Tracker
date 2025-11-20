import { NextRequest, NextResponse } from "next/server";
import {
  getAuthenticatedUser,
  unauthorizedResponse,
  errorResponse,
} from "@/lib/api-auth";
import Account from "@/lib/models/Account";
import Transaction from "@/lib/models/Transaction";
import { calculateAccountBalance } from "@/lib/balance";
import dbConnect from "@/lib/mongoose";

// GET /api/accounts/[id]/balance - Get calculated balance for an account
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await getAuthenticatedUser(req);
  if (!userId) return unauthorizedResponse();

  try {
    await dbConnect();
    const { id } = await params;

    // Get the account
    const accountDoc = await Account.findOne({ _id: id, userId }).lean();
    if (!accountDoc) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    // Get all transactions for this account
    const transactions = await Transaction.find({
      userId,
      $or: [{ fromAccountId: id }, { toAccountId: id }],
    })
      .sort({ date: 1 })
      .lean();

    // Convert to client format
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const account = accountDoc as any;
    const acc = {
      id: account._id.toString(),
      name: account.name,
      type: account.type,
      balance: account.balance,
      apr: account.apr,
      minPayment: account.minPayment,
      dueDay: account.dueDay,
      creditLimit: account.creditLimit,
      website: account.website,
      createdAt: account.createdAt.toISOString(),
      updatedAt: account.updatedAt.toISOString(),
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const txns = transactions.map((t: any) => ({
      id: t._id.toString(),
      userId: t.userId,
      type: t.type,
      fromAccountId: t.fromAccountId,
      toAccountId: t.toAccountId,
      amount: t.amount,
      date: t.date,
      description: t.description,
      category: t.category,
      metadata: t.metadata,
      createdAt: t.createdAt.toISOString(),
      updatedAt: t.updatedAt.toISOString(),
    }));

    const calculatedBalance = calculateAccountBalance(acc, txns);

    return NextResponse.json({
      accountId: id,
      storedBalance: account.balance,
      calculatedBalance,
      difference: calculatedBalance - account.balance,
      transactionCount: transactions.length,
    });
  } catch (error) {
    return errorResponse(
      error instanceof Error ? error.message : "Unknown error"
    );
  }
}
