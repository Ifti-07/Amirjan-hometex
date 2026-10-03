import mongoose from "mongoose";

const ledgerSchema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ["Credit", "Debit"], required: true },
  description: { type: String, required: true },
}, { timestamps: true });

export const Ledger = mongoose.model("Ledger", ledgerSchema);
