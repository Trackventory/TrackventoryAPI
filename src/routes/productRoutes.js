const express = require('express');
const productController = require('../controllers/productController');
const { authMiddleware } = require('../middleware/authMiddleware');
const { roleMiddleware } = require('../middleware/roleMiddleware');
const { activeUserMiddleware } = require('../middleware/activeUserMiddleware');
const { createRateLimiter } = require('../utils/rateLimiter');
const { paginationMiddleware } = require('../middleware/paginationMiddleware');
const Product = require('../models/product');
const env = require('dotenv');
env.config();

const productRouter = express.Router();

productRouter.use(authMiddleware);
productRouter.use(activeUserMiddleware);

// All active users can get all products
productRouter.get('/', createRateLimiter(Number(process.env.MAX_REQUEST), Number(process.env.WINDOW_MINUTES)), paginationMiddleware(Product), productController.getAllProducts);


// All active users can get specific products
productRouter.get('/:id', productController.getProductById);

// Only active Admin and Manager can update, and delete products
productRouter.put('/update/:id', productController.updateProduct);

productRouter.delete('/delete/:id', productController.deleteProduct);

module.exports = productRouter;