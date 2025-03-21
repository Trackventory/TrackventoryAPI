const Product = require("../models/product");
const Transaction = require("../models/transaction");

// Stock Report: total quantity of each product in stock
// category - optional parameter
const getStockReport = async (req, res) => {
  try {
    const { category } = req.body;

    let query = { isDeleted: false };
    if (category) query.category = category;

    const stockReport = await Product.find(query).select(
      "name quantity category"
    );

    res.status(200).json({ success: true, stockReport });
  } catch (error) {
    console.error("Error in getStockReport:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Sales Report: total quantity sold and total revenue
// date, category, products - optional parameters
const getSalesReport = async (req, res) => {
  try {
    const { startDate, endDate, category, products } = req.body;
    let dateFilter = {};

    if (startDate && endDate) {
      dateFilter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    let transactionsQuery = { type: "sell_out", ...dateFilter };

    if (category) {
      const categoryProducts = await Product.find({ category }).select("_id");
      const productIds = categoryProducts.map((prod) => prod._id);
      transactionsQuery.product = { $in: productIds };
    }

    if (products && products.length > 0) {
      transactionsQuery.product = { $in: products };
    }

    const salesReport = await Transaction.aggregate([
      { $match: transactionsQuery },
      {
        $group: {
          _id: "$product",
          totalSold: { $sum: "$quantity" },
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      { $unwind: "$productDetails" },
      {
        $project: {
          _id: 0,
          productName: "$productDetails.name",
          category: "$productDetails.category",
          totalSold: 1,
          totalRevenue: { $multiply: ["$totalSold", "$productDetails.price"] },
        },
      },
    ]);

    res.status(200).json({ success: true, salesReport });
  } catch (error) {
    console.error("Error in getStockReport:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// out of stock products
// category - optional parameter
const getOutOfStockReport = async (req, res) => {
  try {
    const { category } = req.body;

    let query = { quantity: 0, isDeleted: false };
    if (category) query.category = category;

    const outOfStockProducts = await Product.find(query).select(
      "name category"
    );

    res.status(200).json({ success: true, outOfStockProducts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getStockReport, getSalesReport, getOutOfStockReport };
