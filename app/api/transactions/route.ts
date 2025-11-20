import { NextRequest, NextResponse } from "next/server";
import {
  getAuthenticatedUser,
  unauthorizedResponse,
  errorResponse,
} from "@/lib/api-auth";
import Transaction from "@/lib/models/Transaction";
import dbConnect from "@/lib/mongoose";

// GET /api/transactions - List all transactions for authenticated user
export async function GET(req: NextRequest) {
  const userId = await getAuthenticatedUser(req);
  if (!userId) return unauthorizedResponse();

  try {
    await dbConnect();

    // Parse query parameters for filtering
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    const fromAccountId = searchParams.get("fromAccountId");
    const toAccountId = searchParams.get("toAccountId");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    // Build query
    interface QueryFilter {
      userId: string;
      type?: string;
      fromAccountId?: string;
      toAccountId?: string;
      date?: {
        $gte?: string;
        $lte?: string;
      };
    }

    const query: QueryFilter = { userId };

    if (type) query.type = type;
    if (fromAccountId) query.fromAccountId = fromAccountId;
    if (toAccountId) query.toAccountId = toAccountId;
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = startDate;
      if (endDate) query.date.$lte = endDate;
    }

    const transactions = await Transaction.find(query)
      .sort({ date: -1, createdAt: -1 })
      .lean();

    // Format for client
    const formattedTransactions = transactions.map((txn) => {
      const t = txn as unknown as {
        _id: { toString: () => string };
        userId: string;
        type: string;
        fromAccountId?: string;
        toAccountId?: string;
        amount: number;
        date: string;
        description?: string;
        category?: string;
        metadata?: Record<string, unknown>;
        createdAt: Date;
        updatedAt: Date;
      };
      return {
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
      };
    });

    return NextResponse.json(formattedTransactions);
  } catch (error) {
    return errorResponse(
      error instanceof Error ? error.message : "Unknown error"
    );
  }
}

// POST /api/transactions - Create new transaction
export async function POST(req: NextRequest) {
  const userId = await getAuthenticatedUser(req);
  if (!userId) return unauthorizedResponse();

  try {
    await dbConnect();
    const body = await req.json();

    // Validate required fields
    if (!body.type || !body.amount || !body.date) {
      return NextResponse.json(
        { error: "Missing required fields: type, amount, date" },
        { status: 400 }
      );
    }

    const transaction = await Transaction.create({
      userId,
      type: body.type,
      fromAccountId: body.fromAccountId,
      toAccountId: body.toAccountId,
      amount: body.amount,
      date: body.date,
      description: body.description,
      category: body.category,
      metadata: body.metadata,
    });

    return NextResponse.json(
      {
        id: transaction._id.toString(),
        userId: transaction.userId,
        type: transaction.type,
        fromAccountId: transaction.fromAccountId,
        toAccountId: transaction.toAccountId,
        amount: transaction.amount,
        date: transaction.date,
        description: transaction.description,
        category: transaction.category,
        metadata: transaction.metadata,
        createdAt: transaction.createdAt.toISOString(),
        updatedAt: transaction.updatedAt.toISOString(),
      },
      { status: 201 }
    );
  } catch (error) {
    return errorResponse(
      error instanceof Error ? error.message : "Unknown error"
    );
  }
}
