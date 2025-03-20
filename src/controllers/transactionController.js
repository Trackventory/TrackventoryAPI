const Transaction = require('../models/transaction');
const User = require('../models/user');
const Product = require('../models/product');

const stockUp = async (req, res) => {
  try {
    const { productId, name, description, price, quantity, image, category } = req.body;

    if (!quantity || quantity <= 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Quantity must be greater than 0!' 
      });
    }

    const userId = req.userInfo.id;
    let product;

    if (productId) {
      // Find existing product
      product = await Product.findById(productId);

      if (!product) {
        return res.status(404).json({ 
          success: false, 
          message: 'Product not found!' 
        });
      }

      // Update stock
      product.quantity += quantity;
      await product.save();

    } else {
      // Create new product
      if (!name || !description || !price || !image || !category) {
        return res.status(400).json({ 
          success: false, 
          message: 'All product details are required for a new product!' 
        });
      }

      const existingProduct = await Product.findOne({ name });

      if (existingProduct) {
        return res.status(400).json({
          success: false,
          message: 'Product already exists! Use the existing product ID to update stock.',
        });
      }

      product = await Product.create({ name, description, price, quantity, image, category });
    }

    // Create transaction
    const transaction = await Transaction.create({
      user: userId,
      product: product._id,
      quantity,
      type: 'stock_up',
    });

    const populatedTransaction = await Transaction.findById(transaction._id).populate('product');

    res.status(200).json({
      success: true,
      message: 'Stock updated successfully',
      data: populatedTransaction,
    });

  } catch (error) {
    console.error('Error in manageInventory:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};


const sellOut = async(req, res) => {
  try {
    const {productId, quantity} = req.body;
    if (!productId || quantity == null) {
      return res.status(400).json({
        success: false,
        message: 'Product ID and quantity are required!',
      });
    };

    if (quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be greater than 0!',
      });
    };
    
    const userId = req.userInfo.id;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(400).json({
        success: false,
        message: 'Product not found!',
      });
    }

    if ( product.quantity === 0) {
      return res.status(400).json({
        success: false,
        message: 'Out of stock!'
      });
    }

    if (product.quantity < quantity) {
      return res.status(400).json({
        success: false,
        message: 'Not enough stock to sell!'
      });
    }

    product.quantity -= quantity;

    await product.save();
    await Transaction.create({
      user: userId,
      product: productId,
      quantity,
      type: 'sell_out',
      date: new Date(),
    }).populate({
      path: "product",
      select: "name category -_id"
    });;

    res.status(201).json({
      success: true,
      message: 'Transaction successful!'
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Internal server error', error: err.message
    });
  }
}

const getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find()
    .populate({
      path: "user",
      select: "firstName lastName email _id"
    })
    .populate("product");

    if (!transactions.length) {
      return res.status(400).json({
        success: false,
        message: "No transactions found!"
      });
    }

    res.status(200).json({
      success: true,
      message: 'Operation successful!',
      data: transactions      
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
};

const getTransactionById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Please provide transaction ID!'
      });
    }

    const transaction = await Transaction.findById(id)
    .populate({
      path: "user",
      select: "firstName lastName email _id"
    })
    .populate("product");

    if (!transaction) {
      return res.status(400).json({
        success: false,
        message: "Transaction not found!"
      });
    }

    res.status(200).json({
      success: true,
      message: 'Operation successful!',
      data: transaction
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
};

const getTransactionByType = async (req, res) => {
  try {
    const { type } = req.params;
    if (!type) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a transaction type!'
      });
    }

    const transactions = await Transaction.find({type})
    .populate({
      path: "user",
      select: "firstName lastName email -_id"
    })
    .populate("product");

    if (!transactions.length) {
      return res.status(400).json({
        success: false,
        message: "No transactions found for the specified type!"
      });
    }

    res.status(200).json({
      success: true,
      data: transactions,
      message: 'Operation successful!'
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
};

module.exports = {
  stockUp,
  sellOut,
  getAllTransactions,
  getTransactionById,
  getTransactionByType,
};