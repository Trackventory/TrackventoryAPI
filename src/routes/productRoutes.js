const express = require('express');
const Router = express.Router();
const productController = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware');

Router.get('/products',   productController.getAllProducts);
Router.get('/products/:id', productController.getProductById);
Router.post('/products', productController.addProduct);
Router.put('/products/:id', productController.updateProduct);
Router.delete('/products/:id', productController.deleteProduct);

module.exports = Router;