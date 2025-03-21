const express = require('express');
const productController = require('../controllers/productController');
const { authMiddleware } = require('../middleware/authMiddleware');
const { roleMiddleware } = require('../middleware/roleMiddleware');
const { activeUserMiddleware } = require('../middleware/activeUserMiddleware');

const productRouter = express.Router();

productRouter.use(authMiddleware);
productRouter.use(activeUserMiddleware);

// All active users can get all products
productRouter.get('/',  productController.getAllProducts);

// All active users can get specific products
productRouter.get('/:id', productController.getProductById);

// Only active Admin and Manager can update, and delete products
productRouter.put('/update/:id', productController.updateProduct);

productRouter.delete('/delete/:id', productController.deleteProduct);

module.exports = productRouter;