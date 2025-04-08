const express = require('express');
const {
  stockUp,
  sellOut,
  getAllTransactions,
  getTransactionById,
  getTransactionByType,
} = require('../controllers/transactionController');
const { authMiddleware } = require('../middleware/authMiddleware');
const { roleMiddleware } = require('../middleware/roleMiddleware');
const { activeUserMiddleware } = require('../middleware/activeUserMiddleware');

const transactionRouter = express.Router();

transactionRouter.use(authMiddleware);
transactionRouter.use(activeUserMiddleware);

// Only active Admin and Manager can stock up inventory
transactionRouter.post('/stock-up', roleMiddleware(['Admin', 'Manager']), stockUp);

// Active Sales Person and Admin can sell products
transactionRouter.post('/sell-out', roleMiddleware(['Admin', 'Sales Person']), sellOut);

// Only active Admin and Manager can view all transactions
transactionRouter.get('/', roleMiddleware(['Admin', 'Manager']), getAllTransactions);

// Only active Admin and Manager can view specific transactions
transactionRouter.get('/get-by-id/:id', roleMiddleware(['Admin', 'Manager']), getTransactionById);

transactionRouter.get('/get-by-type/:type', roleMiddleware(['Admin', 'Manager']), getTransactionByType);

module.exports = transactionRouter;