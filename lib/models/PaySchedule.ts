import mongoose, { Schema, Document } from "mongoose";
import type { PayFrequency } from "../types";

export interface IPaySchedule extends Document {
  userId: string;
  frequency: PayFrequency;
  nextPayDate: string;
  typicalAmount: number;
  depositAccountId?: string;
  owner?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PayScheduleSchema = new Schema<IPaySchedule>(
  {
    userId: { type: String, required: true, index: true },
    frequency: {
      type: String,
      enum: ["weekly", "bi-weekly", "semi-monthly", "monthly"],
      required: true,
    },
    nextPayDate: { type: String, required: true },
    typicalAmount: { type: Number, required: true },
    depositAccountId: { type: String },
    owner: { type: String },
  },
  { timestamps: true }
);

// Index for multiple schedules per user
PayScheduleSchema.index({ userId: 1 });

export default mongoose.models.PaySchedule ||
  mongoose.model<IPaySchedule>("PaySchedule", PayScheduleSchema);
