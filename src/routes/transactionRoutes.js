const express = require('express');
const {
  stockUp,
  sellOut,
  getAllTransactions,
  getTransactionById,
  getTransactionByType,
} = require('../controllers/transactionController');
const { authMiddleware, roleMiddleware} = require('../middleware/authMiddleware');

const transactionRouter = express.Router();

// Admin and Manager can stock up inventory
transactionRouter.post('/stock-up', authMiddleware, roleMiddleware(['Admin', 'Manager']), stockUp);

// Sales Person and Admin can sell products
transactionRouter.post('/sell-out', authMiddleware, roleMiddleware(['Admin', 'Sales Person']), sellOut);

// Only Admin can view all transactions
transactionRouter.get('/', authMiddleware, roleMiddleware(['Admin']), getAllTransactions);

// Admin and Manager can view specific transactions
transactionRouter.get('/get-transaction-by-id/:id', authMiddleware, roleMiddleware(['Admin', 'Manager']), getTransactionById);
transactionRouter.get('/get-transaction-by-type/:type', authMiddleware, roleMiddleware(['Admin', 'Manager']), getTransactionByType);

module.exports = transactionRouter;