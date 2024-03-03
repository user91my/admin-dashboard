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
    // Btw, 'sort' object received from the frontend should look like the following :-
    //     { field: "userId", sort: "desc" }
    const { page = 1, pageSize = 20, sort = null, search = "" } = req.query;

    // The formatted sort ('sortFormatted') should look something as such :-
    //     { userId: -1 }
    const generateSort = () => {
      // "JSON.parse(sort)" converts 'sort' from a text string into a JS object.
      const sortParsed = JSON.parse(sort);
      const sortFormatted = {
        [sortParsed.field]: (sortParsed.sort = "asc" ? 1 : -1),
      };
      return sortFormatted;
    };

    const sortFormatted = Boolean(sort) ? generateSort() : {};

    // Sorting, skipping and limiting the queried data.
    // Note: Querying "_id" field will not work here because "_id"
    //       value needs to be in "ObjectId" format.
    //       In "dataTransaction" ("server\data\index.js"), the
    //       _id's field value is a simple string.
    const transactions = await Transaction.find({
      $or: [
        { cost: { $regex: new RegExp(search, "i") } },
        { userId: { $regex: new RegExp(search, "i") } },
      ],
    })
      .sort(sortFormatted) // sort in ascending/descending order. 'sortFormatted' should be structured like "{ userId: -1 }".
      .skip(page * pageSize) // skips the first `page*pageSize` results
      .limit(pageSize); // limit the returned results to the first `pageSize` results.

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
