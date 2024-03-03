import mongoose from "mongoose";

const AffiliateStatSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Types.ObjectId, ref: "User" }, // Should be a valid ObjectId referencing a document in the "User" model.
    affiliateSales: {
      type: [mongoose.Types.ObjectId], // Each element in the array is expected to be a valid ObjectId referencing a document in the "Transaction" model.
      ref: "Transaction",
    },
  },
  { timestamps: true }
);

const AffiliateStat = mongoose.model("AffiliateStat", AffiliateStatSchema);
export default AffiliateStat;
