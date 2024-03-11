import Product from "../models/Product.js";
import ProductStat from "../models/ProductStat.js";
import User from "../models/User.js";
import Transaction from "../models/Transaction.js";
import getCountryIso3 from "country-iso-2-to-3";

export const getProducts = async (req, res) => {
  try {
    const product = await Product.find();

    // 'await Promise.all(...)' resolves when all asynchronous
    // operations inside the '.map' function are complete.
    const productsWithStats = await Promise.all(
      // Returns an array of objects.
      // Each object consists of the Product information and
      // its corresponding ProductStat.
      product.map(async (product) => {
        const stat = await ProductStat.find({
          productId: product._id,
        });
        return {
          // 'product._doc' key (below) is to directly get the relevant product data WITHOUT
          // any of the mongoose-specific properties (i.e. '$__', '$isNew').
          //
          ...product._doc, // Product information
          stat, // ProductStat
        };
      })
    );

    res.status(200).json(productsWithStats);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getCustomers = async (req, res) => {
  try {
    // ".select("-password")" is to EXCLUDE 'password' field from the response
    // body when sent to the frontend.
    const customers = await User.find({ role: "user" }).select("-password");
    res.status(200).json(customers);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getTransactions = async (req, res) => {
  try {
    // Initial defaults for variables 'page','pageSize','sort', etc....
    // After 'req.query' is received from the frontend, these variables
    // will be updated accordingly.
    // Btw, the "sort" string received from the frontend should look like the following :-
    //     "{ field: "userId", sort: "desc" }"
    // It's actually a JS object but unparsed yet, therefore in string format.
    const { page = 0, pageSize = 20, sort = null, search = "" } = req.query;

    // The raw unparsed 'sort' string would look something like this :-
    //     "{"field": "cost", "sort": "asc"}"
    // After parsing 'sort, 'sortFormatted' should look something as such :-
    //     { cost: 1 }
    const generateSort = () => {
      // "JSON.parse(sort)" converts 'sort' from a text string into a JS object.
      const sortParsed = JSON.parse(sort);
      const sortFormatted = {
        [sortParsed.field]: sortParsed.sort === "asc" ? 1 : -1,
      };
      return sortFormatted;
    };
    const sortFormatted = Boolean(sort) ? generateSort() : {};

    // Function to structure the aggregation pipeline.
    const generatePipeline = () => {
      const sortParsed = JSON.parse(sort);
      const pipelineArr = [
        {
          // Note: Matching "_id" field will not work here because "_id"
          //       value needs to be in "ObjectId" format.
          //       In "dataTransaction" ("server\data\index.js"), the
          //       _id's field value is a simple string.
          $match: {
            $or: [
              { userId: { $regex: new RegExp(search, "i") } },
              { cost: { $regex: new RegExp(search, "i") } },
            ],
          },
        },
        // "$addFields" + "$toDouble" operators may be conditionally
        // added to this part of the pipeline depending on whether
        // the client queries to sort the datagrid table on the basis
        // of the "cost" field or not.
        // Conditionally adding these operators to the pipeline will
        // avoid having to unncessarily rerun them on every query.
        //
        // "$toDouble" is necessary to ensure that the values of
        // the "cost" field are numerical and not strings.
        // "$addFields" overwrites the existing "cost" field values
        // from string to their respective numerical counterpart.
        //
        // {
        //   $addFields: {
        //     cost: { $toDouble: "$cost" },
        //   },
        // },
        {
          $sort: sortFormatted,
        },
        {
          $skip: Number(page * pageSize),
        },
        {
          $limit: Number(pageSize),
        },
      ];

      // Overwrite the 'cost' field with its numeric version so
      // that the cost columns is numerically sorted.
      // "$toDouble" operator converts a value to a double-precision
      // floating-point number. Useful when performing arithmetic
      // operations on values that are stored as strings.
      const convertCostStringToNumber = {
        $addFields: {
          // "$cost" is a field path expression referring to the
          // value of the "cost" field in the current document
          // being processed by the aggregation pipeline.
          cost: { $toDouble: "$cost" },
        },
      };

      // Adds the "$addFields" operator into the aggregation pipeline
      // if the client requests to sort by "cost" field.
      if (sortParsed.field === "cost")
        pipelineArr.splice(1, 0, convertCostStringToNumber);

      return pipelineArr;
    };

    // Sorting, skipping and limiting the queried data.
    // MongoDB aggregation operations explanation :-
    // https://www.mongodb.com/docs/manual/aggregation/
    // MongoDB list of aggregation pipeline stages (e.g. $match, $lookup, $unwind, etc...) :-
    // https://www.mongodb.com/docs/manual/reference/operator/aggregation-pipeline/#std-label-aggregation-pipeline-operator-reference
    const transactions = await Transaction.aggregate(generatePipeline());

    // Gives us the total count of documents queried.
    const total = await Transaction.countDocuments();
    // const total = await Transaction.countDocuments({
    //   userId: { $regex: search, $options: "i" },
    // });

    res.status(200).json({
      transactions,
      total,
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getGeography = async (req, res) => {
  try {
    const users = await User.find();

    // 'mappedLocations' returns an object of which every key is a country
    // AND the value is the number of users from that specific country.
    //         { [country] : number_of_users , ... }
    // The accumulator ('acc') is initialized as an empty object '{}'.
    // Every object element in the 'users' array is destructured to
    // extract the 'country' variable.
    const mappedLocations = users.reduce((acc, { country }) => {
      // Convert every destructured 'country' string into ISO3 format.
      const countryISO3 = getCountryIso3(country);
      // If 'countryISO3' doesn't exist in 'acc', set it a value of 0.
      if (!acc[countryISO3]) {
        acc[countryISO3] = 0;
      }
      // Increase 'countryISO3' value by 1.
      acc[countryISO3]++;
      return acc;
    }, {});

    // 'formattedLocations' returns the proper object format that "nivo" library
    // uses to chart the geography chart.
    // https://nivo.rocks/choropleth/
    const formattedLocations = Object.entries(mappedLocations).map(
      ([country, count]) => {
        return { id: country, value: count };
      }
    );

    res.status(200).json(formattedLocations);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
