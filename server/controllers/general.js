import User from "../models/User.js";
import OverallStat from "../models/OverallStat.js";
import Transaction from "../models/Transaction.js";

export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    // hardcoded mock values
    const currentMonth = "december";
    const currentYear = 2023;
    const currentDay = "2023-12-01";

    // Recent Transactions
    // Limit to the first 50 transactions and sort them backwards.
    const transactions = await Transaction.find()
      .limit(50)
      .sort({ createdOn: -1 });

    // Overall Stats
    const overallStat = await OverallStat.find({ year: currentYear });

    const {
      totalCustomers,
      yearlyTotalSoldUnits,
      yearlySalesTotal,
      monthlyData,
      salesByCategory,
    } = overallStat[0];

    // In 'monthlyData' array, returns the first object element of which its
    // 'month' field is equivalent to the 'currentMonth'.
    const thisMonthStats = overallStat[0].monthlyData.find(({ month }) => {
      return month === currentMonth;
    });

    // In 'dailyData' array, returns the first object element of which its
    // 'date' field is equivalent to the 'currentDay'.
    const todayStats = overallStat[0].dailyData.find(({ date }) => {
      return date === currentDay;
    });

    res.status(200).json({
      totalCustomers,
      yearlyTotalSoldUnits,
      yearlySalesTotal,
      monthlyData,
      salesByCategory,
      thisMonthStats,
      todayStats,
      transactions,
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
