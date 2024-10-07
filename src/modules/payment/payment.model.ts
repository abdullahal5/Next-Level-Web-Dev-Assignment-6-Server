import mongoose, { model, Schema } from "mongoose";
import { IPayment } from "./payment.interface";

const PaymentSchema = new Schema<IPayment>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      default: "AAMARPAY",
    },
    status: {
      type: String,
      enum: ["Active", "Expired"],
      default: "Active",
    },
    transactionId: {
      type: String,
      required: true,
      unique: true,
    },
    planTitle: {
      type: String,
      required: true,
    },
    planPrice: {
      type: Number,
      required: true,
    },
    expiryDate: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const PaymentModel = model<IPayment>("Payment", PaymentSchema);
