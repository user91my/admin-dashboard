import OverallStat from "../models/OverallStat.js";

export const getSales = async (req, res) => {
  try {
    // 'OverallStat.find()' returns an array that only
    // contains one very large object.
    const overallStats = await OverallStat.find();

    // Grabs the one sole object element from
    // 'overallStats' array.
    res.status(200).json(overallStats[0]);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
