import mongoose from "mongoose";
import User from "../models/User.js";
import Transaction from "../models/Transaction.js";

export const getAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: "admin" }).select("-password"); // ".select("-password")" omits password field from query
    res.status(200).json(admins);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getUserPerformance = async (req, res) => {
  try {
    const { id } = req.params;

    // MongoDB aggregation operations explanation :-
    // https://www.mongodb.com/docs/manual/aggregation/
    // MongoDB list of aggregation pipeline stages (e.g. $match, $lookup, $unwind, etc...) :-
    // https://www.mongodb.com/docs/manual/reference/operator/aggregation-pipeline/#std-label-aggregation-pipeline-operator-reference

    // Joins the user documents (from users collection) with the corresponding user's affiliate
    // stat documents (from affiliatestats collection).
    // (NOTE: The collection name "users" is actually derived and associated to
    //        the mongoose model "User".)
    // Data structure "userWithStats" :-
    //     [ { _id, email, ..... , affiliateStats } ]
    const userWithStats = await User.aggregate([
      //
      // [1] Match Stage
      // ----------------
      // https://www.mongodb.com/docs/manual/reference/operator/aggregation/match/#mongodb-pipeline-pipe.-match
      // Filters 'users' collection and gets user documents with matching 'id'
      // resulting in a filtered 'users' collection.
      // (NOTE: "new mongoose.Types.ObjectId(id)" converts the 'id' string
      //        into a proper 'ObjectId' instance.)
      { $match: { _id: new mongoose.Types.ObjectId(id) } },
      //
      // [2] Lookup Stage
      // -----------------
      // https://www.mongodb.com/docs/manual/reference/operator/aggregation/lookup/#mongodb-pipeline-pipe.-lookup
      // Joins the filtered 'users' collection (from the $match stage) with
      // the 'affiliatestats' collection.
      {
        $lookup: {
          // Specifies "affiliatestats" as the collection for "users" collection
          // to perform the join with (both collections must be in the same database!).
          // (NOTE: The collection name "affiliatestats" is actually derived and
          //        associated to the mongoose model "AffiliateStat".)
          from: "affiliatestats",

          // An equality match will be performed on BOTH the "localField" and "foreignField".
          localField: "_id", // Target document field from "users" collection.
          foreignField: "userId", // Target document field from "affiliatestats" collection

          // Adds a new array field ("affiliateStats") to the filtered 'users'
          // collection (from $match stage).
          as: "affiliateStats",
        },
      },
      //
      // [3] Unwind Stage
      // -----------------
      // https://www.mongodb.com/docs/manual/reference/operator/aggregation/unwind/#mongodb-pipeline-pipe.-unwind
      // Flattens the newly added "affiliateStats" array field (from $lookup stage) by one level.
      // (NOTE: Reference to the value of the "affiliateStats" field has to be prefixed with a dollar sign ($).
      //        "$affiliateStats" is a field path expression.)
      // Initial data structure for "affiliateStats" field :-
      //      affiliateStats : [ {...} ]
      // Data structure after unwinding :-
      //      affilliateStats : { _id , userId , affiliateSales , ... }
      { $unwind: "$affiliateStats" },
    ]);

    // THEREFORE,
    // Data structure for "userWithStats" :-
    //     [ { _id , name , email , ..... , affiliateStats } ]
    // Therefore we select the FIRST and ONLY element via "userWithStats[0]".
    // Data structure for "affiliateStats" field :-
    //     affiliateStats : { affiliateSales , ... }
    // "affiliateSales" is an array of transaction id strings.
    // Data structure for "affiliateSales" (one of the fields inside "affiliateStats") :-
    //     affiliateSales : [ ... ]
    const saleTransactions = await Promise.all(
      userWithStats[0].affiliateStats.affiliateSales.map((id) => {
        return Transaction.findById(id);
      })
    );

    // Each element in "filteredSaleTransactions" array is a transaction
    // document (with the specific id) originating from "transactions"
    // collection.
    // Data structure of "filteredSaleTransactions" :-
    //     [ { _id, userId, cost, products, ... } , {...} , {...} , ..... ]
    const filteredSaleTransactions = saleTransactions.filter(
      (transaction) => transaction !== null
    );

    res
      .status(200)
      // Data structure of response body :-
      //      { user: {...} , sales: [ {...}, {...}, {...}, ... ] }
      .json({ user: userWithStats[0], sales: filteredSaleTransactions });
    //
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
