const express = require('express');
const productController = require('../controllers/productController');
const { authMiddleware } = require('../middleware/authMiddleware');
const { roleMiddleware } = require('../middleware/roleMiddleware');
const { activeUserMiddleware } = require('../middleware/activeUserMiddleware');

const productRouter = express.Router();

productRouter.use(authMiddleware);
productRouter.use(activeUserMiddleware);

// All active users can get all products
Router.get('/',   productController.getAllProducts);

// All active users can get specific products
Router.get('/:id', productController.getProductById);

// Only active Admin and Manager can add, update, and delete products
Router.post('/add', productController.addProduct);
Router.put('/update/:id', productController.updateProduct);
Router.delete('/delete/:id', productController.deleteProduct);

module.exports = productRouter;