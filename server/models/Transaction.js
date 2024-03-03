import mongoose from "mongoose";

// 'required' not implemented for simplicity
// BUT should be done in future.
const TransactionSchema = new mongoose.Schema(
  {
    userId: String,
    cost: String,
    products: {
      type: [mongoose.Types.ObjectId], // Each element in the array is expected to be a valid ObjectId referencing another document.
    },
  },
  { timestamps: true }
);

const Transaction = mongoose.model("Transaction", TransactionSchema);
export default Transaction;
