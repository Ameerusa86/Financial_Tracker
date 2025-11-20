import { NextRequest, NextResponse } from "next/server";
import {
  getAuthenticatedUser,
  unauthorizedResponse,
  errorResponse,
} from "@/lib/api-auth";
import Transaction from "@/lib/models/Transaction";
import dbConnect from "@/lib/mongoose";

// GET /api/transactions/[id] - Get single transaction
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await getAuthenticatedUser(req);
  if (!userId) return unauthorizedResponse();

  try {
    await dbConnect();
    const { id } = await params;
    const transaction = await Transaction.findOne({
      _id: id,
      userId,
    }).lean();

    if (!transaction) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );
    }

    const txn = transaction as unknown as {
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

    return NextResponse.json({
      id: txn._id.toString(),
      userId: txn.userId,
      type: txn.type,
      fromAccountId: txn.fromAccountId,
      toAccountId: txn.toAccountId,
      amount: txn.amount,
      date: txn.date,
      description: txn.description,
      category: txn.category,
      metadata: txn.metadata,
      createdAt: txn.createdAt.toISOString(),
      updatedAt: txn.updatedAt.toISOString(),
    });
  } catch (error) {
    return errorResponse(
      error instanceof Error ? error.message : "Unknown error"
    );
  }
}

// PUT /api/transactions/[id] - Update transaction
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await getAuthenticatedUser(req);
  if (!userId) return unauthorizedResponse();

  try {
    await dbConnect();
    const body = await req.json();
    const { id } = await params;

    const transaction = await Transaction.findOneAndUpdate(
      { _id: id, userId },
      {
        type: body.type,
        fromAccountId: body.fromAccountId,
        toAccountId: body.toAccountId,
        amount: body.amount,
        date: body.date,
        description: body.description,
        category: body.category,
        metadata: body.metadata,
      },
      { new: true }
    );

    if (!transaction) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
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
    });
  } catch (error) {
    return errorResponse(
      error instanceof Error ? error.message : "Unknown error"
    );
  }
}

// DELETE /api/transactions/[id] - Delete transaction
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await getAuthenticatedUser(req);
  if (!userId) return unauthorizedResponse();

  try {
    await dbConnect();
    const { id } = await params;
    const result = await Transaction.deleteOne({ _id: id, userId });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return errorResponse(
      error instanceof Error ? error.message : "Unknown error"
    );
  }
}
